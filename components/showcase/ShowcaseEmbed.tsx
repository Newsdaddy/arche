"use client";

import { useState, useEffect } from "react";
import { ShowcasePlatform } from "@/types/showcase";

interface Props {
  platform: ShowcasePlatform;
  url: string;
}

export default function ShowcaseEmbed({ platform, url }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-dark-lighter">
        <div className="text-center text-primary-500 p-4">
          <p className="mb-2">콘텐츠를 불러올 수 없습니다</p>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white underline text-small hover:text-primary-300"
          >
            원본 보기 →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-dark-lighter z-10">
          <div className="animate-pulse text-primary-400">로딩 중...</div>
        </div>
      )}

      {platform === "instagram" && (
        <InstagramEmbed
          url={url}
          onLoad={() => setIsLoading(false)}
          onError={() => setHasError(true)}
        />
      )}

      {platform === "youtube" && (
        <YouTubeEmbed
          url={url}
          onLoad={() => setIsLoading(false)}
          onError={() => setHasError(true)}
        />
      )}

      {platform === "x" && (
        <XEmbed
          url={url}
          onLoad={() => setIsLoading(false)}
          onError={() => setHasError(true)}
        />
      )}

      {platform === "tiktok" && (
        <TikTokEmbed
          url={url}
          onLoad={() => setIsLoading(false)}
          onError={() => setHasError(true)}
        />
      )}
    </div>
  );
}

// Instagram 임베드
function InstagramEmbed({
  url,
  onLoad,
  onError,
}: {
  url: string;
  onLoad: () => void;
  onError: () => void;
}) {
  const postId = extractInstagramId(url);

  if (!postId) {
    onError();
    return null;
  }

  return (
    <iframe
      src={`https://www.instagram.com/p/${postId}/embed`}
      className="w-full h-full border-0"
      onLoad={onLoad}
      onError={onError}
      loading="lazy"
      allowTransparency
    />
  );
}

// YouTube 임베드
function YouTubeEmbed({
  url,
  onLoad,
  onError,
}: {
  url: string;
  onLoad: () => void;
  onError: () => void;
}) {
  const videoId = extractYouTubeId(url);

  if (!videoId) {
    onError();
    return null;
  }

  return (
    <iframe
      src={`https://www.youtube.com/embed/${videoId}`}
      className="w-full h-full border-0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      onLoad={onLoad}
      onError={onError}
      loading="lazy"
    />
  );
}

// X (Twitter) 임베드
function XEmbed({
  url,
  onLoad,
  onError,
}: {
  url: string;
  onLoad: () => void;
  onError: () => void;
}) {
  useEffect(() => {
    // Twitter Widget 스크립트 로드
    const script = document.createElement("script");
    script.src = "https://platform.twitter.com/widgets.js";
    script.async = true;
    script.onload = () => {
      // @ts-expect-error - Twitter widget global
      if (window.twttr) {
        // @ts-expect-error - Twitter widget global
        window.twttr.widgets.load();
      }
      onLoad();
    };
    script.onerror = onError;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [onLoad, onError]);

  return (
    <div className="w-full h-full overflow-auto p-2 flex items-center justify-center">
      <blockquote className="twitter-tweet" data-theme="dark">
        <a href={url}>트윗 로딩 중...</a>
      </blockquote>
    </div>
  );
}

// TikTok 임베드
function TikTokEmbed({
  url,
  onLoad,
  onError,
}: {
  url: string;
  onLoad: () => void;
  onError: () => void;
}) {
  const videoId = extractTikTokId(url);

  if (!videoId) {
    onError();
    return null;
  }

  return (
    <iframe
      src={`https://www.tiktok.com/embed/v2/${videoId}`}
      className="w-full h-full border-0"
      onLoad={onLoad}
      onError={onError}
      loading="lazy"
      allowFullScreen
    />
  );
}

// URL 파싱 헬퍼
function extractInstagramId(url: string): string {
  const match = url.match(/\/(p|reel)\/([\w-]+)/);
  return match?.[2] || "";
}

function extractYouTubeId(url: string): string {
  // youtube.com/watch?v=ID, youtu.be/ID, youtube.com/shorts/ID
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([\w-]+)/
  );
  return match?.[1] || "";
}

function extractTikTokId(url: string): string {
  const match = url.match(/video\/(\d+)/);
  return match?.[1] || "";
}
