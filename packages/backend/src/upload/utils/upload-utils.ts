export function toHeaderSafe(value: string, maxLen = 1000): string {
  if (!value) return '';
  return value
    .normalize('NFKD')              // split accents from letters
    .replace(/[\u0300-\u036f]/g, '')// remove diacritics
    .replace(/[\r\n]/g, ' ')        // no CR/LF in headers
    .replace(/\s+/g, ' ')           // collapse whitespace
    .replace(/[^\x20-\x7E]/g, '')   // keep only printable ASCII
    .trim()
    .slice(0, maxLen);
}