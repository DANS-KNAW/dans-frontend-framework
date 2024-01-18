import { SelectedFile, FileBlob } from "../../types/Files";
import { SectionType } from "../../types/Metadata";

// Function to rearrange the metadata for submission
export const formatFormData = (
  sessionId: string,
  metadata: SectionType[],
  files?: SelectedFile[],
) => {
  // Create the file metadata array
  const fileMetadata =
    Array.isArray(files) &&
    files.map((f) => ({
      id: f.id,
      name: f.name,
      lastModified: f.lastModified,
      private: f.private,
      role: f.role,
      process: f.process,
    }));

  return {
    id: sessionId,
    metadata: metadata,
    "file-metadata": fileMetadata,
  };
};

export const formatFileData = async (
  files: SelectedFile[],
) => {
  // Convert file blob url's back to a js File object 
  // And add the required metadata (sessionId gets added in the upload function)
  const fileData =
    Array.isArray(files) &&
    (await Promise.all(
      files.map((file) =>
        fetch(file.url)
          .then((result) => result.blob())
          .then((blob) => ({
            blob: blob,
            fileName: file.name,
            fileId: file.id,
          })),
      ),
    ));

  return fileData as FileBlob[];
};


// event handler for leaving page when form is submitting or errored and unsaved
export const beforeUnloadHandler = (event: any) => {
  event.preventDefault();
  event.returnValue = true;
};
