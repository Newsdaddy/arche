import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ADMIN_EMAILS = ["editorjin0326@gmail.com"];

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !ADMIN_EMAILS.includes(user.email || "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { action } = body;

  if (action === "set_consulting") {
    // 컨설팅 고객으로 지정 (3개월)
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 3);

    const { data, error } = await supabase
      .from("profiles")
      .update({
        customer_type: "consulting",
        consulting_start_date: startDate.toISOString().split("T")[0],
        consulting_end_date: endDate.toISOString().split("T")[0],
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      member: data,
      message: `컨설팅 고객으로 지정되었습니다 (${endDate.toLocaleDateString("ko-KR")}까지)`
    });
  }

  if (action === "set_paid") {
    // Pro 고객으로 지정
    const { data, error } = await supabase
      .from("profiles")
      .update({ customer_type: "paid" })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, member: data });
  }

  if (action === "set_free") {
    // 무료 고객으로 변경
    const { data, error } = await supabase
      .from("profiles")
      .update({
        customer_type: "free",
        consulting_start_date: null,
        consulting_end_date: null,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, member: data });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
