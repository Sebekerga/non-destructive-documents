import puppeteer from "puppeteer";
import { Handlers, PageProps } from "$fresh/server.ts";
import { parse } from "deno/std/node/url.ts";
import { join, normalize } from "deno/std/path/posix.ts";
import { encode } from "deno/std/encoding/base64.ts";

import { DocumentDescription } from "../../../utils/documents.ts";
import manifest from "../../../documents.gen.ts";

import DocumentPreviewHandler from "../../../islands/DocumentPreviewHandler.tsx";
import DocumentPreviewContainer from "../../../components/DocumentPreviewContainer.tsx";

export const handler: Handlers = {
  GET: async (req, ctx) => {
    const document_name = `/${ctx.params.document}`;
    const document_description = manifest.find(
      (document) => normalize(document.path) === normalize(document_name),
    )?.document;

    // returning page to user
    if (!document_description) {
      return new Response("No such document", { status: 404 });
    }

    const parsed_url = parse(req.url, true, true);
    const host_full_url = `${parsed_url.protocol}//${parsed_url.host}`;
    const raw_document_preview = join(host_full_url, "documents/raw", document_name);

    try {
      // rendering page
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(raw_document_preview, {
        waitUntil: "networkidle2",
      });

      // saving to a temp file
      const page_temp_file = await Deno.makeTempFile({
        prefix: "documents_render_",
        suffix: ".pdf",
      });
      await page.pdf({
        path: page_temp_file,
        height: "297mm",
        width: "210mm",
        printBackground: true,
      });
      await browser.close();

      const file = await Deno.readFile(page_temp_file);
      const encoded = encode(file);

      console.log(`Returning document "${document_name}", from ${page_temp_file}`);
      return await ctx.render({
        document_description,
        pdf: encoded,
      } as DocumentPreviewProps);
    } catch {
      console.warn(`Returning document "${document_name}", without PDF`);
      return await ctx.render({
        document_description,
        disable_pdf: true,
      } as DocumentPreviewProps);
    }
  },
};

interface DocumentPreviewProps {
  document_description: DocumentDescription;
  disable_pdf?: boolean;
  pdf?: string;
}
const DocumentPreview = (props: PageProps<DocumentPreviewProps>) => {
  const { pages, ...document_data } = props.data.document_description;

  return (
    <>
      <html lang="en">
        <head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>{document_data.label}</title>
        </head>
        <body>
          <DocumentPreviewHandler
            {...document_data}
            disable_pdf={props.data.disable_pdf}
            pdf={props.data.pdf}
          />
          <DocumentPreviewContainer {...document_data}>
            {props.data.document_description.pages.map((p) => (
              <div
                class={`w-[${props.data.document_description.page_size.width}] h-[${props.data.document_description.page_size.height}]`}
              >
                {p}
              </div>
            ))}
          </DocumentPreviewContainer>
        </body>
      </html>
    </>
  );
};
export default DocumentPreview;
