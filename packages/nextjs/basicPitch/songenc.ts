import { Dispatch, SetStateAction } from "react";
import { addPitchBendsToNoteEvents, noteFramesToTime, outputToNotesPoly } from "./toMidi";
import { BasicPitch } from "@spotify/basic-pitch";
import * as tf from "@tensorflow/tfjs";

export async function songTrad(songArray: ArrayBuffer, setProgress: Dispatch<SetStateAction<number>>) {
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

  const notesPoly = noteFramesToTime(
    addPitchBendsToNoteEvents(contours, outputToNotesPoly(frames, onsets, 0.25, 0.25, 5)),
  );

  //frames, onsets, onSetTreshold, frameTreshold, minNoteLength, inferOnsets, maxFreq, minFreq, melodiaTrick
  //melodiaTrick -> remove semitones near a peak
  const notesPolyNoMelodia = noteFramesToTime(
    addPitchBendsToNoteEvents(contours, outputToNotesPoly(frames, onsets, 0.5, 0.3, 5, true, null, null, false)),
  );

  console.log(notesPoly);
  console.log(notesPolyNoMelodia);
}
