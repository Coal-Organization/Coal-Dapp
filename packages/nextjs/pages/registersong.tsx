import { useRef, useState } from "react";
import { songTrad } from "../basicPitch/songenc";
import { NextPage } from "next";

const RegisterSong: NextPage = () => {
  const [song, setSong] = useState<ArrayBuffer>();
  const [songName, setSongName] = useState<string>();
  const [progress, setProgress] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log(file);
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      console.log(arrayBuffer);
      setSong(arrayBuffer);
      setSongName(file.name);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleStart = async () => {
    if (song) {
      await songTrad(song, setProgress);
    } else {
      alert("No song selected");
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.currentTarget.style.border = "3px dashed #999";
  };

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.currentTarget.style.border = "3px dashed #999";
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.currentTarget.style.border = "";
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.currentTarget.style.border = "";
    const files = event.dataTransfer.files;
    if (files.length) {
      handleFile(files[0]);
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
        <div
          className="dropzone mb-4 border-black border-2 p-4"
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <label className="block text-white-700 text-sm font-bold mb-2">Drop file here, or click below!</label>
          <input ref={fileInputRef} className="hidden" type="file" accept="audio/*" onChange={handleFileChange} />
          <button
            className="bg-blue-600 hover:border-white-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => fileInputRef.current?.click()}
          >
            Upload
          </button>
          <label className="block text-white-700 text-sm mb-2 pt-2">Only audio files accepted.</label>
          {song && (
            <div>
              <span>{songName}</span>
              <button
                className="hover:border-white"
                onClick={() => {
                  setSong(undefined);
                  setSongName(undefined);
                }}
              >
                X
              </button>
            </div>
          )}
        </div>
        <button className="justify-center items-center" onClick={handleStart}>
          Start
        </button>
        <br />
        {0 < progress && progress < 1 && (
          <div>
            <progress value={progress} max="1" />
            <span>{(progress * 100).toFixed(3)}%</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterSong;
