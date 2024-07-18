import type { AutocompleteAPIFieldData } from "@dans-framework/deposit";

export const postRecommendationsApiData = async (
  ror: string | null, 
  narcis: string | null, 
  depositType: string, 
  fileType: string
) => {
  try {
    /*const result = await fetch(``, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: JSON.stringify({
        affiliation: ror,
        domain: narcis,
        depositType: depositType,
        fileType: fileType,
      }),
    });
    const json = await result.json();
    return json;*/
    return ['fake1', 'fake2'];
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