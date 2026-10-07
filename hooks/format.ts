export const formatUsd = (usd: number): string => `$${usd.toFixed(usd < 1 ? 3 : 2)}`
