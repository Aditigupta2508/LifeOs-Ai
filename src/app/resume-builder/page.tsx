"use client";

import { useState } from "react";

export default function ResumeBuilder() {
  const [input, setInput] = useState("");
  const [resume, setResume] = useState("");
  const [loading, setLoading] = useState(false);

  async function generateResume() {
    if (!input) return;

    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: `
You are an expert AI Resume Builder.

Convert the following user details into a PROFESSIONAL ATS-friendly resume.

Rules:
- Use sections: Summary, Skills, Experience, Projects, Education
- Make it professional and clean
- Do NOT add unnecessary text
- Improve grammar
- Make it job-ready

User Input:
${input}
        `,
      }),
    });

    const data = await res.json();
    setResume(data.reply);
    setLoading(false);
  }

  function copyText() {
    navigator.clipboard.writeText(resume);
    alert("Resume copied!");
  }

  return (
    <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white p-6">

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">

        {/* INPUT PANEL */}
        <div className="bg-gray-100 dark:bg-gray-900 p-6 rounded-xl">
          <h1 className="text-2xl font-bold mb-4">
            🤖 AI Resume Builder Pro
          </h1>

          <textarea
            className="w-full h-60 p-3 border rounded bg-white dark:bg-gray-800"
            placeholder="Example:
Name: John
Skills: React, Node.js
Experience: 2 years frontend developer..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <button
            onClick={generateResume}
            className="w-full mt-3 bg-black text-white dark:bg-white dark:text-black py-2 rounded"
          >
            {loading ? "Generating..." : "Generate Resume"}
          </button>
        </div>

        {/* OUTPUT PANEL */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-3">📄 Generated Resume</h2>

          <div className="whitespace-pre-wrap text-sm leading-relaxed">
            {resume || "Your AI-generated resume will appear here..."}
          </div>

          {resume && (
            <button
              onClick={copyText}
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
            >
              Copy Resume
            </button>
          )}
        </div>

      </div>
    </div>
  );
}