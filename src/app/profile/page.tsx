"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  getDocs,
} from "firebase/firestore";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [documents, setDocuments] = useState(0);
  const [habits, setHabits] = useState(0);
  const [plans, setPlans] = useState(0);
  const [user, setUser] = useState<any>(null);

  const router = useRouter();

  // =====================
  // AUTH LISTENER (FIX LOGOUT ISSUE)
  // =====================
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);

      if (!u) {
        router.push("/login"); // redirect after logout
      }
    });

    return () => unsubscribe();
  }, []);

  // =====================
  // LOAD STATS (PER USER FIX)
  // =====================
  useEffect(() => {
    if (user?.uid) {
      loadStats(user.uid);
    }
  }, [user]);

  async function loadStats(userId: string) {
    try {
      // 🔥 FIX: per-user collections
      const docsSnapshot = await getDocs(
        collection(db, "users", userId, "documents")
      );

      const habitsSnapshot = await getDocs(
        collection(db, "users", userId, "habits")
      );

      const plansSnapshot = await getDocs(
        collection(db, "users", userId, "studyPlans")
      );

      setDocuments(docsSnapshot.size);
      setHabits(habitsSnapshot.size);
      setPlans(plansSnapshot.size);
    } catch (error) {
      console.error(error);
    }
  }

  // =====================
  // LOGOUT FIX
  // =====================
  async function handleLogout() {
    try {
      await signOut(auth);
      router.push("/login"); // force redirect
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-black dark:bg-black dark:text-white p-6">

      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <h1 className="text-4xl font-bold mb-8">
          👤 My Profile
        </h1>

        {/* USER INFO */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow mb-8">

          <h2 className="text-xl font-bold mb-4">
            User Information
          </h2>

          <p>
            <strong>Email:</strong> {user?.email || "Loading..."}
          </p>

          <p>
            <strong>User ID:</strong> {user?.uid || "Loading..."}
          </p>

        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow">
            <h3 className="font-bold">📄 Documents</h3>
            <p className="text-3xl mt-2">{documents}</p>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow">
            <h3 className="font-bold">📈 Habits</h3>
            <p className="text-3xl mt-2">{habits}</p>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow">
            <h3 className="font-bold">📚 Study Plans</h3>
            <p className="text-3xl mt-2">{plans}</p>
          </div>

        </div>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="mt-10 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
        >
          Logout
        </button>

      </div>
    </div>
  );
}