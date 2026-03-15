import { useGameStore, REAL_ESTATE, CRYPTO_ASSETS, STOCKS_ASSETS, upgradeCost } from '../store/gameStore'
import { fmt, fmtIncome } from '../utils/format'
import { AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Home, Bitcoin, TrendingUp, Zap } from 'lucide-react'

// ─── SHARED UPGRADE CARD ──────────────────────────────────────
function UpgCard({ item, category, accentColor }) {
    const { balance, buyUpgrade } = useGameStore()
    const cost = upgradeCost(item.cost, item.level)
    const canAfford = balance >= cost
    const maxed = item.level >= item.maxLvl
    const pct = (item.level / item.maxLvl) * 100
    return (
        <button className={`upg-card ${maxed ? 'maxed' : ''}`} onClick={() => buyUpgrade(category, item.id)} disabled={!canAfford || maxed}>
            {canAfford && !maxed && (
                <div style={{ position: 'absolute', top: 8, right: 8, width: 6, height: 6, borderRadius: '50%', background: accentColor, boxShadow: `0 0 8px ${accentColor}`, animation: 'pulseRing 1.5s infinite' }} />
            )}
            <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ fontSize: 22 }}>{item.icon}</div>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: maxed ? '#10b981' : '#e2e8f0' }}>{item.name}</span>
                        <span style={{ fontSize: 9, padding: '1px 5px', borderRadius: 5, fontFamily: 'JetBrains Mono', fontWeight: 700, background: `${accentColor}18`, color: accentColor }}>
                            {item.level}/{item.maxLvl}
                        </span>
                    </div>
                    <div style={{ fontSize: 10, color: '#475569', marginBottom: 6 }}>{item.desc}</div>
                    <div className="pbar" style={{ marginBottom: 5 }}>
                        <div className="pfill" style={{ width: `${pct}%`, background: maxed ? '#10b981' : accentColor }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 10, fontFamily: 'JetBrains Mono', fontWeight: 700, color: maxed ? '#10b981' : canAfford ? '#10b981' : '#475569' }}>
                            {maxed ? '✅ MAX' : fmt(cost)}
                        </span>
                        <span style={{ fontSize: 10, color: '#1e3a5f', fontFamily: 'JetBrains Mono' }}>+{fmtIncome(item.income)}</span>
                    </div>
                </div>
            </div>
        </button>
    )
}

// ═══════════════════════════════════════════════════════════════
// IMMOBILIER SECTION
// ═══════════════════════════════════════════════════════════════
export function RealEstateSection() {
    const { balance, totalEarned, incomePerSec, history, realEstate } = useGameStore()
    const items = REAL_ESTATE.map(r => ({ ...r, ...realEstate[r.id] }))
    const reIncome = Object.values(realEstate).reduce((s, u) => s + u.income * u.level, 0)
    const chartData = history.map((h, i) => ({ i, v: h.v * 0.4 + Math.sin(i * 0.3) * 1000 }))

    const properties = [
        { city: 'Paris', flag: '🇫🇷', value: fmt(totalEarned * 0.15), yield: '4.2%', color: '#3b82f6' },
        { city: 'New York', flag: '🇺🇸', value: fmt(totalEarned * 0.28), yield: '5.1%', color: '#10b981' },
        { city: 'Dubai', flag: '🇦🇪', value: fmt(totalEarned * 0.12), yield: '6.8%', color: '#f59e0b' },
        { city: 'Tokyo', flag: '🇯🇵', value: fmt(totalEarned * 0.09), yield: '3.9%', color: '#8b5cf6' },
    ]

    return (
        <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
            <div className="scroll-y" style={{ flex: 1, padding: '24px' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Home size={16} color="#10b981" />
                    </div>
                    <div>
                        <h2 style={{ fontSize: 18, fontWeight: 800, color: '#f1f5f9' }}>Portfolio Immobilier</h2>
                        <p style={{ fontSize: 11, color: '#475569' }}>Bâtissez un empire immobilier mondial</p>
                    </div>
                </div>

                {/* Stats row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 20 }}>
                    {[
                        { label: 'Valeur Portfolio', val: fmt(totalEarned * 0.6), icon: '🏙️', color: '#10b981' },
                        { label: 'Loyers / heure', val: fmt(reIncome * 3600), icon: '🔑', color: '#3b82f6' },
                        { label: 'Propriétés', val: items.filter(i => i.level > 0).length, icon: '🏠', color: '#f59e0b' },
                        { label: 'Rendement moy.', val: '5.3%', icon: '📈', color: '#8b5cf6' },
                    ].map(s => (
                        <div key={s.label} className="glass-panel" style={{ padding: '14px 16px' }}>
                            <div style={{ fontSize: 18, marginBottom: 8 }}>{s.icon}</div>
                            <div style={{ fontSize: 10, color: '#475569', marginBottom: 4 }}>{s.label}</div>
                            <div style={{ fontSize: 15, fontWeight: 800, color: s.color, fontFamily: 'JetBrains Mono' }}>{s.val}</div>
                        </div>
                    ))}
                </div>

                {/* Map / City breakdown */}
                <div className="glass-panel" style={{ padding: '16px', marginBottom: 16 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Exposition Géographique</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {properties.map(p => (
                            <div key={p.city} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <span style={{ fontSize: 18 }}>{p.flag}</span>
                                <span style={{ width: 80, fontSize: 12, fontWeight: 600, color: '#cbd5e1' }}>{p.city}</span>
                                <div style={{ flex: 1 }}>
                                    <div className="pbar">
                                        <div className="pfill" style={{ width: `${Math.random() * 60 + 20}%`, background: p.color }} />
                                    </div>
                                </div>
                                <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono', color: '#10b981', width: 80, textAlign: 'right' }}>{p.value}</span>
                                <span style={{ fontSize: 10, color: '#334155', width: 40, textAlign: 'right' }}>{p.yield}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chart */}
                <div className="glass-panel" style={{ padding: '14px' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Valorisation Immobilière</div>
                    <ResponsiveContainer width="100%" height={100}>
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="reGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <Area type="monotone" dataKey="v" stroke="#10b981" strokeWidth={2} fill="url(#reGrad)" dot={false} />
                            <Tooltip contentStyle={{ background: '#0c1a3a', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 8, fontSize: 10, color: '#e2e8f0' }} formatter={v => [fmt(Math.abs(v)), 'Valeur']} labelFormatter={() => ''} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="scroll-y" style={{ flex: '0 0 280px', padding: '20px 14px', borderLeft: '1px solid rgba(30,58,143,0.12)' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Zap size={12} color="#10b981" />Acquisitions
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {items.map(i => <UpgCard key={i.id} item={i} category="realestate" accentColor="#10b981" />)}
                </div>
            </div>
        </div>
    )
}

// ═══════════════════════════════════════════════════════════════
// CRYPTO SECTION
// ═══════════════════════════════════════════════════════════════
export function CryptoSection() {
    const { balance, totalEarned, history, cryptoAssets } = useGameStore()
    const items = CRYPTO_ASSETS.map(c => ({ ...c, ...cryptoAssets[c.id] }))

    const mkData = (offset, freq, amp) =>
        history.map((h, i) => ({ i, v: Math.max(0, h.v + Math.sin((i + offset) * freq) * h.v * amp + Math.cos(i * 0.2) * h.v * 0.03) }))

    const prices = [
        { sym: 'BTC', price: `$${(97350 + Math.sin(Date.now() / 10000) * 1200).toFixed(0)}`, change: +2.34, color: '#f59e0b', icon: '₿' },
        { sym: 'ETH', price: `$${(3240 + Math.sin(Date.now() / 8000) * 80).toFixed(0)}`, change: -0.87, color: '#8b5cf6', icon: '⟠' },
        { sym: 'SOL', price: `$${(185 + Math.sin(Date.now() / 6000) * 12).toFixed(0)}`, change: +5.12, color: '#10b981', icon: '◎' },
        { sym: 'BNB', price: `$${(620 + Math.sin(Date.now() / 7000) * 30).toFixed(0)}`, change: +1.05, color: '#f97316', icon: '⬡' },
        { sym: 'AVAX', price: `$${(48 + Math.sin(Date.now() / 5000) * 4).toFixed(0)}`, change: -2.11, color: '#ef4444', icon: '▲' },
        { sym: 'MATIC', price: `$${(1.24 + Math.sin(Date.now() / 4000) * 0.08).toFixed(2)}`, change: +0.62, color: '#3b82f6', icon: '⬡' },
    ]

    return (
        <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
            <div className="scroll-y" style={{ flex: 1, padding: '24px' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Bitcoin size={16} color="#f59e0b" />
                    </div>
                    <div>
                        <h2 style={{ fontSize: 18, fontWeight: 800, color: '#f1f5f9' }}>Crypto Portfolio</h2>
                        <p style={{ fontSize: 11, color: '#475569' }}>Marché décentralisé 24h/24 — to the moon 🚀</p>
                    </div>
                </div>

                {/* Live prices ticker */}
                <div className="glass-panel" style={{ padding: '12px 16px', marginBottom: 16, overflow: 'hidden' }}>
                    <div style={{ fontSize: 9, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>LIVE MARKET</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 8 }}>
                        {prices.map(p => (
                            <div key={p.sym} className="stock-chip" style={{
                                background: `${p.color}10`, borderColor: `${p.color}20`, color: p.color,
                            }}>
                                <span style={{ fontSize: 13 }}>{p.icon}</span>
                                <span style={{ fontWeight: 800 }}>{p.sym}</span>
                                <span style={{ fontSize: 9 }}>{p.price}</span>
                                <span style={{ fontSize: 9, color: p.change > 0 ? '#10b981' : '#ef4444' }}>
                                    {p.change > 0 ? '▲' : '▼'}{Math.abs(p.change)}%
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Charts */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
                    {[
                        { sym: 'Bitcoin', data: mkData(0, 0.4, 0.08), color: '#f59e0b' },
                        { sym: 'Ethereum', data: mkData(2, 0.6, 0.06), color: '#8b5cf6' },
                    ].map(c => (
                        <div key={c.sym} className="glass-panel" style={{ padding: '14px' }}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 8 }}>{c.sym} / USD</div>
                            <ResponsiveContainer width="100%" height={90}>
                                <AreaChart data={c.data}>
                                    <defs>
                                        <linearGradient id={`cg-${c.sym}`} x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={c.color} stopOpacity={0.2} />
                                            <stop offset="95%" stopColor={c.color} stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <Area type="monotone" dataKey="v" stroke={c.color} strokeWidth={2} fill={`url(#cg-${c.sym})`} dot={false} />
                                    <Tooltip contentStyle={{ background: '#0c1a3a', border: `1px solid ${c.color}30`, borderRadius: 8, fontSize: 10, color: '#e2e8f0' }} formatter={v => [fmt(v), c.sym]} labelFormatter={() => ''} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    ))}
                </div>

                {/* DeFi stats */}
                <div className="glass-panel" style={{ padding: '16px' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>DeFi Portfolio</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                        {[
                            { label: 'Total Locked (TVL)', val: fmt(totalEarned * 2.3), color: '#f59e0b' },
                            { label: 'APY Staking Moyen', val: '127.3%', color: '#10b981' },
                            { label: 'Gains Non-Réalisés', val: fmt(totalEarned * 0.45), color: '#8b5cf6' },
                        ].map(s => (
                            <div key={s.label} style={{ padding: '12px', borderRadius: 10, background: 'rgba(10,18,48,0.7)', border: `1px solid ${s.color}18` }}>
                                <div style={{ fontSize: 10, color: '#475569', marginBottom: 4 }}>{s.label}</div>
                                <div style={{ fontSize: 14, fontWeight: 800, color: s.color, fontFamily: 'JetBrains Mono' }}>{s.val}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="scroll-y" style={{ flex: '0 0 280px', padding: '20px 14px', borderLeft: '1px solid rgba(30,58,143,0.12)' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Zap size={12} color="#f59e0b" />Actifs Crypto
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {items.map(i => <UpgCard key={i.id} item={i} category="crypto" accentColor="#f59e0b" />)}
                </div>
            </div>
        </div>
    )
}

// ═══════════════════════════════════════════════════════════════
// STOCKS SECTION
// ═══════════════════════════════════════════════════════════════
export function StocksSection() {
    const { balance, totalEarned, history, stocksAssets } = useGameStore()
    const items = STOCKS_ASSETS.map(s => ({ ...s, ...stocksAssets[s.id] }))

    const mkLine = (off, amp) => history.map((h, i) => ({ i, v: h.v + Math.sin((i + off) * 0.4) * h.v * amp, v2: h.v * 0.8 + Math.cos((i + off) * 0.3) * h.v * amp * 0.7 }))

    const watchlist = [
        { sym: 'AAPL', full: 'Apple Inc.', p: `${(212 + Math.sin(Date.now() / 8000) * 5).toFixed(2)}`, chg: +1.23, cap: '$3.2T', color: '#f1f5f9' },
        { sym: 'NVDA', full: 'Nvidia Corp.', p: `${(875 + Math.sin(Date.now() / 6000) * 20).toFixed(2)}`, chg: +3.45, cap: '$2.1T', color: '#10b981' },
        { sym: 'TSLA', full: 'Tesla Inc.', p: `${(245 + Math.sin(Date.now() / 7000) * 12).toFixed(2)}`, chg: -1.87, cap: '$0.8T', color: '#ef4444' },
        { sym: 'MSFT', full: 'Microsoft Corp.', p: `${(415 + Math.sin(Date.now() / 9000) * 8).toFixed(2)}`, chg: +0.54, cap: '$3.1T', color: '#3b82f6' },
        { sym: 'AMZN', full: 'Amazon', p: `${(195 + Math.sin(Date.now() / 5000) * 6).toFixed(2)}`, chg: +2.11, cap: '$2.0T', color: '#f59e0b' },
    ]

    return (
        <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
            <div className="scroll-y" style={{ flex: 1, padding: '24px' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <TrendingUp size={16} color="#ef4444" />
                    </div>
                    <div>
                        <h2 style={{ fontSize: 18, fontWeight: 800, color: '#f1f5f9' }}>Wall Street Trading</h2>
                        <p style={{ fontSize: 11, color: '#475569' }}>NYSE • NASDAQ • S&P 500 — Dominez les marchés</p>
                    </div>
                </div>

                {/* Index indicators */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 16 }}>
                    {[
                        { idx: 'S&P 500', val: '5,842.3', chg: '+0.82%', color: '#10b981' },
                        { idx: 'NASDAQ', val: '18,432.1', chg: '+1.24%', color: '#10b981' },
                        { idx: 'DOW', val: '43,218.7', chg: '+0.34%', color: '#10b981' },
                        { idx: 'VIX', val: '14.23', chg: '-2.1%', color: '#ef4444' },
                    ].map(m => (
                        <div key={m.idx} className="glass-panel" style={{ padding: '12px 14px' }}>
                            <div style={{ fontSize: 9, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{m.idx}</div>
                            <div style={{ fontSize: 15, fontWeight: 800, color: '#f1f5f9', fontFamily: 'JetBrains Mono', marginBottom: 2 }}>{m.val}</div>
                            <div style={{ fontSize: 10, color: m.color, fontWeight: 700 }}>{m.chg}</div>
                        </div>
                    ))}
                </div>

                {/* Main chart */}
                <div className="glass-panel" style={{ padding: '14px', marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Portfolio Performance</div>
                        <div style={{ display: 'flex', gap: 10, fontSize: 10, color: '#475569' }}>
                            <span style={{ color: '#ef4444' }}>— Portfolio</span>
                            <span style={{ color: '#3b82f6' }}>— S&P 500</span>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={120}>
                        <LineChart data={mkLine(0, 0.07)}>
                            <Line type="monotone" dataKey="v" stroke="#ef4444" strokeWidth={2} dot={false} />
                            <Line type="monotone" dataKey="v2" stroke="#3b82f6" strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
                            <Tooltip contentStyle={{ background: '#0c1a3a', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, fontSize: 10, color: '#e2e8f0' }} formatter={v => [fmt(v), '']} labelFormatter={() => ''} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Watchlist */}
                <div className="glass-panel" style={{ padding: '16px' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Watchlist NYSE / NASDAQ</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                        {watchlist.map((s, i) => (
                            <div key={s.sym} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < watchlist.length - 1 ? '1px solid rgba(30,58,143,0.1)' : 'none' }}>
                                <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(30,58,143,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: '#60a5fa' }}>
                                    {s.sym[0]}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 12, fontWeight: 700, color: '#e2e8f0' }}>{s.sym}</div>
                                    <div style={{ fontSize: 10, color: '#475569' }}>{s.full} • Cap: {s.cap}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: 12, fontWeight: 700, color: '#f1f5f9', fontFamily: 'JetBrains Mono' }}>${s.p}</div>
                                    <div style={{ fontSize: 10, color: s.chg > 0 ? '#10b981' : '#ef4444', fontWeight: 700 }}>
                                        {s.chg > 0 ? '▲' : '▼'}{Math.abs(s.chg)}%
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="scroll-y" style={{ flex: '0 0 280px', padding: '20px 14px', borderLeft: '1px solid rgba(30,58,143,0.12)' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Zap size={12} color="#ef4444" />Positions Actions
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {items.map(i => <UpgCard key={i.id} item={i} category="stocks" accentColor="#ef4444" />)}
                </div>
            </div>
        </div>
    )
}
