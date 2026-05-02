import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// 회원 자신의 보고서 목록 조회
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: reports, error } = await supabase
    .from("consulting_reports")
    .select("id, session_number, title, file_name, file_type, file_size, created_at")
    .eq("user_id", user.id)
    .order("session_number", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ reports: reports || [] });
}

// 보고서 다운로드 URL 생성
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { reportId } = await request.json();
  if (!reportId) {
    return NextResponse.json({ error: "reportId is required" }, { status: 400 });
  }

  // 보고서 조회 (자신의 보고서인지 확인)
  const { data: report, error } = await supabase
    .from("consulting_reports")
    .select("file_path, file_name")
    .eq("id", reportId)
    .eq("user_id", user.id)
    .single();

  if (error || !report) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }

  // Signed URL 생성 (1시간 유효)
  const adminClient = createAdminClient();
  const { data: signedUrl, error: urlError } = await adminClient.storage
    .from("consulting-reports")
    .createSignedUrl(report.file_path, 3600);

  if (urlError) {
    console.error("URL 생성 실패:", urlError);
    return NextResponse.json({ error: "다운로드 URL 생성에 실패했습니다." }, { status: 500 });
  }

  return NextResponse.json({
    downloadUrl: signedUrl.signedUrl,
    fileName: report.file_name,
  });
}
