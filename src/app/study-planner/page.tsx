"use client";

import { useEffect, useState } from "react";

type Task = {
  title: string;
  done: boolean;
};

export default function StudyPlanner() {
  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [streak, setStreak] = useState(0);

  // Load saved data
  useEffect(() => {
    const saved = localStorage.getItem("study-data");
    if (saved) {
      const data = JSON.parse(saved);
      setTasks(data.tasks || []);
      setStreak(data.streak || 0);
    }
  }, []);

  // Save data
  function saveData(updatedTasks: Task[], updatedStreak: number) {
    localStorage.setItem(
      "study-data",
      JSON.stringify({
        tasks: updatedTasks,
        streak: updatedStreak,
      })
    );
  }

  async function generateRoadmap() {
    if (!goal) return;

    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: `Break this into 5 structured learning tasks: ${goal}. Return only bullet points.`,
      }),
    });

    const data = await res.json();

    const lines = data.reply
      .split("\n")
      .map((t: string) => t.replace("-", "").trim())
      .filter(Boolean);

    const newTasks = lines.map((t: string) => ({
      title: t,
      done: false,
    }));

    setTasks(newTasks);
    saveData(newTasks, streak);

    setLoading(false);
  }

  function toggleTask(index: number) {
    const updated = [...tasks];
    updated[index].done = !updated[index].done;

    const completed = updated.filter((t) => t.done).length;
    const newStreak = completed === updated.length ? streak + 1 : streak;

    setTasks(updated);
    setStreak(newStreak);
    saveData(updated, newStreak);
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-black dark:text-white transition-colors duration-300 p-6">
      
      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold">🧠 Smart Learning System</h1>
          <p className="text-gray-500 dark:text-gray-400">
            AI-powered roadmap + progress tracker
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow">
            <p className="text-sm text-gray-500">🔥 Streak</p>
            <p className="text-xl font-bold">{streak} days</p>
          </div>

          <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow">
            <p className="text-sm text-gray-500">📚 Tasks</p>
            <p className="text-xl font-bold">{tasks.length}</p>
          </div>
        </div>

        {/* INPUT CARD */}
        <div className="bg-white dark:bg-gray-900 p-5 rounded-xl shadow mb-6">
          <input
            className="w-full p-3 border rounded-lg bg-transparent outline-none dark:border-gray-700"
            placeholder="What do you want to learn?"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          />

          <button
            onClick={generateRoadmap}
            disabled={loading}
            className="mt-3 w-full bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded-lg font-medium hover:opacity-90 transition"
          >
            {loading ? "Generating roadmap..." : "Generate Roadmap"}
          </button>
        </div>

        {/* TASKS */}
        <div className="space-y-3">
          {tasks.length === 0 && (
            <div className="text-center text-gray-500 mt-10">
              No tasks yet. Create a roadmap above 🚀
            </div>
          )}

          {tasks.map((task, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-gray-900 shadow"
            >
              <span
                className={`${
                  task.done
                    ? "line-through text-gray-400"
                    : "text-gray-900 dark:text-white"
                }`}
              >
                {task.title}
              </span>

              <button
                onClick={() => toggleTask(i)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                  task.done
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
              >
                {task.done ? "Done" : "Mark"}
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}