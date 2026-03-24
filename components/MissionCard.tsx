"use client";

import { Mission } from "@/types";
import Card, { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./ui/Card";
import Button from "./ui/Button";

interface MissionCardProps {
  mission: Mission;
  isCompleted?: boolean;
  isCurrent?: boolean;
  onStart?: () => void;
  onView?: () => void;
}

export default function MissionCard({
  mission,
  isCompleted = false,
  isCurrent = false,
  onStart,
  onView,
}: MissionCardProps) {
  return (
    <Card
      className={`${isCurrent ? "border-accent border-2" : ""} ${isCompleted ? "bg-gray-50" : ""}`}
      hoverable={!isCompleted}
      onClick={onView}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <span className="text-small text-accent font-semibold">
            Week {mission.week} - Day {mission.day}
          </span>
          {isCompleted && (
            <span className="bg-success/10 text-success text-small px-2 py-1 rounded-full">
              완료
            </span>
          )}
          {isCurrent && !isCompleted && (
            <span className="bg-accent/10 text-accent text-small px-2 py-1 rounded-full">
              오늘의 미션
            </span>
          )}
        </div>
        <CardTitle className={isCompleted ? "text-gray-400" : ""}>{mission.title}</CardTitle>
        <CardDescription>{mission.description}</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex items-center gap-4 text-small text-gray-500">
          <span>예상 시간: {mission.estimatedTime}</span>
        </div>
      </CardContent>

      {isCurrent && !isCompleted && onStart && (
        <CardFooter>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onStart();
            }}
            fullWidth
          >
            미션 시작하기
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
