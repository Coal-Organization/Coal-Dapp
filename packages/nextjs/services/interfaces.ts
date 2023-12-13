import { SendTransactionResult } from "@wagmi/core";

export interface Copyright {
  songId: bigint;
  shares: bigint;
}

interface Permission {
  addr: string;
  typeOf: bigint;
  date: bigint;
}

export interface UseAddSongParams {
  author: string;
  metadata: string;
  copyrights: Copyright[];
}

export interface AddSongEventArgs {
  id?: bigint;
  date?: bigint;
  author?: string;
  metadata?: string;
  copyrights?: ReadonlyArray<Copyright>;
  permissions?: ReadonlyArray<Permission>;
}

export interface UseWriteTransactionResponse {
  sendTransaction: () => void;
  data: SendTransactionResult | undefined;
  isLoading: boolean;
  isSuccess: boolean;
  prepareError: string | null;
  isPrepareError: boolean;
  error: string | null;
  isError: boolean;
  errors: (string | unknown)[];
  isSomeError: boolean;
}

export interface GoResponse {
  Id: bigint;
  Title: string;
  Author: string;
  MatchingRate: number;
}

export interface RegisterStepsProps {
  state: 0 | 1 | 2;
}

export interface SongFormProps {
  setState: React.Dispatch<React.SetStateAction<RegisterStepsProps>>;
  copyright: Copyright | null;
}
