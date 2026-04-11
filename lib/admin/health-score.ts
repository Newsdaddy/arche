import { HealthScore, HealthGrade, HealthScoreFactors } from '@/types/admin';

const WEIGHTS = {
  taskSubmissionRate: 0.30,
  lectureCompletion: 0.20,
  schedulingConsistency: 0.15,
  qaParticipation: 0.15,
  reviewSatisfaction: 0.20,
};

export function calculateHealthScore(factors: HealthScoreFactors): HealthScore {
  const score = Math.round(
    factors.taskSubmissionRate * WEIGHTS.taskSubmissionRate +
    factors.lectureCompletion * WEIGHTS.lectureCompletion +
    factors.schedulingConsistency * WEIGHTS.schedulingConsistency +
    factors.qaParticipation * WEIGHTS.qaParticipation +
    factors.reviewSatisfaction * WEIGHTS.reviewSatisfaction
  );

  const grade = getGrade(score);

  return { score, grade, factors };
}

function getGrade(score: number): HealthGrade {
  if (score >= 80) return 'excellent';
  if (score >= 60) return 'good';
  if (score >= 40) return 'poor';
  return 'critical';
}

export function getGradeInfo(grade: HealthGrade) {
  const info = {
    excellent: { label: '매우 좋음', color: 'green', emoji: '🟢', bgClass: 'bg-green-100', textClass: 'text-green-600' },
    good: { label: '좋음', color: 'blue', emoji: '🔵', bgClass: 'bg-blue-100', textClass: 'text-blue-600' },
    poor: { label: '나쁨', color: 'yellow', emoji: '🟡', bgClass: 'bg-yellow-100', textClass: 'text-yellow-600' },
    critical: { label: '아주 나쁨', color: 'red', emoji: '🔴', bgClass: 'bg-red-100', textClass: 'text-red-600' },
  };
  return info[grade];
}

export function calculateTaskSubmissionRate(
  submissions: number,
  expectedDays: number
): number {
  if (expectedDays <= 0) return 0;
  return Math.min(100, Math.round((submissions / expectedDays) * 100));
}

export function calculateLectureCompletion(
  completed: number,
  total: number
): number {
  if (total <= 0) return 100;
  return Math.round((completed / total) * 100);
}

export function calculateSchedulingConsistency(
  sessions: { meetingDate: string | null; meetingStatus: string }[]
): number {
  const scheduled = sessions.filter(s => s.meetingDate !== null);
  if (scheduled.length === 0) return 100;

  const completed = sessions.filter(s => s.meetingStatus === 'completed');
  const onTimeRate = completed.length / scheduled.length;

  return Math.round(onTimeRate * 100);
}

export function calculateQaParticipation(
  inquiries: number,
  expectedMin: number = 2
): number {
  return Math.min(100, Math.round((inquiries / expectedMin) * 100));
}

export function calculateReviewSatisfaction(
  reviews: { rating: number; isSatisfied: boolean }[]
): number {
  if (reviews.length === 0) return 50;

  const satisfiedCount = reviews.filter(r => r.isSatisfied).length;
  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  const satisfactionScore = (satisfiedCount / reviews.length) * 50;
  const ratingScore = (avgRating / 5) * 50;

  return Math.round(satisfactionScore + ratingScore);
}

export function getDefaultHealthScore(): HealthScore {
  return {
    score: 50,
    grade: 'poor',
    factors: {
      taskSubmissionRate: 0,
      lectureCompletion: 0,
      schedulingConsistency: 100,
      qaParticipation: 0,
      reviewSatisfaction: 50,
    },
  };
}
