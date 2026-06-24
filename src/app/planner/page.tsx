"use client";

import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db , auth } from "@/lib/firebase";

export default function PlannerPage() {
  const [subject, setSubject] = useState("");
  const [examDate, setExamDate] = useState("");
  const [hours, setHours] = useState("");
  const [plan, setPlan] = useState("");

  async function generatePlan() {
    if (!subject || !examDate || !hours) {
      alert("Please fill all fields");
      return;
    }

    const studyPlan = `
📚 Study Plan for ${subject}

Day 1: Introduction & Basics
Day 2: Core Concepts
Day 3: Important Topics
Day 4: Practice Questions
Day 5: Revision & Mock Test

Exam Date: ${examDate}
Daily Study Hours: ${hours}
`;

    setPlan(studyPlan);

    try {
      await addDoc(collection(db, "studyPlans"), {
        subject,
        examDate,
        hours,
        plan: studyPlan,
        createdAt: new Date(),
      });

      alert("Study Plan Saved Successfully!");
    } catch (error) {
      console.error("Firestore Error:", error);
      alert("Failed to save study plan");
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-10">

      <h1 className="text-5xl font-bold mb-8">
        AI Study Planner
      </h1>

      <div className="bg-slate-900 p-8 rounded-xl max-w-4xl">

        <label className="block mb-2 text-lg">
          Subject
        </label>

        <input
          type="text"
          placeholder="Java"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full p-4 rounded bg-slate-800 mb-6"
        />

        <label className="block mb-2 text-lg">
          Exam Date
        </label>

        <input
          type="date"
          value={examDate}
          onChange={(e) => setExamDate(e.target.value)}
          className="w-full p-4 rounded bg-slate-800 mb-6"
        />

        <label className="block mb-2 text-lg">
          Study Hours Per Day
        </label>

        <input
          type="number"
          placeholder="3"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          className="w-full p-4 rounded bg-slate-800 mb-6"
        />

        <button
          onClick={generatePlan}
          className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg"
        >
          Generate Plan
        </button>

      </div>

      {plan && (
        <div className="mt-8 bg-slate-900 p-8 rounded-xl max-w-4xl">

          <h2 className="text-2xl font-bold mb-4">
            Generated Study Plan
          </h2>

          <pre className="whitespace-pre-wrap text-slate-300">
            {plan}
          </pre>

        </div>
      )}

    </div>
  );
}