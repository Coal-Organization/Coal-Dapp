import React, { ChangeEvent, FormEvent, useState } from "react";

export const SongForm = () => {
  const [form, setForm] = useState({
    name: "",
    genre: "",
    author: "",
    contactInfo: "",
    artists: [""],
    nature: "",
  });

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
      3,
      form.name,
      form.genre,
      form.author,
      form.contactInfo,
      form.artists.join(","),
      form.nature,
    );
    console.log(res);
  };

  return (
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
        onClick={() => handleSubmit}
      >
        Upload
      </button>
    </form>
  );
};

export default SongForm;
