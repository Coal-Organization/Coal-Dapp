import { useState } from "react";
import { songTrad } from "../basicPitch/songenc";
import { NextPage } from "next";

const RegisterSong: NextPage = () => {
  const [song, setSong] = useState<ArrayBuffer>();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        console.log(arrayBuffer);
        setSong(arrayBuffer);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleClick = async () => {
    console.log("clicked");
    if (song) {
      await songTrad(song);
    }
  };

  return (
    <div className="flex items-center flex-col flex-grow pt-10 justify-center items-center">
      <div className="px-5">
        <h1 className="text-center mb-8">
          <span className="block text-4xl font-bold">Register your Song</span>
        </h1>
      </div>
      <div>
        <input type="file" accept="audio/*" onChange={handleFileChange} />
        <button onClick={handleClick}>Upload</button>
      </div>
    </div>
  );
};

export default RegisterSong;
