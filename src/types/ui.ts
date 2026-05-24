export type ImageDropzoneProps = {
  id: string;
  label?: string;
  hint?: string;
  multiple?: boolean;
  onFilesSelected: (files: File[]) => void;
};
