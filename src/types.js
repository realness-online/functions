/**
 * @typedef {Object} FunctionContext
 * @property {Object} auth - Authentication context
 * @property {string} auth.uid - User ID
 */

/**
 * @typedef {Object} HttpsError
 * @property {string} code - Error code
 * @property {string} message - Error message
 */

/**
 * @typedef {Object} LineTypeIntelligence
 * @property {string} type - Line type (mobile, landline, voip, etc.)
 * @property {string} [carrier_name] - Carrier name
 * @property {string} [mobile_country_code] - Mobile country code
 * @property {string} [mobile_network_code] - Mobile network code
 */

/**
 * @typedef {Object} IntegrityData
 * @property {LineTypeIntelligence} line_type_intelligence - Line type intelligence data
 */

/**
 * @typedef {Object} IntegrityCheckResult
 * @property {string} user_id - User ID
 * @property {string} phone - Phone number
 * @property {boolean} valid - Whether the phone is valid
 */

export {}
