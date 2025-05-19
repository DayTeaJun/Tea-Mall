// supabase storage 이미지 경로 추출
export function extractFilePathFromUrl(
  publicUrl: string,
  bucketName: string,
): string {
  const prefix = `/storage/v1/object/public/${bucketName}/`;
  const index = publicUrl.indexOf(prefix);
  if (index === -1) return "";

  return publicUrl.slice(index + prefix.length).trim(); // ← 여기 trim 추가 가능
}
