import { describe, it } from 'node:test'
import assert from 'node:assert'
import { create_rate_limiter } from '../src/utils/rate-limiter.js'

const SHORT_DELAY = 10
const MEDIUM_DELAY = 50
const LONG_DELAY = 60

describe('create_rate_limiter', () => {
	it('returns a function', () => {
		const limiter = create_rate_limiter()
		assert.strictEqual(typeof limiter, 'function')
	})

  it('executes function immediately on first call', async () => {
    const limiter = create_rate_limiter(MEDIUM_DELAY)
    const start = Date.now()
    const result = await limiter(() => 'test')
    const duration = Date.now() - start

    assert.strictEqual(result, 'test')
    assert.ok(duration < SHORT_DELAY)
  })

  it('delays second call if within rate limit window', async () => {
    const limiter = create_rate_limiter(MEDIUM_DELAY)
    const start = Date.now()

    await limiter(() => 'first')
    await limiter(() => 'second')

    const duration = Date.now() - start
    assert.ok(duration >= MEDIUM_DELAY)
  })

  it('does not delay if enough time has passed', async () => {
    const limiter = create_rate_limiter(MEDIUM_DELAY)

    await limiter(() => 'first')
    await new Promise(resolve => {
      setTimeout(resolve, LONG_DELAY)
    })

    const start = Date.now()
    await limiter(() => 'second')
    const duration = Date.now() - start

    assert.ok(duration < SHORT_DELAY)
  })

  it('returns the result of the function', async () => {
    const limiter = create_rate_limiter(SHORT_DELAY)
    const result = await limiter(() => ({ value: 42 }))

    assert.deepStrictEqual(result, { value: 42 })
  })

  it('uses default delay of 50ms', async () => {
    const limiter = create_rate_limiter()
    const start = Date.now()

    await limiter(() => 'first')
    await limiter(() => 'second')

    const duration = Date.now() - start
    assert.ok(duration >= MEDIUM_DELAY)
  })
})
