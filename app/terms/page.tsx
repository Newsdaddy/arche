import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "이용약관 - Arche 아르케",
  description: "Arche 서비스 이용약관",
};

export default function TermsPage() {
  return (
    <main className="flex-1 bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-primary">
            Arche
          </Link>
          <Link href="/" className="text-body text-gray-500 hover:text-accent">
            홈으로
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 md:p-12">
          <h1 className="text-3xl font-bold text-primary mb-2">이용약관</h1>
          <p className="text-gray-500 mb-8">시행일: 2024년 1월 1일</p>

          <div className="prose prose-gray max-w-none space-y-8">
            {/* 제1조 */}
            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">제1조 (목적)</h2>
              <p className="text-gray-700 leading-relaxed">
                이 약관은 Arche(이하 "회사")가 제공하는 소셜미디어 콘텐츠 컨설팅 서비스(이하 "서비스")의
                이용조건 및 절차, 회사와 회원 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
              </p>
            </section>

            {/* 제2조 */}
            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">제2조 (용어의 정의)</h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li><strong>"서비스"</strong>란 회사가 제공하는 소셜미디어 콘텐츠 컨설팅, AI 콘텐츠 생성, 8주 미션 프로그램 및 관련 부가 서비스를 의미합니다.</li>
                <li><strong>"회원"</strong>이란 이 약관에 동의하고 회사와 이용계약을 체결한 자를 의미합니다.</li>
                <li><strong>"콘텐츠"</strong>란 회원이 서비스를 이용하여 생성하거나 제출한 텍스트, 이미지, 영상 등 모든 자료를 의미합니다.</li>
                <li><strong>"컨설팅"</strong>이란 회사가 제공하는 1:1 소셜미디어 전략 상담 서비스를 의미합니다.</li>
              </ol>
            </section>

            {/* 제3조 */}
            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">제3조 (약관의 효력 및 변경)</h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>이 약관은 서비스 화면에 게시하거나 기타의 방법으로 회원에게 공지함으로써 효력이 발생합니다.</li>
                <li>회사는 관련 법령을 위배하지 않는 범위에서 이 약관을 변경할 수 있으며, 변경 시 적용일자 7일 전부터 공지합니다.</li>
                <li>회원은 변경된 약관에 동의하지 않을 경우 서비스 이용을 중단하고 탈퇴할 수 있습니다.</li>
              </ol>
            </section>

            {/* 제4조 */}
            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">제4조 (서비스의 내용)</h2>
              <p className="text-gray-700 mb-3">회사가 제공하는 서비스는 다음과 같습니다:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li><strong>8주 미션 프로그램</strong>: 무료 콘텐츠 제작 교육 프로그램</li>
                <li><strong>AI 콘텐츠 생성</strong>: 플랫폼별 맞춤 콘텐츠 자동 생성 기능</li>
                <li><strong>Total Combat</strong>: 2달 코스 유료 컨설팅 (50만원)</li>
                <li><strong>Total + Scale</strong>: 4달 풀코스 유료 컨설팅 (79만원)</li>
                <li><strong>Scale or Die</strong>: 2달 코스 비즈니스 확장 컨설팅 (50만원)</li>
              </ul>
            </section>

            {/* 제5조 */}
            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">제5조 (회원가입)</h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>이용자는 회사가 정한 가입 양식에 따라 회원정보를 기입하고 이 약관에 동의함으로써 회원가입을 신청합니다.</li>
                <li>회사는 다음 각 호에 해당하는 신청에 대하여 승낙하지 않을 수 있습니다:
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li>타인의 정보를 이용한 경우</li>
                    <li>허위 정보를 기재한 경우</li>
                    <li>기타 회원으로 등록하는 것이 부적절하다고 판단되는 경우</li>
                  </ul>
                </li>
              </ol>
            </section>

            {/* 제6조 */}
            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">제6조 (회원의 의무)</h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>회원은 관계 법령, 이 약관의 규정, 이용안내 및 서비스와 관련하여 공지한 주의사항을 준수하여야 합니다.</li>
                <li>회원은 다음 행위를 하여서는 안 됩니다:
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li>타인의 정보 도용</li>
                    <li>회사가 게시한 정보의 무단 변경</li>
                    <li>회사가 정한 정보 이외의 정보 송신 또는 게시</li>
                    <li>회사와 기타 제3자의 저작권 등 지적재산권 침해</li>
                    <li>회사와 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</li>
                    <li>서비스를 이용하여 얻은 정보를 회사의 사전 승낙 없이 상업적으로 이용하는 행위</li>
                  </ul>
                </li>
              </ol>
            </section>

            {/* 제7조 */}
            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">제7조 (결제 및 환불)</h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>유료 서비스의 결제는 신용카드, 계좌이체 등 회사가 정한 방법으로 진행됩니다.</li>
                <li>환불 정책:
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li>서비스 시작 전: 전액 환불</li>
                    <li>서비스 시작 후 7일 이내: 이용 기간에 해당하는 금액을 제외한 잔액 환불</li>
                    <li>서비스 시작 후 7일 초과: 환불 불가 (단, 회사 귀책사유 시 예외)</li>
                  </ul>
                </li>
                <li>컨설팅 일정 변경은 예정일 3일 전까지 요청해야 합니다.</li>
              </ol>
            </section>

            {/* 제8조 */}
            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">제8조 (지적재산권)</h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>서비스에 포함된 모든 콘텐츠(텍스트, 이미지, 로고, 소프트웨어 등)에 대한 저작권은 회사에 귀속됩니다.</li>
                <li>AI 콘텐츠 생성 기능을 통해 회원이 생성한 콘텐츠의 저작권은 회원에게 귀속됩니다.</li>
                <li>회원이 서비스에 제출한 콘텐츠에 대해 회사는 서비스 운영, 개선, 홍보 목적으로 사용할 수 있는 권리를 가집니다.</li>
              </ol>
            </section>

            {/* 제9조 */}
            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">제9조 (서비스 이용의 제한 및 중지)</h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>회사는 다음 각 호에 해당하는 경우 서비스 이용을 제한하거나 중지할 수 있습니다:
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li>서비스용 설비의 보수 등 공사로 인한 부득이한 경우</li>
                    <li>회원이 본 약관의 의무를 위반한 경우</li>
                    <li>기타 불가항력적 사유가 있는 경우</li>
                  </ul>
                </li>
              </ol>
            </section>

            {/* 제10조 */}
            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">제10조 (면책조항)</h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>회사는 천재지변, 전쟁, 기간통신사업자의 서비스 중지 등 불가항력으로 인한 서비스 제공 불능에 대해 책임을 지지 않습니다.</li>
                <li>회사는 회원의 귀책사유로 인한 서비스 이용 장애에 대해 책임을 지지 않습니다.</li>
                <li>AI 생성 콘텐츠의 정확성, 적법성에 대해 회사는 보증하지 않으며, 최종 사용 책임은 회원에게 있습니다.</li>
              </ol>
            </section>

            {/* 제11조 */}
            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">제11조 (분쟁해결)</h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>회사와 회원 간에 발생한 분쟁에 대해 회원은 회사의 고객센터를 통해 이의를 제기할 수 있습니다.</li>
                <li>회사는 회원의 이의제기에 대해 14일 이내에 답변합니다.</li>
                <li>본 약관에 명시되지 않은 사항은 대한민국 관련 법령에 따릅니다.</li>
                <li>서비스 이용으로 발생한 분쟁에 대해 소송이 제기되는 경우, 회사의 본사 소재지를 관할하는 법원을 관할법원으로 합니다.</li>
              </ol>
            </section>

            {/* 부칙 */}
            <section className="border-t pt-6">
              <h2 className="text-xl font-semibold text-primary mb-3">부칙</h2>
              <p className="text-gray-700">이 약관은 2024년 1월 1일부터 시행합니다.</p>
            </section>
          </div>
        </div>

        {/* 관련 링크 */}
        <div className="mt-8 text-center space-x-6">
          <Link href="/privacy" className="text-accent hover:underline">
            개인정보처리방침
          </Link>
          <Link href="/" className="text-gray-500 hover:underline">
            홈으로 돌아가기
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-6 py-6 bg-gray-100 text-center">
        <p className="text-sm text-gray-500">© 2024 Arche. All rights reserved.</p>
      </footer>
    </main>
  );
}
