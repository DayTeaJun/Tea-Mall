// 입력 중 실시간으로 숫자만 남기고 자동으로 하이픈을 붙여줌 (010-1234-5678 형태)
export function formatPhoneNumber(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length < 4) return digits;
  if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

// 하이픈 포함 10~11자리 숫자만 유효한 전화번호로 인정
export function isValidPhoneNumber(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length === 10 || digits.length === 11;
}
