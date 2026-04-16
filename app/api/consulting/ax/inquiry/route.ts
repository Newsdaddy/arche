import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const supabase = await createClient();

    // 현재 로그인한 사용자 확인 (선택적)
    const { data: { user } } = await supabase.auth.getUser();

    // 강의 타입에 따른 이름 매핑
    const courseNames: Record<string, string> = {
      "1h": "라이트닝 토크 (1시간)",
      "2h": "실무 워크숍 (2시간)",
      "3h": "딥다이브 세미나 (3시간)",
    };

    // consulting_requests 테이블에 저장 (AX 워크숍 구분)
    const { data: result, error } = await supabase
      .from("consulting_requests")
      .insert({
        user_id: user?.id || null,
        name: data.name,
        email: data.email,
        phone: null, // AX는 phone 필수 아님
        plan_id: `ax-${data.courseType}`,
        plan_name: `AX 워크숍: ${courseNames[data.courseType] || data.courseType}`,
        plan_price: "문의 후 안내",
        platform: null,
        follower_count: data.attendees, // 참석 인원
        goal: data.preferredDate ? `희망 일정: ${data.preferredDate}` : null,
        message: [
          data.company ? `회사/조직: ${data.company}` : null,
          data.message,
        ].filter(Boolean).join("\n\n"),
      })
      .select()
      .single();

    if (error) {
      console.error("AX 워크숍 문의 저장 실패:", error);
      return NextResponse.json(
        { error: "문의 접수에 실패했습니다." },
        { status: 500 }
      );
    }

    // 이메일 알림 전송 (Resend 사용)
    if (process.env.RESEND_API_KEY) {
      try {
        await sendEmailNotification(data, courseNames);
      } catch (emailError) {
        console.error("이메일 알림 실패:", emailError);
        // 이메일 실패해도 신청은 성공으로 처리
      }
    }

    // Discord/Slack 웹훅 알림 (설정된 경우)
    if (process.env.NOTIFICATION_WEBHOOK_URL) {
      try {
        await sendWebhookNotification(data, courseNames);
      } catch (webhookError) {
        console.error("웹훅 알림 실패:", webhookError);
      }
    }

    return NextResponse.json({
      success: true,
      id: result.id,
      message: "AX 워크숍 문의가 접수되었습니다."
    });
  } catch (error) {
    console.error("AX 워크숍 문의 처리 실패:", error);
    return NextResponse.json(
      { error: "문의 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// Resend를 통한 이메일 알림
async function sendEmailNotification(
  data: {
    name: string;
    email: string;
    company?: string;
    courseType: string;
    attendees?: string;
    preferredDate?: string;
    message?: string;
  },
  courseNames: Record<string, string>
) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM || "상담알림 <onboarding@resend.dev>",
      to: process.env.NOTIFICATION_EMAIL || "your-email@example.com",
      subject: `[AX 워크숍 문의] ${data.name}님 - ${courseNames[data.courseType]}`,
      html: `
        <h2>🎯 새로운 AX 워크숍 문의가 접수되었습니다!</h2>

        <h3>📋 기본 정보</h3>
        <ul>
          <li><strong>이름:</strong> ${data.name}</li>
          <li><strong>이메일:</strong> ${data.email}</li>
          <li><strong>회사/조직:</strong> ${data.company || "미입력"}</li>
        </ul>

        <h3>💼 강의 정보</h3>
        <ul>
          <li><strong>희망 강의:</strong> ${courseNames[data.courseType]}</li>
          <li><strong>예상 인원:</strong> ${data.attendees || "미입력"}</li>
          <li><strong>희망 일정:</strong> ${data.preferredDate || "미입력"}</li>
        </ul>

        ${data.message ? `
        <h3>💬 기타 문의사항</h3>
        <p>${data.message}</p>
        ` : ""}

        <hr>
        <p style="color: #666; font-size: 12px;">
          이 이메일은 Arche AX 워크숍에서 자동 발송되었습니다.
        </p>
      `,
    }),
  });

  if (!response.ok) {
    throw new Error(`이메일 전송 실패: ${response.status}`);
  }

  return response.json();
}

// Discord/Slack 웹훅 알림
async function sendWebhookNotification(
  data: {
    name: string;
    email: string;
    company?: string;
    courseType: string;
    attendees?: string;
    preferredDate?: string;
    message?: string;
  },
  courseNames: Record<string, string>
) {
  const webhookUrl = process.env.NOTIFICATION_WEBHOOK_URL;
  if (!webhookUrl) return;

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      content: "🎯 **새로운 AX 워크숍 문의!**",
      embeds: [
        {
          title: `${data.name}님 - ${courseNames[data.courseType]}`,
          color: 0x0891B2, // accent color
          fields: [
            { name: "📧 이메일", value: data.email, inline: true },
            { name: "🏢 회사/조직", value: data.company || "미입력", inline: true },
            { name: "👥 예상 인원", value: data.attendees || "미입력", inline: true },
            { name: "📅 희망 일정", value: data.preferredDate || "미입력", inline: true },
            ...(data.message ? [{ name: "💬 기타", value: data.message, inline: false }] : []),
          ],
          timestamp: new Date().toISOString(),
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`웹훅 전송 실패: ${response.status}`);
  }
}
