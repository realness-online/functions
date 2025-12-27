/** @typedef {import('./types.js').IntegrityData} IntegrityData */
/** @typedef {import('./types.js').IntegrityCheckResult} IntegrityCheckResult */
/** @typedef {import('./types.js').LineTypeIntelligence} LineTypeIntelligence */

import twilio from 'twilio'
import { auth } from '#utils/firebase.js'
import { create_rate_limiter } from '#utils/rate-limiter.js'

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

// Common VoIP carriers to block (all lowercase for comparison)
const blacklisted_carriers = [
  'google (grand central) - svr',
  'bandwidth/13 - bandwidth.com - svr',
  'bandwidth/15 - bandwidth.com - svr',
  'textplus - 360 networks - svr',
  'textplus - inteliquent - svr',
  'sinch a2p - sinch',
  'onvoy spectrum, llc',
  'twilio - sms/mms-svr',
  'telnyx/1 a2p - svr',
  'level 3 communications, llc',
  'plivo - svr',
  'skype communications sarl - level3 - svr',
  'talktone p2p - bandwidth - svr',
  'textnow wireless - svr',
  'textnow - neutral tandem - svr'
]

/**
 * Validates phone integrity based on line type intelligence
 * @param {IntegrityData} integrity_data - Integrity data containing line type intelligence
 * @returns {boolean} Whether the phone is valid (mobile and not VoIP)
 */
export const validate_phone_integrity = integrity_data => {
  if (!integrity_data?.line_type_intelligence) return false

  const { type, carrier_name } = integrity_data.line_type_intelligence

  if (type !== 'mobile') return false

  if (carrier_name && blacklisted_carriers.includes(carrier_name.toLowerCase()))
    return false

  return true
}

const MAX_USERS_PER_PAGE = 1000

/**
 * Checks phone integrity for all authenticated users
 * @returns {Promise<IntegrityCheckResult[]>} Array of integrity check results
 */
export const check_integrity = async () => {
  const limited_request = create_rate_limiter() // 50ms delay
  const output = []

  let page_token
  do {
    // eslint-disable-next-line no-await-in-loop
    const list_result = await auth.listUsers(MAX_USERS_PER_PAGE, page_token)

    for (const user of list_result.users) {
      if (!user.phoneNumber) continue

      const existing_claims = user.customClaims || {}
      let intelligence

      if (existing_claims.phone_type && existing_claims.carrier_name)
        intelligence = {
          type: existing_claims.phone_type,
          carrier_name: existing_claims.carrier_name
        }
      else {
        // eslint-disable-next-line no-await-in-loop
        const result = await limited_request(() =>
          client.lookups.v2.phoneNumbers(user.phoneNumber).fetch({
            fields: 'line_type_intelligence'
          })
        )

        intelligence = result.lineTypeIntelligence
      }

      const is_valid = validate_phone_integrity({ line_type_intelligence: intelligence })

      // eslint-disable-next-line no-await-in-loop
      await auth.setCustomUserClaims(user.uid, {
        ...existing_claims,
        phone_type: intelligence?.type || 'unknown',
        carrier_name: intelligence?.carrier_name || 'unknown',
        phone_verified: is_valid,
        is_voip: !is_valid
      })

      output.push({ user_id: user.uid, phone: user.phoneNumber, valid: is_valid })
    }

    page_token = list_result.pageToken
  } while (page_token)

  return output
}
