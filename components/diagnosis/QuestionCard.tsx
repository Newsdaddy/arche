"use client";

import { Question } from "@/types/diagnosis";
import MethodologyBadge from "./MethodologyBadge";

interface QuestionCardProps {
  question: Question;
  currentAnswer?: string | string[];
  onAnswer: (value: string | string[]) => void;
}

export default function QuestionCard({
  question,
  currentAnswer,
  onAnswer,
}: QuestionCardProps) {
  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onAnswer(e.target.value);
  };

  const handleSelectChange = (value: string) => {
    onAnswer(value);
  };

  const handleMultiSelectChange = (value: string) => {
    const currentValues = Array.isArray(currentAnswer) ? currentAnswer : [];
    if (currentValues.includes(value)) {
      onAnswer(currentValues.filter((v) => v !== value));
    } else {
      onAnswer([...currentValues, value]);
    }
  };

  const renderInput = () => {
    switch (question.type) {
      case "text":
        return (
          <input
            type="text"
            value={(currentAnswer as string) || ""}
            onChange={handleTextChange}
            placeholder={question.placeholder}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-gray-900 placeholder:text-gray-400"
          />
        );

      case "textarea":
        return (
          <textarea
            value={(currentAnswer as string) || ""}
            onChange={handleTextChange}
            placeholder={question.placeholder}
            rows={4}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all resize-none text-gray-900 placeholder:text-gray-400"
          />
        );

      case "select":
        return (
          <div className="space-y-2">
            {question.options?.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelectChange(option.value)}
                className={`w-full px-4 py-3 rounded-lg border text-left transition-all ${
                  currentAnswer === option.value
                    ? "border-accent bg-accent/5 text-accent"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-900"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        );

      case "multiselect":
        return (
          <div className="space-y-2">
            <p className="text-sm text-gray-500 mb-2">
              여러 개 선택 가능합니다
            </p>
            {question.options?.map((option) => {
              const isSelected =
                Array.isArray(currentAnswer) &&
                currentAnswer.includes(option.value);
              return (
                <button
                  key={option.value}
                  onClick={() => handleMultiSelectChange(option.value)}
                  className={`w-full px-4 py-3 rounded-lg border text-left transition-all flex items-center gap-3 ${
                    isSelected
                      ? "border-accent bg-accent/5 text-accent"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-900"
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded flex items-center justify-center border ${
                      isSelected
                        ? "bg-accent border-accent text-white"
                        : "border-gray-300"
                    }`}
                  >
                    {isSelected && (
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </span>
                  {option.label}
                </button>
              );
            })}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
          {question.question}
        </h2>
        {question.description && (
          <p className="text-gray-500">{question.description}</p>
        )}
      </div>

      <div className="mb-6">{renderInput()}</div>

      <div className="flex items-center gap-2 text-sm text-gray-400 pt-4 border-t border-gray-100">
        <span>이 질문은</span>
        <MethodologyBadge framework={question.framework} size="sm" showTooltip />
        <span>분석에 활용됩니다</span>
      </div>
    </div>
  );
}
