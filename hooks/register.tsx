import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'

import { TTL_MS, formatRemaining, resolveTtl } from './cache'
import { formatContext, formatUsd } from './format'

const usd = atom({ plugin: 'cost-bar', key: 'usd' } as const, null)
const context = atom({ plugin: 'cost-bar', key: 'context' } as const, null)
const turns = atom({ plugin: 'cost-bar', key: 'turns' } as const, 0)
const ttl = atom({ plugin: 'cost-bar', key: 'ttl' } as const, '5m')
const lastRequestAt = atom({ plugin: 'cost-bar', key: 'lastRequestAt' } as const, null)

export const register: Register = on => {
  // Seed from the ledger so a resumed session shows its totals before the first turn ends.
  on('session.start', async ($, e, next) => {
    const settings = await $.settings.read()
    const resolved = resolveTtl({
      force5m: await $.env.get('FORCE_PROMPT_CACHING_5M'),
      envTtl: await $.env.get('CLAUDE_CODE_PROMPT_CACHE_TTL'),
      settingTtl: settings.promptCacheTtl,
      enable1h: await $.env.get('ENABLE_PROMPT_CACHING_1H'),
    })
    await update($, ttl, () => resolved)

    // ponytail: redraw once a second forever; stop it when idle if the repaint cost shows up.
    $.clock.every(1000, () => $.ui.invalidate('ui.render'))

    const u = await $.session.usage()
    if (u.cost) await update($, usd, () => u.cost!.usd)
    await update($, context, () => u.context)
    const n = await $.session.turns()
    await update($, turns, () => n)

    return next(e)
  })

  on('session.measure', async ($, e, next) => {
    if (e.cost) await update($, usd, () => e.cost!.usd)
    await update($, context, () => e.context)
    const n = await $.session.turns()
    await update($, turns, () => n)

    return next(e)
  })

  // The TTL runs from when a request starts: the prompt, and each request that follows a tool result.
  on('prompt.submit', async ($, e, next) => {
    const now = await $.clock.now()
    await update($, lastRequestAt, () => now)

    return next(e)
  }).catch(($, e, next) => next(e))

  on('tool.call', async ($, e, next) => {
    const result = await next(e)
    const now = await $.clock.now()
    await update($, lastRequestAt, () => now)

    return result
  }).catch(($, e, next) => next(e))

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const cost = await read($, usd)
    const ctx = await read($, context)
    const turn = await read($, turns)
    const at = await read($, lastRequestAt)
    const kind = await read($, ttl)
    const left = at === null ? null : at + TTL_MS[kind] - (await $.clock.now())
    if (cost === null || e.props.hasSurvey) return next(e)

    const { Box, Text } = $.ui.resolve(e)

    return (
      <Box>
        <Text dimColor>
          Session cost: {formatUsd(cost)}
          {ctx ? ` | ${formatContext(ctx)}` : ''} | Turn {turn}
          {left === null ? '' : ` | Cache(${kind}) ${formatRemaining(left)}`}
        </Text>
      </Box>
    )
  })
}
