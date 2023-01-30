import { HandlerContext, Handlers } from "$fresh/server.ts";
import { normalize } from "deno/std/path/posix.ts";
import manifest from "../../../documents.gen.ts";

const handler: Handlers = {
  GET(_req: Request, _ctx: HandlerContext) {
    const document_name = `/${_ctx.params.document}`;
    const document_data = manifest.find(
      (document) => normalize(document.path) === normalize(document_name),
    );
    const document_description = document_data?.document;

    // returning page to user
    if (!document_description) {
      return new Response("No such document", { status: 404 });
    }

    const response_body = document_description.page_size;
    const response = new Response(JSON.stringify(response_body));
    response.headers.set("content-type", "application/json;charset=UTF-8");

    return response;
  },
};

export { handler };
