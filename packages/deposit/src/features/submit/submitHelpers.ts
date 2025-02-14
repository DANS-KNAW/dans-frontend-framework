import { SelectedFile } from "../../types/Files";
import { MetadataStructure } from "../../types/Metadata";

// Function to rearrange the metadata for submission
export const formatFormData = (
  sessionId: string,
  metadata: MetadataStructure,
  files?: SelectedFile[],
  formTitle: string = "",
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
      // convert date to preferred date format
      embargo: f.embargo,
    }));

  return {
    id: sessionId,
    metadata: metadata,
    "file-metadata": fileMetadata,
    title: metadata[formTitle]?.value || "",
  };
};