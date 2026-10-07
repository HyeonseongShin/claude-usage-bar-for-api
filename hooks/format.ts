export const formatUsd = (usd: number): string => `$${usd.toFixed(usd < 1 ? 3 : 2)}`

export const formatTokens = (n: number): string =>
  n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `${Math.round(n / 1e3)}k` : `${n}`

export type Context = { tokens?: number; window: number; percent?: number }

export const formatContext = ({ tokens, window, percent }: Context): string =>
  `Context ${formatTokens(tokens ?? 0)}/${formatTokens(window)}(${percent ?? 0}%)`
