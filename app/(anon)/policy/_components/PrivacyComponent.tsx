import { Info } from "lucide-react";

export default function PrivacyComponent() {
  return (
    <main>
      <header className="flex items-center gap-3 mb-8">
        <div>
          <h1 className="text-xl font-semibold mb-2 text-green-600">
            개인정보 처리방침
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            T-Mall 학습용 웹사이트에서의 개인정보 처리 안내입니다.
          </p>
        </div>
      </header>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-green-600 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
          제1조 (개인정보 수집 및 이용 목적)
        </h2>
        <p className="mt-3 text-sm text-gray-700 leading-relaxed">
          본 사이트는 학습 및 테스트 환경 제공을 위해 다음과 같은 최소한의
          정보를 수집합니다.
        </p>
        <ul className="mt-2 space-y-1.5 text-sm text-gray-700 list-disc list-inside">
          <li>이메일 주소 (Supabase Auth 인증용)</li>
          <li>닉네임 또는 사용자명 (프로필 표시용)</li>
          <li>프로필 이미지 (선택사항)</li>
          <li>전화번호, 주소 (선택사항, 임의 입력 가능)</li>
        </ul>
        <p className="mt-2 text-sm text-gray-700 leading-relaxed">
          수집된 정보는 상업적 목적으로 사용되지 않으며,{" "}
          <span className="font-semibold">학습용 테스트 데이터</span>로만
          처리됩니다.
        </p>

        <p className="mt-4 text-sm text-gray-700 leading-relaxed">
          회원가입 시 운영자가 제공하는{" "}
          <span className="font-semibold">테스트 계정</span>을 사용하는 것을
          권장합니다. 직접 가입하는 경우 다음을 참고해 주세요.
        </p>
        <ul className="mt-2 space-y-1.5 text-sm text-gray-700 list-disc list-inside">
          <li>
            실제 이메일과 비밀번호를 사용할 필요는 없습니다. 테스트용 임의 값을
            사용해도 됩니다.
          </li>
          <li>
            다만,{" "}
            <span className="font-semibold">
              아이디 찾기나 비밀번호 재설정 기능
            </span>
            을 이용하려면 메일을 수신할 수 있는 실제 이메일을 입력해야 합니다.
          </li>
          <li>
            회원가입과 로그인 절차는{" "}
            <span className="font-semibold">학습용 시나리오</span> 구현을 위한
            구조입니다.
          </li>
        </ul>
      </section>

      <section className="mt-8">
        <div className="rounded-md border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-700 leading-relaxed">
          <p>
            회원가입 없이 바로 체험할 수 있도록 아래의 테스트 계정을 제공합니다.
          </p>
          <div className="mt-2 space-y-1">
            <p>
              · 아이디(이메일):{" "}
              <span className="font-mono text-xs">testuser@tmall.com</span>
            </p>
            <p>
              · 비밀번호: <span className="font-mono text-xs">test1234</span>
            </p>
            <p>
              · 권한: 일반 사용자 (일부 기능 제한 가능, 주기적으로 데이터
              초기화)
            </p>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-green-600 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
          제2조 (보유 및 이용 기간)
        </h2>
        <ul className="mt-3 space-y-1.5 text-sm text-gray-700 list-disc list-inside">
          <li>
            테스트 계정 관련 데이터는 일정 주기마다{" "}
            <span className="font-semibold">초기화</span>될 수 있습니다.
          </li>
          <li>
            학습 환경 변경이나 데이터베이스 구조 수정 시 사전 예고 없이 삭제될
            수 있습니다.
          </li>
          <li>계정 삭제 요청 시 가능한 범위 내에서 신속히 반영합니다.</li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-green-600 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
          제3조 (개인정보의 제3자 제공)
        </h2>
        <ul className="mt-3 space-y-1.5 text-sm text-gray-700 list-disc list-inside">
          <li>개인정보를 제3자에게 판매하거나 공유하지 않습니다.</li>
          <li>
            다만 Supabase, AWS(S3·CloudFront) 등 인프라 제공자가 데이터 저장과
            전송을 위한 <span className="font-semibold">기술적 범위 내</span>
            에서 접근할 수 있습니다.
          </li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-green-600 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
          제4조 (쿠키 및 로그파일)
        </h2>
        <ul className="mt-3 space-y-1.5 text-sm text-gray-700 list-disc list-inside">
          <li>로그인 유지와 기본 서비스 제공을 위해 세션 쿠키를 사용합니다.</li>
          <li>
            접속 기록과 에러 로그는 서비스 안정화 및 성능 개선을 위한 통계용으로
            활용되며 개인 식별에는 사용되지 않습니다.
          </li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-green-600 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
          제5조 (안전성 확보 조치)
        </h2>
        <ul className="mt-3 space-y-1.5 text-sm text-gray-700 list-disc list-inside">
          <li>
            Supabase Auth의 비밀번호는 암호화되어 저장되며 운영자는 원문을
            확인할 수 없습니다.
          </li>
          <li>
            데이터는 접근 제어 및 권한 설정을 통해 외부에서 직접 접근할 수 없게
            관리됩니다.
          </li>
          <li>
            완전한 상용 보안 수준은 아니지만, 학습 환경 내에서 가능한 범위의
            안전성을 확보합니다.
          </li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-green-600 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
          제6조 (개인정보 관리 책임자)
        </h2>
        <div className="rounded-md border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-700 leading-relaxed">
          <p>T-Mall 프로젝트의 개인정보 관리 책임자는 다음과 같습니다.</p>
          <div className="mt-2 space-y-1">
            <p>
              · 이름:{" "}
              <span className="font-semibold">
                T-Mall 프로젝트 관리자 (학습용)
              </span>
            </p>
            <p>
              · 이메일:{" "}
              <span className="font-mono text-xs">gkfnck@gmail.com</span>
            </p>
            <p>· 역할: 데이터 초기화 및 정책 관리</p>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-green-600 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
          제7조 (이용자의 권리)
        </h2>
        <ul className="mt-3 space-y-1.5 text-sm text-gray-700 list-disc list-inside">
          <li>
            이용자는 자신의 계정 정보 열람, 수정, 삭제를 요청할 수 있습니다.
          </li>
          <li>요청 시 가능한 범위 내에서 신속히 반영합니다.</li>
        </ul>
      </section>

      <section className="mt-8 mb-4">
        <h2 className="text-lg font-semibold text-green-600 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
          제8조 (처리방침 변경)
        </h2>
        <ul className="mt-3 space-y-1.5 text-sm text-gray-700 list-disc list-inside">
          <li>
            프로젝트 구조나 기술 스택 변경에 따라 내용이 예고 없이 수정될 수
            있습니다.
          </li>
          <li>
            최신 버전은 사이트 하단의 &quot;개인정보 처리방침&quot; 링크를 통해
            확인할 수 있습니다.
          </li>
        </ul>
      </section>

      <section className="mt-8">
        <div className="flex items-start gap-3 rounded-lg border border-green-100 bg-green-50 px-4 py-3">
          <Info className="w-5 h-5 text-green-600 mt-0.5" />
          <div className="text-sm text-gray-700 leading-relaxed">
            <p className="font-semibold text-green-700">
              본 사이트는 상업적 서비스를 제공하지 않으며,{" "}
              <span className="font-semibold">포트폴리오 및 학습용</span>으로
              운영됩니다.
            </p>
            <p className="mt-1.5">
              모든 약관 및 정책은 실무 예시를 보여주기 위한 문서이며 법적 효력을
              가지지 않습니다.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
