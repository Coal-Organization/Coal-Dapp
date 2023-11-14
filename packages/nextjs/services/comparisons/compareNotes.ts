import { NoteEventTime } from "~~/basicPitch/toMidi";

export async function compareSongs(notes: NoteEventTime[]): Promise<boolean> {
  try {
    console.log("notes", notes);
    const same = false;
    //if (true) {
    //  same = true;
    //}
    return same;
  } catch (e) {
    console.log(e);
    return true;
  }
}
