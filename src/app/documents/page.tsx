"use client";

import { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase";

import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";

export default function DocumentsPage() {
  const [documentName, setDocumentName] = useState("");
  const [category, setCategory] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState<any[]>([]);

  const userId = auth.currentUser?.uid;

  // =========================
  // LOAD DOCUMENTS (PER USER)
  // =========================
  async function loadDocuments() {
    if (!userId) return;

    try {
      const q = query(
        collection(db, "users", userId, "documents"),
        orderBy("uploadedAt", "desc")
      );

      const snapshot = await getDocs(q);

      const docs = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      setDocuments(docs);
    } catch (error) {
      console.error("Load error:", error);
    }
  }

  useEffect(() => {
    loadDocuments();
  }, [userId]);

  // =========================
  // UPLOAD DOCUMENT
  // =========================
  async function uploadDocument() {
    if (!file || !documentName || !category) {
      alert("Please fill all fields");
      return;
    }

    if (!userId) {
      alert("User not logged in");
      return;
    }

    try {
      setLoading(true);

      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onloadend = async () => {
        try {
          const base64 = reader.result;

          const response = await fetch("/api/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ file: base64 }),
          });

          const data = await response.json();

          if (!data.success) {
            alert("Upload failed");
            setLoading(false);
            return;
          }

          await addDoc(
            collection(db, "users", userId, "documents"),
            {
              documentName,
              category,
              expiryDate,
              fileUrl: data.url,
              uploadedAt: new Date(),
            }
          );

          setDocumentName("");
          setCategory("");
          setExpiryDate("");
          setFile(null);

          await loadDocuments();

          alert("Document Uploaded Successfully!");
        } catch (err) {
          console.error(err);
          alert("Upload failed");
        }

        setLoading(false);
      };
    } catch (error) {
      console.error(error);
      alert("Upload failed");
      setLoading(false);
    }
  }

  // =========================
  // DELETE DOCUMENT
  // =========================
  async function deleteDocument(id: string) {
    if (!userId) return;

    try {
      await deleteDoc(doc(db, "users", userId, "documents", id));
      setDocuments((prev) => prev.filter((d) => d.id !== id));
    } catch (error) {
      console.error("Delete error:", error);
    }
  }

  // =========================
  // EXPIRY CALCULATION
  // =========================
  function getDaysLeft(date: string) {
    if (!date) return null;

    const today = new Date();
    const expiry = new Date(date);

    const diff = expiry.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  // =========================
  // UI
  // =========================
  return (
    <div className="min-h-screen bg-gray-50 text-black dark:bg-black dark:text-white p-6">

      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <h1 className="text-4xl font-bold mb-2">
          📁 AI Document Wallet
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Upload, track and manage your important documents
        </p>

        {/* UPLOAD BOX */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow mb-8">

          <input
            type="text"
            placeholder="Document Name"
            value={documentName}
            onChange={(e) => setDocumentName(e.target.value)}
            className="w-full p-3 mb-3 rounded border dark:bg-gray-800"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-3 mb-3 rounded border dark:bg-gray-800"
          >
            <option value="">Select Category</option>
            <option>Aadhaar</option>
            <option>PAN</option>
            <option>Passport</option>
            <option>Marksheet</option>
            <option>Resume</option>
            <option>Certificate</option>
          </select>

          <input
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            className="w-full p-3 mb-3 rounded border dark:bg-gray-800"
          />

          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="mb-4"
          />

          <button
            onClick={uploadDocument}
            disabled={loading}
            className="bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded w-full"
          >
            {loading ? "Uploading..." : "Upload Document"}
          </button>
        </div>

        {/* DOCUMENT LIST */}
        <div className="space-y-4">

          {documents.length === 0 ? (
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow">
              No documents uploaded yet.
            </div>
          ) : (
            documents.map((doc) => {
              const daysLeft = getDaysLeft(doc.expiryDate);

              return (
                <div
                  key={doc.id}
                  className="bg-white dark:bg-gray-900 p-5 rounded-xl shadow"
                >
                  <h3 className="text-xl font-bold">
                    {doc.documentName}
                  </h3>

                  <p className="text-gray-500">
                    Category: {doc.category}
                  </p>

                  <p className="text-gray-500">
                    Expiry: {doc.expiryDate || "N/A"}
                  </p>

                  {daysLeft !== null && (
                    <p
                      className={`text-sm mt-1 ${
                        daysLeft <= 7
                          ? "text-red-500"
                          : "text-green-500"
                      }`}
                    >
                      {daysLeft <= 0
                        ? "⚠️ Expired"
                        : `⏳ ${daysLeft} days left`}
                    </p>
                  )}

                  <div className="flex gap-3 mt-3">

                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      className="text-blue-500 underline"
                    >
                      View
                    </a>

                    <button
                      onClick={() => deleteDocument(doc.id)}
                      className="text-red-500"
                    >
                      Delete
                    </button>

                  </div>
                </div>
              );
            })
          )}

        </div>

      </div>
    </div>
  );
}