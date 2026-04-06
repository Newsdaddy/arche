import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// GET: 응원 여부 확인
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: showcaseId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ hasCheer: false });
  }

  const { data } = await supabase
    .from("showcase_cheers")
    .select("id")
    .eq("showcase_id", showcaseId)
    .eq("user_id", user.id)
    .single();

  return NextResponse.json({ hasCheer: !!data });
}

// POST: 응원 토글 (추가/취소)
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: showcaseId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 });
  }

  // 기존 응원 확인
  const { data: existingCheer } = await supabase
    .from("showcase_cheers")
    .select("id")
    .eq("showcase_id", showcaseId)
    .eq("user_id", user.id)
    .single();

  if (existingCheer) {
    // 응원 취소
    await supabase.from("showcase_cheers").delete().eq("id", existingCheer.id);

    // 카운트 감소
    await supabase.rpc("decrement_cheer_count", { p_showcase_id: showcaseId });

    return NextResponse.json({ hasCheer: false });
  } else {
    // 응원 추가
    const { error: insertError } = await supabase
      .from("showcase_cheers")
      .insert({
        showcase_id: showcaseId,
        user_id: user.id,
      });

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    // 카운트 증가
    await supabase.rpc("increment_cheer_count", { p_showcase_id: showcaseId });

    return NextResponse.json({ hasCheer: true });
  }
}
