"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
} from "firebase/firestore";

export default function RemindersPage() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [reminders, setReminders] = useState<any[]>([]);

  useEffect(() => {
    loadReminders();
  }, []);

  async function loadReminders() {
    const snapshot = await getDocs(
      collection(db, "reminders")
    );

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setReminders(data);
  }

  async function saveReminder() {
    if (!title || !date) return;

    await addDoc(collection(db, "reminders"), {
      title,
      date,
      createdAt: new Date(),
    });

    setTitle("");
    setDate("");

    loadReminders();
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">

      <h1 className="text-5xl font-bold mb-8">
        Smart Reminders
      </h1>

      <div className="bg-slate-900 p-6 rounded-xl">

        <input
          type="text"
          placeholder="Reminder Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 bg-slate-800 rounded mb-4"
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-3 bg-slate-800 rounded mb-4"
        />

        <button
          onClick={saveReminder}
          className="bg-blue-600 px-6 py-3 rounded"
        >
          Save Reminder
        </button>

      </div>

      <div className="mt-8">

        <h2 className="text-3xl font-bold mb-4">
          Upcoming Reminders
        </h2>

        {reminders.map((reminder) => (
          <div
            key={reminder.id}
            className="bg-slate-900 p-4 rounded-xl mb-3"
          >
            <h3 className="font-bold">
              {reminder.title}
            </h3>

            <p className="text-slate-400">
              {reminder.date}
            </p>
          </div>
        ))}

      </div>

    </div>
  );
}