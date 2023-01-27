import { ComponentChildren } from "https://esm.sh/v102/preact@10.11.0/src/index";

interface DocumentPageInterface {
    children: ComponentChildren;
    number: number;
  }
const DocumentPage = (props: DocumentPageInterface) => {
  return (
    <div class="mx-8 my-[5px]">
      <div class="shadow-2xl mt-4 border-1 border-gray-500">
        {props.children}
      </div>
      <h3>Page {props.number}</h3>
    </div>
  );
};

interface DocumentPreviewContainerProps {
  children: ComponentChildren;
  label: string;
  document_id: string;
}
const DocumentPreviewContainer = (props: DocumentPreviewContainerProps) => {
  const content = Array.isArray(props.children)
    ? props.children.map((page, i) => <DocumentPage number={i + 1}>{page}</DocumentPage>)
    : <DocumentPage number={1}>{props.children}</DocumentPage>;

  return (
    <>
      <main>
        <div class="flex max-w-full overflow-hidden max-h-full">
          <div class="flex-1 h-1" />
          <div id={props.document_id} class="origin-top-left mt-10">
            {content}
          </div>
          <div class="flex-1 h-1" />
        </div>
      </main>
    </>
  );
};

export default DocumentPreviewContainer