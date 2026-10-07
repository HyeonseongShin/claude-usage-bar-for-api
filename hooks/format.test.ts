import { expect, test } from 'claude-code/testing'

import { formatContext, formatUsd } from './format'

test('formatUsd: three decimals under $1, two above', () => {
  expect(formatUsd(0.0421)).toBe('$0.042')
  expect(formatUsd(12.345)).toBe('$12.35')
})

test('formatContext: k and M units', () => {
  expect(formatContext({ tokens: 82_000, window: 1_000_000, percent: 8 })).toBe('Context 82k/1.0M(8%)')
  expect(formatContext({ window: 200_000 })).toBe('Context 0/200k(0%)')
})
