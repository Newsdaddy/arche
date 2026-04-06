import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// URL 검증 헬퍼
function isValidPlatformUrl(platform: string, url: string): boolean {
  const patterns: Record<string, RegExp> = {
    instagram: /^https?:\/\/(www\.)?instagram\.com\/(p|reel)\/[\w-]+/,
    youtube: /^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)[\w-]+/,
    x: /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/\w+\/status\/\d+/,
    tiktok: /^https?:\/\/(www\.)?(tiktok\.com\/@[\w.-]+\/video\/\d+|vm\.tiktok\.com\/\w+)/,
    threads: /^https?:\/\/(www\.)?threads\.(net|com)\/@[\w.]+\/post\/[\w-]+/,
    linkedin: /^https?:\/\/(www\.)?linkedin\.com\/(posts|feed|pulse)\//,
  };
  return patterns[platform]?.test(url) ?? false;
}

// OpenGraph에서 제목 가져오기
async function fetchTitle(url: string): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
      },
    });

    clearTimeout(timeout);

    if (!response.ok) return null;

    const html = await response.text();

    // og:title 추출
    const ogMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i) ||
                    html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:title["']/i);
    if (ogMatch) return ogMatch[1].substring(0, 200);

    // title 태그
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    return titleMatch ? titleMatch[1].substring(0, 200) : null;
  } catch {
    return null;
  }
}

// GET: 쇼케이스 랭킹 목록 조회
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "20");

  const supabase = await createClient();

  // 승인된 쇼케이스 조회 (좋아요+댓글 순 정렬)
  const { data: showcases, error } = await supabase
    .from("member_showcases")
    .select("*")
    .eq("is_approved", true)
    .order("likes", { ascending: false })
    .order("comments", { ascending: false })
    .limit(limit);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!showcases || showcases.length === 0) {
    return NextResponse.json({ showcases: [], total: 0 });
  }

  // 프로필 정보 별도 조회 (user_id가 있는 경우만)
  const userIds = Array.from(new Set(showcases.map((s) => s.user_id).filter(Boolean)));
  let profileMap = new Map();

  if (userIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, nickname, avatar_url, persona_name")
      .in("id", userIds);
    profileMap = new Map(profiles?.map((p) => [p.id, p]) || []);
  }

  // 랭킹 및 프로필 정보 병합
  const showcasesWithRank = showcases.map((showcase, index) => ({
    ...showcase,
    profiles: profileMap.get(showcase.user_id) || null,
    rank: index + 1,
  }));

  // 전체 개수
  const { count } = await supabase
    .from("member_showcases")
    .select("*", { count: "exact", head: true })
    .eq("is_approved", true);

  return NextResponse.json({
    showcases: showcasesWithRank,
    total: count || showcases.length,
  });
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
  const { platform, post_url, likes, comments, comment } = body;

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
      { error: "유효하지 않은 URL 형식입니다" },
      { status: 400 }
    );
  }

  // 제목 자동 fetch
  const title = await fetchTitle(post_url);

  const { data, error } = await supabase
    .from("member_showcases")
    .insert({
      user_id: user.id,
      platform,
      post_url,
      title,
      likes: likes || 0,
      comments: comments || 0,
      comment: comment || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // 사용자의 현재 랭킹 계산
  const { count: betterCount } = await supabase
    .from("member_showcases")
    .select("*", { count: "exact", head: true })
    .eq("is_approved", true)
    .gt("likes", data.likes);

  const userRank = (betterCount || 0) + 1;

  const { count: total } = await supabase
    .from("member_showcases")
    .select("*", { count: "exact", head: true })
    .eq("is_approved", true);

  return NextResponse.json({
    showcase: data,
    ranking: {
      rank: userRank,
      total: total || 1,
    },
  });
}
