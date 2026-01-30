export type ExternalBPResult = { ids: number[]; reason: string };

export async function searchExternalBP(query: string): Promise<ExternalBPResult | null> {
  // ✅ 빌드 에러 방지용 기본 구현(나중에 실제 Gemini 연동으로 교체)
  const q = (query ?? "").trim();
  if (q.length < 2) return null;

  // (옵션) 키가 없으면 그냥 null 반환
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) return null;

  // TODO: 실제 호출 로직은 추후 추가
  return null;
}
