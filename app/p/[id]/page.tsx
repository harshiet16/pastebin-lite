import kv from "../../../lib/kv";
import { notFound } from "next/navigation";

export default async function PastePage({
  params,
}: {
  params: { id: string };
}) {
  const paste = await kv.get<any>(`paste:${params.id}`);
  if (!paste) notFound();

  return (
    <pre
      style={{
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        padding: 20,
      }}
    >
      {paste.content}
    </pre>
  );
}

