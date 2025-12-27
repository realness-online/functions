import { onCall, onRequest } from 'firebase-functions/v2/https'
import { onSchedule } from 'firebase-functions/v2/scheduler'
import { check_integrity } from './integrity.js'

export const health_check = onCall(() => ({ status: 'ok', timestamp: Date.now() }))

export const integrity_check = onRequest(async (req, res) => {
	const result = await check_integrity()
	res.json({ success: true, result })
})

export const scheduled_integrity_check = onSchedule('every 24 hours', async () => {
	await check_integrity()
})

