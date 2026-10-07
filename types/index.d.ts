declare module 'claude-code' {
  interface PluginState {
    'cost-bar': {
      usd: number | null
      context: { tokens?: number; window: number; percent?: number } | null
    }
  }
}
