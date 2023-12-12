interface Copyright {
  songId: bigint;
  shares: bigint;
}

interface Permission {
  addr: string;
  typeOf: bigint;
  date: bigint;
}

export interface AddSongEventArgs {
  id?: bigint;
  date?: bigint;
  author?: string;
  metadata?: string;
  copyrights?: ReadonlyArray<Copyright>;
  permissions?: ReadonlyArray<Permission>;
}

export interface RegisterStepsProps {
  state: 0 | 1 | 2;
}

export interface SongFormProps {
  setState: React.Dispatch<React.SetStateAction<RegisterStepsProps>>;
}
