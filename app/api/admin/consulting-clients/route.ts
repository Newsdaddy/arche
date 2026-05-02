import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/config/admin";
import { getConsultingClients } from "@/lib/admin/queries";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const sortBy = searchParams.get("sortBy") as "healthScore" | "name" | "createdAt" | undefined;
  const order = searchParams.get("order") as "asc" | "desc" | undefined;

  const { clients, summary } = await getConsultingClients({ sortBy, order });

  return NextResponse.json({ clients, summary });
}
