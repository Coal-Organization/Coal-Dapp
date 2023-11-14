import { useRef, useState } from "react";
import { songTrad } from "../basicPitch/songenc";
import { compareSvg, songInfoSvg, uploadSvg, validSvg } from "../components/svgs";
import { NextPage } from "next";

const RegisterSong: NextPage = () => {
  const [regState, setRegState] = useState<0 | 1 | 2 | 3>(0); // ["upload", "info", "compare", "deployed"]
  const [song, setSong] = useState<ArrayBuffer | undefined>();
  const [songName, setSongName] = useState<string>();
  const [progress, setProgress] = useState(0);
  const [compared, setCompared] = useState<{ cp: boolean; text: string }>({ cp: false, text: "" });

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
      await songTrad(song, setProgress, setCompared, setRegState);
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

  const removeFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      setSong(undefined);
      setSongName("");
    }
  };

  return (
    <div className="flex items-center flex-col flex-grow pt-10 justify-center items-center">
      <div className="flex fixed left-20">
        <ol className="relative text-gray-500 border-s border-gray-200 dark:border-gray-700 dark:text-gray-400">
          <li className="mb-10 ms-6">
            {regState > 0 ? validSvg : compareSvg}
            <h3 className="font-medium leading-tight">Compare Song</h3>
            <p className="text-sm">Choose file</p>
          </li>
          <li className="mb-10 ms-6">
            {regState > 1 ? validSvg : songInfoSvg}
            <h3 className="font-medium leading-tight">Song Info</h3>
            <p className="text-sm">Add song details</p>
          </li>
          <li className="mb-10 ms-6">
            {regState > 2 ? validSvg : uploadSvg}
            <h3 className="font-medium leading-tight">Upload</h3>
            <p className="text-sm">Deploy on ledger</p>
          </li>
        </ol>
      </div>
      {regState === 0 ? (
        <div>
          <div className="px-5">
            <h1 className="text-center mb-8">
              <span className="block text-4xl font-bold">Check for Copyright</span>
            </h1>
          </div>
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
              <div className="flex">
                <span>{songName?.substring(0, 30)}...</span>
                <button
                  className="hover:border-white ml-2 mt-2 mr-2 border-2 border-black rounded-full w-6 h-6 justify-center items-center flex"
                  onClick={removeFile}
                >
                  X
                </button>
              </div>
            )}
          </div>
          <div className="text-center">
            <div>
              <button
                className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
                onClick={handleStart}
              >
                Start
              </button>
            </div>
            <br />
            <div>
              {0 < progress && progress < 1 && (
                <div>
                  <progress color="blue-700" value={progress} max="1" />
                  <span>{(progress * 100).toFixed(3)}%</span>
                </div>
              )}
              {compared.cp && (
                <div>
                  <span>{compared.text}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
      {regState === 1 ? <div>Register Song Info</div> : <></>}
    </div>
  );
};

export default RegisterSong;
