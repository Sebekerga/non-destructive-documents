import { Handlers, PageProps } from "$fresh/server.ts";
import puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts";
import manifest from "../../../documents.gen.ts";
import { parse } from "deno/std/node/url.ts";
import { join } from "deno/std/path/posix.ts";

import { DocumentDescription } from "../../../utils/documents.ts";

import DocumentPreviewHandler from "../../../islands/DocumentPreviewHandler.tsx";
import DocumentPreviewContainer from "../../../components/DocumentPreviewContainer.tsx";

export const handler: Handlers = {
  GET: async (req, ctx) => {
    const document_name = ctx.params.document;
    const document_description = manifest.find((document) => document.document_id === document_name);

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
      const pdf_file = await page.pdf({
        path: page_temp_file,
        height: "297mm",
        width: "210mm",
        printBackground: true,
      });
      await browser.close();
    } catch {
      console.warn("It seems like it's not possible to save pdf file locally");
      return await ctx.render({
        document_description,
        disable_pdf: true,
      } as DocumentPreviewProps);
    }

    return await ctx.render({
      document_description,
    } as DocumentPreviewProps);
  },
};

interface DocumentPreviewProps {
  document_description: DocumentDescription;
  disable_pdf?: boolean;
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
          />
          <DocumentPreviewContainer {...document_data}>
            {props.data.document_description.pages}
          </DocumentPreviewContainer>
        </body>
      </html>
    </>
  );
};
export default DocumentPreview;
