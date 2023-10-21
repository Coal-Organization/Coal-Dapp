import React from "react";
import { NextPage } from "next";
import { AudioContext } from "web-audio-api";

const RegisterSong: NextPage = () => {
  const audioCtx = new AudioContext();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let audioBuffer = undefined;

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log(file);
  };

  function filetomidi(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const audioData = reader.result as ArrayBuffer;
      console.log(audioData);
      console.log(typeof audioData);
      audioCtx.decodeAudioData(
        audioData,
        async (_audioBuffer: AudioBuffer) => {
          audioBuffer = _audioBuffer;
        },
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        () => {},
      );
    };
    reader.readAsArrayBuffer(file);
  }

  return (
    <div className="flex items-center flex-col flex-grow pt-10 justify-center items-center">
      <div className="px-5">
        <h1 className="text-center mb-8">
          <span className="block text-4xl font-bold"> Register your Song</span>
        </h1>
      </div>
      <div>
        <input type="file" accept="audio/*" onChange={handleFileUpload} />
        <button onClick={filetomidi}>Upload</button>
      </div>
    </div>
  );
};

export default RegisterSong;
