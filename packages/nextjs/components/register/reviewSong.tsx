import React, { useState } from "react";
import loopistABI from "../../generated/deployedContracts";
import { useAccount, useContractEvent } from "wagmi";
import { AddSongEventArgs } from "~~/services/interfaces";

export const ReviewSong = () => {
  const [contractCall, setContractCall] = useState<AddSongEventArgs>();
  const [txHash, setTxHash] = useState<string>();

  // Pinata
  const pinataGateway = "https://gateway.pinata.cloud/ipfs/";

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
          setTxHash(logs[log].transactionHash);
          setContractCall(logs[log].args);
          unwatch?.();
        }
      }
    },
  });

  const showCopyrights = () => {
    return contractCall?.copyrights?.map((cp, index) => (
      <p key={index} className="text-blue-500">
        Song ID: {cp.songId.toString()}, Shares: {cp.shares.toString()}
      </p>
    ));
  };

  const contractCallInfo = () => {
    return (
      <div className="bg-gray-200 p-4 rounded text-gray-900 w-1/2 mx-auto overflow-auto">
        <p className="font-bold"> Song info: </p>
        <p> Id is: {contractCall?.id?.toString()} </p>
        <p> Author: {contractCall?.author} </p>
        <p>
          {" "}
          Metadata link:{" "}
          <a href={pinataGateway + contractCall?.metadata} target="_blank" rel="noopener noreferrer">
            {pinataGateway + contractCall?.metadata}
          </a>{" "}
        </p>
        <p> Transaction Hash: {txHash} </p>
        <p> Uses copyrights from songs: </p>
        {showCopyrights()}
      </div>
    );
  };

  return (
    <div className="font-sans">
      <h1 className="text-center">Review Song</h1>
      {contractCall ? contractCallInfo() : <p> Transaction Loading </p>}
    </div>
  );
};
