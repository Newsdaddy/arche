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

[콘텐츠 변환 공식 - 핵심]

절대 하지 말 것 (Bad):
- 팩트/숫자 나열식 시작
- 뉴스 기사체 ("~했습니다", "~로 밝혀졌다")
- 독자에게 지시하는 톤 ("~하세요", "확인하세요")
- 체크리스트 나열형 CTA
- 3인칭 객관적 보도

반드시 할 것 (Good):
- 감정/공감 훅으로 시작 ("와...", "이런 경우도 있네요")
- 스토리텔링 전개 (사건→반전→교훈)
- 독자와 함께 발견하는 톤 ("~거예요", "~지 뭡니까")
- 전환적 CTA (링크, 무료자료)
- 조력자 관점 1인칭 나레이션

[스레드 구조 예시]

(1/n) 주인공 + 난관
- 공감 훅으로 시작
- 사건 제시
- 반전 (예상 밖 결과)

(2/n) 난관 심화 + 질문
- 문제 구체화 (장면 묘사)
- "어디서부터 잘못된 걸까요?" 질문 던지기

(3/n) 솔루션 + CTA
- 원인 진단 (조력자로서)
- "이게 남일이 아닙니다" (독자=주인공)
- 전환적 CTA (블로그, 자료 링크)
`;

// ========================================
// 12가지 콘텐츠 유형별 프롬프트
// ========================================
const CONTENT_TYPE_PROMPTS: Record<string, string> = {
  listicle: `
[글 유형: 리스티클]
- 반드시 숫자 기반 제목 사용 (예: "3가지", "5개의")
- 각 항목을 명확히 구분하여 나열
- 도입→리스트→마무리 구조
- 각 항목에 구체적 예시나 설명 포함`,

  how_to: `
[글 유형: HOW-TO 가이드]
- "~하는 방법", "~하는 N단계" 형식
- 단계별로 명확한 액션 제시
- 각 단계에 왜 중요한지 설명
- 마지막에 실행 후 기대 결과 제시`,

  comparison: `
[글 유형: A vs B 비교]
- 두 선택지를 명확히 제시
- 각각의 장단점 분석
- 어떤 상황에 뭐가 좋은지 가이드
- 마지막에 나의 선택과 이유 제시`,

  growth_story: `
[글 유형: 성장 스토리]
- Before(과거) 상황 구체적 묘사
- 전환점이 된 사건/깨달음
- After(현재) 상황 대비
- "당신도 할 수 있다" 격려로 마무리`,

  failure_story: `
[글 유형: 실패담/회고]
- 실패 상황을 솔직하게 묘사
- 그 순간의 감정 표현
- 실패에서 배운 구체적 교훈
- 현재는 어떻게 달라졌는지`,

  experiment: `
[글 유형: 실험 기록]
- "N일간 ~해봤습니다" 형식
- 시작 전 예상/가설 제시
- 실제 결과 (숫자 포함)
- 예상과 다른 점, 배운 인사이트`,

  daily_insight: `
[글 유형: 일상 인사이트]
- 일상의 작은 에피소드로 시작
- "오늘 ~하다가 깨달은 것"
- 에피소드에서 보편적 교훈 도출
- 독자도 공감할 수 있는 메시지`,

  paradox: `
[글 유형: 역설적 진실]
- "모두가 ~라고 하지만" 으로 시작
- 일반적 통념 제시
- "실제로는 ~더라고요" 반전
- 왜 그런지 근거와 경험 제시`,

  deep_analysis: `
[글 유형: 심층 분석]
- 하나의 주제를 깊이있게 파고들기
- 3-4가지 다른 관점에서 분석
- 각 관점에 근거나 데이터 포함
- 종합적인 인사이트로 마무리`,

  empathy: `
[글 유형: 공감 연결]
- "혹시 이런 경험 있으신가요?"로 시작
- 독자가 겪었을 법한 상황 묘사
- "저도 그랬습니다" 공감
- 함께 해결해나가는 톤으로 마무리`,

  community_qa: `
[글 유형: 독자 Q&A]
- "DM으로 이런 질문을 받았어요"
- 질문 원문 인용 (가상)
- 답변을 친절하고 구체적으로
- 비슷한 고민 가진 분들께 메시지`,

  recommendation: `
[글 유형: 추천/큐레이션]
- "~를 위한 N가지 추천"
- 각 추천 항목의 특징과 장점
- 왜 이것을 추천하는지 이유
- 나의 실제 사용 경험 포함`,
};

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

  thread: `X(트위터)/스레드용 포스트를 작성해주세요.
요구사항:
- 강력한 훅으로 시작
- 280자 이내의 임팩트 있는 단일 포스트
- CTA 포함
- 이모지 사용하지 마세요 (글자만 작성)`,

  // 스레드 분할 모드 (threadCount가 있을 때 사용)
  thread_split: `X(트위터)/스레드용 연결된 포스트 시리즈를 작성해주세요.
요구사항:
- 첫 트윗은 강력한 훅으로 시작
- {{threadCount}}개의 연결된 트윗으로 구성
- 각 트윗 280자 이내
- (1/{{threadCount}}), (2/{{threadCount}}) 형식으로 번호 표시
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

  newsletter: `10,000자 분량의 롱폼 뉴스레터를 작성해주세요.

[글쓰기 원칙]
- 담백하게 써. 수사, 미사여구, 군더더기 말 붙이지 마.
- 10,000자 분량으로 써.
- 주제와 긴밀성 있는 내용만. 멋대로 이야기 지어내지 마.
- 신선한 비즈니스 인사이트가 돋보이게.
- 축약하지 말고 차근차근 풀어서 써.
- 중학생도 이해할 수 있는 쉬운 문체.
- 겸손한 말투, 적절히 '~요'로 끝맺음 (전부 다는 아니고).
- 후반부에 멋대로 인사이트/교훈 지어내지 마.
- 감탄사 빼. "와, 정말 멋지네요" 같은 거 하지 마.
- 이모지 절대 금지.

[톤과 어투]
- "~에요", "~죠", "~거든요", "~고요" 친근한 구어체
- "그러나", "하지만", "그런데", "즉" 연결어 최소화
- 앞 문장 단어/뉘앙스를 다음 문장이 이어받아 가독성 높이기
- 한 문장은 짧게, 하나의 핵심 메시지만
- 독자와 대화하듯 전개

[스토리텔링 구조]
1. 도입부: 구체적 인물/회사를 주인공으로, 놀라운 성과나 흥미로운 사실로 시작
   예: "월 2억원을 혼자서 버는 아저씨가 있습니다"
2. 전개부: 시간 순서대로 스토리 전개
   - 주인공의 배경과 초기 실패 경험
   - 전환점이 되는 구체적 사건 ("한통의 메일이 옵니다")
   - 성공까지의 과정을 단계별로 서술
3. 결론부: 핵심 교훈을 불릿 포인트로 정리, 도입부 소재 수미쌍관 활용

[정보 전달]
- 구체적 수치 필수: "많은 돈" X → "월 2억원" O
- 실제 회사/서비스명 언급 (추상적 설명 X)
- Before & After 대비 명확히

[독자 몰입]
- 호기심 유발 질문: "어떻게 ~할 수 있을까요?"
- 감정 묘사: "기절할 뻔 했죠", "낭만적인 생각이었죠"
- 공감 포인트: 독자가 겪었을 법한 상황/욕구 언급

[문단 구성]
- 한 문단 2-3문장으로 짧게
- 복잡한 내용은 여러 문단으로 쪼개기
- 소제목은 **굵은 글씨**로 명확히 구분

[마무리]
- 분야에 맞는 저명한 전문가 인용구로 감동 더하기
- 수미쌍관: 도입부 표현/소재 재활용, 패러프레이징
- 보편적으로 확장하는 문장으로 마무리
- 핵심 주제 다시 짚어주기
- 주요 팩트/핵심 요약 정리`,
};

// 페르소나 컨텍스트 생성 - 진단 결과를 콘텐츠에 풍부하게 반영
function buildPersonaContext(persona: Record<string, unknown> | null): string {
  if (!persona) return "";

  // 배열 필드 안전하게 추출
  const strengths = Array.isArray(persona.strengths)
    ? persona.strengths.join(", ")
    : "";
  const weaknesses = Array.isArray(persona.weaknesses)
    ? persona.weaknesses.join(", ")
    : "";
  const opportunities = Array.isArray(persona.opportunities)
    ? persona.opportunities.join(", ")
    : "";
  const skills = Array.isArray(persona.skills)
    ? persona.skills.join(", ")
    : "";

  // ICP (이상적 고객 프로필) 추출
  const icp = persona.icp as Record<string, unknown> | null;
  const icpSummary = icp?.summary || "";
  const icpPainPoints = Array.isArray(icp?.painPoints)
    ? (icp.painPoints as string[]).join(", ")
    : "";
  const icpDesires = Array.isArray(icp?.desires)
    ? (icp.desires as string[]).join(", ")
    : "";

  // 콘텐츠 필러 추출
  const contentPillars = Array.isArray(persona.content_pillars)
    ? (persona.content_pillars as Array<{ name?: string; description?: string }>)
        .map((p) => `${p.name}: ${p.description}`)
        .join("\n   - ")
    : "";

  // SWOT Mix 전략 추출
  const swotMix = persona.swot_mix as Record<string, string> | null;
  const swotMixStr = swotMix
    ? `
   - 공격 전략(SO): ${swotMix.so || ""}
   - 전환 전략(WO): ${swotMix.wo || ""}
   - 방어 전략(ST): ${swotMix.st || ""}`
    : "";

  return `
[크리에이터 페르소나 - 반드시 이 정보를 콘텐츠에 반영하세요]

1. 아키타입
   - 유형: ${persona.archetype_name || ""}
   - 설명: ${persona.archetype_description || ""}
   - 콘텐츠 스타일: ${persona.content_style || ""}

2. SWOT 분석
   - 강점: ${strengths}
   - 약점: ${weaknesses}
   - 기회: ${opportunities}

3. 전략 방향${swotMixStr}

4. 핵심 역량
   - 보유 스킬: ${skills}
   - 고유 포지션: ${persona.unique_position || ""}

5. 타겟 독자 (ICP)
   - 요약: ${icpSummary}
   - 그들의 고민: ${icpPainPoints}
   - 그들의 욕구: ${icpDesires}

6. 콘텐츠 주제 (Content Pillars)
   - ${contentPillars || "없음"}

[페르소나 적용 규칙]
- 이 크리에이터의 "강점"을 콘텐츠 전면에 내세우세요
- "콘텐츠 스타일"에 맞는 톤앤매너로 작성하세요
- "타겟 독자의 고민"에 공감하고 "욕구"를 자극하세요
- "고유 포지션"이 드러나는 관점으로 서술하세요
- "전략 방향"에 맞게 메시지를 구성하세요
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

    const { platform, topic, tone, keywords, target, additionalInfo, threadMode, threadCount, contentType } = await request.json();

    if (!topic) {
      return NextResponse.json(
        { error: "에피소드나 생각을 입력해주세요." },
        { status: 400 }
      );
    }

    // 스레드 분할 모드 처리
    let platformPrompt = PLATFORM_PROMPTS[platform] || PLATFORM_PROMPTS.instagram;
    if (platform === "thread" && threadMode === "split" && threadCount) {
      platformPrompt = PLATFORM_PROMPTS.thread_split.replace(/\{\{threadCount\}\}/g, String(threadCount));
    }
    const personaContext = buildPersonaContext(persona);

    // 콘텐츠 유형 프롬프트 추가
    const contentTypePrompt = contentType && CONTENT_TYPE_PROMPTS[contentType]
      ? CONTENT_TYPE_PROMPTS[contentType]
      : "";

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
${contentTypePrompt}

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
- 한국어로 작성
- 이모지/이모티콘 절대 사용 금지 (글자만 작성)
- 한자(漢字) 절대 사용 금지. 순한글로만 작성 (예: 周圍→주위, 方法→방법, 問題→문제)`;

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
        additionalInputs: { tone, keywords, target, additionalInfo, contentType },
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
