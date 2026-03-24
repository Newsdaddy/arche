import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const PLATFORM_PROMPTS: Record<string, string> = {
  instagram: `인스타그램 피드/릴스용 캡션을 작성해주세요.
요구사항:
- 첫 줄은 임팩트 있는 훅으로 시작
- 이모지를 적절히 활용
- 핵심 포인트 3-5개를 불릿 포인트로
- CTA(Call to Action) 포함
- 해시태그 5-10개 추천
- 전체 길이: 200-500자`,

  youtube: `유튜브 영상용 제목, 설명, 태그를 작성해주세요.
요구사항:
- 클릭을 유도하는 제목 3개 옵션
- SEO 최적화된 설명문 (타임스탬프 포함)
- 관련 태그 10-15개
- 썸네일 텍스트 제안`,

  blog: `블로그 글 초안을 작성해주세요.
요구사항:
- SEO 최적화된 제목
- 서론, 본론(2-3개 섹션), 결론 구조
- 각 섹션에 소제목 포함
- 자연스러운 키워드 배치
- 독자 참여 유도 문구`,

  thread: `스레드/X(트위터)용 스레드를 작성해주세요.
요구사항:
- 첫 트윗은 강력한 훅
- 5-10개의 연결된 트윗
- 각 트윗 280자 이내
- 마지막 트윗에 CTA
- 이모지 적절히 활용`,

  newsletter: `이메일 뉴스레터를 작성해주세요.
요구사항:
- 열고 싶은 제목
- 인사말
- 메인 콘텐츠 (2-3개 섹션)
- 큐레이션/추천 코너
- 마무리 인사
- CTA 버튼 문구`,
};

export async function POST(request: Request) {
  try {
    const { platform, topic, tone, keywords, target, additionalInfo } = await request.json();

    const platformPrompt = PLATFORM_PROMPTS[platform] || PLATFORM_PROMPTS.instagram;

    const prompt = `당신은 전문 콘텐츠 크리에이터입니다. 아래 정보를 바탕으로 콘텐츠를 작성해주세요.

플랫폼: ${platform}
주제: ${topic}
${tone ? `톤앤매너: ${tone}` : ""}
${keywords ? `포함할 키워드: ${keywords}` : ""}
${target ? `타겟 독자: ${target}` : ""}
${additionalInfo ? `추가 정보: ${additionalInfo}` : ""}

${platformPrompt}

바로 사용할 수 있는 완성된 콘텐츠를 작성해주세요. 한국어로 작성하세요.`;

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

    return NextResponse.json({ content });
  } catch (error) {
    console.error("콘텐츠 생성 실패:", error);
    return NextResponse.json(
      { error: "콘텐츠 생성에 실패했습니다. 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
