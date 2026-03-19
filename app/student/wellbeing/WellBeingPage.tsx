"use client";

import { useState } from "react";
import { Smile, Meh, Frown } from "lucide-react";

interface MoodEntry {
  id: number;
  date: string;
  mood: "Happy" | "Okay" | "Need Help";
  note?: string;
}

export default function WellBeingPage() {
  const [mood, setMood] = useState<"Happy" | "Okay" | "Need Help" | null>(null);
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([
    {
      id: 1,
      date: "2026-03-18",
      mood: "Happy",
      note: "Finished my Science project!",
    },
    {
      id: 2,
      date: "2026-03-17",
      mood: "Okay",
      note: "Busy day, but manageable.",
    },
    {
      id: 3,
      date: "2026-03-16",
      mood: "Need Help",
      note: "Felt stressed with assignments.",
    },
  ]);

  const recordMood = (selectedMood: "Happy" | "Okay" | "Need Help") => {
    setMood(selectedMood);
    const newEntry: MoodEntry = {
      id: moodHistory.length + 1,
      date: new Date().toISOString().split("T")[0],
      mood: selectedMood,
      note: "",
    };
    setMoodHistory([newEntry, ...moodHistory]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
          Well-Being Tracker
        </h1>
        <p className="text-sm text-gray-500">
          Track your mood and emotional health
        </p>
      </div>

      {/* Mood Buttons */}
      <div className="flex gap-4 justify-center sm:justify-start">
        <button
          onClick={() => recordMood("Happy")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white transition ${
            mood === "Happy"
              ? "bg-green-600"
              : "bg-green-400 hover:bg-green-500"
          }`}
        >
          <Smile size={18} /> Happy
        </button>
        <button
          onClick={() => recordMood("Okay")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white transition ${
            mood === "Okay"
              ? "bg-yellow-600"
              : "bg-yellow-400 hover:bg-yellow-500"
          }`}
        >
          <Meh size={18} /> Okay
        </button>
        <button
          onClick={() => recordMood("Need Help")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white transition ${
            mood === "Need Help" ? "bg-red-600" : "bg-red-400 hover:bg-red-500"
          }`}
        >
          <Frown size={18} /> Need Help
        </button>
      </div>

      {/* Mood History */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Mood History</h2>
        {moodHistory.length === 0 && (
          <p className="text-gray-500 text-center">No entries yet.</p>
        )}
        <div className="space-y-2">
          {moodHistory.map((entry) => (
            <div
              key={entry.id}
              className="flex justify-between items-center bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
            >
              <div>
                <span className="font-semibold text-gray-900">
                  {entry.mood}
                </span>
                <p className="text-xs text-gray-400">{entry.date}</p>
                {entry.note && (
                  <p className="text-gray-700 text-sm mt-1">{entry.note}</p>
                )}
              </div>
              <div>
                {entry.mood === "Happy" && (
                  <Smile size={20} className="text-green-600" />
                )}
                {entry.mood === "Okay" && (
                  <Meh size={20} className="text-yellow-500" />
                )}
                {entry.mood === "Need Help" && (
                  <Frown size={20} className="text-red-600" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
