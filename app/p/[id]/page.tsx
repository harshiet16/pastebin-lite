import kv from "../../../lib/kv";
import { notFound } from "next/navigation";

export default async function PastePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const paste = await kv.get<any>(`paste:${id}`);
  if (!paste) notFound();

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-white">
          Shared Paste
        </h2>

        <pre className="bg-slate-950 border border-slate-800 rounded-lg p-4 whitespace-pre-wrap break-words text-slate-100">
          {paste.content}
        </pre>

        <p className="mt-4 text-sm text-slate-400 text-right">
          Paste ID: {id}
        </p>
      </div>
    </main>
  );
}
