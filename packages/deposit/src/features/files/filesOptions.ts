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
    value: "audio_file",
    label: "Audio file",
  },
  {
    value: "code",
    label: "Code",
  },
  {
    value: "data_dictionary_code_book",
    label: "Data dictionary - code nook",
  },
  {
    value: "data_dictionary_other",
    label: "Data dictionary - other",
  },
  {
    value: "data_file",
    label: "Data file",
  },
  {
    value: "dissemination_copy",
    label: "dissemination copy",
  },
  {
    value: "image_file",
    label: "Image file",
  },
  {
    value: "methodology",
    label: "Methodology",
  },
  {
    value: "original_metadata",
    label: "Original metadata",
  },
  {
    value: "preservation_copy",
    label: "Preservation copy",
  },
  {
    value: "publication",
    label: "Publication",
  },
  {
    value: "report",
    label: "Report",
  },
  {
    value: "supplementary_file",
    label: "Supplementary file",
  },
  {
    value: "thumbnail",
    label: "Thumbnail",
  },
  {
    value: "transcript_or_derived_file",
    label: "Transcript or derived file",
  },
  {
    value: "type_registry_value",
    label: "Type registry value",
  },
  {
    value: "video_file",
    label: "Video file",
  },
];
