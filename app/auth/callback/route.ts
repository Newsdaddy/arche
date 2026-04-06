import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function safeRedirectPath(next: string | null): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return "/dashboard";
  }
  return next;
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
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
        const { data: profile } = await supabase
          .from("profiles")
          .select("onboarding_completed")
          .eq("id", user.id)
          .single();

        if (profile?.onboarding_completed) {
          return NextResponse.redirect(`${origin}${nextPath}`);
        }

        if (!profile) {
          await supabase.from("profiles").insert({
            id: user.id,
            email: user.email,
            onboarding_completed: true,
          });
          return NextResponse.redirect(`${origin}${nextPath}`);
        }
      }

      return NextResponse.redirect(`${origin}${nextPath}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
