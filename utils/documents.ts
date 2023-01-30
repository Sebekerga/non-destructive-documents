import { encode } from "deno/std/encoding/base64.ts";
import { join, toFileUrl } from "deno/std/path/mod.ts";
import { walk } from "deno/std/fs/walk.ts";
import { dirname, fromFileUrl, parse } from "deno/std/path/posix.ts";
import puppeteer from "puppeteer";

interface DocumentDescription {
  label: string;
  filename: string;
  pages: Array<preact.JSX.Element>;
  page_size: {
    width: string;
    height: string;
  };
}

interface DocumentFile {
  path: string;
  document: DocumentDescription;
  render?: string;
}

const fileToBase64 = async (file_path: string) => {
  const file = await Deno.readFile(file_path);
  const encoded = encode(file);

  return encoded;
};

const collectDocuments = async (directory: string): Promise<string[]> => {
  const unfiltered_documents = [];

  // this sections of the code is adapted from fresh manifest generator
  try {
    const routesUrl = toFileUrl(directory);
    // TODO(lucacasonato): remove the extranious Deno.readDir when
    // https://github.com/denoland/deno_std/issues/1310 is fixed.
    for await (const _ of Deno.readDir(directory)) {
      // do nothing
    }
    const routesFolder = walk(directory, {
      includeDirs: false,
      includeFiles: true,
      exts: ["tsx"],
    });
    for await (const entry of routesFolder) {
      if (entry.isFile) {
        const file = toFileUrl(entry.path).href.substring(
          routesUrl.href.length,
        );
        unfiltered_documents.push(file);
      }
    }
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      // Do nothing.
    } else {
      throw err;
    }
  }
  unfiltered_documents.sort();

  const documents = unfiltered_documents.filter((file) => {
    const path_elements = file.split("/").filter((e) => e);
    return path_elements[0] !== "components";
  });
  return documents;
};

const writeBareManifest = async (project_dir: string, directory: string, manifest_items: string[]) => {
  const manifest_text = `// DO NOT EDIT. This file is generated.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running \`dev.ts\`.

import { DocumentFile } from "./utils/documents.ts";

${
    manifest_items.map((file, index) => `import $${index} from "${directory}${file}";`)
      .join("\n")
  }

const manifest: DocumentFile[] = [
${
    manifest_items.map((file, index) => {
      const parsed_path = parse(file);
      const resulting_path = join(parsed_path.dir, parsed_path.name);
      const resulting_line = `{
  path: "${resulting_path}",
  document: $${index},
      },`;
      return resulting_line;
    }).join("\n")
  }
];

export default manifest;`;

  const proc = Deno.run({
    cmd: [Deno.execPath(), "fmt", "-"],
    stdin: "piped",
    stdout: "piped",
    stderr: "null",
  });
  const raw = new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(manifest_text));
      controller.close();
    },
  });
  await raw.pipeTo(proc.stdin.writable);
  const out = await proc.output();
  await proc.status();
  proc.close();

  const manifestStr = new TextDecoder().decode(out);
  const manifestPath = join(project_dir, "./documents.gen.ts");

  await Deno.writeTextFile(manifestPath, manifestStr);
};

const renderDocuments = async (project_dir: string, manifest_items: string[]) => {
  console.log(
    `%cStarting temporary server for PDF rendering`,
    "color: green; font-weight: bold",
  );

  const temp_fresh_server_worker = new Worker(new URL("./main.ts", project_dir).href, {
    type: "module",
  });

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  while (true) {
    try {
      const response = await page.goto("http://localhost:8000", {
        waitUntil: "networkidle2",
      });

      if (response?.ok) {
        break;
      }
    } catch {
      // Couldn't get a page, let's try again
    }
  }

  console.log(
    `%cServer is ready`,
    "color: green",
  );
  browser;
  let renders: string[] = [];
  for (let index = 0; index < manifest_items.length; index++) {
    const parsed_path = parse(manifest_items[index]);
    const resulting_path = join(parsed_path.dir, parsed_path.name);

    console.log(
      `%cRendering ${resulting_path}`,
      "color: green;",
    );

    const web_address = join("http://localhost:8000/documents/raw", resulting_path);
    await page.goto(web_address, { waitUntil: "networkidle2" });

    // fetching document data, since puppeteer won't return proper headers
    const api_address = join("http://localhost:8000/api/documents", resulting_path);
    const document_info_response = await fetch(api_address);
    const document_info = await document_info_response.json();

    // saving to a temp file
    const page_temp_file = await Deno.makeTempFile({
      prefix: "documents_render_",
      suffix: ".pdf",
    });
    await page.pdf({
      path: page_temp_file,
      printBackground: true,
      ...document_info,
    });

    renders = renders.concat(await fileToBase64(page_temp_file));
  }

  console.log(`%cClosing server`, "color: green");

  await browser.close();
  temp_fresh_server_worker.terminate();

  console.log(`%cTemp server is down`, "color: green; font-weight: bold");

  return renders;
};

const writeFullManifest = async (
  project_dir: string,
  directory: string,
  manifest_items: string[],
  renders: string[],
) => {
  const manifest_text = `// DO NOT EDIT. This file is generated.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running \`dev.ts\`.

import { DocumentFile } from "./utils/documents.ts";

${
    manifest_items.map((file, index) => `import $${index} from "${directory}${file}";`)
      .join("\n")
  }

const manifest: DocumentFile[] = [
${
    manifest_items.map((file, index) => {
      const parsed_path = parse(file);
      const resulting_path = join(parsed_path.dir, parsed_path.name);
      const resulting_line = `  {
    path: "${resulting_path}",
    document: $${index},
    render: "${renders[index]}",
  },`;
      return resulting_line;
    }).join("\n")
  }
];

export default manifest;`;

  const proc = Deno.run({
    cmd: [Deno.execPath(), "fmt", "-"],
    stdin: "piped",
    stdout: "piped",
    stderr: "null",
  });
  const raw = new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(manifest_text));
      controller.close();
    },
  });
  await raw.pipeTo(proc.stdin.writable);
  const out = await proc.output();
  await proc.status();
  proc.close();

  const manifestStr = new TextDecoder().decode(out);
  const manifestPath = join(project_dir, "./documents.gen.ts");

  await Deno.writeTextFile(manifestPath, manifestStr);
};

const generateDocumentsManifest = async (base: string, directory: string) => {
  const project_dir = dirname(fromFileUrl(base));
  const documents_dir = join(project_dir, directory);

  const manifest_items = await collectDocuments(documents_dir);
  await writeBareManifest(project_dir, directory, manifest_items);
  const renders = await renderDocuments(base, manifest_items);
  await writeFullManifest(project_dir, directory, manifest_items, renders);

  console.log(
    `%cThe manifest has been generated for ${manifest_items.length} documents.`,
    "color: blue; font-weight: bold",
  );
};

export type { DocumentDescription, DocumentFile };
export { fileToBase64, generateDocumentsManifest };
