// ==================== Health Score ====================

export type HealthGrade = 'excellent' | 'good' | 'poor' | 'critical';

export interface HealthScoreFactors {
  taskSubmissionRate: number;     // 0-100
  lectureCompletion: number;      // 0-100
  schedulingConsistency: number;  // 0-100
  qaParticipation: number;        // 0-100
  reviewSatisfaction: number;     // 0-100
}

export interface HealthScore {
  score: number;
  grade: HealthGrade;
  factors: HealthScoreFactors;
}

// ==================== Members ====================

export interface AdminMember {
  id: string;
  email: string;
  fullName: string | null;
  socialChannels: string[];
  createdAt: string;
  onboardingCompleted: boolean;
  totalUploads: number;
  customerType: 'free' | 'paid' | 'consulting';
}

// ==================== Paid Members ====================

export interface AdminPaidMember extends AdminMember {
  subscription: {
    plan: 'pro' | 'consulting';
    status: 'active' | 'cancelled' | 'expired';
    currentPeriodStart: string;
    currentPeriodEnd: string;
  } | null;
  recentInquiries: CustomerInquiry[];
}

// ==================== Consulting ====================

export interface ConsultingClient extends AdminMember {
  customerType: 'consulting';
  consultingStartDate: string | null;
  consultingEndDate: string | null;
  currentMeetingNumber: number;
  totalTaskSubmissions: number;
  currentStreak: number;
  healthScore: HealthScore;
  lastMeetingDate: string | null;
  hasFinalReview: boolean;
}

export interface ConsultingClientDetail extends ConsultingClient {
  sessions: ConsultingSession[];
  taskSubmissions: TaskSubmission[];
  lectureProgress: LectureProgress[];
  inquiries: CustomerInquiry[];
}

export interface ConsultingSession {
  id: string;
  userId: string;
  meetingNumber: 1 | 2 | 3 | 4;
  meetingDate: string | null;
  meetingStatus: 'scheduled' | 'completed' | 'cancelled';
  materials: string[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

// ==================== Task Submissions ====================

export interface TaskSubmission {
  id: string;
  userId: string;
  submissionDate: string;
  submissionType: 'content_upload' | 'assignment';
  proofUrl: string | null;
  note: string | null;
  verified: boolean;
  createdAt: string;
}

// ==================== Lecture Progress ====================

export interface LectureProgress {
  id: string;
  userId: string;
  lectureId: string;
  lectureTitle: string;
  completed: boolean;
  completedAt: string | null;
  scheduledAt: string | null;
  createdAt: string;
}

// ==================== Customer Inquiries ====================

export type InquiryStatus = 'pending' | 'in_progress' | 'resolved';

export interface CustomerInquiry {
  id: string;
  userId: string;
  userFullName?: string;
  userEmail?: string;
  subject: string;
  message: string;
  status: InquiryStatus;
  adminResponse: string | null;
  respondedAt: string | null;
  createdAt: string;
}

// ==================== Customer Reviews ====================

export interface CustomerReview {
  id: string;
  userId: string;
  rating: 1 | 2 | 3 | 4 | 5;
  reviewText: string;
  isSatisfied: boolean;
  reviewType: 'mid_course' | 'final';
  createdAt: string;
}

// ==================== API Response Types ====================

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ConsultingClientSummary {
  total: number;
  inProgress: number;
  completed: number;
  needsAttention: number;
}

// ==================== Admin Stats ====================

export interface AdminStats {
  totalMembers: number;
  paidMembers: number;
  consultingClients: number;
  pendingInquiries: number;
}
