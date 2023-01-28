import { Handlers, PageProps } from "$fresh/server.ts";
import manifest from "../../../../documents.gen.ts";

export const handler: Handlers = {
  GET: async (req, ctx) => {
    const document_name = ctx.params.document;
    console.log(req);
    const document_description = manifest.find((document) => document.document_id === document_name);

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
