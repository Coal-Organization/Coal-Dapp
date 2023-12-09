export interface RegisterStepsProps {
  state: 0 | 1 | 2;
}

export interface SongFormProps {
  setState: React.Dispatch<React.SetStateAction<RegisterStepsProps>>;
}
