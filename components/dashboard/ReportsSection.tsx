"use client";

import { useEffect, useState } from "react";
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

export default function ReportsSection() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch("/api/reports");
        const data = await res.json();
        setReports(data.reports || []);
      } catch (err) {
        console.error("보고서 목록 조회 실패:", err);
      }
      setIsLoading(false);
    };

    fetchReports();
  }, []);

  const handleDownload = async (reportId: string) => {
    setDownloadingId(reportId);
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId }),
      });

      if (res.ok) {
        const { downloadUrl, fileName } = await res.json();
        // 새 탭에서 다운로드
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = fileName;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert("다운로드에 실패했습니다.");
      }
    } catch (err) {
      console.error("다운로드 실패:", err);
      alert("다운로드에 실패했습니다.");
    }
    setDownloadingId(null);
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

  if (isLoading) {
    return null;
  }

  if (reports.length === 0) {
    return null; // 보고서가 없으면 섹션 숨김
  }

  return (
    <Card variant="light" className="mb-6">
      <CardHeader>
        <CardTitle dark>컨설팅 보고서</CardTitle>
      </CardHeader>
      <CardContent>
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
                    {getSessionLabel(report.session_number)} · {formatFileSize(report.file_size)}
                  </p>
                </div>
              </div>
              <Button
                variant="outline-dark"
                size="sm"
                onClick={() => handleDownload(report.id)}
                disabled={downloadingId === report.id}
              >
                {downloadingId === report.id ? "..." : "다운로드"}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
