"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { db, auth } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import HabitChart from "@/components/HabitChart";

type StatCardProps = {
  title: string;
  value: number;
  icon: string;
};

function StatCard({
  title,
  value,
  icon,
}: StatCardProps) {
  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between">
        <h3 className="text-gray-500 text-sm">
          {title}
        </h3>

        <span className="text-2xl">
          {icon}
        </span>
      </div>

      <p className="text-3xl font-bold mt-4">
        {value}
      </p>
    </div>
  );
}

export default function DashboardPage() {
  const [documents, setDocuments] = useState(0);
  const [studyPlans, setStudyPlans] = useState(0);
  const [habits, setHabits] = useState(0);
  const [loading, setLoading] = useState(true);

  const userId = auth.currentUser?.uid;

  useEffect(() => {
    if (!userId) return;
    loadAnalytics();
  }, [userId]);

  async function loadAnalytics() {
    try {
      setLoading(true);

      const [
        docsSnapshot,
        plansSnapshot,
        habitsSnapshot,
      ] = await Promise.all([
        getDocs(
          collection(
            db,
            "users",
            userId!,
            "documents"
          )
        ),
        getDocs(
          collection(
            db,
            "users",
            userId!,
            "studyPlans"
          )
        ),
        getDocs(
          collection(
            db,
            "users",
            userId!,
            "habits"
          )
        ),
      ]);

      setDocuments(docsSnapshot.size);
      setStudyPlans(plansSnapshot.size);
      setHabits(habitsSnapshot.size);
    } catch (error) {
      console.error("Analytics error:", error);
    } finally {
      setLoading(false);
    }
  }

  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? "Good Morning ☀️"
      : hour < 18
      ? "Good Afternoon 🌤️"
      : "Good Evening 🌙";

  const modules = [
    ["🤖 AI Assistant", "/assistant"],
    ["📚 Study Planner", "/study-planner"],
    ["💼 Placement", "/placement"],
    ["📄 Documents", "/documents"],
    ["📈 Habits", "/habits"],
    ["👤 Profile", "/profile"],
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-black dark:text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">

        {/* HERO */}
        <div className="mb-8 rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 md:p-10 text-white">
          <h1 className="text-3xl md:text-5xl font-bold">
            {greeting}
          </h1>

          <p className="mt-3 text-sm md:text-lg opacity-90">
            Welcome to LifeOS AI – your personal
            productivity and study companion.
          </p>
        </div>

        {/* REMINDER */}
        <div className="bg-yellow-400 text-black p-5 rounded-2xl mb-8">
          <h2 className="font-bold text-lg">
            ⏰ Smart Reminder
          </h2>

          <p>
            Check deadlines, update habits and
            continue your study goals.
          </p>
        </div>

        {/* ANALYTICS */}
        <h2 className="text-2xl font-bold mb-4">
          Analytics
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">

          {loading ? (
            <div className="col-span-full text-center py-10">
              Loading analytics...
            </div>
          ) : (
            <>
              <StatCard
                title="Documents"
                value={documents}
                icon="📄"
              />

              <StatCard
                title="Study Plans"
                value={studyPlans}
                icon="📚"
              />

              <StatCard
                title="Habits Logged"
                value={habits}
                icon="📈"
              />

              <StatCard
                title="Total Activity"
                value={
                  documents +
                  studyPlans +
                  habits
                }
                icon="⚡"
              />
            </>
          )}
        </div>

        {/* QUICK ACTIONS */}
        <h2 className="text-2xl font-bold mb-4">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">

          <Link
            href="/assistant"
            className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow hover:shadow-xl transition"
          >
            🤖 AI Assistant
          </Link>

          <Link
            href="/study-planner"
            className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow hover:shadow-xl transition"
          >
            📚 Study Planner
          </Link>

          <Link
            href="/documents"
            className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow hover:shadow-xl transition"
          >
            📄 Document Wallet
          </Link>

        </div>

        {/* HABIT CHART */}
        <div className="mb-10">
          <HabitChart />
        </div>

        {/* TODAY */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4">
            Today's Overview
          </h2>

          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow">
            <ul className="space-y-3">
              <li>
                📚 Continue placement preparation
              </li>
              <li>
                📈 Update today's habits
              </li>
              <li>
                📄 Review important documents
              </li>
              <li>
                🤖 Ask AI Assistant for guidance
              </li>
            </ul>
          </div>
        </div>

        {/* MODULES */}
        <div>
          <h2 className="text-2xl font-bold mb-4">
            Modules
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">

            {modules.map(([title, href]) => (
              <Link
                key={href}
                href={href}
                className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {title}
              </Link>
            ))}

          </div>
        </div>

      </div>
    </div>
  );
}