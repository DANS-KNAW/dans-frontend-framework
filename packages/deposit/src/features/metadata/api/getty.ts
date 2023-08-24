import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import { XMLParser } from 'fast-xml-parser';
import type { GettyResponse, ProxyResponse } from '../../../types/Api';

export const gettyApi = createApi({
  reducerPath: 'getty',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://lipwig.labs.dans.knaw.nl' }),
  endpoints: (build) => ({
    fetchGettyAATTerms: build.query({
      query: (content) => {
        const search = content.replace(/ +(?= |$)/g,'').replace(/ +/g, ' AND ')+'*';
        return ({
          url: `proxy?url=${encodeURIComponent(`http://vocabsservices.getty.edu/AATService.asmx/AATGetTermMatch?term=${search}&logop=and&notes=`)}`,
          headers: {Accept: "application/json"},
      })},
      transformResponse: (response: ProxyResponse, meta, arg) => {
        // convert xml text string to JSON
        const parser = new XMLParser();
        const json: GettyResponse = parser.parse(response.text);
        // Return an empty array when no results, which is what the Autocomplete field expects
        return json.Vocabulary.Count > 0 ? 
          ({
            arg: arg,
            response: 
              json.Vocabulary.Subject.map( (item: any) => ({
                label: item.Preferred_Term,
                value: `http://vocab.getty.edu/page/aat/${item.Subject_ID}`, 
              })),
          })
          :
          [];
      },
    }),
  }),
});

export const {
  useFetchGettyAATTermsQuery,
} = gettyApi;