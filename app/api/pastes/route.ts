import { nanoid } from "nanoid";
import kv from "../../../lib/kv";
import { nowMs } from "../../../lib/time";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.content || typeof body.content !== "string") {
    return Response.json({ error: "Invalid content" }, { status: 400 });
  }

  const ttl = body.ttl_seconds;
  const maxViews = body.max_views;

  if (ttl !== undefined && (!Number.isInteger(ttl) || ttl < 1)) {
    return Response.json({ error: "Invalid ttl_seconds" }, { status: 400 });
  }

  if (maxViews !== undefined && (!Number.isInteger(maxViews) || maxViews < 1)) {
    return Response.json({ error: "Invalid max_views" }, { status: 400 });
  }

  const id = nanoid(10);
  const createdAt = nowMs();

  const paste = {
    content: body.content,
    createdAt,
    expiresAt: ttl ? createdAt + ttl * 1000 : null,
    maxViews: maxViews ?? null,
    views: 0,
  };

  await kv.set(`paste:${id}`, paste);

  return Response.json({
    id,
    url: `${process.env.VERCEL_URL ? "https://" + process.env.VERCEL_URL : ""}/p/${id}`,
  });
}
