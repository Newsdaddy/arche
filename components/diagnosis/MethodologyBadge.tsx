"use client";

import { Framework } from "@/types/diagnosis";
import { FRAMEWORK_NAMES, FRAMEWORK_ICONS } from "@/lib/diagnosis/questions";
import { METHODOLOGIES } from "@/lib/diagnosis/methodologies";

interface MethodologyBadgeProps {
  framework: Framework;
  size?: "sm" | "md" | "lg";
  showTooltip?: boolean;
  showIcon?: boolean;
}

export default function MethodologyBadge({
  framework,
  size = "md",
  showTooltip = false,
  showIcon = true,
}: MethodologyBadgeProps) {
  const methodology = METHODOLOGIES[framework];
  const name = FRAMEWORK_NAMES[framework];
  const icon = FRAMEWORK_ICONS[framework];

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-1.5",
  };

  const frameworkColors: Record<Framework, string> = {
    swot: "bg-blue-50 text-blue-700 border-blue-200",
    hero: "bg-purple-50 text-purple-700 border-purple-200",
    enneagram: "bg-pink-50 text-pink-700 border-pink-200",
    vpc: "bg-green-50 text-green-700 border-green-200",
    ikigai: "bg-amber-50 text-amber-700 border-amber-200",
  };

  return (
    <div className="relative group inline-block">
      <span
        className={`inline-flex items-center gap-1 rounded-full border font-medium ${sizeClasses[size]} ${frameworkColors[framework]}`}
      >
        {showIcon && <span>{icon}</span>}
        <span>{name}</span>
      </span>

      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 pointer-events-none">
          <div className="font-semibold mb-1">{methodology.fullName}</div>
          <div className="text-gray-300 text-xs mb-2">
            {methodology.source}
          </div>
          <div className="text-gray-100">{methodology.description}</div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
        </div>
      )}
    </div>
  );
}
