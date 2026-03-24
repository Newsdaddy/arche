"use client";

interface StreakCounterProps {
  streak: number;
  totalUploads: number;
}

export default function StreakCounter({ streak, totalUploads }: StreakCounterProps) {
  return (
    <div className="flex gap-4">
      <div className="flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-lg">
        <span className="text-2xl">🔥</span>
        <div>
          <p className="text-small text-gray-600">연속</p>
          <p className="text-h2 text-accent font-bold">{streak}일</p>
        </div>
      </div>
      <div className="flex items-center gap-2 bg-success/10 px-4 py-2 rounded-lg">
        <span className="text-2xl">📝</span>
        <div>
          <p className="text-small text-gray-600">총 업로드</p>
          <p className="text-h2 text-success font-bold">{totalUploads}회</p>
        </div>
      </div>
    </div>
  );
}
