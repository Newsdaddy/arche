"use client";

import { useState } from "react";
import { ShowcasePlatform, CreateShowcaseInput } from "@/types/showcase";
import Button from "@/components/ui/Button";

interface Props {
  onSubmit: (data: CreateShowcaseInput) => Promise<void>;
  onCancel: () => void;
}

const PLATFORMS: { id: ShowcasePlatform; name: string; placeholder: string }[] =
  [
    {
      id: "instagram",
      name: "Instagram",
      placeholder: "https://instagram.com/p/...",
    },
    {
      id: "youtube",
      name: "YouTube",
      placeholder: "https://youtube.com/watch?v=...",
    },
    { id: "x", name: "X (Twitter)", placeholder: "https://x.com/.../status/..." },
    {
      id: "tiktok",
      name: "TikTok",
      placeholder: "https://tiktok.com/@.../video/...",
    },
  ];

export default function ShowcaseForm({ onSubmit, onCancel }: Props) {
  const [platform, setPlatform] = useState<ShowcasePlatform>("instagram");
  const [postUrl, setPostUrl] = useState("");
  const [comment, setComment] = useState("");
  const [stats, setStats] = useState({
    likes_before: "",
    likes_after: "",
    comments_before: "",
    comments_after: "",
    followers_before: "",
    followers_after: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const currentPlatform = PLATFORMS.find((p) => p.id === platform);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!postUrl) {
      setError("게시물 URL을 입력해주세요");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        platform,
        post_url: postUrl,
        likes_before: parseInt(stats.likes_before) || 0,
        likes_after: parseInt(stats.likes_after) || 0,
        comments_before: parseInt(stats.comments_before) || 0,
        comments_after: parseInt(stats.comments_after) || 0,
        followers_before: parseInt(stats.followers_before) || 0,
        followers_after: parseInt(stats.followers_after) || 0,
        comment: comment || undefined,
      });
    } catch {
      setError("등록에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateStat = (key: keyof typeof stats, value: string) => {
    setStats((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 플랫폼 선택 */}
      <div>
        <label className="text-small text-primary-400 block mb-2">
          플랫폼
        </label>
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
      </div>

      {/* 성장 수치 */}
      <div>
        <label className="text-small text-primary-400 block mb-2">
          📊 성장 수치 (선택)
        </label>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "좋아요", before: "likes_before", after: "likes_after" },
            {
              label: "댓글",
              before: "comments_before",
              after: "comments_after",
            },
            {
              label: "팔로워",
              before: "followers_before",
              after: "followers_after",
            },
          ].map(({ label, before, after }) => (
            <div key={label} className="space-y-2">
              <p className="text-small text-primary-500">{label}</p>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="이전"
                  min="0"
                  value={stats[before as keyof typeof stats]}
                  onChange={(e) =>
                    updateStat(before as keyof typeof stats, e.target.value)
                  }
                  className="w-full px-2 py-2 bg-dark border border-white/10 rounded-lg text-white text-small focus:border-white/30 focus:outline-none"
                />
                <input
                  type="number"
                  placeholder="현재"
                  min="0"
                  value={stats[after as keyof typeof stats]}
                  onChange={(e) =>
                    updateStat(after as keyof typeof stats, e.target.value)
                  }
                  className="w-full px-2 py-2 bg-dark border border-white/10 rounded-lg text-white text-small focus:border-white/30 focus:outline-none"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 한 줄 소감 */}
      <div>
        <label className="text-small text-primary-400 block mb-2">
          💬 한 줄 소감 (선택)
        </label>
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="이 콘텐츠로 어떤 성과를 얻었나요?"
          maxLength={100}
          className="w-full px-4 py-3 bg-dark border border-white/20 rounded-xl text-white placeholder-primary-600 focus:border-white/50 focus:outline-none"
        />
        <p className="text-caption text-primary-600 mt-1">
          {comment.length}/100
        </p>
      </div>

      {error && <p className="text-red-400 text-small">{error}</p>}

      {/* 버튼 */}
      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting} fullWidth>
          {isSubmitting ? "등록 중..." : "성과 공유하기"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          취소
        </Button>
      </div>
    </form>
  );
}
