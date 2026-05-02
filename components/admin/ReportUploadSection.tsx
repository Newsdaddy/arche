"use client";

import { useEffect, useState, useRef } from "react";
import Card, { CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";

interface Report {
  id: string;
  session_number: number;
  title: string;
  file_name: string;
  file_type: string;
  file_size: number;
  created_at: string;
}

interface ReportUploadSectionProps {
  userId: string;
  sessions: { session_number: number; status: string }[];
}

export default function ReportUploadSection({ userId, sessions }: ReportUploadSectionProps) {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // 업로드 폼 상태
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedSession, setSelectedSession] = useState<number>(1);
  const [reportTitle, setReportTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchReports();
  }, [userId]);

  const fetchReports = async () => {
    try {
      const res = await fetch(`/api/admin/reports?userId=${userId}`);
      const data = await res.json();
      setReports(data.reports || []);
    } catch (err) {
      console.error("보고서 목록 조회 실패:", err);
    }
    setIsLoading(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 파일 타입 검증
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedTypes.includes(file.type)) {
        alert("PDF 또는 Word 파일만 업로드할 수 있습니다.");
        return;
      }
      // 파일 크기 검증 (10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert("파일 크기는 10MB를 초과할 수 없습니다.");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !reportTitle) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("userId", userId);
      formData.append("sessionNumber", selectedSession.toString());
      formData.append("title", reportTitle);

      const res = await fetch("/api/admin/reports", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setReports([data.report, ...reports]);
        // 폼 초기화
        setShowUploadForm(false);
        setSelectedFile(null);
        setReportTitle("");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        const data = await res.json();
        alert(data.error || "업로드에 실패했습니다.");
      }
    } catch (err) {
      console.error("업로드 실패:", err);
      alert("업로드에 실패했습니다.");
    }
    setIsUploading(false);
  };

  const handleDelete = async (reportId: string) => {
    if (!confirm("이 보고서를 삭제하시겠습니까?")) return;

    setDeletingId(reportId);
    try {
      const res = await fetch("/api/admin/reports", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId }),
      });

      if (res.ok) {
        setReports(reports.filter((r) => r.id !== reportId));
      } else {
        alert("삭제에 실패했습니다.");
      }
    } catch (err) {
      console.error("삭제 실패:", err);
      alert("삭제에 실패했습니다.");
    }
    setDeletingId(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getSessionLabel = (num: number) => {
    const labels = ["1차 미팅", "2차 미팅", "3차 미팅", "4차 미팅"];
    return labels[num - 1] || `${num}차`;
  };

  // 완료된 세션 목록 (업로드 가능한 세션)
  const completedSessions = sessions
    .filter((s) => s.status === "completed")
    .map((s) => s.session_number);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-gray-400">
          로딩 중...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>컨설팅 보고서 ({reports.length}건)</CardTitle>
          <Button
            variant="outline-dark"
            size="sm"
            onClick={() => setShowUploadForm(!showUploadForm)}
          >
            {showUploadForm ? "취소" : "+ 보고서 업로드"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* 업로드 폼 */}
        {showUploadForm && (
          <form onSubmit={handleUpload} className="mb-6 p-4 bg-gray-50 rounded-xl space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                세션 선택
              </label>
              <select
                value={selectedSession}
                onChange={(e) => setSelectedSession(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-accent focus:border-transparent"
              >
                {[1, 2, 3, 4].map((num) => (
                  <option key={num} value={num}>
                    {getSessionLabel(num)}
                    {completedSessions.includes(num) ? " ✓" : ""}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                보고서 제목 *
              </label>
              <input
                type="text"
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
                placeholder="예: 1차 미팅 페르소나 진단 보고서"
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                파일 선택 * (PDF, Word, 최대 10MB)
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleFileSelect}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-accent focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-accent file:text-white file:cursor-pointer"
              />
              {selectedFile && (
                <p className="mt-2 text-sm text-gray-500">
                  선택: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={!selectedFile || !reportTitle || isUploading}
            >
              {isUploading ? "업로드 중..." : "업로드"}
            </Button>
          </form>
        )}

        {/* 보고서 목록 */}
        {reports.length === 0 ? (
          <p className="text-center text-gray-400 py-8">
            아직 업로드된 보고서가 없습니다
          </p>
        ) : (
          <div className="space-y-3">
            {reports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                    <span className="text-accent text-lg">
                      {report.file_type === "pdf" ? "📄" : "📝"}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{report.title}</p>
                    <p className="text-sm text-gray-500">
                      {getSessionLabel(report.session_number)} · {formatFileSize(report.file_size)} · {new Date(report.created_at).toLocaleDateString("ko-KR")}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(report.id)}
                  disabled={deletingId === report.id}
                  className="text-red-500 hover:text-red-700 text-sm disabled:opacity-50"
                >
                  {deletingId === report.id ? "..." : "삭제"}
                </button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
