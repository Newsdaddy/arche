import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// 독일(arche.ai.kr/de) Claude Code 1:1 과외 신청 접수
// → de_tutoring_applications 테이블에 저장 (서비스 롤, RLS 우회) + 이메일 알림
export async function POST(request: Request) {
  try {
    const data = await request.json();

    const vorname = (data.vorname || "").trim();
    const nachname = (data.nachname || "").trim();
    const email = (data.email || "").trim();
    const os = data.os === "mac" || data.os === "windows" ? data.os : null;
    const preferredTime = (data.preferredTime || "").trim() || null;

    // 필수값 검증
    if (!vorname || !nachname || !email || !os) {
      return NextResponse.json(
        { error: "Pflichtfelder fehlen." },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const { data: result, error } = await supabase
      .from("de_tutoring_applications")
      .insert({
        vorname,
        nachname,
        email,
        os,
        preferred_time: preferredTime,
      })
      .select()
      .single();

    if (error) {
      console.error("DE 과외 신청 저장 실패:", error);
      return NextResponse.json(
        { error: "Beim Speichern ist ein Fehler aufgetreten." },
        { status: 500 }
      );
    }

    // 이메일 알림 (Resend) — 설정된 경우에만
    if (process.env.RESEND_API_KEY) {
      try {
        await sendEmailNotification({ vorname, nachname, email, os, preferredTime });
      } catch (emailError) {
        console.error("DE 신청 이메일 알림 실패:", emailError);
        // 이메일 실패해도 신청은 성공 처리
      }
    }

    return NextResponse.json({ success: true, id: result.id });
  } catch (error) {
    console.error("DE 과외 신청 처리 실패:", error);
    return NextResponse.json(
      { error: "Beim Senden ist ein Fehler aufgetreten." },
      { status: 500 }
    );
  }
}

async function sendEmailNotification(d: {
  vorname: string;
  nachname: string;
  email: string;
  os: string;
  preferredTime: string | null;
}) {
  const osLabel = d.os === "mac" ? "macOS" : "Windows";
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM || "상담알림 <onboarding@resend.dev>",
      to: process.env.NOTIFICATION_EMAIL || "your-email@example.com",
      subject: `[DE 과외 신청] ${d.vorname} ${d.nachname} (${osLabel})`,
      html: `
        <h2>🇩🇪 새로운 Claude Code 1:1 과외 신청 (arche.ai.kr/de)</h2>
        <ul>
          <li><strong>이름:</strong> ${d.vorname} ${d.nachname}</li>
          <li><strong>이메일:</strong> ${d.email}</li>
          <li><strong>운영체제:</strong> ${osLabel}</li>
          <li><strong>희망 일정:</strong> ${d.preferredTime || "미입력 (협의 후 결정)"}</li>
        </ul>
        <hr>
        <p style="color:#666;font-size:12px;">arche.ai.kr/de 신청 폼에서 자동 발송.</p>
      `,
    }),
  });
  if (!response.ok) {
    throw new Error(`이메일 전송 실패: ${response.status}`);
  }
  return response.json();
}
