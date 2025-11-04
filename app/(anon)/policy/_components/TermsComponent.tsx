import { Info } from "lucide-react";

export default function TermsComponent() {
  return (
    <main className="">
      <header className="flex items-center gap-3 mb-8">
        <div>
          <h1 className="text-xl font-semibold mb-2 text-green-600">
            이용 약관
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            T-Mall 학습용 웹사이트 이용에 대한 기본 약관입니다.
          </p>
        </div>
      </header>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-green-600 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
          제1조 (목적)
        </h2>
        <p className="mt-3 text-sm text-gray-700 leading-relaxed">
          본 약관은 개인 학습용 웹사이트{" "}
          <span className="font-semibold">T-Mall</span>
          (이하 &quot;사이트&quot;)의 이용 조건 및 절차, 이용자와 운영자 간의
          권리, 의무 및 책임 사항을 규정함을 목적으로 합니다.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-green-600 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
          제2조 (사이트의 성격)
        </h2>
        <ul className="mt-3 space-y-1.5 text-sm text-gray-700 leading-relaxed list-disc list-inside">
          <li>
            본 사이트는{" "}
            <span className="font-semibold">
              비상업적 개인 학습 및 포트폴리오 제작 목적
            </span>
            으로 개발되었습니다.
          </li>
          <li>
            실제 상품 판매, 결제, 배송 등의 상업 행위는 이루어지지 않으며, 모든
            서비스는 <span className="font-semibold">테스트용 가상 데이터</span>
            를 기반으로 작동합니다.
          </li>
          <li>
            이용자는 실구매 또는 민감한 개인정보 제공을 전제로 하지 않으며, 학습
            및 체험 목적의 접근만 허용됩니다.
          </li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-green-600 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
          제3조 (테스트 계정 안내)
        </h2>
        <ul className="mt-3 space-y-1.5 text-sm text-gray-700 leading-relaxed list-disc list-inside">
          <li>사이트의 대부분 기능은 테스트 계정을 통해 체험할 수 있습니다.</li>
          <li>
            테스트 계정으로 입력되는 정보는 학습용{" "}
            <span className="font-semibold">임시 데이터</span>이며, 언제든지
            초기화 또는 삭제될 수 있습니다.
          </li>
          <li>
            사용자는 테스트 목적 이외의 실제 개인정보(실명, 실제 결제정보 등)를
            입력하지 않는 것을 권장합니다.
          </li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-green-600 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
          제4조 (회원가입 및 계정)
        </h2>
        <ul className="mt-3 space-y-1.5 text-sm text-gray-700 leading-relaxed list-disc list-inside">
          <li>
            회원가입은 Supabase Auth를 이용한 이메일 또는 OAuth(Google, GitHub)
            방식으로 진행될 수 있습니다.
          </li>
          <li>
            가입 시 입력된 정보는 학습용 테스트 데이터베이스에 저장되며, 실제
            상업 서비스의 고객 정보로 간주되지 않습니다.
          </li>
          <li>
            사용자는 자신의 계정을 제3자와 공유하거나 부정한 목적으로 사용할 수
            없습니다.
          </li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-green-600 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
          제5조 (서비스 내용)
        </h2>
        <p className="mt-3 text-sm text-gray-700 leading-relaxed">
          사이트는 다음과 같은 기능을 제공합니다. 단, 모두 시뮬레이션이며 실제
          거래는 발생하지 않습니다.
        </p>
        <ul className="mt-2 space-y-1.5 text-sm text-gray-700 leading-relaxed list-disc list-inside">
          <li>상품 목록 및 상세 페이지 열람</li>
          <li>가상의 장바구니, 주문, 리뷰, 즐겨찾기 기능</li>
          <li>관리자(학습용) 화면에서의 상품 등록 및 수정</li>
          <li>조회수, 평점, 검색/필터 등 UX 관련 기능 테스트</li>
        </ul>
        <p className="mt-2 text-sm text-gray-700 leading-relaxed">
          위 모든 기능은 프론트엔드, 백엔드, 데이터베이스 설계 및 연동 학습을
          위한 <span className="font-semibold">시뮬레이션 서비스</span>입니다.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-green-600 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
          제6조 (저작권)
        </h2>
        <ul className="mt-3 space-y-1.5 text-sm text-gray-700 leading-relaxed list-disc list-inside">
          <li>
            본 사이트의 디자인, 코드, 데이터 구조는 운영자의 개인 학습 및
            포트폴리오를 위해 작성된 것입니다.
          </li>
          <li>
            이용자는 사이트 내 콘텐츠를 무단 복제, 배포, 2차 저작물 제작 등의
            방식으로 사용할 수 없습니다.
          </li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-green-600 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
          제7조 (책임의 제한)
        </h2>
        <ul className="mt-3 space-y-1.5 text-sm text-gray-700 leading-relaxed list-disc list-inside">
          <li>
            본 사이트는 실제 거래, 결제, 배송, 개인정보 관리에 대한 법적 책임을
            지지 않습니다.
          </li>
          <li>
            사이트 이용 과정에서 발생하는 오류, 데이터 손실, 기타 손해에 대해
            운영자는 책임을 부담하지 않습니다.
          </li>
        </ul>
      </section>

      <section className="mt-8 mb-4">
        <h2 className="text-lg font-semibold text-green-600 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
          제8조 (약관의 효력 및 변경)
        </h2>
        <ul className="mt-3 space-y-1.5 text-sm text-gray-700 leading-relaxed list-disc list-inside">
          <li>
            본 약관은 기술적인 개선 또는 학습 목적 변경에 따라 사전 고지 없이
            수정될 수 있습니다.
          </li>
          <li>
            변경된 약관은 사이트 하단의 &quot;이용약관&quot; 링크를 통해 최신
            내용이 제공됩니다.
          </li>
        </ul>
      </section>

      <section className="mt-8">
        <div className="flex items-start gap-3 rounded-lg border border-green-100 bg-green-50 px-4 py-3">
          <Info className="w-5 h-5 text-green-600 mt-0.5" />
          <div className="text-sm text-gray-700 leading-relaxed">
            <p className="font-semibold text-green-700">
              T-Mall은 상업용이 아닌, 개인적인 학습 및 포트폴리오 제작을 위한
              테스트용 사이트입니다.
            </p>
            <p className="mt-1.5">
              실제 상품 판매, 결제, 배송이 이루어지지 않으며, 모든 기능은
              프론트엔드 · 백엔드 학습을 위한 시뮬레이션 용도로만 제공됩니다.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
