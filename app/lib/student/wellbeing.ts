// app/lib/student/wellbeing.ts
import api from "@/app/lib/api";

export const saveMood = (mood: string, note: string) =>
  api.post("/student/wellbeing/mood", { mood, note });

export const getMoodHistory = () =>
  api.get("/student/wellbeing/mood");

export const saveJournal = (text: string) =>
  api.post("/student/wellbeing/journal", { text });

export const getJournal = () =>
  api.get("/student/wellbeing/journal");