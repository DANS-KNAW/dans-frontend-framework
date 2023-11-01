import { createApi } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import axios from 'axios';
import type { AxiosHeaders, AxiosRequestConfig, AxiosError, AxiosProgressEvent } from 'axios';
import { setMetadataSubmitStatus, setFilesSubmitStatus, setLatestSave } from './submitSlice';
import { store } from '../../redux/store';
import type { Target } from '@dans-framework/user-auth';
import type { HeaderData, SubmitHeaders } from '../../types/Submit';
import moment from 'moment';

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
      actionType?: string;
    },
    unknown,
    unknown
  > =>
  async ({ url, method, data, params, headers, actionType }) => {
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
        store.dispatch(setMetadataSubmitStatus(actionType === 'submit' ? 'submitted' : 'saved'));
        actionType === 'save' && store.dispatch(setLatestSave(moment().format('D-M-YYYY @ HH:mm')));
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

const formatHeaderData = (headerData: HeaderData) => ({
  Authorization: `Bearer ${headerData.submitKey}`,
  'user-id': headerData.userId,
  'auth-env-name': headerData.target.envName,
  'assistant-config-name': headerData.target.configName,
  'targets-credentials': JSON.stringify(headerData.targetCredentials.map((t: Target) => ({
    'target-repo-name': t.repo,
    'credentials': {
      'username': t.auth,
      'password': headerData.targetKeys[t.authKey],
    },
  })))
}) as SubmitHeaders;

export const submitApi = createApi({
  reducerPath: 'submitApi',
  baseQuery: axiosBaseQuery({ baseUrl: `${import.meta.env.VITE_PACKAGING_TARGET}/inbox/` }),
  endpoints: (build) => ({
    submitData: build.mutation({
      // Custom query for chaining Post functions
      // submitKey is the current users Keycloak token
      async queryFn({data, headerData, actionType}, queryApi, extraOptions, fetchWithBQ) {
        console.log('submitting metadata...')
        console.log(data)
        // Format the headers
        const headers = formatHeaderData(headerData);
        console.log('submitting with headers...')
        console.log(headers);

        // First post the metadata
        const metadataResult = await fetchWithBQ({
          url: `metadata/${actionType === 'save' ? 'DRAFT' : 'PUBLISH'}`,
          method: 'POST',
          data: data,
          headers: headers,
          actionType: actionType,
        });

        console.log(metadataResult)

        if (metadataResult.error)
          return { error: metadataResult.error as FetchBaseQueryError }

        return { data: metadataResult }
      },
    }),
    submitFiles: build.mutation({
      async queryFn({data, headerData}, queryApi, extraOptions, fetchWithBQ) {
        console.log('submitting files...')
        console.log(data.map((d: any) => [...d]))
        const headers = formatHeaderData(headerData);
        const filesResults = Array.isArray(data) && await Promise.all(data.map((file: any) => fetchWithBQ({
          url: 'file',
          method: 'POST',
          data: file,
          headers: headers,
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