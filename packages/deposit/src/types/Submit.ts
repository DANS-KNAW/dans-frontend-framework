export interface SubmitError {
  status?: string;
  data?: string;
}

export interface SubmittedFile {
  id: string;
  progress?: number;
  success?: boolean;
  error?: boolean;
}

export type SubmitStatus = '' | 'submitting' | 'success' | 'error';

export interface ReduxFileSubmitActions {
  id: string;
  progress?: number;
  status?: SubmitStatus;
}

export interface InitialStateType {
  metadataStatus: string;
  submittedFiles: ReduxFileSubmitActions[];
}