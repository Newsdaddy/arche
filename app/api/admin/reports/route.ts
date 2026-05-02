import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/config/admin";

// 특정 회원의 보고서 목록 조회
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = request.nextUrl.searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  const adminClient = createAdminClient();
  const { data: reports, error } = await adminClient
    .from("consulting_reports")
    .select("*")
    .eq("user_id", userId)
    .order("session_number", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ reports });
}

// 보고서 업로드
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File;
  const userId = formData.get("userId") as string;
  const sessionNumber = parseInt(formData.get("sessionNumber") as string);
  const title = formData.get("title") as string;

  if (!file || !userId || !sessionNumber || !title) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // 파일 타입 확인
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: "PDF 또는 Word 파일만 업로드 가능합니다." }, { status: 400 });
  }

  // 파일 크기 확인 (10MB)
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "파일 크기는 10MB 이하여야 합니다." }, { status: 400 });
  }

  const adminClient = createAdminClient();
  const fileExt = file.name.split(".").pop();
  const fileName = `${userId}/${sessionNumber}_${Date.now()}.${fileExt}`;

  // 파일 업로드
  const { error: uploadError } = await adminClient.storage
    .from("consulting-reports")
    .upload(fileName, file, {
      contentType: file.type,
      upsert: true,
    });

  if (uploadError) {
    console.error("파일 업로드 실패:", uploadError);
    return NextResponse.json({ error: "파일 업로드에 실패했습니다." }, { status: 500 });
  }

  // 기존 보고서 삭제 (같은 세션)
  await adminClient
    .from("consulting_reports")
    .delete()
    .eq("user_id", userId)
    .eq("session_number", sessionNumber);

  // DB에 보고서 정보 저장
  const { data: report, error: dbError } = await adminClient
    .from("consulting_reports")
    .insert({
      user_id: userId,
      session_number: sessionNumber,
      title,
      file_name: file.name,
      file_path: fileName,
      file_size: file.size,
      file_type: fileExt,
      uploaded_by: user.id,
    })
    .select()
    .single();

  if (dbError) {
    console.error("DB 저장 실패:", dbError);
    return NextResponse.json({ error: "보고서 정보 저장에 실패했습니다." }, { status: 500 });
  }

  return NextResponse.json({ success: true, report });
}

// 보고서 삭제
export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { reportId } = await request.json();
  if (!reportId) {
    return NextResponse.json({ error: "reportId is required" }, { status: 400 });
  }

  const adminClient = createAdminClient();

  // 보고서 정보 조회
  const { data: report } = await adminClient
    .from("consulting_reports")
    .select("file_path")
    .eq("id", reportId)
    .single();

  if (report?.file_path) {
    // 스토리지에서 파일 삭제
    await adminClient.storage.from("consulting-reports").remove([report.file_path]);
  }

  // DB에서 삭제
  const { error } = await adminClient
    .from("consulting_reports")
    .delete()
    .eq("id", reportId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
