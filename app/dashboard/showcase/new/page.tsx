"use client";

import { useRouter } from "next/navigation";
import { ShowcaseForm } from "@/components/showcase";
import { CreateShowcaseInput } from "@/types/showcase";
import Card, { CardContent } from "@/components/ui/Card";

export default function NewShowcasePage() {
  const router = useRouter();

  const handleSubmit = async (data: CreateShowcaseInput) => {
    const res = await fetch("/api/showcases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (result.error) {
      throw new Error(result.error);
    }

    // 랭킹 정보 반환
    return result.ranking;
  };

  const handleCancel = () => {
    router.push("/dashboard");
  };

  return (
    <div className="flex-1 bg-dark min-h-screen">
      <div className="container-narrow section-sm">
        <div className="mb-8">
          <h1 className="text-h1 text-white mb-2">내 콘텐츠 등록</h1>
          <p className="text-body text-primary-400">
            콘텐츠 링크와 실적을 입력하면 커뮤니티 랭킹에 등록됩니다!
          </p>
        </div>

        <Card variant="elevated" className="border border-white/10">
          <CardContent>
            <ShowcaseForm onSubmit={handleSubmit} onCancel={handleCancel} />
          </CardContent>
        </Card>

        <div className="mt-6 p-4 bg-dark-lighter rounded-xl border border-white/10">
          <p className="text-small text-primary-500 mb-2">💡 팁</p>
          <ul className="text-small text-primary-400 space-y-1">
            <li>• 게시물 링크를 입력하면 제목이 자동으로 가져와집니다</li>
            <li>• 좋아요와 댓글 수를 정확히 입력해주세요</li>
            <li>• 전체 회원 중 몇 등인지 바로 확인할 수 있어요!</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
