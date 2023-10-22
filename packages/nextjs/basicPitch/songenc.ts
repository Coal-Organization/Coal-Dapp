import { addPitchBendsToNoteEvents, noteFramesToTime, outputToNotesPoly } from "./toMidi";
import { BasicPitch } from "@spotify/basic-pitch";
import * as tf from "@tensorflow/tfjs";

export async function songTrad(songArray: ArrayBuffer) {
  const audioCtx = new AudioContext();
  let audioBuffer = undefined;

  console.log("Loading audio...");
  console.log(songArray);

  audioCtx.decodeAudioData(songArray, async (_audioBuffer: AudioBuffer) => {
    audioBuffer = _audioBuffer;
  });

  while (audioBuffer === undefined) {
    await new Promise(r => setTimeout(r, 1));
  }

  const frames: number[][] = [];
  const onsets: number[][] = [];
  const contours: number[][] = [];

  const basicPitch = new BasicPitch(tf.loadGraphModel(`./model/model.json`));

  await basicPitch.evaluateModel(
    audioBuffer as unknown as AudioBuffer,
    (f: number[][], o: number[][], c: number[][]) => {
      frames.push(...f);
      onsets.push(...o);
      contours.push(...c);
    },
    (p: number) => {
      console.log(p);
    },
  );

  const notes = noteFramesToTime(addPitchBendsToNoteEvents(contours, outputToNotesPoly(frames, onsets, 0.25, 0.25, 5)));

  const notesTwo = noteFramesToTime(
    addPitchBendsToNoteEvents(contours, outputToNotesPoly(frames, onsets, 0.5, 0.3, 5, true, null, null, false)),
  );

  console.log(notes);
  console.log(notesTwo);
}
