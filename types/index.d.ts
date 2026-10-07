declare module 'claude-code' {
  interface PluginState {
    'cost-bar': {
      usd: number | null
      context: { tokens?: number; window: number; percent?: number } | null
      turns: number
      ttl: '5m' | '1h'
      lastRequestAt: number | null
    }
  }
}
