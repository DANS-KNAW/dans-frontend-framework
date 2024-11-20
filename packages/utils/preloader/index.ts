// Little helper to extract form data from an LZ compressed string
import LZString from "lz-string";

/*
// format some fake data for testing purposes
const fakeData = LZString.compressToEncodedURIComponent(JSON.stringify({
  "title": "This is a title",
  "affiliation": {
    "label": "Deepam Educational Society for Health",
    "value": "https://ror.org/00nyy7p10"
  },
  "audience": {
    "id": "D12700",
    "label": "Gases, fluid dynamics, plasma physics",
    "value": "https://www.narcis.nl/classification/D12700"
  },
  "datastation": "ssh",
  "etc": "etc"
}));

console.log(fakeData);
*/

const uri = new URL(document.location.toString());
const searchParams =
  uri.searchParams.get("data") || sessionStorage.getItem("preloadData");
const json =
  searchParams ?
    JSON.parse(
      LZString.decompressFromEncodedURIComponent(searchParams as string),
    )
  : null;

export default json;
