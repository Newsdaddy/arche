import { Metadata } from "next";
import SurveyForm from "./SurveyForm";

export const metadata: Metadata = {
  title: "사전 설문 | Arche 아르케",
  description:
    "실무 AX 세미나 사전 설문 - 참석자 눈높이에 맞춘 세미나 준비를 위한 설문입니다.",
};

export default function SurveyPage() {
  return <SurveyForm />;
}
