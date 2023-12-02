import { NoteEventTime } from "@spotify/basic-pitch";

export async function compareSongs(notesPoly: NoteEventTime[]): Promise<boolean> {
  const midiFormat: { midi: number; time: number; duration: number; velocity: number }[] = [];
  notesPoly.forEach(note => {
    midiFormat.push({
      midi: note.pitchMidi,
      time: note.startTimeSeconds,
      duration: note.durationSeconds,
      velocity: note.amplitude,
    });
  });

  console.log(midiFormat);

  const same = false;

  return same;
}
