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

// ========================================
// 뉴스대디 7코드 콘텐츠 프레임워크
// ========================================
// 핵심 원칙:
// - 글쓴이 = 조력자(Guide) 포지션
// - 독자 = 주인공(Hero) 포지션
// - 독자가 "이건 내 얘기다"라고 느끼게 작성
//
// 콘텐츠 유전 7단계:
// 1. 고객이 주인공 - 독자가 주인공임을 인식시킴
// 2. 난관에 직면한 주인공 - 외적/내적/철학적 문제 공감
// 3. 가이드를 만나다 - 전문성 + 애정을 가진 조력자로서 등장
// 4. 솔루션 제시 - 구체적 계획, 단계 제시
// 5. 행동 촉구 - 직접적 CTA 또는 전환적 CTA
// 6. 실패 피하게 도와주기 - 안 하면 어떻게 되는지 상기
// 7. 성공으로 마무리 - 성공한 모습을 상상하게
// ========================================

const NEWSDADDY_FRAMEWORK = `
[뉴스대디 7코드 콘텐츠 프레임워크]

당신은 '조력자(Guide)' 관점에서 글을 씁니다.
독자는 '주인공(Hero)'입니다.
독자가 글을 읽으면서 "이건 내 얘기다"라고 느끼게 해야 합니다.

콘텐츠는 다음 7단계 서사 구조를 따릅니다:

1. 고객이 주인공
   - 독자가 원하는 것을 정확히 파악
   - 그들의 욕구와 목표에 공감
   - "당신"이 중심이 되는 이야기

2. 난관에 직면한 주인공
   - 외적 난관: 눈에 보이는 문제 (사건, 상황, 환경)
   - 내적 난관: 마음속 문제 (두려움, 불안, 열등감)
   - 철학적 난관: 더 깊은 의미 (이게 옳은 걸까?)

3. 가이드를 만나다
   - 전문성 + 공감을 갖춘 조력자로 등장
   - 독자는 또다른 영웅이 아닌 '가이드'를 찾음
   - 라포 형성: "나도 그랬어요" 또는 "당신을 이해합니다"

4. 솔루션 제시
   - 구체적인 계획과 단계 제시
   - "이렇게 하면 됩니다"
   - 명확한 로드맵

5. 행동 촉구
   - 직접적 CTA: "지금 바로 ~하세요"
   - 전환적 CTA: "무료 가이드를 받아보세요"
   - 스토리로 자극하여 행동 유도

6. 실패 피하게 도와주기
   - 행동하지 않으면 어떻게 되는지 상기
   - "뭐가 걸려 있는가?" (시간, 돈, 기회)
   - 긴급성과 중요성 부여

7. 성공으로 마무리
   - 성공한 모습을 구체적으로 묘사
   - 독자가 그 미래를 상상하게
   - 희망과 가능성 제시
`;

// ========================================
// 문체 패턴 및 글쓰기 공식
// ========================================
const WRITING_STYLE = `
[문체 및 톤]
- 존댓말 기본 (~해요, ~네요, ~거든요)
- 독백과 대화체 혼용
- 겸손하면서도 확신있는 톤
- 자주 사용하는 표현: "~더라고요", "~것 같아요", "~거든요", "개인적으로", "솔직히"

[기본 구조]
- 도입부: 개인적 경험이나 관찰로 시작
- 전개부: 구체적 사례와 데이터 제시
- 결론부: 독자에게 전하는 메시지나 다짐

[글 유형별 공식]

Type A - 경험 공유형:
1. 시간/상황 제시 ("작년 12월...", "퇴사 후 6개월...")
2. 구체적 성과/숫자 ("270명이 결제", "월 2000만원")
3. 배운 점/깨달음
4. 독자에게 전하는 메시지

Type B - 인사이트 제공형:
1. 질문이나 의문 제기
2. 나만의 관점 제시
3. 구체적 근거나 경험
4. 실행 가능한 조언

Type C - 성장 스토리형:
1. Before 상황 (과거의 나)
2. 전환점이 된 사건/깨달음
3. After 상황 (현재의 나)
4. 독자도 할 수 있다는 격려

[전개 패턴]

역설적 진실 패턴:
"[일반적 통념]이라고 생각하실 거예요.
그런데 실제로는 [반대되는 진실]더라고요."

Before & After 패턴:
"[과거 시점] [과거 상황]이었어요.
[현재 시점] [현재 상황]이 되었네요."

질문-답변 패턴:
"[자주 받는 질문]?
제 답은 [간단한 답변]이에요."

[필수 체크리스트]
- 개인 경험이 들어갔는가?
- 구체적 숫자나 데이터가 있는가?
- 독자가 공감할 수 있는 내용인가?
- 실행 가능한 조언이 있는가?
- 마지막이 희망적인가?
`;

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

    const prompt = `당신은 뉴스대디 7코드 프레임워크를 마스터한 콘텐츠 에디터입니다.
사용자의 브레인스토밍을 '조력자 관점'의 완성된 콘텐츠로 변환합니다.

${NEWSDADDY_FRAMEWORK}

${WRITING_STYLE}

[변환 프로세스]
사용자가 날것의 생각, 에피소드, 브레인스토밍을 적어주면:
1. 핵심 스토리와 메시지를 추출
2. 누가, 언제, 어디서, 무엇을, 어떻게, 왜의 요소 파악
3. 7코드 서사 구조에 맞게 재구성:
   - 독자(주인공)의 난관 공감
   - 글쓴이(조력자)로서 솔루션 제시
   - 행동 촉구 + 실패 회피 + 성공 비전

${personaContext}

[사용자의 브레인스토밍]
${topic}

[플랫폼: ${platform}]
${platformPrompt}

${tone ? `톤앤매너: ${tone}` : ""}
${keywords ? `포함할 키워드: ${keywords}` : ""}
${target ? `타겟 독자: ${target}` : ""}
${additionalInfo ? `추가 정보: ${additionalInfo}` : ""}

[핵심 규칙]
- 글쓴이 = 조력자(Guide), 독자 = 주인공(Hero)
- 독자가 "이건 내 얘기다"라고 느끼게 작성
- 첫 줄은 독자의 난관/욕구를 건드리는 강력한 훅
- 중간에 솔루션과 구체적 단계 제시
- 마지막에 행동 촉구 + 성공한 미래 비전
- 바로 올릴 수 있는 완성된 콘텐츠
- 한국어로 작성`;

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
