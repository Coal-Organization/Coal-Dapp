import { NoteEventTime } from "@spotify/basic-pitch";
import axios, { AxiosResponse } from "axios";
import { generateFileData } from "~~/basicPitch/toMidi";

export async function compareSongs(notesPoly: NoteEventTime[]): Promise<AxiosResponse | null> {
  const midiFile = generateFileData(notesPoly);
  const blob = new Blob([midiFile as Buffer], { type: "audio/mid" });
  const data = new FormData();
  data.append("midiFile", blob, "song.mid");

  try {
    const res = await axios.post("http://localhost:8888/compare", data);
    if (res.status == 200) {
      console.log(res.data);
      return res;
    }
  } catch (error) {
    console.error("Coal API error: ", error);
    return null;
  }

  return null;
}
