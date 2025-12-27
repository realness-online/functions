import twilio from 'twilio'
import { db, auth } from '#utils/firebase.js'
import { create_rate_limiter } from '#utils/rate-limiter.js'

const client = new twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

// Common VoIP carriers to block
const blacklisted_carriers = [
  'Google (Grand Central) - SVR',
  'Bandwidth/13 - Bandwidth.com - SVR',
  'Bandwidth/15 - Bandwidth.com - SVR',
  'TextPlus - 360 Networks - SVR',
  'TextPlus - Inteliquent - SVR',
  'Sinch A2P - Sinch',
  'Onvoy Spectrum, LLC',
  'Twilio - SMS/MMS-SVR',
  'Telnyx/1 A2P - SVR',
  'Level 3 Communications, LLC',
  'Plivo - SVR',
  'Sinch A2P - Sinch',
  'Skype Communications SARL - Level3 - SVR',
  'Talktone P2P - Bandwidth - SVR',
  'Telnyx/1 A2P - SVR',
  'TextNow Wireless - SVR',
  'TextNow - Neutral Tandem - SVR',
  'TextPlus - 360 Networks - SVR',
  'Twilio - SMS/MMS-SVR'
]

export const validate_phone_integrity = integrity_data => {
  if (!integrity_data?.line_type_intelligence) return false

  const { type, carrier_name } = integrity_data.line_type_intelligence

  if (type !== 'mobile') return false

  if (carrier_name && blacklisted_carriers.includes(carrier_name.toLowerCase()))
    return false

  return true
}

export const check_integrity = async () => {
  console.info('Starting integrity check...')

  const users_snapshot = await db.collection('users').get()

  const limited_request = create_rate_limiter() // 50ms delay
  const output = []

  for (const user_doc of users_snapshot.docs) {
    const user = { id: user_doc.id, ...user_doc.data() }

    if (!user.phone) continue

    const phone_doc = await db.collection('phone_numbers').doc(user.phone).get()

    let integrity_data
    let intelligence

    if (phone_doc.exists) {
      integrity_data = phone_doc.data()
      intelligence = {
        type: integrity_data.type,
        carrier_name: integrity_data.carrier_name
      }
    } else {
      const result = await limited_request(() =>
        client.lookups.v2.phoneNumbers(user.phone).fetch({
          fields: ['line_type_intelligence']
        })
      )

      intelligence = result.lineTypeIntelligence

      integrity_data = {
        type: intelligence?.type || 'unknown',
        carrier_name: intelligence?.carrier_name || 'unknown',
        country_code: intelligence?.mobile_country_code || 'unknown',
        network_code: intelligence?.mobile_network_code || 'unknown',
        checked_at: new Date().toISOString()
      }

      await db.collection('phone_numbers').doc(user.phone).set(integrity_data)
    }

    const is_valid = validate_phone_integrity({ line_type_intelligence: intelligence })

    await auth.setCustomUserClaims(user.id, {
      phone_verified: is_valid,
      is_voip: !is_valid
    })

    output.push({ user_id: user.id, phone: user.phone, valid: is_valid })
  }
  return output
}
