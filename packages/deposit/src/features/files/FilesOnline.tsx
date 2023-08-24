import { useState } from 'react';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useTranslation } from 'react-i18next';
import { addFiles } from './filesSlice';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import type { FileLocation } from '../../types/Files';
import { v4 as uuidv4 } from 'uuid';

const URLExpression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
const URLRegex = new RegExp(URLExpression);

// TODO: this needs to be specced.
// We could perhaps try and fetch headers of a file, see if it exists. CORS issues maybe though.
// Can't really do much else, needs to be handled by server
// File metadata, how are we handling that?
// Not used for now!

const FilesOnline = () => {
  const dispatch = useAppDispatch();
  const [onlineFile, setOnlineFile] = useState<string>('');
  const [onlineFileError, setOnlineFileError] = useState<boolean>(false);
  const { t } = useTranslation('files');

  const checkOnlineFile = (value: string) => {
    const valid = encodeURIComponent(value).match(URLRegex);
    setOnlineFile( value );
    setOnlineFileError( valid ? false : true );
  }

  const addOnlineFile = () => {
    const fileToSubmit = {
      id: uuidv4(),
      name: onlineFile.replace(/^.*\/(.*)$/, "$1"),
      size: 0,
      type: 'tbd',
      location: 'online' as FileLocation,
      url: encodeURIComponent(onlineFile),
      lastModified: 0,
    }
    dispatch(addFiles([fileToSubmit]));
    setOnlineFile('');
  }

  return (
    <Card sx={{height: '100%'}}>
      <CardHeader title={t('addURL') as string} />
      <CardContent>
        <Stack
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          spacing={1}
        > 
          <TextField 
            fullWidth 
            size="small" 
            label={t('enterURL') as string}
            variant="outlined" 
            onChange={e => checkOnlineFile(e.target.value)}
            onKeyUp={e => e.keyCode === 13 && !onlineFileError && onlineFile !== '' && addOnlineFile()}
            error={onlineFileError}
            value={onlineFile}
            helperText={onlineFileError && t('errorURL')}
          />
          <Button disabled={onlineFileError || onlineFile === ''} onClick={() => addOnlineFile()} variant="text">{t('add')}</Button>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default FilesOnline;