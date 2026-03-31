"use client";

import { ContentTemplate } from "@/types/diagnosis";

interface ContentTemplatesProps {
  templates: ContentTemplate[];
}

export default function ContentTemplates({ templates }: ContentTemplatesProps) {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
      <h4 className="font-semibold text-gray-900 mb-4">
        추천 콘텐츠 템플릿
      </h4>

      <p className="text-sm text-gray-600 mb-4">
        아래 템플릿의 [괄호] 부분을 본인의 경험으로 채워보세요.
      </p>

      <div className="space-y-4">
        {templates.map((template) => {
          return (
            <div
              key={template.id}
              className="bg-white rounded-xl overflow-hidden border border-purple-100 shadow-sm"
            >
              {/* 템플릿 헤더 */}
              <div className="bg-purple-50 px-4 py-2 border-b border-purple-100">
                <span className="font-medium text-purple-800">
                  {template.name}
                </span>
              </div>

              {/* 템플릿 내용 */}
              <div className="p-4">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 text-gray-700 whitespace-pre-line font-mono text-sm">
                  {template.template}
                </div>

                {template.example && (
                  <div className="mt-3">
                    <div className="text-xs text-gray-500 mb-1">
                      예시
                    </div>
                    <div className="bg-accent/5 border border-accent/20 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-line">
                      {template.example}
                    </div>
                  </div>
                )}
              </div>

              {/* 복사 버튼 */}
              <div className="px-4 pb-4">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(template.template);
                    alert("템플릿이 복사되었습니다!");
                  }}
                  className="w-full py-2 text-sm text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors border border-purple-200"
                >
                  템플릿 복사하기
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
