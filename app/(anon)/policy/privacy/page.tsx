import { Info } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <main className="">
      <header className="flex items-center gap-3 mb-8">
        <div>
          <h1 className="text-xl font-semibold mb-2 text-green-600">
            개인정보 처리방침
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            T-Mall 학습용 웹사이트에서 처리되는 개인정보에 대한 안내입니다.
          </p>
        </div>
      </header>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-green-600 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
          제1조 (개인정보 수집 및 이용 목적)
        </h2>
        <p className="mt-3 text-sm text-gray-700 leading-relaxed">
          본 사이트는 개인 학습 및 테스트 목적의 서비스를 제공하기 위해 다음과
          같은 최소한의 정보를 수집할 수 있습니다.
        </p>
        <ul className="mt-2 space-y-1.5 text-sm text-gray-700 leading-relaxed list-disc list-inside">
          <li>이메일 주소 (Supabase Auth 인증용)</li>
          <li>닉네임 또는 사용자명 (프로필 및 표시용)</li>
          <li>프로필 이미지 (선택사항, 아바타 표현용)</li>
        </ul>
        <p className="mt-2 text-sm text-gray-700 leading-relaxed">
          상기 정보는 실제 상업 서비스용 고객 데이터가 아닌,
          <span className="font-semibold"> 학습용 테스트 데이터</span>로만
          취급됩니다.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-green-600 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
          제2조 (개인정보의 보유 및 이용 기간)
        </h2>
        <ul className="mt-3 space-y-1.5 text-sm text-gray-700 leading-relaxed list-disc list-inside">
          <li>
            테스트 계정 및 그와 관련된 데이터는 일정 기간 이후
            <span className="font-semibold"> 데이터 초기화</span> 과정에서
            삭제될 수 있습니다.
          </li>
          <li>
            운영자가 학습 환경을 재설정하거나 데이터베이스 구조를 변경하는 경우,
            사전 예고 없이 데이터가 삭제될 수 있습니다.
          </li>
          <li>
            사용자가 직접 계정 삭제를 요청하는 경우, 가능한 범위 내에서 신속히
            반영되도록 합니다.
          </li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-green-600 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
          제3조 (개인정보의 제3자 제공)
        </h2>
        <ul className="mt-3 space-y-1.5 text-sm text-gray-700 leading-relaxed list-disc list-inside">
          <li>
            본 사이트는 이용자의 개인정보를 어떠한 제3자에게도 판매하거나
            공유하지 않습니다.
          </li>
          <li>
            다만, Supabase, AWS(S3, CloudFront) 등 인프라 서비스 제공자는 데이터
            저장 및 전송을 위한
            <span className="font-semibold"> 기술적 처리 범위 내</span>에서만
            사용자의 정보에 접근할 수 있습니다.
          </li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-green-600 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
          제4조 (쿠키 및 로그파일)
        </h2>
        <ul className="mt-3 space-y-1.5 text-sm text-gray-700 leading-relaxed list-disc list-inside">
          <li>
            로그인 상태 유지 및 기본적인 서비스 제공을 위해 세션 쿠키 또는 토큰
            기반 인증 정보를 사용할 수 있습니다.
          </li>
          <li>
            접속 기록, 에러 로그 등은 서비스 안정성과 성능 개선을 위한
            <span className="font-semibold"> 통계·분석 목적</span>으로만
            활용되며, 개인을 식별하는 데 사용하지 않습니다.
          </li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-green-600 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
          제5조 (개인정보의 안전성 확보 조치)
        </h2>
        <ul className="mt-3 space-y-1.5 text-sm text-gray-700 leading-relaxed list-disc list-inside">
          <li>
            Supabase Auth를 통해 저장되는 비밀번호는 암호화되어 관리되며,
            운영자도 원문을 확인할 수 없습니다.
          </li>
          <li>
            Supabase 및 AWS 스토리지에 저장되는 데이터는 접근 제어 및 권한
            설정을 통해 외부에서 직접 접근할 수 없도록 구성합니다.
          </li>
          <li>
            프로젝트 특성상 완전한 상용 보안 수준을 보장하지는 않지만, 학습환경
            내에서 가능한 범위의 안전한 구조를 지향합니다.
          </li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-green-600 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
          제6조 (개인정보 관리 책임자)
        </h2>
        <div className="mt-3 rounded-md border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-700 leading-relaxed">
          <p>T-Mall 프로젝트 개인정보 관리 책임자는 다음과 같습니다.</p>
          <div className="mt-2 space-y-1">
            <p>
              · 이름:{" "}
              <span className="font-semibold">
                T-Mall 프로젝트 관리자 (학습용)
              </span>
            </p>
            <p>
              · 이메일:{" "}
              <span className="font-mono text-xs">tmall.dev@example.com</span>{" "}
              (예시 · 테스트용 주소)
            </p>
            <p>· 역할: 데이터 초기화 및 관리, 개인정보 보호 정책 유지</p>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-green-600 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
          제7조 (이용자의 권리)
        </h2>
        <ul className="mt-3 space-y-1.5 text-sm text-gray-700 leading-relaxed list-disc list-inside">
          <li>
            이용자는 자신의 계정 정보 열람, 수정, 삭제를 요청할 수 있습니다.
          </li>
          <li>
            본 프로젝트는 학습용 환경이므로, 삭제 요청 시 가능한 범위 내에서
            신속하게 반영되도록 합니다.
          </li>
        </ul>
      </section>

      <section className="mt-8 mb-4">
        <h2 className="text-lg font-semibold text-green-600 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
          제8조 (개인정보 처리방침 변경)
        </h2>
        <ul className="mt-3 space-y-1.5 text-sm text-gray-700 leading-relaxed list-disc list-inside">
          <li>
            본 개인정보 처리방침은 프로젝트 구조 변경, 기술 스택 변경, 학습 범위
            조정 등에 따라 예고 없이 수정될 수 있습니다.
          </li>
          <li>
            변경된 내용은 사이트 하단의 &quot;개인정보 처리방침&quot; 링크를
            통해 최신 버전으로 제공됩니다.
          </li>
        </ul>
      </section>

      <section className="mt-8">
        <div className="flex items-start gap-3 rounded-lg border border-green-100 bg-green-50 px-4 py-3">
          <Info className="w-5 h-5 text-green-600 mt-0.5" />
          <div className="text-sm text-gray-700 leading-relaxed">
            <p className="font-semibold text-green-700">
              본 사이트는 실제 서비스를 제공하는 상업용 서비스가 아닌,
              포트폴리오 및 개인 학습을 위한 테스트 환경입니다.
            </p>
            <p className="mt-1.5">
              수집되는 정보는 가능한 최소한으로 제한하며, 학습 및 기능 테스트
              외의 용도로 사용하지 않습니다.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
