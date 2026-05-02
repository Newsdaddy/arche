import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { isAdmin } from '@/lib/usage/server';

export async function GET() {
  // 인증 확인
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: '권한이 없습니다' }, { status: 403 });
  }

  const adminClient = createAdminClient();

  try {
    const [
      { count: totalUsers },
      { count: onboardingCompleted },
      { count: totalSubmissions },
      { data: users },
      { data: consulting },
    ] = await Promise.all([
      adminClient.from('profiles').select('*', { count: 'exact', head: true }),
      adminClient.from('profiles').select('*', { count: 'exact', head: true }).eq('onboarding_completed', true),
      adminClient.from('submissions').select('*', { count: 'exact', head: true }),
      adminClient.from('profiles').select('id, email, full_name, created_at, onboarding_completed, total_uploads').order('created_at', { ascending: false }).limit(5),
      adminClient.from('consulting_requests').select('id, name, email, plan_name, created_at').order('created_at', { ascending: false }).limit(5),
    ]);

    return NextResponse.json({
      stats: {
        totalUsers: totalUsers || 0,
        onboardingCompleted: onboardingCompleted || 0,
        totalSubmissions: totalSubmissions || 0,
      },
      recentUsers: users || [],
      recentConsulting: consulting || [],
    });
  } catch (error) {
    console.error('Admin overview 조회 실패:', error);
    return NextResponse.json({ error: '데이터 조회 실패' }, { status: 500 });
  }
}
