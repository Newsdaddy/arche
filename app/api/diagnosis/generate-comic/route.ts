import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ComicScene } from "@/types/diagnosis";

// Gemini API for image generation
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }

    const { comicScenes, resultId } = await request.json();

    if (!comicScenes || !Array.isArray(comicScenes) || comicScenes.length !== 4) {
      return NextResponse.json({ error: "4개의 장면이 필요합니다." }, { status: 400 });
    }

    // Gemini API 키 확인
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY not configured");
      return NextResponse.json(
        { error: "이미지 생성 서비스가 설정되지 않았습니다." },
        { status: 500 }
      );
    }

    // 4개의 이미지 생성
    const images: string[] = [];

    for (let i = 0; i < comicScenes.length; i++) {
      const scene = comicScenes[i] as ComicScene;

      const prompt = `Create a simple, clean illustration for a 4-panel comic.
Panel ${i + 1} of 4.

Scene: ${scene.scene}
Emotion to convey: ${scene.emotion}
Visual elements: ${scene.visualElements.join(", ")}

Style guidelines:
- Minimalist, warm illustration style
- Single adult character, professional appearance
- Soft, muted color palette with one accent color
- No text, speech bubbles, or watermarks
- Clean background, focus on the character and emotion
- Korean webtoon inspired aesthetic
- Suitable for a personal branding context`;

      try {
        const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
            generationConfig: {
              responseModalities: ["image", "text"],
            },
          }),
        });

        if (!response.ok) {
          const errorData = await response.text();
          console.error(`Gemini API error for panel ${i + 1}:`, errorData);
          // 실패 시 플레이스홀더 이미지 사용
          images.push(generatePlaceholderImage(i + 1, scene.emotion));
          continue;
        }

        const data = await response.json();

        // 이미지 데이터 추출
        const imageData = data.candidates?.[0]?.content?.parts?.find(
          (part: { inlineData?: { mimeType: string; data: string } }) => part.inlineData?.mimeType?.startsWith("image/")
        )?.inlineData;

        if (imageData) {
          images.push(`data:${imageData.mimeType};base64,${imageData.data}`);
        } else {
          // 이미지가 없으면 플레이스홀더 사용
          images.push(generatePlaceholderImage(i + 1, scene.emotion));
        }
      } catch (error) {
        console.error(`Error generating panel ${i + 1}:`, error);
        images.push(generatePlaceholderImage(i + 1, scene.emotion));
      }
    }

    // 결과 저장 (선택적)
    if (resultId) {
      await supabase
        .from("persona_results")
        .update({ comic_images: images })
        .eq("id", resultId)
        .eq("user_id", user.id);
    }

    return NextResponse.json({ success: true, images });
  } catch (error) {
    console.error("Comic generation error:", error);
    return NextResponse.json(
      { error: "이미지 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// 플레이스홀더 이미지 생성 (SVG)
function generatePlaceholderImage(panelNumber: number, emotion: string): string {
  const colors = ["#FFB3BA", "#BAFFC9", "#BAE1FF", "#FFFFBA"];
  const color = colors[(panelNumber - 1) % colors.length];

  const svg = `
    <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <rect width="512" height="512" fill="${color}"/>
      <circle cx="256" cy="200" r="80" fill="#fff" opacity="0.8"/>
      <rect x="176" y="300" width="160" height="120" rx="20" fill="#fff" opacity="0.8"/>
      <text x="256" y="460" font-family="Arial" font-size="24" fill="#666" text-anchor="middle">
        Panel ${panelNumber}: ${emotion}
      </text>
    </svg>
  `.trim();

  const base64 = Buffer.from(svg).toString("base64");
  return `data:image/svg+xml;base64,${base64}`;
}
