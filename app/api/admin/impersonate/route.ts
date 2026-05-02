import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/config/admin";
import { cookies } from "next/headers";

const IMPERSONATE_COOKIE = "impersonating_user_id";
const IMPERSONATE_NAME_COOKIE = "impersonating_user_name";

// 대행 모드 시작
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // RLS 우회를 위해 admin client 사용
  const adminClient = createAdminClient();

  const { targetUserId } = await request.json();

  if (!targetUserId) {
    return NextResponse.json({ error: "targetUserId is required" }, { status: 400 });
  }

  // 대상 사용자 확인
  const { data: targetUser, error } = await adminClient
    .from("profiles")
    .select("id, email, full_name")
    .eq("id", targetUserId)
    .single();

  if (error || !targetUser) {
    return NextResponse.json({ error: "Target user not found" }, { status: 404 });
  }

  // 쿠키 설정 (24시간)
  const cookieStore = await cookies();
  const displayName = targetUser.full_name || targetUser.email;

  cookieStore.set(IMPERSONATE_COOKIE, targetUserId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24시간
    path: "/",
  });

  cookieStore.set(IMPERSONATE_NAME_COOKIE, displayName, {
    httpOnly: false, // 클라이언트에서 읽을 수 있도록
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
    path: "/",
  });

  return NextResponse.json({
    success: true,
    impersonating: {
      id: targetUserId,
      email: targetUser.email,
      name: displayName,
    },
  });
}

// 대행 모드 상태 확인
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // RLS 우회를 위해 admin client 사용
  const adminClient = createAdminClient();

  const cookieStore = await cookies();
  const impersonatingUserId = cookieStore.get(IMPERSONATE_COOKIE)?.value;
  const impersonatingName = cookieStore.get(IMPERSONATE_NAME_COOKIE)?.value;

  if (!impersonatingUserId) {
    return NextResponse.json({ impersonating: null });
  }

  // 대상 사용자 정보 조회
  const { data: targetUser } = await adminClient
    .from("profiles")
    .select("id, email, full_name")
    .eq("id", impersonatingUserId)
    .single();

  return NextResponse.json({
    impersonating: targetUser
      ? {
          id: targetUser.id,
          email: targetUser.email,
          name: targetUser.full_name || impersonatingName || targetUser.email,
        }
      : null,
  });
}

// 대행 모드 종료
export async function DELETE() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cookieStore = await cookies();

  cookieStore.delete(IMPERSONATE_COOKIE);
  cookieStore.delete(IMPERSONATE_NAME_COOKIE);

  return NextResponse.json({ success: true });
}
