import ResumePage from "./Resume.tsx";

enum DocumentType {
  Resume,
}

interface DocumentDescription {
  label: string;
  document_id: string;
  filename: string;
  pages: Array<preact.JSX.Element>;
}

const documents: DocumentDescription[] = [
  {
    label: "Resume",
    document_id: "resume",
    filename: "kozlov_maxim_resume",
    pages: [
      <ResumePage color="gray" />,
      <ResumePage color="green" />,
    ],
  },
];

const getDocumentByAddress = (name: string) => {
  return documents.find((document) => document.document_id === name);
};

export { getDocumentByAddress };
export type { DocumentDescription };
export default documents;
