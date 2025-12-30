import kv from "../../../../lib/kv";
import { nowMs } from "../../../../lib/time";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const key = `paste:${params.id}`;
  const paste = await kv.get<any>(key);

  if (!paste) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const now = nowMs(req.headers);

  if (paste.expiresAt && now >= paste.expiresAt) {
    await kv.del(key);
    return Response.json({ error: "Expired" }, { status: 404 });
  }

  if (paste.maxViews !== null && paste.views >= paste.maxViews) {
    return Response.json({ error: "View limit exceeded" }, { status: 404 });
  }

  paste.views += 1;
  await kv.set(key, paste);

  return Response.json({
    content: paste.content,
    remaining_views:
      paste.maxViews === null ? null : paste.maxViews - paste.views,
    expires_at: paste.expiresAt
      ? new Date(paste.expiresAt).toISOString()
      : null,
  });
}
