import Link from "next/link";
import ThemeButtons from "@/components/ThemeButtons";

export default function Home() {
  return (
    
    <main className="min-h-screen bg-slate-950 text-white">

      <nav className="flex justify-between items-center p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold">
          LifeOS AI
        </h1>

        <div className="space-x-4">
          <Link
            href="/login"
            className="px-4 py-2 rounded bg-slate-800"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="px-4 py-2 rounded bg-blue-600"
          >
            Register
          </Link>
        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-6 py-20">

        <h2 className="text-6xl font-bold">
          Your Personal AI Operating System
        </h2>

        <p className="mt-6 text-xl text-slate-300">
          Manage studies, goals, documents,
          reminders and daily planning through
          one intelligent assistant.
        </p>
        

        <div className="grid md:grid-cols-3 gap-6 mt-12">

          <div className="bg-slate-900 p-6 rounded-xl">
            <h3 className="text-xl font-semibold">
              AI Assistant
            </h3>

            <p className="mt-2 text-slate-400">
              Personalized planning and guidance.
            </p>
          </div>

          <div className="bg-slate-900 p-6 rounded-xl">
            <h3 className="text-xl font-semibold">
              Study Planner
            </h3>

            <p className="mt-2 text-slate-400">
              Exam preparation and schedules.
            </p>
          </div>

          <div className="bg-slate-900 p-6 rounded-xl">
            <h3 className="text-xl font-semibold">
              Document Wallet
            </h3>

            <p className="mt-2 text-slate-400">
              OCR-powered smart document storage.
            </p>
          </div>

        </div>

      </section>

    </main>
  );
}