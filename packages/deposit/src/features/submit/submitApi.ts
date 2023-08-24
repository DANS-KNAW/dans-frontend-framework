import { createApi } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchBaseQueryError } from '@reduxjs/toolkit/query'
import axios from 'axios'
import type { AxiosRequestConfig, AxiosError, AxiosProgressEvent } from 'axios'
import { setMetadataSubmitStatus, setFilesSubmitStatus } from './submitSlice';
import { store } from '../../app/store';

// We use Axios to enable file upload progress monitoring
const axiosBaseQuery =
  (
    { baseUrl }: { baseUrl: string } = { baseUrl: '' }
  ): BaseQueryFn<
    {
      url: string
      method: AxiosRequestConfig['method']
      data?: AxiosRequestConfig['data']
      params?: AxiosRequestConfig['params']
      headers?: AxiosRequestConfig['headers']
    },
    unknown,
    unknown
  > =>
  async ({ url, method, data, params, headers }) => {
    // Perform actions based on server response here, so we can truly separate metadata and file handling
    // Files are always a FormData object, metadata is JSON
    const isFile = data instanceof FormData;
    try {
      const result = await axios({ 
        url: baseUrl + url, 
        method, 
        data, 
        params,
        headers,
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          if (isFile) {
            // Calculate progress percentage and set state in fileSlice
            const percentCompleted = progressEvent.total ? Math.round( (progressEvent.loaded * 100) / progressEvent.total ) : 0;
            store.dispatch(setFilesSubmitStatus({
              id: data.get('fileId') as string, 
              progress: percentCompleted,
              status: 'submitting',
            }));
          }
        }
      })
      // set upload successful in file object
      if (isFile && result.data) {
        console.log(result)
        store.dispatch(setFilesSubmitStatus({
          id: data.get('fileId') as string, 
          status: 'success',
        }));
      }
      // Metadata has been successfully submitted, so let's store that right away
      else if (result.data) {
        store.dispatch(setMetadataSubmitStatus('success'));
      }
      return { data: result.data }
    } catch (axiosError) {
      const err = axiosError as AxiosError
      if (isFile) {
        // set error in the file object, so user can retry uploading
        store.dispatch(setFilesSubmitStatus({
          id: data.get('fileId') as string, 
          status: 'error',
        }));
      }
      else {
        store.dispatch(setMetadataSubmitStatus('error'));
      }
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      }
    }
  }

export const submitApi = createApi({
  reducerPath: 'submitApi',
  baseQuery: axiosBaseQuery({ baseUrl: 'https://packaging.labs.dans.knaw.nl/inbox/' }),
  endpoints: (build) => ({
    submitData: build.mutation({
      // Custom query for chaining Post functions
      // TODO: responses and error handling.
      async queryFn({data, targetRepo, submitKey, targetAuth, targetKey}, queryApi, extraOptions, fetchWithBQ) {
        console.log('submitting metadata...')
        console.log(data)
        // First post the metadata
        const metadataResult = await fetchWithBQ({
          url: `metadata?repo_target=${targetRepo}`,
          method: 'POST',
          data: data,
          headers: {
            Authorization: `Bearer ${submitKey}`,
            'target-username': targetAuth,
            'target-password': targetKey,
          },
        });

        console.log(metadataResult)

        if (metadataResult.error)
          return { error: metadataResult.error as FetchBaseQueryError }

        return { data: metadataResult }
      },
    }),
    submitFiles: build.mutation({
      async queryFn({data, submitKey}, queryApi, extraOptions, fetchWithBQ) {
        console.log('submitting files...')
        console.log(data)
        const filesResults = Array.isArray(data) && await Promise.all(data.map((file: any) => fetchWithBQ({
          url: 'file',
          method: 'POST',
          data: file,
          headers: {
            Authorization: `Bearer ${submitKey}`,
          },
        })));

        console.log(filesResults)

        const filesErrors = filesResults && filesResults.filter( (res: any) => res.error as FetchBaseQueryError )
        if (Array.isArray(filesErrors) && filesErrors.length > 0)
          return { error: filesErrors }

        return { data: filesResults };
      }
    }),
  }),
});

export const {
  useSubmitDataMutation,
  useSubmitFilesMutation,
} = submitApi;