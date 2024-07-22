import type { AutocompleteAPIFieldData } from "@dans-framework/deposit";
import type { FormConfig } from "@dans-framework/deposit";
import type { LanguageStrings } from "@dans-framework/utils";

export interface ExtendedFormConfig extends FormConfig {
  displayName: LanguageStrings;
  description: LanguageStrings;
} 

export const postRecommendationsApiData = async (
  ror: string | null, 
  narcis: string | null, 
  depositType: string, 
  fileType: string
) => {
  try {
    const result = await fetch(`https://repository-assistant.labs.dansdemo.nl/seek-advice`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Authorization: "Bearer @km1-10122004-lamA!M@rdh1yy@h@51nnur1@hK",
      },
      body: JSON.stringify({
        affiliation: ror,
        domain: narcis,
        "deposit-type": depositType,
        ...(fileType && { "file-type": fileType }),
      }),
    });
    const json = await result.json();
    return json.advice as ExtendedFormConfig[];
  } catch (error) {
    console.error(error);
    return false;
  }
}

export const fetchTypeaheadApiData = async (
  type: string, 
  debouncedInputValue: string, 
) => {
  const uri = 
    type === 'ror' ?
    `https://api.ror.org/organizations?query.advanced=name:${debouncedInputValue}*` :
    type === 'narcis' ?
    `https://vocabs.datastations.nl/rest/v1/NARCIS/search?query=${debouncedInputValue}*&unique=true&lang=en` :
    '';
  try {
    const result = await fetch(uri, {
      headers: { Accept: "application/json" }
    });
    const json = await result.json();
    const transformResult = 
      type === 'ror' ?
        (json.number_of_results > 0 ? 
          {
            arg: debouncedInputValue,
            response: json.items.map((item: any) => ({
              label: item.name,
              value: item.id,
            }))
          } : 
          []
        ) :
      type === 'narcis' ?
        (json.results.length > 0 ? 
          {
            arg: debouncedInputValue,
            response: json.results.map((item: any) => ({
              label: item.prefLabel,
              value: item.uri,
            })).filter(Boolean),
          } :
          []
        ) :
      [];
    return transformResult as AutocompleteAPIFieldData;
  } catch (error) {
    console.error(error);
    return false;
  }
}