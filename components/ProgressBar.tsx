"use client";

interface ProgressBarProps {
  current: number;
  total: number;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  color?: "accent" | "success" | "warning";
}

export default function ProgressBar({
  current,
  total,
  showLabel = true,
  size = "md",
  color = "accent",
}: ProgressBarProps) {
  const percentage = Math.min((current / total) * 100, 100);

  const sizes = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };

  const colors = {
    accent: "bg-accent",
    success: "bg-success",
    warning: "bg-warning",
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-small text-gray-600">진행률</span>
          <span className="text-small font-semibold text-primary">
            {current}/{total} ({Math.round(percentage)}%)
          </span>
        </div>
      )}
      <div className={`w-full bg-secondary rounded-full ${sizes[size]} overflow-hidden`}>
        <div
          className={`${colors[color]} ${sizes[size]} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
