import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/** 1회성 상품(트레이닝 등) 주문 생성 — Toss 위젯에 넘길 orderId/amount 반환 */
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  let body: { productId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const productId = body.productId;
  if (!productId) {
    return NextResponse.json({ error: "상품이 선택되지 않았습니다." }, { status: 400 });
  }

  let admin;
  try {
    admin = createAdminClient();
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "서버 설정을 확인해 주세요." }, { status: 500 });
  }

  const { data: product, error: productError } = await admin
    .from("products")
    .select("id, name, price, active")
    .eq("id", productId)
    .single();

  if (productError || !product || !product.active) {
    return NextResponse.json({ error: "상품을 찾을 수 없습니다." }, { status: 404 });
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
    kind: "product",
    product_id: product.id,
    amount: product.price,
    status: "pending",
  });

  if (insertError) {
    console.error("payments insert:", insertError);
    return NextResponse.json({ error: "결제 준비에 실패했습니다." }, { status: 500 });
  }

  return NextResponse.json({
    orderId,
    amount: product.price,
    planName: product.name, // 결제 위젯 orderName 으로 사용 (기존 페이지 호환)
    customerEmail: user.email ?? "",
  });
}
