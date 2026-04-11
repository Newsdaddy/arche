import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getInquiries, respondToInquiry } from "@/lib/admin/queries";

const ADMIN_EMAILS = ["editorjin0326@gmail.com"];

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !ADMIN_EMAILS.includes(user.email || "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get("status") as "pending" | "in_progress" | "resolved" | undefined;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  const { inquiries, total } = await getInquiries({ status, page, limit });

  return NextResponse.json({
    inquiries,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

export async function PUT(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !ADMIN_EMAILS.includes(user.email || "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { inquiryId, response, status } = body;

  if (!inquiryId || !response) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const success = await respondToInquiry(inquiryId, response, status || "resolved");

  if (!success) {
    return NextResponse.json({ error: "Failed to respond" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
