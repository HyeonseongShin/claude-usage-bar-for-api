export const formatUsd = (usd: number): string => `$${usd.toFixed(usd < 1 ? 3 : 2)}`

export const formatTokens = (n: number): string =>
  n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `${Math.round(n / 1e3)}k` : `${n}`

export type Context = { tokens?: number; window: number; percent?: number }

const BAR_CELLS = 10

export const formatContext = ({ tokens, window, percent }: Context): string => {
  const pct = percent ?? 0
  const filled = Math.min(BAR_CELLS, Math.max(pct > 0 ? 1 : 0, Math.round((pct / 100) * BAR_CELLS)))
  const bar = '█'.repeat(filled) + '░'.repeat(BAR_CELLS - filled)

  return `Context [${bar}] ${pct}% ${formatTokens(tokens ?? 0)}/${formatTokens(window)}`
}
