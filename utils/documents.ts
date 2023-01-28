import { encode } from "deno/std/encoding/base64.ts";
import { readAll } from "deno/std/io/util.ts";

import { join, toFileUrl } from "deno/std/path/mod.ts";
import { walk } from "deno/std/fs/walk.ts";
import { dirname, fromFileUrl } from "deno/std/path/posix.ts";

interface DocumentDescription {
  label: string;
  document_id: string;
  filename: string;
  pages: Array<preact.JSX.Element>;
}

const fileToBase64 = async (file_path: string) => {
  const file = await Deno.open(file_path);
  const encoded = encode(await readAll(file));

  return encoded;
};

const collectDocuments = async (directory: string): Promise<string[]> => {
  const documents = [];

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
        documents.push(file);
      }
    }
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      // Do nothing.
    } else {
      throw err;
    }
  }
  documents.sort();

  return documents;
};

const generateDocumentsManifest = async (base: string, directory: string) => {
  const project_dir = dirname(fromFileUrl(base));
  const documents_dir = join(project_dir, directory);

  const manifest_data = await collectDocuments(documents_dir);

  const manifest_text = `// DO NOT EDIT. This file is generated.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running \`dev.ts\`.

${
    manifest_data.map((file, index) => `import $${index} from "${directory}${file}";`)
      .join("\n")
  }

const manifest = [
${Array.from({ length: manifest_data.length }, (v, i) => ` $${i},`).join("\n")}
];

export default manifest;
`;

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
  console.log(
    `%cThe manifest has been generated for ${manifest_data.length} documents.`,
    "color: blue; font-weight: bold",
  );
};

export type { DocumentDescription };
export { fileToBase64, generateDocumentsManifest };
