import { Handlers, PageProps } from "$fresh/server.ts";
import { getDocumentByAddress } from "../../../components/documents/documents.tsx";

export const handler: Handlers = {
  GET: async (req, ctx) => {
    const document_name = ctx.params.document;
    const document_description = getDocumentByAddress(document_name);

    if (!document_description) {
      return new Response("No such document", { status: 404 });
    }

    try {
      const document_page_name = ctx.params.page;
      const document_page_number = parseInt(document_page_name);
      const document_page = document_description.pages[document_page_number];

      return await ctx.render({ pages: [document_page] });
    } catch {
      return new Response("No such page for a document", { status: 404 });
    }
  },
};

interface DocumentRawPageProps {
  pages: Array<Element>;
}
const DocumentRawPage = (props: PageProps<DocumentRawPageProps>) => props.data.pages;
export default DocumentRawPage;
