import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // 사용자 프로필 확인
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // profiles 테이블에서 온보딩 완료 여부 확인
        const { data: profile } = await supabase
          .from("profiles")
          .select("onboarding_completed")
          .eq("id", user.id)
          .single();

        // 프로필이 있고 온보딩 완료면 대시보드로
        if (profile?.onboarding_completed) {
          return NextResponse.redirect(`${origin}/dashboard`);
        }

        // 프로필이 없으면 생성 시도
        if (!profile) {
          await supabase.from("profiles").insert({
            id: user.id,
            email: user.email,
            onboarding_completed: true, // 임시로 true 설정
          });
          return NextResponse.redirect(`${origin}/dashboard`);
        }
      }

      // 온보딩 안 했으면 온보딩으로 (또는 대시보드로 바꿔도 됨)
      return NextResponse.redirect(`${origin}/dashboard`);
    }
  }

  // 에러 발생시 로그인 페이지로
  return NextResponse.redirect(`${origin}/login?error=auth`);
}
