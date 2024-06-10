import type { InitialSectionType } from "@dans-framework/deposit";
import json from '@dans-framework/utils/preloader';

const section: InitialSectionType = {
  id: "relations",
  title: "Relations",
  fields: [
    {
      type: "autocomplete",
      label: "Research domain",
      name: "audience",
      required: true,
      description: "Specifies which research disciplines which may be interested in this dataset.",
      options: "narcis",
      value: json?.audience,
    },
  ],
};

export default section;
