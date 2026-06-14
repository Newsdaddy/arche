import { Metadata } from "next";
import PersonaSurveyForm from "./PersonaSurveyForm";

export const metadata: Metadata = {
  title: "강의 만족도 설문 | 소셜페르소나",
  description: "소셜페르소나 강의 만족도 설문조사",
};

export default function PersonaSurveyPage() {
  return <PersonaSurveyForm />;
}
