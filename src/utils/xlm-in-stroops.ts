// 1 XLM = 10,000,000 stroops
export const ONE_XLM_IN_STROOPS = 10_000_000;

export function xlmToStroops(xlm: number): number {
  return xlm * ONE_XLM_IN_STROOPS;
}

export function stroopsToXlm(stroops: number): number {
  return stroops / ONE_XLM_IN_STROOPS;
}
