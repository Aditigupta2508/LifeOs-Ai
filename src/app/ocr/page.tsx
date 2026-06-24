"use client";

import { useState } from "react";
import Tesseract from "tesseract.js";

export default function OCRPage() {
  const [image, setImage] = useState<File | null>(null);
  const [text, setText] = useState("");

  async function extractText() {
    if (!image) return;

    const result = await Tesseract.recognize(
      image,
      "eng"
    );

    setText(result.data.text);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-10">

      <h1 className="text-5xl font-bold mb-8">
        OCR Document Extraction
      </h1>

      <input
        type="file"
        accept="image/*"
        onChange={(e) =>
          setImage(
            e.target.files
              ? e.target.files[0]
              : null
          )
        }
        className="mb-4"
      />

      <br />

      <button
        onClick={extractText}
        className="bg-blue-600 px-6 py-3 rounded"
      >
        Extract Text
      </button>

      {text && (
        <div className="mt-8 bg-slate-900 p-6 rounded">
          <h2 className="text-2xl font-bold mb-4">
            Extracted Text
          </h2>

          <pre className="whitespace-pre-wrap">
            {text}
          </pre>
        </div>
      )}
    </div>
  );
}