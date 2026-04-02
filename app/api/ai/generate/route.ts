import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { createClient } from "@/lib/supabase/server";
import {
  checkUsageLimitServer,
  incrementUsageServer,
  getActivePersonaResult,
  saveContentGeneration,
} from "@/lib/usage/server";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const PLATFORM_PROMPTS: Record<string, string> = {
  instagram: `인스타그램 피드/릴스용 캡션을 작성해주세요.
요구사항:
- 첫 줄은 임팩트 있는 훅으로 시작 (스크롤을 멈추게 하는 문장)
- 이모지 사용하지 마세요 (글자만 작성)
- 핵심 포인트 3-5개를 불릿 포인트로
- CTA(Call to Action) 포함
- 해시태그 5-10개 추천
- 전체 길이: 200-500자`,

  youtube: `유튜브 영상용 제목, 설명, 태그를 작성해주세요.
요구사항:
- 클릭을 유도하는 제목 3개 옵션
- SEO 최적화된 설명문 (타임스탬프 포함)
- 관련 태그 10-15개
- 썸네일 텍스트 제안
- 이모지 사용하지 마세요 (글자만 작성)`,

  blog: `블로그 글 초안을 작성해주세요.
요구사항:
- SEO/AEO 최적화된 제목
- 서론, 본론(2-3개 섹션), 결론 구조
- 각 섹션에 소제목 포함
- 자연스러운 키워드 배치
- 독자 참여 유도 문구
- AI 검색 최적화를 위한 명확한 답변 구조
- 이모지 사용하지 마세요 (글자만 작성)`,

  thread: `스레드/X(트위터)용 스레드를 작성해주세요.
요구사항:
- 첫 트윗은 강력한 훅
- 5-10개의 연결된 트윗
- 각 트윗 280자 이내
- 마지막 트윗에 CTA
- 이모지 사용하지 마세요 (글자만 작성)`,

  linkedin: `링크드인 포스트를 작성해주세요.
요구사항:
- 첫 줄은 호기심을 자극하는 훅으로 시작
- 전문적이면서도 친근한 톤
- 개인 경험이나 인사이트 공유 형식
- 핵심 메시지 3-5개를 명확하게 전달
- 마지막에 질문이나 CTA로 댓글 유도
- 해시태그 3-5개 추천
- 전체 길이: 300-800자
- 이모지 사용하지 마세요 (글자만 작성)`,

  newsletter: `이메일 뉴스레터를 작성해주세요.
요구사항:
- 열고 싶은 제목
- 인사말
- 메인 콘텐츠 (2-3개 섹션)
- 큐레이션/추천 코너
- 마무리 인사
- CTA 버튼 문구
- 이모지 사용하지 마세요 (글자만 작성)`,
};

// 페르소나 컨텍스트 생성
function buildPersonaContext(persona: Record<string, unknown> | null): string {
  if (!persona) return "";

  const strengths = Array.isArray(persona.strengths)
    ? persona.strengths.join(", ")
    : "";

  return `
[크리에이터 페르소나 정보]
유형: ${persona.archetype_name || ""}
설명: ${persona.archetype_description || ""}
강점: ${strengths}
콘텐츠 스타일: ${persona.content_style || ""}
고유 포지션: ${persona.unique_position || ""}

이 크리에이터의 톤앤매너와 스타일에 맞게 콘텐츠를 작성하세요.
강점을 살리고, 고유한 관점이 드러나도록 해주세요.
`;
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // 로그인 여부 확인 (비로그인도 허용하되 사용량 추적 안함)
    const userId: string | null = user?.id || null;
    let usageCheck = null;
    let persona = null;

    // 로그인한 사용자: 사용량 체크
    if (userId) {
      usageCheck = await checkUsageLimitServer(userId, "content_generation");

      if (!usageCheck.allowed) {
        return NextResponse.json(
          {
            error: "오늘 생성 횟수를 모두 사용했습니다.",
            usageInfo: {
              remaining: 0,
              limit: usageCheck.limit,
              plan: usageCheck.plan,
            }
          },
          { status: 429 }
        );
      }

      // 활성 페르소나 조회
      persona = await getActivePersonaResult(userId);
    }

    const { platform, topic, tone, keywords, target, additionalInfo } = await request.json();

    if (!topic) {
      return NextResponse.json(
        { error: "에피소드나 생각을 입력해주세요." },
        { status: 400 }
      );
    }

    const platformPrompt = PLATFORM_PROMPTS[platform] || PLATFORM_PROMPTS.instagram;
    const personaContext = buildPersonaContext(persona);

    const prompt = `당신은 브레인스토밍을 완성된 콘텐츠로 변환하는 전문 에디터입니다.

사용자가 날것의 생각, 에피소드, 브레인스토밍을 적어주면:
1. 핵심 스토리와 메시지를 추출하세요
2. 누가, 언제, 어디서, 무엇을, 어떻게, 왜의 요소를 파악하세요
3. 이슈 → 결과 또는 문제 → 해결의 서사 구조를 찾으세요
4. 플랫폼에 맞는 완성된 글로 정리하세요

${personaContext}

[사용자의 브레인스토밍]
${topic}

[플랫폼: ${platform}]
${platformPrompt}

${tone ? `톤앤매너: ${tone}` : ""}
${keywords ? `포함할 키워드: ${keywords}` : ""}
${target ? `타겟 독자: ${target}` : ""}
${additionalInfo ? `추가 정보: ${additionalInfo}` : ""}

중요 규칙:
- 사용자의 날것의 생각을 그대로 쓰지 말고, 정리된 콘텐츠로 재구성하세요
- 첫 줄은 반드시 스크롤을 멈추게 하는 강력한 훅으로 시작하세요
- 사용자의 경험과 인사이트가 자연스럽게 녹아들게 하세요
- 독자가 공감하고 행동하게 만드는 CTA를 포함하세요
- 바로 올릴 수 있는 완성된 콘텐츠를 작성하세요
- 한국어로 작성하세요`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.8,
      max_tokens: 2000,
    });

    const content = completion.choices[0]?.message?.content || "";

    // 로그인한 사용자: 사용량 증가 및 기록 저장
    if (userId) {
      await incrementUsageServer(userId, "content_generation");

      await saveContentGeneration(userId, {
        platform,
        topic,
        additionalInputs: { tone, keywords, target, additionalInfo },
        personaResultId: persona?.id,
        generatedContent: content,
      });

      // 업데이트된 사용량 정보
      const updatedUsage = await checkUsageLimitServer(userId, "content_generation");

      return NextResponse.json({
        content,
        usageInfo: {
          remaining: updatedUsage.remaining,
          limit: updatedUsage.limit,
          plan: updatedUsage.plan,
        },
        hasPersona: !!persona,
      });
    }

    return NextResponse.json({ content });
  } catch (error) {
    console.error("콘텐츠 생성 실패:", error);
    return NextResponse.json(
      { error: "콘텐츠 생성에 실패했습니다. 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
