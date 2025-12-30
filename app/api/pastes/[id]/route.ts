import kv from "../../../../lib/kv";
import { nowMs } from "../../../../lib/time";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const key = `paste:${id}`;

  const paste = await kv.get<any>(key);
  if (!paste) {
    return new Response("Not found", { status: 404 });
  }

  const now = nowMs(req.headers);

  if (paste.expiresAt && now > paste.expiresAt) {
    await kv.del(key);
    return new Response("Not found", { status: 404 });
  }

  if (paste.maxViews !== null) {
    if (paste.views >= paste.maxViews) {
      await kv.del(key);
      return new Response("Not found", { status: 404 });
    }

    paste.views += 1;
    await kv.set(key, paste);
  }

  return Response.json({
    content: paste.content,
    remaining_views:
      paste.maxViews !== null ? paste.maxViews - paste.views : null,
    expires_at: paste.expiresAt,
  });
}