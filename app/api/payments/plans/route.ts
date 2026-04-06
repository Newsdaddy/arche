import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/** 공개 플랜 목록 (인증 불필요) */
export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  const supabase = createClient(url, key);
  const { data, error } = await supabase
    .from("plans")
    .select("id, name, price, duration_days, daily_limit")
    .order("price", { ascending: true });

  if (error) {
    console.error("plans fetch:", error);
    return NextResponse.json({ error: "Failed to load plans" }, { status: 500 });
  }

  return NextResponse.json({ plans: data ?? [] });
}
