import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { missionTitle, missionTask, link } = await request.json();

    const prompt = `당신은 콘텐츠 크리에이터 코치입니다. 사용자가 콘텐츠 미션을 완료하고 링크를 제출했습니다.

미션 제목: ${missionTitle}
미션 내용: ${missionTask}
제출된 링크: ${link}

이 미션 완료에 대해 격려하는 피드백을 JSON 형식으로 제공해주세요.
실제 링크 내용은 확인할 수 없으므로, 미션을 완료한 것 자체에 대해 피드백해주세요.

반드시 아래 JSON 형식으로만 응답하세요:
{
  "score": 75~95 사이의 점수,
  "strengths": ["잘한 점 1", "잘한 점 2"],
  "improvements": ["개선할 점 1", "개선할 점 2"],
  "message": "격려 메시지 (2-3문장, 친근하고 따뜻하게)"
}`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 500,
    });

    const responseText = completion.choices[0]?.message?.content || "";

    // JSON 파싱 시도
    try {
      // JSON 부분만 추출
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const feedback = JSON.parse(jsonMatch[0]);
        return NextResponse.json(feedback);
      }
    } catch {
      console.error("JSON 파싱 실패:", responseText);
    }

    // 파싱 실패시 기본 피드백
    return NextResponse.json({
      score: 85,
      strengths: ["미션을 완료한 것이 대단해요!", "꾸준히 실천하고 계시네요"],
      improvements: ["다음엔 더 구체적인 내용을 담아보세요"],
      message: "오늘도 한 걸음 나아갔어요! 이 꾸준함이 쌓여서 큰 변화를 만들어낼 거예요. 내일도 화이팅!",
    });
  } catch (error) {
    console.error("AI 피드백 생성 실패:", error);
    return NextResponse.json(
      {
        score: 80,
        strengths: ["미션을 완료했어요!"],
        improvements: ["계속 도전해보세요"],
        message: "좋은 시작이에요! 꾸준히 하다 보면 분명 성장할 거예요.",
      },
      { status: 200 }
    );
  }
}
