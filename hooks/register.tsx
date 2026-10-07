import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'

import { formatUsd } from './format'

const usd = atom({ plugin: 'cost-bar', key: 'usd' } as const, null)

export const register: Register = on => {
  // Seed from /cost's ledger so a resumed session shows its total before the first turn ends.
  on('session.start', async ($, e, next) => {
    const { cost } = await $.session.usage()
    if (cost) await update($, usd, () => cost.usd)

    return next(e)
  })

  on('session.measure', async ($, e, next) => {
    if (e.cost) await update($, usd, () => e.cost!.usd)

    return next(e)
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const value = await read($, usd)
    if (value === null || e.props.hasSurvey) return next(e)

    const { Box, Text } = $.ui.resolve(e)

    return (
      <Box>
        <Text dimColor>Session cost: {formatUsd(value)}</Text>
      </Box>
    )
  })
}
