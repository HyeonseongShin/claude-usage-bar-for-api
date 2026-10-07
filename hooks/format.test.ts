import { expect, test } from 'claude-code/testing'

import { formatUsd } from './format'

test('formatUsd: three decimals under $1, two above', () => {
  expect(formatUsd(0.0421)).toBe('$0.042')
  expect(formatUsd(12.345)).toBe('$12.35')
})
