interface Props {
  likes: { before: number; after: number };
  comments: { before: number; after: number };
  followers: { before: number; after: number };
}

export default function GrowthStats({ likes, comments, followers }: Props) {
  const stats = [
    { label: "좋아요", icon: "❤️", ...likes },
    { label: "댓글", icon: "💬", ...comments },
    { label: "팔로워", icon: "👥", ...followers },
  ].filter((s) => s.after > 0); // 수치가 있는 것만 표시

  if (stats.length === 0) return null;

  return (
    <div className="space-y-2">
      <p className="text-small text-primary-500 font-medium">📈 성장 기록</p>
      <div className="space-y-1">
        {stats.map((stat) => {
          const growth = stat.after - stat.before;
          const percent =
            stat.before > 0 ? Math.round((growth / stat.before) * 100) : 0;

          return (
            <div
              key={stat.label}
              className="flex items-center justify-between text-small"
            >
              <span className="text-primary-400">
                {stat.icon} {stat.label}
              </span>
              <span className="text-white">
                {stat.before.toLocaleString()} → {stat.after.toLocaleString()}
                {growth > 0 && (
                  <span className="text-green-400 ml-2">+{percent}%</span>
                )}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
