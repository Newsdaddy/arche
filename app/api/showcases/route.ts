import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// URL 검증 헬퍼
function isValidPlatformUrl(platform: string, url: string): boolean {
  const patterns: Record<string, RegExp> = {
    instagram: /^https?:\/\/(www\.)?instagram\.com\/(p|reel)\/[\w-]+/,
    youtube: /^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)[\w-]+/,
    x: /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/\w+\/status\/\d+/,
    tiktok: /^https?:\/\/(www\.)?(tiktok\.com\/@[\w.-]+\/video\/\d+|vm\.tiktok\.com\/\w+)/,
  };
  return patterns[platform]?.test(url) ?? false;
}

// GET: 쇼케이스 목록 조회
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "10");
  const featured = searchParams.get("featured") === "true";

  const supabase = await createClient();

  let query = supabase
    .from("member_showcases")
    .select(
      `
      *,
      profiles:user_id (nickname, avatar_url)
    `
    )
    .eq("is_approved", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (featured) {
    query = query.eq("is_featured", true);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ showcases: data || [] });
}

// POST: 새 쇼케이스 등록
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 });
  }

  const body = await request.json();
  const {
    platform,
    post_url,
    likes_before,
    likes_after,
    comments_before,
    comments_after,
    followers_before,
    followers_after,
    comment,
  } = body;

  // 필수 필드 확인
  if (!platform || !post_url) {
    return NextResponse.json(
      { error: "플랫폼과 URL은 필수입니다" },
      { status: 400 }
    );
  }

  // URL 검증
  if (!isValidPlatformUrl(platform, post_url)) {
    return NextResponse.json(
      { error: "유효하지 않은 URL입니다" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("member_showcases")
    .insert({
      user_id: user.id,
      platform,
      post_url,
      likes_before: likes_before || 0,
      likes_after: likes_after || 0,
      comments_before: comments_before || 0,
      comments_after: comments_after || 0,
      followers_before: followers_before || 0,
      followers_after: followers_after || 0,
      comment: comment || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ showcase: data });
}
