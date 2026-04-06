"use client";

import { useState } from "react";
import { ShowcasePlatform, CreateShowcaseInput } from "@/types/showcase";
import Button from "@/components/ui/Button";

interface Props {
  onSubmit: (data: CreateShowcaseInput) => Promise<{ rank: number; total: number } | void>;
  onCancel: () => void;
}

const PLATFORMS: { id: ShowcasePlatform; name: string; placeholder: string }[] = [
  { id: "threads", name: "Threads", placeholder: "https://threads.net/@.../post/..." },
  { id: "linkedin", name: "LinkedIn", placeholder: "https://linkedin.com/posts/..." },
  { id: "instagram", name: "Instagram", placeholder: "https://instagram.com/p/..." },
  { id: "youtube", name: "YouTube", placeholder: "https://youtube.com/watch?v=..." },
  { id: "x", name: "X", placeholder: "https://x.com/.../status/..." },
  { id: "tiktok", name: "TikTok", placeholder: "https://tiktok.com/@.../video/..." },
];

export default function ShowcaseForm({ onSubmit, onCancel }: Props) {
  const [platform, setPlatform] = useState<ShowcasePlatform>("threads");
  const [postUrl, setPostUrl] = useState("");
  const [likes, setLikes] = useState("");
  const [comments, setComments] = useState("");
  const [cohort, setCohort] = useState("");
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ rank: number; total: number } | null>(null);

  const currentPlatform = PLATFORMS.find((p) => p.id === platform);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!postUrl) {
      setError("게시물 URL을 입력해주세요");
      return;
    }

    if (!likes) {
      setError("좋아요 수를 입력해주세요");
      return;
    }

    setIsSubmitting(true);
    try {
      const ranking = await onSubmit({
        platform,
        post_url: postUrl,
        likes: parseInt(likes) || 0,
        comments: parseInt(comments) || 0,
        cohort: cohort || undefined,
        name: name || undefined,
        nickname: nickname || undefined,
      });

      if (ranking) {
        setResult(ranking);
      }
    } catch {
      setError("등록에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 결과 화면
  if (result) {
    return (
      <div className="text-center py-8 space-y-6">
        <div className="text-6xl">🎉</div>
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">등록 완료!</h3>
          <p className="text-primary-400">
            총 <span className="text-white font-bold">{result.total}명</span> 중{" "}
            <span className="text-accent font-bold text-xl">{result.rank}등</span>입니다!
          </p>
        </div>
        <div className="flex gap-3 justify-center">
          <Button onClick={onCancel}>대시보드로 이동</Button>
          <Button
            variant="outline"
            onClick={() => {
              setResult(null);
              setPostUrl("");
              setLikes("");
              setComments("");
              setCohort("");
              setName("");
              setNickname("");
            }}
          >
            하나 더 등록
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 플랫폼 선택 */}
      <div>
        <label className="text-small text-primary-400 block mb-2">플랫폼</label>
        <div className="flex flex-wrap gap-2">
          {PLATFORMS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPlatform(p.id)}
              className={`px-4 py-2 rounded-xl text-body transition-colors ${
                platform === p.id
                  ? "bg-white text-dark"
                  : "bg-dark text-primary-400 border border-white/10 hover:border-white/30"
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* 제출자 정보 */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="text-small text-primary-400 block mb-2">기수</label>
          <input
            type="text"
            value={cohort}
            onChange={(e) => setCohort(e.target.value)}
            placeholder="1기"
            className="w-full px-4 py-3 bg-dark border border-white/20 rounded-xl text-white placeholder-primary-600 focus:border-white/50 focus:outline-none"
          />
        </div>
        <div>
          <label className="text-small text-primary-400 block mb-2">이름</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="홍길동"
            className="w-full px-4 py-3 bg-dark border border-white/20 rounded-xl text-white placeholder-primary-600 focus:border-white/50 focus:outline-none"
          />
        </div>
        <div>
          <label className="text-small text-primary-400 block mb-2">닉네임</label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="길동이"
            className="w-full px-4 py-3 bg-dark border border-white/20 rounded-xl text-white placeholder-primary-600 focus:border-white/50 focus:outline-none"
          />
        </div>
      </div>

      {/* URL 입력 */}
      <div>
        <label className="text-small text-primary-400 block mb-2">
          게시물 URL
        </label>
        <input
          type="url"
          value={postUrl}
          onChange={(e) => setPostUrl(e.target.value)}
          placeholder={currentPlatform?.placeholder}
          className="w-full px-4 py-3 bg-dark border border-white/20 rounded-xl text-white placeholder-primary-600 focus:border-white/50 focus:outline-none"
        />
        <p className="text-xs text-primary-600 mt-1">
          제목은 자동으로 가져옵니다
        </p>
      </div>

      {/* 실적 입력 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-small text-primary-400 block mb-2">
            ❤️ 좋아요 수
          </label>
          <input
            type="number"
            min="0"
            value={likes}
            onChange={(e) => setLikes(e.target.value)}
            placeholder="1234"
            className="w-full px-4 py-3 bg-dark border border-white/20 rounded-xl text-white placeholder-primary-600 focus:border-white/50 focus:outline-none"
          />
        </div>
        <div>
          <label className="text-small text-primary-400 block mb-2">
            💬 댓글 수
          </label>
          <input
            type="number"
            min="0"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="56"
            className="w-full px-4 py-3 bg-dark border border-white/20 rounded-xl text-white placeholder-primary-600 focus:border-white/50 focus:outline-none"
          />
        </div>
      </div>

      {error && <p className="text-red-400 text-small">{error}</p>}

      {/* 버튼 */}
      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting} fullWidth>
          {isSubmitting ? "등록 중..." : "내 콘텐츠 등록하기"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          취소
        </Button>
      </div>
    </form>
  );
}
