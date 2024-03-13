// Defines actions a user can select for file processing and roles

export const fileProcessing = [
  {
    value: "create_thumbnail",
    label: {
      en: "Create thumbnail",
      nl: "Genereer thumbnail",
    },
    for: ["video", "images"],
  },
  {
    value: "transcribe_audio",
    label: {
      en: "Generate audio transcription",
      nl: "Genereer audiotranscriptie",
    },
    for: ["video", "audio"],
  },
];

export const fileRoles = [
  {
    value: "data_file",
    label: "Data File",
  },
  {
    value: "type_registry_value",
    label: "Type Registry Value",
  },
  {
    value: "video_file",
    label: "Video File",
  },
  {
    value: "audio_file",
    label: "Audio File",
  },
  {
    value: "image_file",
    label: "Image File",
  },
  {
    value: "data_dictionary_code_book",
    label: "Data Dictionary - Code Book",
  },
  {
    value: "data_dictionary_other",
    label: "Data Dictionary - Other",
  },
  {
    value: "consent_form",
    label: "Consent Form",
  },
  {
    value: "methodology",
    label: "Methodology",
  },
  {
    value: "report",
    label: "Report",
  },
  {
    value: "rublication",
    label: "Publication",
  },
  {
    value: "code",
    label: "Code",
  },
  {
    value: "thumbnail",
    label: "Thumbnail",
  },
  {
    value: "transcript_or_derived_file",
    label: "Transcript or Derived File",
  },
  {
    value: "dissemination_copy",
    label: "Dissemination Copy",
  },
  {
    value: "preservation_copy",
    label: "Preservation Copy",
  },
  {
    value: "supplementary file",
    label: "Supplementary File",
  },
  {
    value: "original_metadata",
    label: "Original Metadata",
  },
];
