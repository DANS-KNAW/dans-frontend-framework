import { useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { green } from '@mui/material/colors';
import CheckIcon from '@mui/icons-material/Check';
import SendIcon from '@mui/icons-material/Send';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { getMetadataStatus, getMetadata, resetMetadata, setSectionStatus, getSessionId } from '../metadata/metadataSlice';
import { getFiles, resetFiles } from '../files/filesSlice';
import { useSubmitDataMutation, useSubmitFilesMutation } from './submitApi';
import { setMetadataSubmitStatus, getMetadataSubmitStatus, getFilesSubmitStatus, resetFilesSubmitStatus } from './submitSlice';
import { formatFormData, formatFileData } from './submitHelpers';
import { useTranslation } from 'react-i18next';
import { getData } from '../../pages/depositSlice';

const Submit = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation('submit');
  const metadataStatus = useAppSelector(getMetadataStatus);
  const metadataSubmitStatus = useAppSelector(getMetadataSubmitStatus);
  const metadata = useAppSelector(getMetadata);
  const selectedFiles = useAppSelector(getFiles);
  const sessionId = useAppSelector(getSessionId);
  // File status exists in an array, so we need to do some processing and filtering. 
  const filesSubmitStatus = useAppSelector(getFilesSubmitStatus).filter(f => f.id !== '');
  const totalFileProgress = filesSubmitStatus.reduce( (n, {progress}) => n + (progress || 0), 0) / filesSubmitStatus.length || undefined;
  // If any file has an error, the form should indicate that.
  const fileStatusArray = [...new Set(filesSubmitStatus.map(f => f.status))];
  const fileStatus = 
    fileStatusArray.indexOf('error') !== -1 ? 
    'error' :
    fileStatusArray.indexOf('submitting') !== -1 ?
    'submitting' :
    fileStatusArray.indexOf('success')  !== -1 ?
    'success' :
    '';

  const [submitData, { 
    isUninitialized: isUninitializedMeta, 
    isLoading: isLoadingMeta, 
    isSuccess: isSuccessMeta, 
    isError: isErrorMeta, 
    reset: resetMeta,
  }] = useSubmitDataMutation();
  const [submitFiles, { 
    isLoading: isLoadingFiles, 
    reset: resetSubmittedFiles, 
  }] = useSubmitFilesMutation();

  const depositProps = useAppSelector(getData);

  const handleButtonClick = () => {
    // First submit the metadata
    const formattedMetadata = formatFormData(sessionId, metadata, selectedFiles);
    dispatch(setMetadataSubmitStatus('submitting'));
    submitData({
      data: formattedMetadata, 
      targetRepo: depositProps.targetRepo,
      submitKey: depositProps.submitKey,
      targetAuth: depositProps.targetAuth,
      targetKey: depositProps.targetKey,
    });
  };

  useEffect(() => {
    // Then submit the files if metadata submit is successful
    if (isSuccessMeta && selectedFiles) {
      formatFileData(sessionId, selectedFiles)
        .then( d => {
          submitFiles({
            data: d, 
            submitKey: depositProps.submitKey,
          });
        });
    }
  }, [isSuccessMeta, selectedFiles, sessionId, submitFiles]);

  const resetForm = () => {
    // reset RTK mutations
    resetSubmittedFiles();
    resetMeta();
    // reset files in file slice
    dispatch(resetFiles());
    // reset metadata in metadata slice
    dispatch(resetMetadata());
    // reset status in submit slice
    dispatch(setMetadataSubmitStatus(''));
    dispatch(resetFilesSubmitStatus());
    // finally reset all section statusses
    dispatch(setSectionStatus(null));
  }

  const iconSx = {
    color: 'white',
  }

  return (
    <Stack direction="column" alignItems="flex-end">
      <Stack direction="row" alignItems="center">
        <Typography mr={2}>
          { isUninitializedMeta && (
            // metadata has not yet been submitted, so let's just indicate metadata completeness
            metadataStatus === 'error' ?
            t('metadataError') :
            metadataStatus === 'warning' || selectedFiles.length === 0  ?
            t('metadataWarning') :
            t('metadataSuccess')
          ) }
          { // submit process has started, let's check for responses
            (metadataSubmitStatus === 'submitting' || fileStatus === 'submitting' || isLoadingFiles) &&
            t('submitting')
          }
          { (isSuccessMeta && (fileStatus === 'success' || selectedFiles.length === 0)) &&
            t('submitSuccess')
          }
          { isErrorMeta &&
            t('submitErrorMetadata')
          }
          { fileStatus === 'error' &&
            t('submitErrorFiles')
          }
        </Typography>
        <Box sx={{ mr: 2, position: 'relative' }} display="flex" justifyContent="center" alignItems="center">
          <Box display="flex" justifyContent="center" alignItems="center" sx={{
            p: 1.2,
            borderRadius: '50%',
            backgroundColor: `${
              isSuccessMeta && (fileStatus === 'success' || selectedFiles.length === 0) ?
              'success' :
              metadataStatus === 'error' || fileStatus === 'error' || isErrorMeta ?
              'error' :
              metadataStatus === 'warning' || selectedFiles.length === 0 ?
              'warning' :
              'primary'
            }.main`,
            opacity: (metadataSubmitStatus === 'submitting' || fileStatus === 'submitting' || isLoadingFiles) ? 0.5 : 1,
          }}>
            {
              isSuccessMeta && (fileStatus === 'success' || selectedFiles.length === 0) ?
              <CheckIcon sx={iconSx} /> :
              (metadataStatus === 'error' || fileStatus === 'error' || isErrorMeta) && !(metadataSubmitStatus === 'submitting' || fileStatus === 'submitting' || isLoadingFiles) ?
              <ErrorOutlineOutlinedIcon sx={iconSx} /> :
              <SendIcon sx={iconSx} />
            }
          </Box>
          {(fileStatus === 'submitting' || isLoadingFiles) && (
            <CircularProgress
              size={54}
              sx={{
                color: green[500],
                position: 'absolute',
                zIndex: 1,
              }}
              variant={totalFileProgress ? "determinate" : "indeterminate"}
              value={totalFileProgress}
            />
          )}
        </Box>
        {isSuccessMeta && (fileStatus === 'success' || selectedFiles.length === 0) && 
          <Button
            variant="contained"
            onClick={resetForm}
            size="large"
            sx={{mr:1}}
          >
            {t('reset')}
          </Button> 
        }
        <Button
          variant="contained"
          disabled={isSuccessMeta || isLoadingMeta || (metadataStatus === 'error' && !depositProps.skipValidation)}
          onClick={handleButtonClick}
          size="large"
        >
          {t('submit')}
        </Button>
      </Stack>
    </Stack>
  );
}

export default Submit;