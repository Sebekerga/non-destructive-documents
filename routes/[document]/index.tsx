import { Handlers, PageProps } from "$fresh/server.ts";
import puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts";

import DocumentPreviewHandler from "../../islands/DocumentPreviewHandler.tsx";
import DocumentPreviewContainer from "../../components/DocumentPreviewContainer.tsx";
import { DocumentDescription, getDocumentByAddress } from "../../components/documents/documents.tsx";

export const handler: Handlers = {
  GET: async (req, ctx) => {
    const document_name = ctx.params.document;

    // rendering page
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`http://localhost:8000/${document_name}/raw`, {
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

    // returning page to user
    const document_description = getDocumentByAddress(document_name);
    if (!document_description) {
      return new Response("No such document", { status: 404 });
    }

    return await ctx.render(document_description );
  },
};

const DocumentPreview = (props: PageProps<DocumentDescription>) => {
  const {pages, ...document_data} = props.data;
  
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
