// ─── FORMATTERS ───────────────────────────────────────────────
export function fmt(n) {
    if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`
    if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`
    if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`
    if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}K`
    return `$${n.toFixed(n < 10 ? 2 : 0)}`
}

export function fmtIncome(n) {
    if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M/s`
    if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K/s`
    return `${n.toFixed(1)}/s`
}

export function fmtShort(n) {
    if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`
    if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`
    if (n >= 1e3) return `${(n / 1e3).toFixed(0)}K`
    return `${Math.floor(n)}`
}

export function wealthProgress(totalEarned, WEALTH_LEVELS) {
    const idx = [...WEALTH_LEVELS].reverse().findIndex(w => totalEarned >= w.min)
    const cur = [...WEALTH_LEVELS].reverse()[idx]
    const nxtIdx = WEALTH_LEVELS.length - idx
    if (nxtIdx >= WEALTH_LEVELS.length) return { pct: 100, cur, nxt: null }
    const nxt = WEALTH_LEVELS[nxtIdx]
    const pct = ((totalEarned - cur.min) / (nxt.min - cur.min)) * 100
    return { pct: Math.min(pct, 100), cur, nxt }
}

export function clsx(...args) {
    return args.filter(Boolean).join(' ')
}
