"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Card, { CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

interface PaidMember {
  id: string;
  email: string;
  full_name: string | null;
  customer_type: string;
  created_at: string;
}

export default function PaidMembersPage() {
  const [members, setMembers] = useState<PaidMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, full_name, customer_type, created_at")
        .in("customer_type", ["paid", "consulting"])
        .order("created_at", { ascending: false });

      if (!error && data) {
        setMembers(data);
      }
      setIsLoading(false);
    };

    fetchMembers();
  }, []);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const proMembers = members.filter((m) => m.customer_type === "paid");
  const consultingMembers = members.filter((m) => m.customer_type === "consulting");

  if (isLoading) {
    return <div className="text-center py-12 text-gray-400">로딩 중...</div>;
  }

  return (
    <div className="space-y-6">
      {/* 요약 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{proMembers.length}</p>
          <p className="text-sm text-gray-600">Pro 플랜</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-purple-600">{consultingMembers.length}</p>
          <p className="text-sm text-gray-600">Consulting</p>
        </div>
      </div>

      {/* 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle>유료 가입자 목록 ({members.length}명)</CardTitle>
        </CardHeader>
        <CardContent>
          {members.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              아직 유료 가입자가 없습니다
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">이름</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">이메일</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-600">플랜</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">가입일</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((member) => (
                    <tr
                      key={member.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-purple-400 flex items-center justify-center text-white text-sm font-medium">
                            {(member.full_name || member.email)[0].toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-900">
                            {member.full_name || "-"}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{member.email}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          member.customer_type === "consulting"
                            ? "bg-purple-100 text-purple-600"
                            : "bg-blue-100 text-blue-600"
                        }`}>
                          {member.customer_type === "consulting" ? "Consulting" : "Pro"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {formatDate(member.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
