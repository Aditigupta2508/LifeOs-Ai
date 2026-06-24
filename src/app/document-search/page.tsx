"use client";

import { useState } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";

export default function DocumentSearchPage() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function searchDocument() {
    const userId = auth.currentUser?.uid;

    if (!userId) {
      alert("User not logged in");
      return;
    }

    if (!search.trim()) return;

    setLoading(true);

    try {
      // ✅ ONLY USER DOCUMENTS (important fix)
      const q = query(collection(db, "users", userId, "documents"));
      const snapshot = await getDocs(q);

      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const keyword = search.toLowerCase();

      // ✅ SMART FILTER (better matching)
      const filtered = docs.filter((doc: any) => {
        const name = doc.documentName?.toLowerCase() || "";
        const category = doc.category?.toLowerCase() || "";

        return (
          name.includes(keyword) ||
          category.includes(keyword)
        );
      });

      setResults(filtered);

      if (filtered.length === 0) {
        alert("No documents found");
      }
    } catch (error) {
      console.error(error);
      alert("Search failed");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 text-black dark:bg-black dark:text-white p-6">

      <div className="max-w-3xl mx-auto">

        {/* HEADER */}
        <h1 className="text-4xl font-bold mb-2">
          🔍 AI Document Search
        </h1>

        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Search your uploaded documents instantly
        </p>

        {/* SEARCH BOX */}
        <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow mb-6">

          <input
            type="text"
            placeholder="Search Resume, Aadhaar, Passport..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 border rounded-lg dark:bg-gray-800"
          />

          <button
            onClick={searchDocument}
            disabled={loading}
            className="mt-3 w-full bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded-lg"
          >
            {loading ? "Searching..." : "Search Documents"}
          </button>
        </div>

        {/* RESULTS */}
        <div className="space-y-4">

          {!loading && results.length === 0 && search && (
            <div className="text-gray-500 text-center">
              No documents found 😕
            </div>
          )}

          {results.map((doc) => (
            <div
              key={doc.id}
              className="bg-white dark:bg-gray-900 p-5 rounded-xl shadow"
            >
              <h2 className="text-xl font-bold">
                {doc.documentName}
              </h2>

              <p className="text-gray-500">
                Category: {doc.category}
              </p>

              <a
                href={doc.fileUrl}
                target="_blank"
                className="text-blue-500 underline mt-2 inline-block"
              >
                Open Document
              </a>
            </div>
          ))}

        </div>

      </div>
    </div>
  );
}