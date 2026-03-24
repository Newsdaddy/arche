import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { personaType, answers } = await request.json();

    const personaTypeNames: Record<string, string> = {
      individual: "1인 크리에이터",
      duo: "2인+ 크리에이터 (커플/팀)",
      brand: "브랜드 계정",
    };

    const prompt = `당신은 소셜미디어 전략 컨설턴트입니다.
사용자의 SWOT 분석 결과를 바탕으로 소셜미디어 콘텐츠 전략을 제시해주세요.

## 페르소나 유형
${personaTypeNames[personaType] || personaType}

## SWOT 분석 결과

### 강점 (Strengths)
- ${answers.s1 || "미입력"}
- ${answers.s2 || "미입력"}
- ${answers.s3 || "미입력"}
- ${answers.s4 || "미입력"}

### 약점 (Weaknesses)
- ${answers.w1 || "미입력"}
- ${answers.w2 || "미입력"}
- ${answers.w3 || "미입력"}
- ${answers.w4 || "미입력"}

### 기회 (Opportunities)
- ${answers.o1 || "미입력"}
- ${answers.o2 || "미입력"}
- ${answers.o3 || "미입력"}
- ${answers.o4 || "미입력"}

### 위협 (Threats)
- ${answers.t1 || "미입력"}
- ${answers.t2 || "미입력"}
- ${answers.t3 || "미입력"}
- ${answers.t4 || "미입력"}

위 분석을 바탕으로 SWOT 믹스 전략을 JSON 형식으로 제시해주세요.
각 전략은 구체적이고 실행 가능해야 합니다.

반드시 아래 JSON 형식으로만 응답하세요:
{
  "summary": "전체 분석 요약 (2-3문장)",
  "so": "SO 전략 - 강점을 활용해 기회를 극대화하는 구체적인 전략 (3-4문장)",
  "st": "ST 전략 - 강점을 활용해 위협을 최소화하는 구체적인 전략 (3-4문장)",
  "wo": "WO 전략 - 기회를 활용해 약점을 보완하는 구체적인 전략 (3-4문장)",
  "wt": "WT 전략 - 약점을 최소화하고 위협을 회피하는 구체적인 전략 (3-4문장)",
  "recommendations": ["실행 권장사항 1", "실행 권장사항 2", "실행 권장사항 3"]
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
      max_tokens: 1500,
    });

    const responseText = completion.choices[0]?.message?.content || "";

    // JSON 파싱 시도
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);
        return NextResponse.json(result);
      }
    } catch {
      console.error("JSON 파싱 실패:", responseText);
    }

    // 파싱 실패시 기본 응답
    return NextResponse.json({
      summary: "당신의 SWOT 분석이 완료되었습니다. 강점을 최대한 활용하고 약점을 보완하는 전략을 수립하세요.",
      so: "강점을 바탕으로 현재 성장하는 시장의 기회를 적극 공략하세요. 차별화된 콘텐츠로 포지셔닝을 확립하세요.",
      st: "핵심 강점을 내세워 경쟁 심화 속에서도 차별화 포인트를 유지하세요. 변화에 유연하게 대응하세요.",
      wo: "부족한 역량은 도구나 협업을 통해 보완하세요. 외부 기회를 활용해 성장하세요.",
      wt: "약점이 두드러지는 영역은 피하고, 강점이 빛나는 분야에 집중하세요.",
      recommendations: [
        "강점을 활용한 대표 콘텐츠 시리즈 기획",
        "약점 보완을 위한 도구/협업 탐색",
        "트렌드 모니터링으로 기회 포착",
      ],
    });
  } catch (error) {
    console.error("SWOT 분석 실패:", error);
    return NextResponse.json(
      {
        summary: "분석이 완료되었습니다.",
        so: "강점을 활용해 기회를 극대화하세요.",
        st: "강점으로 위협에 대응하세요.",
        wo: "기회를 통해 약점을 보완하세요.",
        wt: "약점과 위협이 겹치는 영역은 피하세요.",
      },
      { status: 200 }
    );
  }
}
