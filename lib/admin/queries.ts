import { createClient } from '@/lib/supabase/client';
import {
  AdminMember,
  AdminPaidMember,
  ConsultingClient,
  ConsultingClientDetail,
  ConsultingSession,
  TaskSubmission,
  CustomerInquiry,
  LectureProgress,
  CustomerReview,
  AdminStats,
  HealthScoreFactors,
} from '@/types/admin';
import {
  calculateHealthScore,
  calculateTaskSubmissionRate,
  calculateLectureCompletion,
  calculateSchedulingConsistency,
  calculateQaParticipation,
  calculateReviewSatisfaction,
} from './health-score';

// ==================== Admin Stats ====================

export async function getAdminStats(): Promise<AdminStats> {
  const supabase = createClient();

  const [
    { count: totalMembers },
    { count: paidMembers },
    { count: consultingClients },
    { count: pendingInquiries },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).in('customer_type', ['paid', 'consulting']),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('customer_type', 'consulting'),
    supabase.from('customer_inquiries').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
  ]);

  return {
    totalMembers: totalMembers || 0,
    paidMembers: paidMembers || 0,
    consultingClients: consultingClients || 0,
    pendingInquiries: pendingInquiries || 0,
  };
}

// ==================== Members ====================

export async function getMembers(options?: {
  page?: number;
  limit?: number;
  search?: string;
  onboarding?: 'completed' | 'pending';
}): Promise<{ members: AdminMember[]; total: number }> {
  const supabase = createClient();
  const page = options?.page || 1;
  const limit = options?.limit || 10;
  const offset = (page - 1) * limit;

  let query = supabase
    .from('profiles')
    .select('id, email, full_name, social_channels, created_at, onboarding_completed, total_uploads, customer_type', { count: 'exact' });

  if (options?.search) {
    query = query.or(`email.ilike.%${options.search}%,full_name.ilike.%${options.search}%`);
  }

  if (options?.onboarding === 'completed') {
    query = query.eq('onboarding_completed', true);
  } else if (options?.onboarding === 'pending') {
    query = query.eq('onboarding_completed', false);
  }

  const { data, count, error } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('회원 목록 조회 실패:', error);
    return { members: [], total: 0 };
  }

  const members: AdminMember[] = (data || []).map((row) => ({
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    socialChannels: row.social_channels || [],
    createdAt: row.created_at,
    onboardingCompleted: row.onboarding_completed,
    totalUploads: row.total_uploads || 0,
    customerType: row.customer_type || 'free',
  }));

  return { members, total: count || 0 };
}

// ==================== Paid Members ====================

export async function getPaidMembers(options?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<{ members: AdminPaidMember[]; total: number }> {
  const supabase = createClient();
  const page = options?.page || 1;
  const limit = options?.limit || 10;
  const offset = (page - 1) * limit;

  let query = supabase
    .from('profiles')
    .select('id, email, full_name, social_channels, created_at, onboarding_completed, total_uploads, customer_type', { count: 'exact' })
    .in('customer_type', ['paid', 'consulting']);

  if (options?.search) {
    query = query.or(`email.ilike.%${options.search}%,full_name.ilike.%${options.search}%`);
  }

  const { data, count, error } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('유료 회원 목록 조회 실패:', error);
    return { members: [], total: 0 };
  }

  const memberIds = (data || []).map((row) => row.id);

  // 구독 정보 조회
  const { data: subscriptions } = await supabase
    .from('subscriptions')
    .select('*')
    .in('user_id', memberIds);

  // 최근 문의 조회
  const { data: inquiries } = await supabase
    .from('customer_inquiries')
    .select('*')
    .in('user_id', memberIds)
    .order('created_at', { ascending: false })
    .limit(5);

  const subscriptionMap = new Map(subscriptions?.map((s) => [s.user_id, s]));
  const inquiryMap = new Map<string, CustomerInquiry[]>();
  inquiries?.forEach((inq) => {
    const list = inquiryMap.get(inq.user_id) || [];
    list.push({
      id: inq.id,
      userId: inq.user_id,
      subject: inq.subject,
      message: inq.message,
      status: inq.status,
      adminResponse: inq.admin_response,
      respondedAt: inq.responded_at,
      createdAt: inq.created_at,
    });
    inquiryMap.set(inq.user_id, list);
  });

  const members: AdminPaidMember[] = (data || []).map((row) => {
    const sub = subscriptionMap.get(row.id);
    return {
      id: row.id,
      email: row.email,
      fullName: row.full_name,
      socialChannels: row.social_channels || [],
      createdAt: row.created_at,
      onboardingCompleted: row.onboarding_completed,
      totalUploads: row.total_uploads || 0,
      customerType: row.customer_type || 'paid',
      subscription: sub ? {
        plan: sub.plan,
        status: sub.status,
        currentPeriodStart: sub.current_period_start,
        currentPeriodEnd: sub.current_period_end,
      } : null,
      recentInquiries: inquiryMap.get(row.id) || [],
    };
  });

  return { members, total: count || 0 };
}

// ==================== Consulting Clients ====================

export async function getConsultingClients(options?: {
  sortBy?: 'healthScore' | 'name' | 'createdAt';
  order?: 'asc' | 'desc';
}): Promise<{ clients: ConsultingClient[]; summary: { total: number; inProgress: number; completed: number; needsAttention: number } }> {
  const supabase = createClient();

  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('customer_type', 'consulting')
    .order('created_at', { ascending: false });

  if (error || !profiles) {
    console.error('상담 고객 조회 실패:', error);
    return { clients: [], summary: { total: 0, inProgress: 0, completed: 0, needsAttention: 0 } };
  }

  const userIds = profiles.map((p) => p.id);

  // 미팅 세션 조회
  const { data: sessions } = await supabase
    .from('consulting_sessions')
    .select('*')
    .in('user_id', userIds);

  // 과제 제출 조회
  const { data: taskSubmissions } = await supabase
    .from('task_submissions')
    .select('*')
    .in('user_id', userIds);

  // 강의 진행 조회
  const { data: lectureProgress } = await supabase
    .from('lecture_progress')
    .select('*')
    .in('user_id', userIds);

  // 문의 조회
  const { data: inquiries } = await supabase
    .from('customer_inquiries')
    .select('*')
    .in('user_id', userIds);

  // 후기 조회
  const { data: reviews } = await supabase
    .from('customer_reviews')
    .select('*')
    .in('user_id', userIds);

  const sessionMap = new Map<string, ConsultingSession[]>();
  sessions?.forEach((s) => {
    const list = sessionMap.get(s.user_id) || [];
    list.push({
      id: s.id,
      userId: s.user_id,
      meetingNumber: s.meeting_number,
      meetingDate: s.meeting_date,
      meetingStatus: s.meeting_status,
      materials: s.materials || [],
      notes: s.notes || '',
      createdAt: s.created_at,
      updatedAt: s.updated_at,
    });
    sessionMap.set(s.user_id, list);
  });

  const taskMap = new Map<string, TaskSubmission[]>();
  taskSubmissions?.forEach((t) => {
    const list = taskMap.get(t.user_id) || [];
    list.push({
      id: t.id,
      userId: t.user_id,
      submissionDate: t.submission_date,
      submissionType: t.submission_type,
      proofUrl: t.proof_url,
      note: t.note,
      verified: t.verified,
      createdAt: t.created_at,
    });
    taskMap.set(t.user_id, list);
  });

  const lectureMap = new Map<string, LectureProgress[]>();
  lectureProgress?.forEach((l) => {
    const list = lectureMap.get(l.user_id) || [];
    list.push({
      id: l.id,
      userId: l.user_id,
      lectureId: l.lecture_id,
      lectureTitle: l.lecture_title,
      completed: l.completed,
      completedAt: l.completed_at,
      scheduledAt: l.scheduled_at,
      createdAt: l.created_at,
    });
    lectureMap.set(l.user_id, list);
  });

  const inquiryMap = new Map<string, CustomerInquiry[]>();
  inquiries?.forEach((i) => {
    const list = inquiryMap.get(i.user_id) || [];
    list.push({
      id: i.id,
      userId: i.user_id,
      subject: i.subject,
      message: i.message,
      status: i.status,
      adminResponse: i.admin_response,
      respondedAt: i.responded_at,
      createdAt: i.created_at,
    });
    inquiryMap.set(i.user_id, list);
  });

  const reviewMap = new Map<string, CustomerReview[]>();
  reviews?.forEach((r) => {
    const list = reviewMap.get(r.user_id) || [];
    list.push({
      id: r.id,
      userId: r.user_id,
      rating: r.rating,
      reviewText: r.review_text,
      isSatisfied: r.is_satisfied,
      reviewType: r.review_type,
      createdAt: r.created_at,
    });
    reviewMap.set(r.user_id, list);
  });

  const clients: ConsultingClient[] = profiles.map((profile) => {
    const userSessions = sessionMap.get(profile.id) || [];
    const userTasks = taskMap.get(profile.id) || [];
    const userLectures = lectureMap.get(profile.id) || [];
    const userInquiries = inquiryMap.get(profile.id) || [];
    const userReviews = reviewMap.get(profile.id) || [];

    // Health Score 계산
    const startDate = profile.consulting_start_date ? new Date(profile.consulting_start_date) : new Date();
    const today = new Date();
    const daysSinceStart = Math.max(1, Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));

    const factors: HealthScoreFactors = {
      taskSubmissionRate: calculateTaskSubmissionRate(userTasks.length, daysSinceStart),
      lectureCompletion: calculateLectureCompletion(
        userLectures.filter((l) => l.completed).length,
        userLectures.length || 8 // 기본 8개 강의
      ),
      schedulingConsistency: calculateSchedulingConsistency(userSessions),
      qaParticipation: calculateQaParticipation(userInquiries.length),
      reviewSatisfaction: calculateReviewSatisfaction(userReviews),
    };

    const healthScore = calculateHealthScore(factors);

    // 현재 미팅 회차
    const completedSessions = userSessions.filter((s) => s.meetingStatus === 'completed');
    const currentMeetingNumber = completedSessions.length;
    const lastCompletedSession = completedSessions.sort((a, b) =>
      new Date(b.meetingDate || 0).getTime() - new Date(a.meetingDate || 0).getTime()
    )[0];

    // 연속 제출일 계산
    let streak = 0;
    const sortedTasks = [...userTasks].sort((a, b) =>
      new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime()
    );
    if (sortedTasks.length > 0) {
      const todayStr = today.toISOString().split('T')[0];
      const checkDate = new Date(todayStr);
      for (const task of sortedTasks) {
        const taskDate = task.submissionDate;
        const checkDateStr = checkDate.toISOString().split('T')[0];
        if (taskDate === checkDateStr) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else if (taskDate < checkDateStr) {
          break;
        }
      }
    }

    return {
      id: profile.id,
      email: profile.email,
      fullName: profile.full_name,
      socialChannels: profile.social_channels || [],
      createdAt: profile.created_at,
      onboardingCompleted: profile.onboarding_completed,
      totalUploads: profile.total_uploads || 0,
      customerType: 'consulting' as const,
      consultingStartDate: profile.consulting_start_date,
      consultingEndDate: profile.consulting_end_date,
      currentMeetingNumber,
      totalTaskSubmissions: userTasks.length,
      currentStreak: streak,
      healthScore,
      lastMeetingDate: lastCompletedSession?.meetingDate || null,
      hasFinalReview: userSessions.some((s) => s.meetingNumber === 4 && s.meetingStatus === 'completed'),
    };
  });

  // 정렬
  if (options?.sortBy === 'healthScore') {
    clients.sort((a, b) => options.order === 'asc'
      ? a.healthScore.score - b.healthScore.score
      : b.healthScore.score - a.healthScore.score
    );
  } else if (options?.sortBy === 'name') {
    clients.sort((a, b) => {
      const nameA = a.fullName || a.email;
      const nameB = b.fullName || b.email;
      return options.order === 'asc'
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });
  }

  const summary = {
    total: clients.length,
    inProgress: clients.filter((c) => !c.hasFinalReview).length,
    completed: clients.filter((c) => c.hasFinalReview).length,
    needsAttention: clients.filter((c) => c.healthScore.score < 60).length,
  };

  return { clients, summary };
}

export async function getConsultingClientDetail(clientId: string): Promise<ConsultingClientDetail | null> {
  const supabase = createClient();

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', clientId)
    .eq('customer_type', 'consulting')
    .single();

  if (error || !profile) {
    console.error('상담 고객 상세 조회 실패:', error);
    return null;
  }

  const [
    { data: sessions },
    { data: tasks },
    { data: lectures },
    { data: inquiries },
    { data: reviews },
  ] = await Promise.all([
    supabase.from('consulting_sessions').select('*').eq('user_id', clientId).order('meeting_number'),
    supabase.from('task_submissions').select('*').eq('user_id', clientId).order('submission_date', { ascending: false }),
    supabase.from('lecture_progress').select('*').eq('user_id', clientId),
    supabase.from('customer_inquiries').select('*').eq('user_id', clientId).order('created_at', { ascending: false }),
    supabase.from('customer_reviews').select('*').eq('user_id', clientId),
  ]);

  const userSessions: ConsultingSession[] = (sessions || []).map((s) => ({
    id: s.id,
    userId: s.user_id,
    meetingNumber: s.meeting_number,
    meetingDate: s.meeting_date,
    meetingStatus: s.meeting_status,
    materials: s.materials || [],
    notes: s.notes || '',
    createdAt: s.created_at,
    updatedAt: s.updated_at,
  }));

  const userTasks: TaskSubmission[] = (tasks || []).map((t) => ({
    id: t.id,
    userId: t.user_id,
    submissionDate: t.submission_date,
    submissionType: t.submission_type,
    proofUrl: t.proof_url,
    note: t.note,
    verified: t.verified,
    createdAt: t.created_at,
  }));

  const userLectures: LectureProgress[] = (lectures || []).map((l) => ({
    id: l.id,
    userId: l.user_id,
    lectureId: l.lecture_id,
    lectureTitle: l.lecture_title,
    completed: l.completed,
    completedAt: l.completed_at,
    scheduledAt: l.scheduled_at,
    createdAt: l.created_at,
  }));

  const userInquiries: CustomerInquiry[] = (inquiries || []).map((i) => ({
    id: i.id,
    userId: i.user_id,
    subject: i.subject,
    message: i.message,
    status: i.status,
    adminResponse: i.admin_response,
    respondedAt: i.responded_at,
    createdAt: i.created_at,
  }));

  const userReviews: CustomerReview[] = (reviews || []).map((r) => ({
    id: r.id,
    userId: r.user_id,
    rating: r.rating,
    reviewText: r.review_text,
    isSatisfied: r.is_satisfied,
    reviewType: r.review_type,
    createdAt: r.created_at,
  }));

  // Health Score 계산
  const startDate = profile.consulting_start_date ? new Date(profile.consulting_start_date) : new Date();
  const today = new Date();
  const daysSinceStart = Math.max(1, Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));

  const factors: HealthScoreFactors = {
    taskSubmissionRate: calculateTaskSubmissionRate(userTasks.length, daysSinceStart),
    lectureCompletion: calculateLectureCompletion(
      userLectures.filter((l) => l.completed).length,
      userLectures.length || 8
    ),
    schedulingConsistency: calculateSchedulingConsistency(userSessions),
    qaParticipation: calculateQaParticipation(userInquiries.length),
    reviewSatisfaction: calculateReviewSatisfaction(userReviews),
  };

  const healthScore = calculateHealthScore(factors);

  const completedSessions = userSessions.filter((s) => s.meetingStatus === 'completed');
  const currentMeetingNumber = completedSessions.length;
  const lastCompletedSession = completedSessions.sort((a, b) =>
    new Date(b.meetingDate || 0).getTime() - new Date(a.meetingDate || 0).getTime()
  )[0];

  // 연속 제출일 계산
  let streak = 0;
  const sortedTasks = [...userTasks].sort((a, b) =>
    new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime()
  );
  if (sortedTasks.length > 0) {
    const todayStr = today.toISOString().split('T')[0];
    const checkDate = new Date(todayStr);
    for (const task of sortedTasks) {
      const taskDate = task.submissionDate;
      const checkDateStr = checkDate.toISOString().split('T')[0];
      if (taskDate === checkDateStr) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else if (taskDate < checkDateStr) {
        break;
      }
    }
  }

  return {
    id: profile.id,
    email: profile.email,
    fullName: profile.full_name,
    socialChannels: profile.social_channels || [],
    createdAt: profile.created_at,
    onboardingCompleted: profile.onboarding_completed,
    totalUploads: profile.total_uploads || 0,
    customerType: 'consulting',
    consultingStartDate: profile.consulting_start_date,
    consultingEndDate: profile.consulting_end_date,
    currentMeetingNumber,
    totalTaskSubmissions: userTasks.length,
    currentStreak: streak,
    healthScore,
    lastMeetingDate: lastCompletedSession?.meetingDate || null,
    hasFinalReview: userSessions.some((s) => s.meetingNumber === 4 && s.meetingStatus === 'completed'),
    sessions: userSessions,
    taskSubmissions: userTasks,
    lectureProgress: userLectures,
    inquiries: userInquiries,
  };
}

// ==================== Consulting Sessions ====================

export async function createConsultingSession(data: {
  userId: string;
  meetingNumber: 1 | 2 | 3 | 4;
  meetingDate?: string;
  materials?: string[];
  notes?: string;
}): Promise<ConsultingSession | null> {
  const supabase = createClient();

  const { data: session, error } = await supabase
    .from('consulting_sessions')
    .insert({
      user_id: data.userId,
      meeting_number: data.meetingNumber,
      meeting_date: data.meetingDate || null,
      materials: data.materials || [],
      notes: data.notes || '',
    })
    .select()
    .single();

  if (error) {
    console.error('미팅 세션 생성 실패:', error);
    return null;
  }

  return {
    id: session.id,
    userId: session.user_id,
    meetingNumber: session.meeting_number,
    meetingDate: session.meeting_date,
    meetingStatus: session.meeting_status,
    materials: session.materials || [],
    notes: session.notes || '',
    createdAt: session.created_at,
    updatedAt: session.updated_at,
  };
}

export async function updateConsultingSession(
  sessionId: string,
  data: Partial<{
    meetingDate: string;
    meetingStatus: 'scheduled' | 'completed' | 'cancelled';
    materials: string[];
    notes: string;
  }>
): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase
    .from('consulting_sessions')
    .update({
      meeting_date: data.meetingDate,
      meeting_status: data.meetingStatus,
      materials: data.materials,
      notes: data.notes,
    })
    .eq('id', sessionId);

  if (error) {
    console.error('미팅 세션 업데이트 실패:', error);
    return false;
  }

  return true;
}

// ==================== Inquiries ====================

export async function getInquiries(options?: {
  status?: 'pending' | 'in_progress' | 'resolved';
  page?: number;
  limit?: number;
}): Promise<{ inquiries: CustomerInquiry[]; total: number }> {
  const supabase = createClient();
  const page = options?.page || 1;
  const limit = options?.limit || 20;
  const offset = (page - 1) * limit;

  let query = supabase
    .from('customer_inquiries')
    .select(`
      *,
      profiles!inner(email, full_name)
    `, { count: 'exact' });

  if (options?.status) {
    query = query.eq('status', options.status);
  }

  const { data, count, error } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('문의 목록 조회 실패:', error);
    return { inquiries: [], total: 0 };
  }

  const inquiries: CustomerInquiry[] = (data || []).map((row: {
    id: string;
    user_id: string;
    subject: string;
    message: string;
    status: 'pending' | 'in_progress' | 'resolved';
    admin_response: string | null;
    responded_at: string | null;
    created_at: string;
    profiles: { email: string; full_name: string | null };
  }) => ({
    id: row.id,
    userId: row.user_id,
    userFullName: row.profiles?.full_name || undefined,
    userEmail: row.profiles?.email,
    subject: row.subject,
    message: row.message,
    status: row.status,
    adminResponse: row.admin_response,
    respondedAt: row.responded_at,
    createdAt: row.created_at,
  }));

  return { inquiries, total: count || 0 };
}

export async function respondToInquiry(
  inquiryId: string,
  response: string,
  status: 'in_progress' | 'resolved' = 'resolved'
): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase
    .from('customer_inquiries')
    .update({
      admin_response: response,
      status,
      responded_at: new Date().toISOString(),
    })
    .eq('id', inquiryId);

  if (error) {
    console.error('문의 응답 실패:', error);
    return false;
  }

  return true;
}
