import { SelectedFile } from '../../types/Files';
import { SectionType } from '../../types/Metadata';

// Function to rearrange the metadata for submission
export const formatFormData = (sessionId: string, metadata: SectionType[], files?: SelectedFile[]) => {
  // Create the file metadata array
  const fileMetadata = Array.isArray(files) && files.map( f => ({
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
}

export const formatFileData = async (sessionId: string, files: SelectedFile[]) => {
  // Submit files individually using multipart form data
  // Convert file blob url's back to a js File object and add them to a FormData object
  // Add FormData to the file array
  const fileData = Array.isArray(files) && await Promise.all(
    files.map(file => 
      fetch(file.url)
      .then(result => result.blob())
      .then(blob => {
        let formData = new FormData();
        formData.append('file', blob);
        formData.append('fileName', file.name);
        formData.append('fileId', file.id);
        formData.append('metadataId', sessionId);
        return formData;
      })
    )
  );

  return fileData;
}