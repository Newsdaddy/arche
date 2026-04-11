import { DiagnosisResult, PreviewData } from "@/types/diagnosis";

// 아키타입별 "되고 싶은 모습" 매핑
const IDEAL_IMAGES: Record<string, string> = {
  warrior: "흔들리지 않는 나침반 - 어떤 폭풍에도 방향을 잃지 않는 존재",
  latestarter: "끊임없이 성장하는 나무 - 늦게 시작해도 더 깊이 뿌리내리는 사람",
  collector: "지식의 등대 - 복잡한 바다에서 명확한 방향을 비춰주는 안내자",
  connector: "마음의 다리 - 사람과 사람을 연결하는 따뜻한 존재",
  experimenter: "창조의 불꽃 - 새로운 가능성을 끊임없이 탐험하는 개척자",
  guide: "검증된 길잡이 - 확실한 방법으로 목표까지 안내하는 전문가",
};

// DiagnosisResult에서 PreviewData 추출
export function generatePreview(result: DiagnosisResult): PreviewData {
  const archetype = result.archetype;

  // 상위 3개 강점 추출
  const topStrengths = result.swot.strengths.slice(0, 3);

  // ICP 요약 (한 줄)
  const icpSummary =
    result.icp.summary ||
    `${result.icp.demographics} | ${result.icp.painPoints[0] || "성장을 원하는 사람들"}`;

  // Content Pillar 이름만
  const pillarNames = result.contentPillars.map((p) => p.name);

  // 되고 싶은 모습 (커스텀 또는 기본값)
  const idealImage = IDEAL_IMAGES[archetype.id] || archetype.tagline;

  return {
    archetypeId: archetype.id,
    archetypeName: archetype.name,
    archetypeEmoji: archetype.emoji,
    archetypeTagline: archetype.tagline,
    archetypeDescription: archetype.description,
    idealImage,
    topStrengths,
    icpSummary,
    pillarNames,
    diagnosisType: result.diagnosisType,
    createdAt: result.createdAt,
  };
}

// DB 결과에서 직접 PreviewData 생성 (전체 DiagnosisResult 없이)
export function generatePreviewFromDb(data: {
  id: string;
  archetype?: string;
  swot_data?: {
    strengths?: string[];
    weaknesses?: string[];
    opportunities?: string[];
    threats?: string[];
  };
  swot_strengths?: string[];
  icp_data?: {
    demographics?: string;
    painPoints?: string[];
    desires?: string[];
    summary?: string;
  };
  content_pillars?: Array<{ id: string; name: string; description: string }>;
  diagnosis_type?: "quick" | "deep";
  created_at: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}): PreviewData {
  const archetypeId = data.archetype || "warrior";

  // ARCHETYPES 정보 가져오기 (런타임에 import 피하기 위해 간단한 매핑 사용)
  const ARCHETYPE_INFO: Record<
    string,
    { name: string; emoji: string; tagline: string; description: string }
  > = {
    warrior: {
      name: "회복의 전사",
      emoji: "⚔️",
      tagline: "실패를 딛고 일어선 당신의 이야기가 가장 강력한 콘텐츠입니다",
      description:
        "큰 시련을 경험했지만 극복한 스토리를 가진 사람. 실패담과 회복 과정이 콘텐츠의 핵심.",
    },
    latestarter: {
      name: "늦깎이 도전자",
      emoji: "🌱",
      tagline: "늦었다고 생각할 때가 가장 빠른 때입니다",
      description:
        "남들보다 늦게 시작했지만 열정으로 성장 중인 사람. 성장 과정 자체가 콘텐츠.",
    },
    collector: {
      name: "지식 수집가",
      emoji: "📚",
      tagline: "깊이 있는 지식으로 인사이트를 전달합니다",
      description:
        "특정 분야에 깊은 전문성을 가진 사람. 지식 큐레이션과 분석이 강점.",
    },
    connector: {
      name: "공감의 연결자",
      emoji: "🤝",
      tagline: "사람들의 마음을 연결하는 다리가 됩니다",
      description:
        "사람들의 감정에 깊이 공감하고 연결하는 사람. 커뮤니티 빌딩에 강점.",
    },
    experimenter: {
      name: "창조적 실험가",
      emoji: "🎨",
      tagline: "새로운 시도와 독특한 관점이 나의 무기입니다",
      description:
        "끊임없이 새로운 것을 시도하는 사람. 실험과 창의적 접근이 콘텐츠의 핵심.",
    },
    guide: {
      name: "실용의 안내자",
      emoji: "🧭",
      tagline: "검증된 방법으로 확실한 길을 안내합니다",
      description:
        "실제로 효과가 검증된 방법을 공유하는 사람. 실용적 가이드가 강점.",
    },
  };

  const info = ARCHETYPE_INFO[archetypeId] || ARCHETYPE_INFO["warrior"];

  // SWOT strengths 추출
  const strengths =
    data.swot_data?.strengths || data.swot_strengths || [];
  const topStrengths = strengths.slice(0, 3);

  // ICP 요약
  const icp = data.icp_data || {};
  const icpSummary =
    icp.summary ||
    `${icp.demographics || "성장을 원하는"} | ${icp.painPoints?.[0] || "목표를 이루고 싶은 사람들"}`;

  // Content Pillars
  const pillars = data.content_pillars || [];
  const pillarNames = pillars.map((p) => p.name);

  return {
    archetypeId,
    archetypeName: info.name,
    archetypeEmoji: info.emoji,
    archetypeTagline: info.tagline,
    archetypeDescription: info.description,
    idealImage: IDEAL_IMAGES[archetypeId] || info.tagline,
    topStrengths,
    icpSummary,
    pillarNames,
    diagnosisType: data.diagnosis_type || "deep",
    createdAt: data.created_at,
  };
}
