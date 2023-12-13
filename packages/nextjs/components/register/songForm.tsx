import React, { useEffect, useState } from "react";
import loopistABI from "../../generated/deployedContracts";
import useAddSong from "../../hooks/coal/write/use-add-song";
import { SongFormProps } from "../../services/interfaces";
import { useAccount, useContractRead } from "wagmi";
import type { Address } from "wagmi";

export const SongForm: React.FC<SongFormProps> = ({ setState, copyright }) => {
  const { address } = useAccount();
  const [songId, setSongId] = useState(0);
  const [metadata, setMetadata] = useState("");
  const [name, setName] = useState("");
  const [genre, setGenre] = useState("");
  const [author, setAuthor] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [artists, setArtists] = useState<string[]>([]);
  const [nature, setNature] = useState("");

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

  // Write Contract
  const { sendTransaction, isSuccess } = useAddSong({
    author: addr,
    metadata: metadata,
    copyrights: copyright ? [copyright] : [],
  });

  useEffect(() => {
    if (isSuccess) {
      setState({ state: 2 });
    }
  }, [isSuccess, setState]);

  async function jsonToIpfs() {
    const response = await fetch("./api/pinJsonToIpfs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: songId,
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
  }

  const handleSubmit = async () => {
    const res = await jsonToIpfs();
    setMetadata(res.IpfsHash);
  };

  useEffect(() => {
    if (!metadata) {
      return;
    }
    sendTransaction();
  }, [metadata, sendTransaction]);

  return (
    <div className="flex flex-col space-y-4 text-black">
      <input type="text" name="name" onChange={e => setName(e.target.value)} placeholder="Name" />
      <select name="genre" onChange={e => setGenre(e.target.value)} placeholder="Genre">
        <option value="">Select genre</option>
        <option value="pop">Pop</option>
        <option value="rap">Rap</option>
        <option value="rock">Rock</option>
        <option value="jazz">Jazz</option>
        <option value="blues">Blues</option>
        <option value="country">Country</option>
      </select>
      <input type="text" name="author" onChange={e => setAuthor(e.target.value)} placeholder="Author" />
      <input
        type="text"
        name="artists"
        onChange={e => setArtists(e.target.value.split(","))}
        placeholder="Artists (comma separated)"
      />
      <input type="text" name="contactInfo" onChange={e => setContactInfo(e.target.value)} placeholder="Contact Info" />
      <select name="nature" onChange={e => setNature(e.target.value)} className="border p-2">
        <option value="">Select nature</option>
        <option value="song">Song</option>
        <option value="lyrics">Lyrics</option>
        <option value="both">Both</option>
      </select>
      <button
        className="bg-blue-600 hover:border-white-700 text-white font-bold py-2 px-4 rounded"
        disabled={!sendTransaction}
        onClick={handleSubmit}
      >
        Upload
      </button>
    </div>
  );
};

export default SongForm;
