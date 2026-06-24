"use client";

import { useState } from "react";

export default function PlacementPage() {
  const [role, setRole] = useState("");
  const [skills, setSkills] = useState("");
  const [result, setResult] = useState("");

  async function analyze() {
    const prompt = `
You are a career advisor.

Target Role: ${role}

Current Skills:
${skills}

Provide:

1. Skill Gap Analysis
2. Learning Roadmap
3. Interview Preparation Topics
4. Project Suggestions
`;

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: prompt,
      }),
    });

    const data = await response.json();

    setResult(data.reply);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-10">

      <h1 className="text-5xl font-bold mb-8">
        Placement Preparation
      </h1>

      <div className="bg-slate-900 p-8 rounded-xl max-w-5xl">

        <input
          type="text"
          placeholder="Target Role"
          value={role}
          onChange={(e) =>
            setRole(e.target.value)
          }
          className="w-full p-4 rounded bg-slate-800 mb-4"
        />

        <textarea
          placeholder="Current Skills"
          value={skills}
          onChange={(e) =>
            setSkills(e.target.value)
          }
          className="w-full p-4 rounded bg-slate-800 mb-4"
          rows={6}
        />

        <button
          onClick={analyze}
          className="bg-blue-600 px-6 py-3 rounded-lg"
        >
          Analyze
        </button>

        {result && (
          <div className="mt-6 bg-slate-800 p-6 rounded">
            <pre className="whitespace-pre-wrap">
              {result}
            </pre>
          </div>
        )}

      </div>

    </div>
  );
}