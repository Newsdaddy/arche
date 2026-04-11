import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// 프로덕션 도메인 (vercel.app 대신 커스텀 도메인 사용)
const PRODUCTION_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://arche.ai.kr";

function safeRedirectPath(next: string | null): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return "/dashboard";
  }
  return next;
}

function getBaseUrl(requestOrigin: string): string {
  // 프로덕션 환경에서는 커스텀 도메인 사용
  if (process.env.NODE_ENV === "production") {
    return PRODUCTION_URL;
  }
  return requestOrigin;
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const baseUrl = getBaseUrl(origin);
  const code = searchParams.get("code");
  const nextPath = safeRedirectPath(searchParams.get("next"));

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // 프로필이 없으면 생성, 있으면 업데이트 (upsert)
        await supabase.from("profiles").upsert({
          id: user.id,
          email: user.email,
          onboarding_completed: true,
        }, { onConflict: "id" });

        return NextResponse.redirect(`${baseUrl}${nextPath}`);
      }

      return NextResponse.redirect(`${baseUrl}${nextPath}`);
    }
  }

  return NextResponse.redirect(`${baseUrl}/login?error=auth`);
}
