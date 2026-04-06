import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-dark-darker border-t border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* 브랜드 */}
          <div className="md:col-span-2">
            <Link
              href="/"
              className="text-2xl font-bold text-white"
            >
              <span className="text-accent">A</span>rche
            </Link>
            <p className="text-body text-primary-500 mt-3 max-w-sm">
              정밀한 진단과 분석으로 나만의 소셜미디어 콘셉트를 찾고,
              그 첫 시작을 함께합니다.
            </p>
          </div>

          {/* 플랫폼 */}
          <div>
            <h3 className="font-semibold text-white mb-4">플랫폼</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/diagnosis" className="text-body text-primary-500 hover:text-white transition-colors">
                  페르소나 진단
                </Link>
              </li>
              <li>
                <Link href="/create" className="text-body text-primary-500 hover:text-white transition-colors">
                  콘텐츠 생성
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-body text-primary-500 hover:text-white transition-colors">
                  가격 플랜
                </Link>
              </li>
            </ul>
          </div>

          {/* 컨설팅 */}
          <div>
            <h3 className="font-semibold text-white mb-4">컨설팅</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/consulting" className="text-body text-primary-500 hover:text-white transition-colors">
                  컨설팅 안내
                </Link>
              </li>
              <li>
                <Link href="/consulting/curriculum" className="text-body text-primary-500 hover:text-white transition-colors">
                  8주 커리큘럼
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* 하단 */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-small text-primary-600">
            &copy; 2026 아르케인텔리전스. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="text-small text-primary-600 hover:text-white transition-colors">
              이용약관
            </Link>
            <Link href="/privacy" className="text-small text-primary-600 hover:text-white transition-colors">
              개인정보처리방침
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
