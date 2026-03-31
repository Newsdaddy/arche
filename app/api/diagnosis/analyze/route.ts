import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { createClient } from "@/lib/supabase/server";
import {
  generateAnalysisPrompt,
  parseAIResponse,
  quickAnalysis,
} from "@/lib/diagnosis/analyzer";
import { checkUsageLimitServer, incrementUsageServer } from "@/lib/usage/server";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // 로그인 필수
    if (!user) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const userId = user.id;

    // 사용량 체크
    const usageCheck = await checkUsageLimitServer(userId, "diagnosis");
    if (!usageCheck.allowed) {
      return NextResponse.json(
        {
          error: "오늘 진단 횟수를 모두 사용했습니다.",
          usageInfo: {
            remaining: 0,
            limit: usageCheck.limit,
            plan: usageCheck.plan,
          },
        },
        { status: 429 }
      );
    }

    const { diagnosisType, answers } = await request.json();

    if (!answers || Object.keys(answers).length === 0) {
      return NextResponse.json(
        { error: "답변이 필요합니다." },
        { status: 400 }
      );
    }

    let result;

    // 빠른 진단: AI 없이 로컬 분석
    if (diagnosisType === "quick") {
      result = quickAnalysis(answers, userId);
    } else {
      // 심층 진단: AI 분석
      const prompt = generateAnalysisPrompt(answers);

      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `당신은 소셜 페르소나 분석 전문가입니다.
사용자의 답변을 바탕으로 SWOT, Hero's Journey, Enneagram, Value Proposition Canvas, Ikigai 프레임워크를 활용하여 종합 분석을 수행합니다.
반드시 요청된 JSON 형식으로만 응답하세요. 추가 설명 없이 JSON만 출력하세요.`,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
        max_tokens: 4000,
      });

      const aiResponse = completion.choices[0]?.message?.content || "";
      result = parseAIResponse(aiResponse, userId, answers);
    }

    // 사용량 증가
    await incrementUsageServer(userId, "diagnosis");

    // 업데이트된 사용량 정보
    const updatedUsage = await checkUsageLimitServer(userId, "diagnosis");

    return NextResponse.json({
      success: true,
      result,
      usageInfo: {
        remaining: updatedUsage.remaining,
        limit: updatedUsage.limit,
        plan: updatedUsage.plan,
      },
    });
  } catch (error) {
    console.error("진단 분석 실패:", error);
    return NextResponse.json(
      { error: "분석에 실패했습니다. 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
