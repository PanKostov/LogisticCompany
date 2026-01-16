const API_BASE = import.meta.env.VITE_API_URL || ''

export async function apiFetch(path, options = {}) {
  const url = `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`
  const config = {
    credentials: 'include',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  }

  if (config.body && typeof config.body !== 'string') {
    config.body = JSON.stringify(config.body)
  }

  const response = await fetch(url, config)
  const text = await response.text()
  const data = text ? safeJsonParse(text) : null

  if (!response.ok) {
    const error = new Error(data?.message || response.statusText)
    error.status = response.status
    error.data = data
    throw error
  }

  return data
}

function safeJsonParse(text) {
  try {
    return JSON.parse(text)
  } catch (error) {
    return { message: text }
  }
}
