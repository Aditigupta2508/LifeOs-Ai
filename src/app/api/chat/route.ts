import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

// Initialize the Gemini SDK client
// Provide the API key explicitly to satisfy the constructor signature
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    // 1. Safeguard: Parse and validate the incoming request body
    const body = await req.json().catch(() => null);
    if (!body || !body.message) {
      return NextResponse.json(
        { error: "Invalid request payload. 'message' field is required." },
        { status: 400 }
      );
    }

    const { message } = body;

    // 2. Safeguard: Check if the API key is actually loaded
    if (!process.env.GEMINI_API_KEY) {
      console.error("❌ CRITICAL ERROR: GEMINI_API_KEY environment variable is completely missing.");
      return NextResponse.json(
        { error: "Server misconfiguration: API key is missing." },
        { status: 500 }
      );
    }

    // 3. Request generation from Gemini
    // Using gemini-2.5-flash as the fast, standard model for chat applications
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
    });

    // 4. Return successful response
    return NextResponse.json({ 
      reply: response.text 
    }, { status: 200 });

  } catch (error: any) {
    // This logs the precise error details directly to your terminal console for debugging
    console.error("❌ BACKEND API ERROR TRACE:", error);

    // Prevents the browser from hanging for 6 seconds by closing the connection cleanly
    return NextResponse.json(
      { 
        error: "Failed to generate content from AI engine.", 
        details: error.message || error 
      },
      { status: 500 }
    );
  }
}