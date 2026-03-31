import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보처리방침 - 아르케인텔리전스",
  description: "아르케인텔리전스 서비스 개인정보처리방침",
};

export default function PrivacyPage() {
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
          <h1 className="text-3xl font-bold text-primary mb-2">개인정보처리방침</h1>
          <p className="text-gray-500 mb-8">시행일: 2026년 3월 1일</p>

          <div className="prose prose-gray max-w-none space-y-8">
            {/* 서문 */}
            <section>
              <p className="text-gray-700 leading-relaxed">
                Arche(이하 "회사")는 개인정보보호법, 정보통신망 이용촉진 및 정보보호 등에 관한 법률 등
                관련 법령에 따라 이용자의 개인정보를 보호하고, 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록
                다음과 같이 개인정보처리방침을 수립·공개합니다.
              </p>
            </section>

            {/* 제1조 */}
            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">제1조 (수집하는 개인정보 항목)</h2>
              <p className="text-gray-700 mb-3">회사는 서비스 제공을 위해 다음과 같은 개인정보를 수집합니다:</p>

              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">1. 회원가입 시 (필수)</h3>
                  <ul className="list-disc list-inside text-gray-700 ml-4 space-y-1">
                    <li>이메일 주소</li>
                    <li>비밀번호 (암호화 저장)</li>
                    <li>이름 또는 닉네임</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">2. 서비스 이용 시 (선택)</h3>
                  <ul className="list-disc list-inside text-gray-700 ml-4 space-y-1">
                    <li>소셜미디어 계정 정보 (플랫폼명, 팔로워 수 등)</li>
                    <li>콘텐츠 제작 관련 정보 (관심 분야, 목표 등)</li>
                    <li>프로필 사진</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">3. 유료 서비스 이용 시</h3>
                  <ul className="list-disc list-inside text-gray-700 ml-4 space-y-1">
                    <li>결제 정보 (카드사명, 승인번호 등 - 카드번호는 저장하지 않음)</li>
                    <li>연락처 (컨설팅 일정 안내용)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">4. 자동 수집 정보</h3>
                  <ul className="list-disc list-inside text-gray-700 ml-4 space-y-1">
                    <li>접속 IP 주소, 접속 시간</li>
                    <li>브라우저 종류, 운영체제</li>
                    <li>서비스 이용 기록, 방문 기록</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 제2조 */}
            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">제2조 (개인정보의 수집 및 이용 목적)</h2>
              <p className="text-gray-700 mb-3">수집한 개인정보는 다음 목적을 위해 이용됩니다:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li><strong>서비스 제공</strong>: 회원 식별, 서비스 이용, 콘텐츠 제공</li>
                <li><strong>회원 관리</strong>: 회원제 서비스 이용, 본인 확인, 부정 이용 방지</li>
                <li><strong>서비스 개선</strong>: 신규 서비스 개발, 기존 서비스 개선, 통계 분석</li>
                <li><strong>마케팅 및 광고</strong>: 이벤트 정보 제공, 맞춤 서비스 제공 (동의 시)</li>
                <li><strong>고객 상담</strong>: 문의 응대, 불만 처리, 공지사항 전달</li>
                <li><strong>결제 처리</strong>: 유료 서비스 결제, 환불 처리</li>
              </ul>
            </section>

            {/* 제3조 */}
            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">제3조 (개인정보의 보유 및 이용 기간)</h2>
              <p className="text-gray-700 mb-3">
                회사는 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다.
                단, 관계 법령에 따라 보존할 필요가 있는 경우 아래와 같이 보관합니다:
              </p>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="border border-gray-200 px-4 py-2 text-left">보존 항목</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">보존 기간</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">근거 법령</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2">계약 또는 청약철회 기록</td>
                      <td className="border border-gray-200 px-4 py-2">5년</td>
                      <td className="border border-gray-200 px-4 py-2">전자상거래법</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2">대금결제 및 재화 공급 기록</td>
                      <td className="border border-gray-200 px-4 py-2">5년</td>
                      <td className="border border-gray-200 px-4 py-2">전자상거래법</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2">소비자 불만 또는 분쟁처리 기록</td>
                      <td className="border border-gray-200 px-4 py-2">3년</td>
                      <td className="border border-gray-200 px-4 py-2">전자상거래법</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2">웹사이트 방문 기록</td>
                      <td className="border border-gray-200 px-4 py-2">3개월</td>
                      <td className="border border-gray-200 px-4 py-2">통신비밀보호법</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* 제4조 */}
            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">제4조 (개인정보의 제3자 제공)</h2>
              <p className="text-gray-700 mb-3">
                회사는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다.
                다만, 다음의 경우에는 예외로 합니다:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>이용자가 사전에 동의한 경우</li>
                <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
              </ul>
            </section>

            {/* 제5조 */}
            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">제5조 (개인정보 처리 위탁)</h2>
              <p className="text-gray-700 mb-3">
                회사는 서비스 향상을 위해 다음과 같이 개인정보 처리를 위탁하고 있습니다:
              </p>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="border border-gray-200 px-4 py-2 text-left">수탁업체</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">위탁 업무</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2">Supabase Inc.</td>
                      <td className="border border-gray-200 px-4 py-2">데이터베이스 및 인증 서비스 운영</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2">Vercel Inc.</td>
                      <td className="border border-gray-200 px-4 py-2">웹서비스 호스팅</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2">PG사 (결제대행사)</td>
                      <td className="border border-gray-200 px-4 py-2">결제 처리</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* 제6조 */}
            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">제6조 (이용자의 권리와 행사 방법)</h2>
              <p className="text-gray-700 mb-3">이용자는 언제든지 다음 권리를 행사할 수 있습니다:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li><strong>열람권</strong>: 본인의 개인정보 처리 현황 열람 요청</li>
                <li><strong>정정권</strong>: 개인정보의 오류에 대한 정정 요청</li>
                <li><strong>삭제권</strong>: 개인정보의 삭제 요청</li>
                <li><strong>처리정지권</strong>: 개인정보 처리의 정지 요청</li>
              </ul>
              <p className="text-gray-700 mt-3">
                위 권리 행사는 서비스 내 설정 메뉴 또는 이메일을 통해 가능하며,
                회사는 지체 없이 조치하겠습니다.
              </p>
            </section>

            {/* 제7조 */}
            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">제7조 (개인정보의 파기)</h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li><strong>파기 절차</strong>: 이용 목적이 달성된 개인정보는 별도의 DB로 옮겨져 내부 방침 및 관련 법령에 따라 일정 기간 저장 후 파기됩니다.</li>
                <li><strong>파기 방법</strong>: 전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제하고, 종이에 출력된 정보는 분쇄기로 분쇄하거나 소각합니다.</li>
              </ol>
            </section>

            {/* 제8조 */}
            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">제8조 (개인정보 보호를 위한 기술적·관리적 대책)</h2>
              <p className="text-gray-700 mb-3">회사는 개인정보 보호를 위해 다음과 같은 조치를 취하고 있습니다:</p>

              <div className="space-y-3">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">기술적 대책</h3>
                  <ul className="list-disc list-inside text-gray-700 ml-4 space-y-1">
                    <li>비밀번호 암호화 저장 (해시 알고리즘)</li>
                    <li>SSL 통신 암호화</li>
                    <li>방화벽 및 침입탐지시스템 운영</li>
                    <li>접근 권한 관리 및 접근 기록 보관</li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">관리적 대책</h3>
                  <ul className="list-disc list-inside text-gray-700 ml-4 space-y-1">
                    <li>개인정보 취급자 최소화</li>
                    <li>정기적인 자체 감사 실시</li>
                    <li>개인정보 처리 관련 내부 관리계획 수립</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 제9조 */}
            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">제9조 (쿠키의 사용)</h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>회사는 이용자에게 개별적인 맞춤 서비스를 제공하기 위해 쿠키(cookie)를 사용합니다.</li>
                <li>쿠키는 웹사이트 운영에 이용되는 서버가 이용자의 브라우저에 보내는 소량의 정보입니다.</li>
                <li>이용자는 쿠키 설치에 대한 선택권을 가지고 있으며, 웹 브라우저 설정을 통해 쿠키를 허용하거나 거부할 수 있습니다.</li>
              </ol>
            </section>

            {/* 제10조 */}
            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">제10조 (개인정보 보호책임자)</h2>
              <p className="text-gray-700 mb-3">
                회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 관련 불만 처리 및 피해 구제를 위하여
                아래와 같이 개인정보 보호책임자를 지정하고 있습니다:
              </p>

              <div className="bg-accent/5 rounded-lg p-4">
                <p className="font-semibold text-gray-800">개인정보 보호책임자</p>
                <ul className="mt-2 space-y-1 text-gray-700">
                  <li>성명: 병진</li>
                  <li>직책: 대표</li>
                  <li>이메일: contact@arche.kr (예시)</li>
                </ul>
              </div>
            </section>

            {/* 제11조 */}
            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">제11조 (권익침해 구제방법)</h2>
              <p className="text-gray-700 mb-3">
                개인정보 침해에 대한 신고나 상담이 필요한 경우 아래 기관에 문의하실 수 있습니다:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>개인정보침해신고센터: (국번없이) 118 / privacy.kisa.or.kr</li>
                <li>개인정보분쟁조정위원회: 1833-6972 / www.kopico.go.kr</li>
                <li>대검찰청 사이버수사과: (국번없이) 1301 / www.spo.go.kr</li>
                <li>경찰청 사이버안전국: (국번없이) 182 / cyberbureau.police.go.kr</li>
              </ul>
            </section>

            {/* 제12조 */}
            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">제12조 (개인정보처리방침 변경)</h2>
              <p className="text-gray-700">
                이 개인정보처리방침은 법령, 정책 또는 보안기술의 변경에 따라 내용이 추가, 삭제 및 수정될 수 있습니다.
                변경 시에는 시행일자 최소 7일 전부터 서비스 내 공지사항을 통해 고지할 것입니다.
              </p>
            </section>

            {/* 부칙 */}
            <section className="border-t pt-6">
              <h2 className="text-xl font-semibold text-primary mb-3">부칙</h2>
              <p className="text-gray-700">이 개인정보처리방침은 2026년 3월 1일부터 시행합니다.</p>
            </section>
          </div>
        </div>

        {/* 관련 링크 */}
        <div className="mt-8 text-center space-x-6">
          <Link href="/terms" className="text-accent hover:underline">
            이용약관
          </Link>
          <Link href="/" className="text-gray-500 hover:underline">
            홈으로 돌아가기
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-6 py-6 bg-gray-100 text-center">
        <p className="text-sm text-gray-500">© 2026 아르케인텔리전스. All rights reserved.</p>
      </footer>
    </main>
  );
}
