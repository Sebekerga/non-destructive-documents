import { Handlers, PageProps } from "$fresh/server.ts";
import { normalize } from "deno/std/path/posix.ts";

import manifest from "../../../documents.gen.ts";
import { DocumentDescription } from "../../../utils/documents.ts";

import DocumentPreviewContainer from "../../../components/DocumentPreviewContainer.tsx";
import DocumentPreviewHandler from "../../../islands/DocumentPreviewHandler.tsx";

export const handler: Handlers = {
  GET: async (req, ctx) => {
    const document_name = `/${ctx.params.document}`;
    const document_data = manifest.find(
      (document) => normalize(document.path) === normalize(document_name),
    );
    const document_description = document_data?.document;

    // returning page to user
    if (!document_description) {
      return new Response("No such document", { status: 404 });
    }

    return document_data.render
      ? await ctx.render({
        document_description,
        pdf: document_data.render,
      } as DocumentPreviewProps)
      : await ctx.render({
        document_description,
        disable_pdf: true,
      } as DocumentPreviewProps);
  },
};

interface DocumentPreviewProps {
  document_description: DocumentDescription;
  disable_pdf?: boolean;
  pdf?: string;
}
const DocumentPreview = (props: PageProps<DocumentPreviewProps>) => {
  const { pages, page_size, ...document_data } = props.data.document_description;
  const document_id = "doc";

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
            document_id={document_id}
            disable_pdf={props.data.disable_pdf}
            pdf={props.data.pdf}
          />
          <DocumentPreviewContainer {...document_data} document_id={document_id}>
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
