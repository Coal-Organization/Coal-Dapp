import { Dispatch, SetStateAction } from "react";
import { addPitchBendsToNoteEvents, generateFileData, noteFramesToTime, outputToNotesPoly } from "./toMidi";
import { BasicPitch } from "@spotify/basic-pitch";
import * as tf from "@tensorflow/tfjs";
import { compareSongs } from "~~/services/comparisons/compareNotes";
import { RegisterStepsProps } from "~~/services/interfaces";

export async function songTrad(
  songArray: ArrayBuffer,
  setProgress: Dispatch<SetStateAction<number>>,
  setCompared: Dispatch<SetStateAction<{ cp: boolean; text: string }>>,
  setRegState: Dispatch<SetStateAction<RegisterStepsProps>>,
  setMidiFile: Dispatch<SetStateAction<Buffer | undefined>>,
) {
  const audioCtx = new AudioContext({ sampleRate: 22050 });
  let audioBuffer = undefined;

  console.log("Loading audio...");
  console.log(songArray);
  const songArrayCopy = songArray.slice(0);

  audioCtx.decodeAudioData(songArrayCopy, async (_audioBuffer: AudioBuffer) => {
    audioBuffer = _audioBuffer;
    audioBuffer = audioBuffer.getChannelData(0);
  });

  while (audioBuffer === undefined) {
    await new Promise(r => setTimeout(r, 1));
  }

  const frames: number[][] = [];
  const onsets: number[][] = [];
  const contours: number[][] = [];

  //will fix this any type check later
  const model = tf.loadGraphModel(`./model/model.json`) as Promise<any>;
  const basicPitch = new BasicPitch(model);

  await basicPitch.evaluateModel(
    audioBuffer as unknown as AudioBuffer,
    (f: number[][], o: number[][], c: number[][]) => {
      frames.push(...f);
      onsets.push(...o);
      contours.push(...c);
    },
    (p: number) => {
      console.log(p);
      setProgress(p);
    },
  );

  // const notesPoly = noteFramesToTime(
  //   addPitchBendsToNoteEvents(contours, outputToNotesPoly(frames, onsets, 0.25, 0.25, 5)),
  // );

  //frames, onsets, onSetTreshold, frameTreshold, minNoteLength, inferOnsets, maxFreq, minFreq, melodiaTrick
  //melodiaTrick -> remove semitones near a peak
  const notesPolyNoMelodia = noteFramesToTime(
    addPitchBendsToNoteEvents(contours, outputToNotesPoly(frames, onsets, 0.5, 0.3, 5, true, null, null, false)),
  );

  setMidiFile(generateFileData(notesPolyNoMelodia));

  const result = await compareSongs(notesPolyNoMelodia);

  const matchingRate = result?.data["matchingRate"];

  if (matchingRate === 1) {
    console.log("Coal is on fire");
    setCompared({ cp: true, text: "Copyright violation detected" });
  } else if (matchingRate < 1 && matchingRate > 0.5) {
    console.log("Coal is hot");
    setCompared({ cp: true, text: "Copyright violation detected" });
  } else if (matchingRate < 0.3) {
    console.log("Coal is cold");
    setRegState({ state: 1 });
  } else {
    console.log("Coal is warm");
    setCompared({ cp: true, text: "Copyright violation detected" });
  }
}
