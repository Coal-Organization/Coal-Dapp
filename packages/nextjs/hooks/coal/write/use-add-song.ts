import { useMemo } from "react";
import loopistABI from "../../../generated/deployedContracts";
import { UseAddSongParams, UseWriteTransactionResponse } from "../../../services/interfaces";
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";

/**
 * Create a new article
 */
const useAddSong = ({ author, metadata, copyrights }: UseAddSongParams): UseWriteTransactionResponse => {
  const contract = loopistABI[31337][0].contracts.Loopist;

  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: contract.address,
    abi: [
      {
        name: "addSong",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [
          { internalType: "address", name: "author", type: "address" },
          { internalType: "string", name: "metadata", type: "string" },
          {
            internalType: "struct Loopist.Copyright[]",
            name: "copyrights",
            type: "tuple[]",
            components: [
              { internalType: "uint256", name: "songId", type: "uint256" },
              { internalType: "uint256", name: "shares", type: "uint256" },
            ],
          },
        ],
        outputs: [],
      },
    ],
    functionName: "addSong",
    args: [author, metadata, copyrights],
  });

  const { data, write, error, isError } = useContractWrite(config);

  const { isLoading, isSuccess } = useWaitForTransaction({ hash: data?.hash });

  const errors: (string | unknown)[] = useMemo(() => {
    let allErrors: (string | unknown)[] = [];
    if (prepareError) {
      allErrors = [...allErrors, prepareError.message];
    }
    if (error) {
      allErrors = [...allErrors, error.message];
    }
    return allErrors;
  }, [prepareError, error]);

  return {
    sendTransaction:
      write ??
      (() => {
        throw new Error("Write function is not defined");
      }),
    data: data ?? undefined,
    isLoading,
    isSuccess,
    prepareError: prepareError?.message ?? null,
    isPrepareError,
    error: error?.message ?? null,
    isError,
    errors,
    isSomeError: isPrepareError || isError,
  };
};

export default useAddSong;
