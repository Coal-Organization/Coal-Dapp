import React, { useState } from "react";
import loopistABI from "../../generated/deployedContracts";
import { useAccount, useContractEvent } from "wagmi";
import { AddSongEventArgs } from "~~/services/interfaces";

export const ReviewSong = () => {
  const [contractCall, setContractCall] = useState<AddSongEventArgs>();

  // Wallet
  const { address } = useAccount();

  // Contract
  const contract = loopistABI[31337][0].contracts.Loopist;

  const unwatch = useContractEvent({
    address: contract.address,
    abi: contract.abi,
    eventName: "SongAdded",
    listener(logs) {
      for (const log in logs) {
        if (logs[log].args.author === address?.toString()) {
          console.log(logs[log]);
          setContractCall(logs[log].args);
          unwatch?.();
        }
      }
    },
  });

  return (
    <div>
      <h1>Review Song</h1>
      {contractCall ? <p>He</p> : <p> Transaction Loading </p>}
    </div>
  );
};
