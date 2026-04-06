import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const PAID_PLAN_IDS = new Set(["pass_1m", "pass_3m", "pass_12m"]);

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  let body: { planId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const planId = body.planId;
  if (!planId || !PAID_PLAN_IDS.has(planId)) {
    return NextResponse.json({ error: "유효하지 않은 플랜입니다." }, { status: 400 });
  }

  let admin;
  try {
    admin = createAdminClient();
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "서버 설정을 확인해 주세요." }, { status: 500 });
  }

  const { data: plan, error: planError } = await admin
    .from("plans")
    .select("id, name, price, duration_days, daily_limit")
    .eq("id", planId)
    .single();

  if (planError || !plan) {
    return NextResponse.json({ error: "플랜을 찾을 수 없습니다." }, { status: 404 });
  }

  // profiles 테이블에 유저가 없으면 자동 생성
  const { data: existingProfile } = await admin
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .single();

  if (!existingProfile) {
    const { error: profileError } = await admin.from("profiles").insert({
      id: user.id,
      email: user.email,
      onboarding_completed: false,
    });
    if (profileError) {
      console.error("profiles insert:", profileError);
      return NextResponse.json({ error: "사용자 프로필 생성에 실패했습니다." }, { status: 500 });
    }
  }

  const orderId = randomUUID();

  const { error: insertError } = await admin.from("payments").insert({
    user_id: user.id,
    order_id: orderId,
    plan_id: plan.id,
    amount: plan.price,
    status: "pending",
  });

  if (insertError) {
    console.error("payments insert:", insertError);
    return NextResponse.json({ error: "결제 준비에 실패했습니다." }, { status: 500 });
  }

  return NextResponse.json({
    orderId,
    amount: plan.price,
    planName: plan.name,
    customerEmail: user.email ?? "",
  });
}
