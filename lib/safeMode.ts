// lib/safeMode.ts

type Counter = {
  count: number
  date: string
}

const globalAny = global as any

if (!globalAny.__usage) {
  globalAny.__usage = {
    daily: { count: 0, date: new Date().toDateString() },
    ips: new Map<string, { count: number; ts: number }>()
  }
}

export function checkDailyLimit(maxPerDay: number) {
  const today = new Date().toDateString()
  const daily: Counter = globalAny.__usage.daily

  if (daily.date !== today) {
    daily.count = 0
    daily.date = today
  }

  if (daily.count >= maxPerDay) {
    return false
  }

  daily.count++
  return true
}

export function checkIpLimit(ip: string, maxPerMinute: number) {
  const now = Date.now()
  const windowMs = 60_000

  const ips = globalAny.__usage.ips
  const record = ips.get(ip)

  if (!record || now - record.ts > windowMs) {
    ips.set(ip, { count: 1, ts: now })
    return true
  }

  if (record.count >= maxPerMinute) {
    return false
  }

  record.count++
  return true
}