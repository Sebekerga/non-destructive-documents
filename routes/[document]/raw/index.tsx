import { Handlers, PageProps } from "$fresh/server.ts";
import { getDocumentByAddress } from "../../../components/documents/documents.tsx";

export const handler: Handlers = {
  GET: async (req, ctx) => {
    const document_name = ctx.params.document;
    const document_description = getDocumentByAddress(document_name);
    
    if (!document_description) {
      return new Response("No such document", { status: 404 });
    }

    return await ctx.render({ pages: document_description.pages });
  },
};

interface DocumentRawProps {
  pages: Array<Element>;
}
const DocumentRaw = (props: PageProps<DocumentRawProps>) => props.data.pages;
export default DocumentRaw;
