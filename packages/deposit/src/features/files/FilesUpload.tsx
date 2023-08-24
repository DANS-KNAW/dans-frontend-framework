import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import CloseIcon from '@mui/icons-material/Close';
import Collapse from '@mui/material/Collapse';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import IconButton from '@mui/material/IconButton';
import blue from '@mui/material/colors/blue';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getFiles, addFiles } from './filesSlice';
import type { SelectedFile, FileLocation, RejectedFilesProps, DansSimpleListQueryResponse } from '../../types/Files';
import { v4 as uuidv4 } from 'uuid';
import { useFetchSimpleListQuery } from './api/dansFormats';
import { getMetadataSubmitStatus } from '../submit/submitSlice';
import { setNotification } from '../notification/notificationSlice';

const FilesUpload = () => {
  const dispatch = useAppDispatch();
  const currentFiles = useAppSelector(getFiles);
  const metadataSubmitStatus = useAppSelector(getMetadataSubmitStatus);
  const { t } = useTranslation('files');  
  const { data } = useFetchSimpleListQuery<DansSimpleListQueryResponse>(null);

  // Validate added files, needs to be synchronous, so no API calls possible here
  const fileValidator = (file: File) => {
    // No duplicate files
    const extensionIndex = file.name.lastIndexOf('.');
    const baseName = file.name.slice(0, extensionIndex);
    const extension = file.name.slice(extensionIndex);
    if (currentFiles.find(f => {
      const extensionIndexCurrent = f.name.lastIndexOf('.');
      const baseNameCurrent = f.name.slice(0, extensionIndexCurrent);
      const extensionCurrent = f.name.slice(extensionIndexCurrent);
      return baseNameCurrent.indexOf(baseName) !== -1 && extension === extensionCurrent && f.size === file.size;
    })) {
      return {
        code: "file-exists",
        message: t('fileAlreadyAdded', {file: file.name}),
      };
    }
    // No files with these file names
    if (file.name === 'form-metadata.json' || file.name === 'original-metadata.zip') {
      return {
        code: "file-not-allowed",
        message: t('fileNotAllowed'),
      };
    }
    return null;
  }


  const onDrop = async (acceptedFiles: File[]) => {
    // Check if a file with the same name has been added; if so, rename to (1), (2), etc
    // Transform the file to a file blob URL so we can save it to the Redux store
    const serializedFiles = acceptedFiles.map( (file, i) => {
      const fileExists = currentFiles.find(f => f.name === file.name);
      // Logic to rename files to the next sequential number
      let updatedFile = file.name;
      if (fileExists) {
        let sequentialNumber = 0;
        const fileExistsWithUpdatedName = (f: SelectedFile) => f.name === updatedFile;
        while (currentFiles.find(fileExistsWithUpdatedName)) {
          sequentialNumber++;
          const extensionIndex = file.name.lastIndexOf('.');
          const baseName = file.name.slice(0, extensionIndex);
          const extension = file.name.slice(extensionIndex);
          updatedFile = `${baseName}(${sequentialNumber})${extension}`;
        }

        // Set a notification that file has been renamed
        dispatch(setNotification({ message: t('fileRenamed', {file: updatedFile}), type: 'info' }));
      }

      const fileName = fileExists ? updatedFile : file.name;

      return ({
        id: uuidv4(),
        name: fileName,
        size: file.size,
        lastModified: file.lastModified,
        type: file.name.substring(file.name.lastIndexOf('.') + 1),
        location: 'local' as FileLocation,
        url: URL.createObjectURL(file),
        private: false,
      });    
    });
      
    dispatch(addFiles(serializedFiles));
  };

  const {getRootProps, getInputProps, isDragActive, fileRejections} = useDropzone({
    onDrop,
    multiple: true,
    accept: { 
      'application/octet-stream': data ? data.map( d => `.${d}` ) : []
    },
    validator: fileValidator
  });

  return (
    <Card>
      <CardHeader title={t('addLocal') as string} />
      <CardContent>
        <Box 
          sx={{
            border: '1px dashed grey',
            backgroundColor: isDragActive ? blue[100] : 'white',
          }}
          p={3}
          {...getRootProps({className: 'dropzone'})}
        >
          {data ?
            <>
              {!metadataSubmitStatus && <input {...getInputProps()} />}
              <Typography color="grey" sx={{textAlign: 'center', cursor: 'pointer'}}>{t('drop')}</Typography>
            </> :
            <Typography color="grey" sx={{textAlign: 'center', cursor: 'pointer'}}>{t('dropLoading')}</Typography>
          }
        </Box>
        {fileRejections.length > 0 && <RejectedFiles fileRejections={fileRejections} />}
      </CardContent>
    </Card>
  )
}

const RejectedFiles = ({fileRejections}: RejectedFilesProps) => {
  const [open, setOpen] = useState(true);
  const { t } = useTranslation('files');

  return (
    <Collapse in={open}>
      <Alert 
        severity="error" 
        sx={{mt:2}} 
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={() => {
              setOpen(false);
            }}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }>
        <AlertTitle>{t('fileTypeError')}</AlertTitle>
        <List dense={true}>
          {fileRejections.map( (file, i) => 
            <ListItem key={i} disableGutters>
              <ListItemIcon>
                <InsertDriveFileIcon />
              </ListItemIcon>
              <ListItemText 
                primary={file.file.name}
                secondary={file.errors.map( (error, i) => `${error.message}${i < file.errors.length - 1 ? ' | ' : ''}`)} />
            </ListItem>
          )}
        </List>
      </Alert>
    </Collapse>
  )
}

export default FilesUpload;
