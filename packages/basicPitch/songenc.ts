import { BasicPitch } from '@spotify/basic-pitch';
import { AudioBuffer, AudioContext } from 'web-audio-api';
import * as tf from '@tensorflow/tfjs';
import fs from 'fs';

import {
  addPitchBendsToNoteEvents,
  noteFramesToTime,
  outputToNotesPoly,
} from './toMidi';

export async function songTrad() {
  const audioCtx = new AudioContext();
  let audioBuffer = undefined;
  
  audioCtx.decodeAudioData(
    fs.readFileSync(`${__dirname}/songs/prod.mp3`,),
    async (_audioBuffer: AudioBuffer) => {
      audioBuffer = _audioBuffer;
    },
    () => {},
  );
  
  while (audioBuffer === undefined) {
    await new Promise(r => setTimeout(r, 1));
  }
  
  const frames: number[][] = [];
  const onsets: number[][] = [];
  const contours: number[][] = [];
  let pct: number = 0;
  
  const basicPitch = new BasicPitch(tf.loadGraphModel(`file://${__dirname}/model/model.json`));

  await basicPitch.evaluateModel(
    audioBuffer as unknown as AudioBuffer,
    (f: number[][], o: number[][], c: number[][]) => {
      frames.push(...f);
      onsets.push(...o);
      contours.push(...c);
    },
    (p: number) => {
      pct = p;
    },
  );

  const notes = noteFramesToTime(
    addPitchBendsToNoteEvents(
      contours,
      outputToNotesPoly(frames, onsets, 0.25, 0.25, 5),
    ),
  );

  const notesTwo = noteFramesToTime(
    addPitchBendsToNoteEvents(
      contours,
      outputToNotesPoly(frames, onsets, 0.5, 0.3, 5, true, null, null, false),
    ),
  );

  console.log(notes);
  console.log(notesTwo);
}