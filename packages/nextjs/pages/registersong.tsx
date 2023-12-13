import { useRef, useState } from "react";
import { songTrad } from "../basicPitch/songenc";
import { SongForm } from "../components/register/songForm";
import { RegisterSteps } from "../components/register/steps";
import { RegisterStepsProps } from "../services/interfaces";
import axios from "axios";
import { NextPage } from "next";
import { ReviewSong } from "~~/components/register/reviewSong";

const RegisterSong: NextPage = () => {
  const [regState, setRegState] = useState<RegisterStepsProps>({ state: 0 }); // ["upload", "info", "compare", "deployed"]
  const [song, setSong] = useState<ArrayBuffer | undefined>();
  const [songName, setSongName] = useState<string>();
  const [progress, setProgress] = useState(0);
  const [compared, setCompared] = useState<{ cp: boolean; text: string }>({ cp: false, text: "" });
  const [midiFile, setMidiFile] = useState<Buffer | undefined>();

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
      await songTrad(song, setProgress, setCompared, setRegState, setMidiFile);
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

  const handleDownload = async () => {
    if (midiFile) {
      const blob = new Blob([midiFile as Buffer], { type: "audio/mid" });
      // const link = document.createElement("a");
      // const castedBlob = blob as Blob
      // link.href = window.URL.createObjectURL(castedBlob);
      // link.download = "song.mid";
      // link.click();

      const data = new FormData();
      data.append("midiFile", blob, "song.mid");

      try {
        const res = await axios.post("http://localhost:8888/compare", data);
        console.log(res);
      } catch (error) {
        console.error("Coal API error: ", error);
      }
    }
  };

  const removeFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      setSong(undefined);
      setSongName("");
    } else {
      console.log("No file input ref");
    }
  };

  return (
    <div className="flex items-center flex-col flex-grow pt-10 justify-center items-center">
      <div className="flex fixed left-20">
        <RegisterSteps state={regState.state} />
      </div>
      {regState.state === 0 ? (
        <div>
          <div className="px-5">
            <h1 className="text-center mb-8">
              <span className="block text-4xl font-bold">Check for Copyright</span>
            </h1>
          </div>
          <div
            className="dropzone mb-4 border-black border-2 p-4 rounded"
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
            <div className="mt-5">
              {midiFile ? (
                <button
                  className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
                  onClick={handleDownload}
                >
                  Download MIDI File
                </button>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
      {regState.state === 1 ? <SongForm setState={setRegState} /> : <></>}
      {regState.state === 2 ? <ReviewSong /> : <></>}
    </div>
  );
};

export default RegisterSong;
