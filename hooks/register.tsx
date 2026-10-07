import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'

import { formatContext, formatUsd } from './format'

const usd = atom({ plugin: 'cost-bar', key: 'usd' } as const, null)
const context = atom({ plugin: 'cost-bar', key: 'context' } as const, null)

export const register: Register = on => {
  // Seed from the ledger so a resumed session shows its totals before the first turn ends.
  on('session.start', async ($, e, next) => {
    const u = await $.session.usage()
    if (u.cost) await update($, usd, () => u.cost!.usd)
    await update($, context, () => u.context)

    return next(e)
  })

  on('session.measure', async ($, e, next) => {
    if (e.cost) await update($, usd, () => e.cost!.usd)
    await update($, context, () => e.context)

    return next(e)
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const cost = await read($, usd)
    const ctx = await read($, context)
    if (cost === null || e.props.hasSurvey) return next(e)

    const { Box, Text } = $.ui.resolve(e)

    return (
      <Box>
        <Text dimColor>
          Session cost: {formatUsd(cost)}
          {ctx ? ` | ${formatContext(ctx)}` : ''}
        </Text>
      </Box>
    )
  })
}
