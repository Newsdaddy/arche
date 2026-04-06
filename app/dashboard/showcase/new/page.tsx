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

    // 성공시 대시보드로 이동
    router.push("/dashboard?showcase=success");
  };

  const handleCancel = () => {
    router.push("/dashboard");
  };

  return (
    <div className="flex-1 bg-dark min-h-screen">
      <div className="container-narrow section-sm">
        <div className="mb-8">
          <h1 className="text-h1 text-white mb-2">내 성과 공유하기</h1>
          <p className="text-body text-primary-400">
            자랑하고 싶은 콘텐츠의 성과를 공유하고, 커뮤니티의 응원을 받아보세요!
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
            <li>• 성장 수치는 정확하지 않아도 괜찮아요. 대략적인 수치도 OK!</li>
            <li>
              • 성과가 아직 없더라도, 첫 게시물을 공유해보세요. 응원을 받을 수
              있어요.
            </li>
            <li>• 공유한 콘텐츠는 랜딩 페이지에서 다른 회원들이 볼 수 있어요.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
