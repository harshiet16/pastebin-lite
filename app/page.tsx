"use client";
import { useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState("");
  const [maxViews, setMaxViews] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function createPaste() {
    setError("");
    setUrl("");
    setCopied(false);

    if (!content.trim()) {
      setError("Paste content cannot be empty.");
      return;
    }

    const payload: any = { content };
    if (ttl) payload.ttl_seconds = Number(ttl);
    if (maxViews) payload.max_views = Number(maxViews);

    setLoading(true);
    const res = await fetch("/api/pastes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Something went wrong");
      return;
    }

    setUrl(data.url);
    setContent("");
    setTtl("");
    setMaxViews("");
  }

  function copyLink() {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <main className="min-h-screen flex items-start justify-center pt-20 px-4">
      {/* CARD */}
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6">
        <h1 className="text-3xl font-bold text-center text-white">
          Pastebin Lite
        </h1>

        <p className="text-slate-400 text-center mt-2 mb-6">
          Create a paste and share it instantly
        </p>

        {/* TEXTAREA */}
        <textarea
          className="w-full h-36 rounded-lg bg-slate-950 border border-slate-700 p-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
          placeholder="Write your paste here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {/* OPTIONS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          <input
            type="number"
            min="1"
            placeholder="TTL (seconds)"
            value={ttl}
            onChange={(e) => setTtl(e.target.value)}
            className="rounded-lg bg-slate-950 border border-slate-700 p-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />

          <input
            type="number"
            min="1"
            placeholder="Max views"
            value={maxViews}
            onChange={(e) => setMaxViews(e.target.value)}
            className="rounded-lg bg-slate-950 border border-slate-700 p-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* ERROR */}
        {error && (
          <p className="text-red-400 text-sm mt-3">{error}</p>
        )}

        {/* BUTTON */}
        <button
          onClick={createPaste}
          disabled={loading}
          className="mt-5 w-full rounded-lg bg-blue-600 hover:bg-blue-700 py-2.5 text-white font-semibold transition disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Paste"}
        </button>

        {/* RESULT */}
        {url && (
          <div className="mt-6 rounded-lg bg-slate-950 border border-slate-800 p-4 text-center">
            <p className="text-green-400 font-medium mb-2">
              Paste created successfully
            </p>

            <div className="flex flex-col sm:flex-row gap-2 items-center justify-center">
              <a
                href={url}
                target="_blank"
                className="text-blue-400 underline break-all"
              >
                {url}
              </a>

              <button
                onClick={copyLink}
                className="px-3 py-1 text-sm rounded-md bg-slate-700 hover:bg-slate-600 transition"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
