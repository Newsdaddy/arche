import { NextResponse } from "next/server";

/**
 * AI 콘텐츠 생성 API - 서비스 종료
 *
 * 2026-04 서비스 피벗으로 인해 AI 글쓰기 기능이 제거되었습니다.
 *
 * 새로운 서비스:
 * - AX 컨설팅: /consulting/ax
 * - 페르소나 진단 SaaS: /diagnosis
 */
export async function POST() {
  return NextResponse.json(
    {
      error: "이 기능은 더 이상 제공되지 않습니다.",
      message: "Arche는 컨설팅 중심 서비스로 전환되었습니다.",
      redirect: "/",
    },
    { status: 410 } // 410 Gone - Resource permanently removed
  );
}

export async function GET() {
  return NextResponse.json(
    {
      error: "이 기능은 더 이상 제공되지 않습니다.",
      message: "Arche는 컨설팅 중심 서비스로 전환되었습니다.",
      redirect: "/",
    },
    { status: 410 }
  );
}
