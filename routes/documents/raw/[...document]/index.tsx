import { Handlers, PageProps } from "$fresh/server.ts";
import { normalize } from "deno/std/path/posix.ts";
import manifest from "../../../../documents.gen.ts";
import { DocumentDescription } from "../../../../utils/documents.ts";

export const handler: Handlers = {
  GET: async (req, ctx) => {
    const document_name = `/${ctx.params.document}`;
    const document_description = manifest
      .find((document) => normalize(document.path) === normalize(document_name))
      ?.document;

    if (!document_description) {
      return new Response("No such document", { status: 404 });
    }

    return await ctx.render(document_description);
  },
};

const DocumentRaw = (props: PageProps<DocumentDescription>) => (
  <>
    <link
      href="https://fonts.googleapis.com/css2?family=Sofia+Sans:wght@300&display=swap"
      rel="stylesheet"
    />
    {props.data.pages.map((p) => (
      <div class={`w-[${props.data.page_size.width}] h-[calc(${props.data.page_size.height}-(1mm-0.865mm))]`}>
        {p}
      </div>
    ))}
  </>
);
export default DocumentRaw;
