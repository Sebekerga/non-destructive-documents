import { Handlers, PageProps } from "$fresh/server.ts";
import puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts";

import DocumentPreviewHandler from "../../../islands/DocumentPreviewHandler.tsx";
import DocumentPreviewContainer from "../../../components/DocumentPreviewContainer.tsx";
import { DocumentDescription } from "../../../utils/documents.ts";
import manifest from "../../../documents.gen.ts";

export const handler: Handlers = {
  GET: async (req, ctx) => {
    const document_name = ctx.params.document;
    const document_description = manifest.find((document) => document.document_id === document_name);

    // returning page to user
    if (!document_description) {
      return new Response("No such document", { status: 404 });
    }

    // rendering page
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`http://localhost:8000/raw/${document_name}`, {
      waitUntil: "networkidle2",
    });

    // saving to a temp file
    const page_temp_file = await Deno.makeTempFile({
      prefix: "documents_render_",
      suffix: ".pdf",
    });
    await page.pdf({ path: page_temp_file, height: "297mm", width: "210mm", printBackground: true });

    console.log("temp path", page_temp_file);
    await browser.close();

    return await ctx.render(document_description);
  },
};

const DocumentPreview = (props: PageProps<DocumentDescription>) => {
  const { pages, ...document_data } = props.data;

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
          />
          <DocumentPreviewContainer {...document_data}>
            {props.data.pages}
          </DocumentPreviewContainer>
        </body>
      </html>
    </>
  );
};
export default DocumentPreview;
