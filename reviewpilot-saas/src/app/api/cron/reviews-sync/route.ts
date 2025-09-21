import { NextResponse } from "next/server";
import { syncAllOrgsOnce } from "@/lib/reviews-sync";

export async function GET() {
  try {
    const res = await syncAllOrgsOnce();
    return NextResponse.json({ ok: true, ...res });
  } catch (e:any) {
    console.error("Cron sync error", e);
    return NextResponse.json({ error: e.message || "Cron failed" }, { status: 500 });
  }
}


