import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import loopistABI from "../../generated/deployedContracts";
import { SongFormProps } from "../../services/interfaces";
import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite } from "wagmi";
import type { Address } from "wagmi";

export const SongForm: React.FC<SongFormProps> = ({ setState }) => {
  const { address } = useAccount();
  const [songId, setSongId] = useState(0);
  const [metadata, setMetadata] = useState("");
  const [form, setForm] = useState({
    name: "",
    genre: "",
    author: "",
    contactInfo: "",
    artists: [""],
    nature: "",
  });

  // Contract
  const contract = loopistABI[31337][0].contracts.Loopist;
  const addr = address as Address;

  // Read Contract
  const {} = useContractRead({
    address: contract.address,
    abi: contract.abi,
    functionName: "getCurrentSongId",
    onSuccess(data) {
      setSongId(Number(data));
    },
    onError(err) {
      console.log(err);
    },
  });

  // Arguments for Smart Contract Call
  const getArgs = () => {
    if (!addr) {
      return;
    }
    const args = [addr, metadata, [{ songId: songId, shares: 100 }]];
    return args;
  };

  // Write Contract
  const { config } = usePrepareContractWrite({
    address: contract.address,
    abi: [
      {
        name: "addSong",
        type: "function",
        account: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
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
    args: getArgs(),
  });

  const { write, isSuccess } = useContractWrite(config);

  const jsonToIpfs = async (
    id: number,
    name: string,
    genre: string,
    author: string,
    contactInfo: string,
    artists: string,
    nature: string,
  ) => {
    const response = await fetch("./api/pinJsonToIpfs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        name: name,
        genre: genre,
        author: author,
        contactInfo: contactInfo,
        artists: artists,
        nature: nature,
      }),
    });
    const result = await response.json();
    return result;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (e.target.name === "artists") {
      setForm({ ...form, [e.target.name]: e.target.value.split(",") });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    //fetch id from smart contract
    const res = await jsonToIpfs(
      songId,
      form.name,
      form.genre,
      form.author,
      form.contactInfo,
      form.artists.join(","),
      form.nature,
    );
    console.log(res.IpfsHash);
    setMetadata(res.IpfsHash);
  };

  useEffect(() => {
    if (isSuccess) {
      setState({ state: 2 });
    }
  }, [isSuccess]);

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4 text-black">
        <input type="text" name="name" onChange={handleChange} placeholder="Name" />
        <select name="genre" onChange={handleChange} placeholder="Genre">
          <option value="">Select genre</option>
          <option value="pop">Pop</option>
          <option value="rap">Rap</option>
          <option value="rock">Rock</option>
          <option value="jazz">Jazz</option>
          <option value="blues">Blues</option>
          <option value="country">Country</option>
        </select>
        <input type="text" name="author" onChange={handleChange} placeholder="Author" />
        <input type="text" name="artists" onChange={handleChange} placeholder="Artists (comma separated)" />
        <input type="text" name="contactInfo" onChange={handleChange} placeholder="Contact Info" />
        <select name="nature" onChange={handleChange} className="border p-2">
          <option value="">Select nature</option>
          <option value="song">Song</option>
          <option value="lyrics">Lyrics</option>
          <option value="both">Both</option>
        </select>
        <button
          className="bg-blue-600 hover:border-white-700 text-white font-bold py-2 px-4 rounded"
          disabled={!write /**&&**/}
          onClick={() => write?.()}
        >
          Upload
        </button>
      </form>
    </div>
  );
};

export default SongForm;
