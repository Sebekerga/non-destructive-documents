import { useEffect } from "preact/hooks";
import downloadjs from "downloadjs";

interface DocumentPreviewHandlerProps {
  label: string;
  document_id: string;
  filename: string;
  disable_pdf?: boolean;
  pdf?: string;
}
const DocumentPreviewHandler = (props: DocumentPreviewHandlerProps) => {
  useEffect(() => {
    const fitDocumentToDevice = () => {
      const document_container = document.getElementById(props.document_id);
      const parent = document_container?.parentElement;

      if (!document_container || !parent) {
        throw Error("invalid document container id");
      }

      const document_width = document_container?.offsetWidth;
      const parent_width = parent?.offsetWidth;

      if (parent && parent_width && document_width >= parent_width) {
        parent.style.height = "";

        const scale = parent_width / document_width;
        document_container.style.scale = `${scale}`;
        parent.style.height = `calc(${document_container.offsetHeight * scale}px + 2.5rem)`;
      } else {
        document_container.style.scale = "1";
        parent.style.height = "";
      }
    };

    self.addEventListener("resize", fitDocumentToDevice);
    fitDocumentToDevice();

    return () => self.removeEventListener("resize", fitDocumentToDevice);
  }, []);

  const saveAsPDF = () => {
    console.log("saving pdf", props.pdf);

    props.pdf &&
      downloadjs(`data:application/pdf;base64,${props.pdf}`, `${props.filename}.pdf`, "application/pdf");
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Sofia+Sans:wght@300&display=swap"
        rel="stylesheet"
      />
      <header class="bg-gradient-to-bl from-blue-50 to-blue-300 py-3 px-8 sticky top-0 z-10 flex shadow-2xl">
        <div class="flex-1"></div>
        <span class="text-4xl text-black hover:-translate-y-0.5 transition-transform">{props.label}</span>
        <div class="flex-1 flex items-center">
          <div class="flex-1"></div>
          <button
            class="group text-black text-2xl underline hover:text-blue-700 w-[fit-content] inline-flex disabled:text-gray-600"
            onClick={saveAsPDF}
            disabled={props.disable_pdf}
          >
            <svg
              class="h-6 w-6 m-1"
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                class="group-enabled:group-hover:translate-y-[0] -translate-y-[0.9rem] transition-transform"
                d="M7.50005 1.04999C7.74858 1.04999 7.95005 1.25146 7.95005 1.49999V8.41359L10.1819 6.18179C10.3576 6.00605 10.6425 6.00605 10.8182 6.18179C10.994 6.35753 10.994 6.64245 10.8182 6.81819L7.81825 9.81819C7.64251 9.99392 7.35759 9.99392 7.18185 9.81819L4.18185 6.81819C4.00611 6.64245 4.00611 6.35753 4.18185 6.18179C4.35759 6.00605 4.64251 6.00605 4.81825 6.18179L7.05005 8.41359V1.49999C7.05005 1.25146 7.25152 1.04999 7.50005 1.04999Z"
                fill="currentColor"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                class="group-enabled:group-hover:translate-y-[0.9rem] group-enabled:group-hover:opacity-0 group-enabled:group-hover:scale-y-0 transition-all"
                d="M7.50005 1.04999C7.74858 1.04999 7.95005 1.25146 7.95005 1.49999V8.41359L10.1819 6.18179C10.3576 6.00605 10.6425 6.00605 10.8182 6.18179C10.994 6.35753 10.994 6.64245 10.8182 6.81819L7.81825 9.81819C7.64251 9.99392 7.35759 9.99392 7.18185 9.81819L4.18185 6.81819C4.00611 6.64245 4.00611 6.35753 4.18185 6.18179C4.35759 6.00605 4.64251 6.00605 4.81825 6.18179L7.05005 8.41359V1.49999C7.05005 1.25146 7.25152 1.04999 7.50005 1.04999Z"
                fill="currentColor"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M2.5 10C2.77614 10 3 10.2239 3 10.5V12C3 12.5539 3.44565 13 3.99635 13H11.0012C11.5529 13 12 12.5528 12 12V10.5C12 10.2239 12.2239 10 12.5 10C12.7761 10 13 10.2239 13 10.5V12C13 13.1041 12.1062 14 11.0012 14H3.99635C2.89019 14 2 13.103 2 12V10.5C2 10.2239 2.22386 10 2.5 10Z"
                fill="currentColor"
              />
            </svg>
            <span class="mr-2">.pdf</span>
          </button>
          <div class="flex-1"></div>
        </div>
      </header>
    </>
  );
};

export default DocumentPreviewHandler;
