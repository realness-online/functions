/**
 * Creates a rate limiter that delays requests
 * @param {number} delay_ms - Delay in milliseconds between requests
 * @returns {Function} Rate limited request function
 */
export const create_rate_limiter = (delay_ms = 50) => {
	let last_request = 0

	return async fn => {
		const now = Date.now()
		const time_since_last = now - last_request

		if (time_since_last < delay_ms)
			await new Promise(resolve => {
				setTimeout(resolve, delay_ms - time_since_last)
			})

		last_request = Date.now()
		return fn()
	}
}

