import { Info } from "lucide-react";

export default function TermsComponent() {
  return (
    <main>
      <header className="flex items-center gap-3 mb-8">
        <div>
          <h1 className="text-xl font-semibold mb-2 text-green-600">
            이용 약관
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            T-Mall 학습용 웹사이트 이용에 관한 안내입니다.
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
          (이하 &quot;사이트&quot;)의 이용 조건과 절차, 이용자와 운영자 간의
          기본적인 권리와 의무를 정함을 목적으로 합니다.
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
              비상업적 개인 학습 및 포트폴리오 제작
            </span>
            을 위해 운영됩니다.
          </li>
          <li>
            상품, 주문, 결제, 배송 등은 실제로 이루어지지 않으며,{" "}
            <span className="font-semibold">가상의 더미 데이터</span>를 기반으로
            동작합니다.
          </li>
          <li>
            이용자는 실거래 목적이 아닌, 기능 체험과 UI/UX 구성을 확인하는
            용도로만 사이트를 이용합니다.
          </li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-green-600 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
          제3조 (테스트 계정 안내)
        </h2>
        <ul className="mt-3 space-y-1.5 text-sm text-gray-700 leading-relaxed list-disc list-inside">
          <li>
            사이트 기능은 운영자가 제공하는 테스트 계정을 통해 대부분 체험할 수
            있습니다.
          </li>
          <li>
            테스트 계정에 입력되는 내용은{" "}
            <span className="font-semibold">학습용 임시 데이터</span>이며, 예고
            없이 초기화 또는 삭제될 수 있습니다.
          </li>
          <li>
            직접 회원가입을 진행하는 경우, 실제 개인정보(실명, 실제 결제정보
            등)를 입력하지 않는 것을 권장합니다.
          </li>
          <li>
            회원가입 시 이메일과 비밀번호는 임의로 설정해도 되지만,{" "}
            <span className="font-semibold">
              아이디 찾기·비밀번호 재설정 기능
            </span>
            을 사용하려면 실제로 메일 수신이 가능한 이메일을 사용하는 것이
            좋습니다.
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
            방식으로 진행됩니다.
          </li>
          <li>
            가입 시 입력된 정보는 학습용 데이터베이스에 저장되며, 실제 상업
            서비스의 고객 정보로 취급되지 않습니다.
          </li>
          <li>
            이용자는 자신의 계정을 제3자에게 양도하거나 부정한 용도로 사용할 수
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
          사이트는 다음과 같은 기능을 제공합니다. 모든 기능은{" "}
          <span className="font-semibold">시뮬레이션</span>이며 실제 거래는
          발생하지 않습니다.
        </p>
        <ul className="mt-2 space-y-1.5 text-sm text-gray-700 leading-relaxed list-disc list-inside">
          <li>상품 목록 및 상세 정보 열람</li>
          <li>가상의 장바구니, 주문, 리뷰, 즐겨찾기 기능</li>
          <li>관리자(학습용) 화면을 통한 상품 등록·수정</li>
          <li>조회수, 평점, 검색/필터 등 UX 관련 기능 테스트</li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-green-600 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
          제6조 (저작권)
        </h2>
        <ul className="mt-3 space-y-1.5 text-sm text-gray-700 leading-relaxed list-disc list-inside">
          <li>
            사이트의 디자인, 코드, 데이터 구조 등은 운영자의 개인 학습과
            포트폴리오를 위해 제작된 것입니다.
          </li>
          <li>
            이용자는 사이트 내 콘텐츠를 무단 복제, 배포하거나 2차 저작물 제작
            등의 용도로 사용할 수 없습니다.
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
            본 사이트는 실제 결제, 배송, 환불 등과 관련한 법적 책임을 부담하지
            않습니다.
          </li>
          <li>
            학습 환경 특성상 발생할 수 있는 오류, 데이터 손실 등으로 인한 불이익
            또는 손해에 대해 운영자는 책임을 지지 않습니다.
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
            기술 구조 변경이나 학습 범위 조정에 따라 약관 내용은 예고 없이
            수정될 수 있습니다.
          </li>
          <li>
            최신 약관은 사이트 하단의 &quot;이용약관&quot; 링크를 통해 확인할 수
            있습니다.
          </li>
        </ul>
      </section>

      <section className="mt-8">
        <div className="flex items-start gap-3 rounded-lg border border-green-100 bg-green-50 px-4 py-3">
          <Info className="w-5 h-5 text-green-600 mt-0.5" />
          <div className="text-sm text-gray-700 leading-relaxed">
            <p className="font-semibold text-green-700">
              이 약관은 실제 상업 서비스용 약관이 아니라,{" "}
              <span className="font-semibold">
                학습 및 포트폴리오용 예시 문서
              </span>
              로 작성된 것입니다.
            </p>
            <p className="mt-1.5">
              사이트에서 제공되는 모든 기능은 개발 연습과 구조 설계를 보여주기
              위한 시뮬레이션이며, 법적 효력을 가지는 이용 계약으로 해석되지
              않습니다.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
