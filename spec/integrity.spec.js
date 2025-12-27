import { describe, it } from 'node:test'
import assert from 'node:assert'
import { validate_phone_integrity } from '../src/integrity.js'

describe('validate_phone_integrity', () => {
  it('returns false when integrity_data is null', () => {
    const result = validate_phone_integrity(null)
    assert.strictEqual(result, false)
  })

  it('returns false when line_type_intelligence is missing', () => {
    const result = validate_phone_integrity({})
    assert.strictEqual(result, false)
  })

  it('returns false when type is not mobile', () => {
    const result = validate_phone_integrity({
      line_type_intelligence: {
        type: 'landline',
        carrier_name: 'AT&T'
      }
    })
    assert.strictEqual(result, false)
  })

  it('returns false when carrier is blacklisted (VoIP)', () => {
    const result = validate_phone_integrity({
      line_type_intelligence: {
        type: 'mobile',
        carrier_name: 'Google (Grand Central) - SVR'
      }
    })
    assert.strictEqual(result, false)
  })

  it('returns false when carrier is TextNow', () => {
    const result = validate_phone_integrity({
      line_type_intelligence: {
        type: 'mobile',
        carrier_name: 'TextNow Wireless - SVR'
      }
    })
    assert.strictEqual(result, false)
  })

  it('returns true for valid mobile carrier', () => {
    const result = validate_phone_integrity({
      line_type_intelligence: {
        type: 'mobile',
        carrier_name: 'Verizon Wireless'
      }
    })
    assert.strictEqual(result, true)
  })

  it('returns true for mobile without carrier_name', () => {
    const result = validate_phone_integrity({
      line_type_intelligence: {
        type: 'mobile'
      }
    })
    assert.strictEqual(result, true)
  })
})

