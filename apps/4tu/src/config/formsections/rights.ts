import type { InitialSectionType } from "@dans-framework/deposit";

const section: InitialSectionType = {
  id: "rights",
  title: "Rights, licencing and re-use",
  fields: [
    {
      type: "autocomplete",
      allowFreeText: true,
      label: {
        en: "Rights holder",
        nl: "Rechthebbende",
      },
      name: "rightsholder",
      required: true,
      description: "State the organisation or individual that is holder of the intellectual property rights. For datasets, these rights are usually vested in the organisation thet employs the data creator(s). Note that the depositor (account used to deposit the data and metadata will be contacted for access requests, and must have the consent of the rights holder to publish the data.",
      multiApiValue: "ror",
      options: ["ror", "orcid"],
    },
    {
      type: "autocomplete",
      label: {
        en: "Licence",
        nl: "Licentie",
      },
      name: "licence_type",
      required: true,
      description: "One of a number of specific licences",
      options: "sshLicences",
      value: {
        label: "CC0 1.0",
        value: "http://creativecommons.org/publicdomain/zero/1.0",
      },
    },
  ],
};

export default section;
