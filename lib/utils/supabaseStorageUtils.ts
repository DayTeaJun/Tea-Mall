export function extractFilePathFromUrl(
  publicUrl: string,
  bucketName: string,
): string {
  const prefix = `/storage/v1/object/public/${bucketName}/`;
  const index = publicUrl.indexOf(prefix);
  if (index === -1) return "";

  return publicUrl.slice(index + prefix.length).trim();
}
