import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const supabase = await createClient();

    // 현재 로그인한 사용자 확인 (선택적)
    const { data: { user } } = await supabase.auth.getUser();

    // Supabase에 상담 신청 저장
    const { data: result, error } = await supabase
      .from("consulting_requests")
      .insert({
        user_id: user?.id || null,
        name: data.name,
        email: data.email,
        phone: data.phone,
        plan_id: data.planId,
        plan_name: data.planName,
        plan_price: data.planPrice,
        platform: data.platform,
        follower_count: data.followerCount,
        goal: data.goal,
        message: data.message,
      })
      .select()
      .single();

    if (error) {
      console.error("상담 신청 저장 실패:", error);
      return NextResponse.json(
        { error: "상담 신청에 실패했습니다." },
        { status: 500 }
      );
    }

    // 이메일 알림 전송 (Resend 사용)
    if (process.env.RESEND_API_KEY) {
      try {
        await sendEmailNotification(data);
      } catch (emailError) {
        console.error("이메일 알림 실패:", emailError);
        // 이메일 실패해도 신청은 성공으로 처리
      }
    }

    // Discord/Slack 웹훅 알림 (설정된 경우)
    if (process.env.NOTIFICATION_WEBHOOK_URL) {
      try {
        await sendWebhookNotification(data);
      } catch (webhookError) {
        console.error("웹훅 알림 실패:", webhookError);
      }
    }

    return NextResponse.json({
      success: true,
      id: result.id,
      message: "상담 신청이 완료되었습니다."
    });
  } catch (error) {
    console.error("상담 신청 처리 실패:", error);
    return NextResponse.json(
      { error: "상담 신청 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// Resend를 통한 이메일 알림
async function sendEmailNotification(data: {
  name: string;
  email: string;
  phone: string;
  planName: string;
  planPrice: string;
  platform?: string;
  followerCount?: string;
  goal?: string;
  message?: string;
}) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM || "상담알림 <onboarding@resend.dev>",
      to: process.env.NOTIFICATION_EMAIL || "your-email@example.com",
      subject: `[상담 신청] ${data.name}님 - ${data.planName}`,
      html: `
        <h2>새로운 상담 신청이 접수되었습니다!</h2>

        <h3>📋 기본 정보</h3>
        <ul>
          <li><strong>이름:</strong> ${data.name}</li>
          <li><strong>이메일:</strong> ${data.email}</li>
          <li><strong>연락처:</strong> ${data.phone}</li>
        </ul>

        <h3>💼 신청 플랜</h3>
        <ul>
          <li><strong>플랜:</strong> ${data.planName}</li>
          <li><strong>가격:</strong> ${data.planPrice}</li>
        </ul>

        <h3>📱 콘텐츠 정보</h3>
        <ul>
          <li><strong>플랫폼:</strong> ${data.platform || "미입력"}</li>
          <li><strong>팔로워:</strong> ${data.followerCount || "미입력"}</li>
          <li><strong>목표:</strong> ${data.goal || "미입력"}</li>
        </ul>

        ${data.message ? `
        <h3>💬 메시지</h3>
        <p>${data.message}</p>
        ` : ""}

        <hr>
        <p style="color: #666; font-size: 12px;">
          이 이메일은 콘텐츠 습관 서비스에서 자동 발송되었습니다.
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
async function sendWebhookNotification(data: {
  name: string;
  email: string;
  phone: string;
  planName: string;
  planPrice: string;
  platform?: string;
  followerCount?: string;
  goal?: string;
  message?: string;
}) {
  const webhookUrl = process.env.NOTIFICATION_WEBHOOK_URL;
  if (!webhookUrl) return;

  // Discord 형식으로 전송 (Slack도 비슷하게 동작)
  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      content: "🔔 **새로운 상담 신청!**",
      embeds: [
        {
          title: `${data.name}님 - ${data.planName}`,
          color: 0x4F46E5, // accent color
          fields: [
            { name: "📧 이메일", value: data.email, inline: true },
            { name: "📱 연락처", value: data.phone, inline: true },
            { name: "💰 가격", value: data.planPrice, inline: true },
            { name: "📺 플랫폼", value: data.platform || "미입력", inline: true },
            { name: "👥 팔로워", value: data.followerCount || "미입력", inline: true },
            { name: "🎯 목표", value: data.goal || "미입력", inline: false },
            ...(data.message ? [{ name: "💬 메시지", value: data.message, inline: false }] : []),
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
