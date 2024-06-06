import { SelectedFile } from "../../types/Files";
import { SectionType } from "../../types/Metadata";
import { findByIdOrName } from "../metadata/metadataHelpers";
import moment from "moment";

// Function to rearrange the metadata for submission
export const formatFormData = (
  sessionId: string,
  metadata: SectionType[],
  files?: SelectedFile[],
  formTitle: string = '',
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
      embargo: f.embargo ? moment(f.embargo, "DD-MM-YYYY").format("YYYY-MM-DD").toString() : undefined,
    }));

  // since the title field is unique, we can assume we only find one value
  // so lets return that
  let foundTitle = false;
  const title = metadata.map(section => {
    if (foundTitle) return false;
    const toFind = findByIdOrName(formTitle, section.fields, "name")?.value;
    if (toFind) {
      foundTitle = true;
    }
    return toFind;
  }).filter(Boolean)[0];

  return {
    id: sessionId,
    metadata: metadata,
    "file-metadata": fileMetadata,
    title: title || '',
  };
};

export const formatFileData = async (
  sessionId: string,
  files: SelectedFile[],
) => {
  // Submit files individually using multipart form data
  // Convert file blob url's back to a js File object and add them to a FormData object
  // Add FormData to the file array
  const fileData =
    Array.isArray(files) &&
    (await Promise.all(
      files.map((file) =>
        fetch(file.url)
          .then((result) => result.blob())
          .then((blob) => {
            let formData = new FormData();
            formData.append("file", blob);
            formData.append("fileName", file.name);
            formData.append("fileId", file.id);
            formData.append("datasetId", sessionId);
            return formData;
          }),
      ),
    ));

  return fileData;
};