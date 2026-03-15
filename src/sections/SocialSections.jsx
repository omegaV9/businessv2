import { useState } from 'react'
import { useGameStore, WEALTH_LEVELS, CLICK_BOOSTS } from '../store/gameStore'
import { fmt, fmtIncome, wealthProgress } from '../utils/format'
import { Trophy, Crown, Users, Zap, Target, Globe } from 'lucide-react'

// ─── FAKE LEADERBOARD PLAYERS ────────────────────────────────
const FAKE_LB = [
    { name: 'SophieNYC', bal: 4.7e12, lvl: '🌍 TITAN', online: true },
    { name: 'AlexTrade', bal: 8.9e9, lvl: '👑 MILLIARDAIRE', online: true },
    { name: 'RaChad', bal: 2.1e9, lvl: '👑 MILLIARDAIRE', online: true },
    { name: 'MarcWall', bal: 680e6, lvl: '🗽 Capitaliste', online: false },
    { name: 'LunaK', bal: 145e6, lvl: '🚀 Elite', online: true },
    { name: 'Jade_W', bal: 12e6, lvl: '🚀 Elite', online: true },
    { name: 'TomB', bal: 2.4e6, lvl: '💎 Millionnaire', online: false },
    { name: 'Chloé_M', bal: 450000, lvl: '💼 Cadre', online: true },
]

function strColor(s) {
    let h = 0
    for (let i = 0; i < s.length; i++) h = s.charCodeAt(i) + ((h << 5) - h)
    return ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899'][Math.abs(h) % 7]
}

export function MultiplayerSection() {
    const { balance, wealthLevel } = useGameStore()
    const [tab, setTab] = useState('lb')
    const myEntry = { name: 'Vous', bal: balance, lvl: wealthLevel?.emoji + ' ' + wealthLevel?.label, online: true, isMe: true }
    const all = [myEntry, ...FAKE_LB].sort((a, b) => b.bal - a.bal)
    const myRank = all.findIndex(p => p.isMe) + 1

    const challenges = [
        { name: 'Premier Millionnaire', desc: 'Atteignez $1,000,000', icon: '💰', reward: '+500K$ bonus', target: 1e6, cur: balance, color: '#f59e0b' },
        { name: 'Clic Junkie', desc: 'Cliquez 5,000 fois', icon: '🖱️', reward: 'x10 click power 10min', target: 5000, cur: useGameStore.getState().totalClicks, color: '#3b82f6' },
        { name: 'Crypto King', desc: 'Investissez dans 4 cryptos', icon: '₿', reward: '+$2M', target: 4, cur: useGameStore.getState().cryptoAssets ? Object.values(useGameStore.getState().cryptoAssets).filter(c => c.level > 0).length : 0, color: '#f59e0b' },
        { name: 'Maître Immobilier', desc: 'Achetez 5 propriétés', icon: '🏙️', reward: 'Carte Diamond', target: 5, cur: useGameStore.getState().realEstate ? Object.values(useGameStore.getState().realEstate).filter(c => c.level > 0).length : 0, color: '#10b981' },
        { name: 'Empire Business', desc: 'Achetez 6 business', icon: '🏢', reward: '+$5M', target: 6, cur: useGameStore.getState().businessInv ? Object.values(useGameStore.getState().businessInv).filter(c => c.level > 0).length : 0, color: '#8b5cf6' },
        { name: 'Wall St. Legend', desc: 'Avoir $100M en stocks', icon: '📊', reward: 'Statue badge', target: 100e6, cur: balance, color: '#ef4444' },
    ]

    return (
        <div className="scroll-y" style={{ flex: 1, padding: '24px' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Users size={16} color="#06b6d4" />
                </div>
                <div>
                    <h2 style={{ fontSize: 18, fontWeight: 800, color: '#f1f5f9' }}>Multiplayer Arena</h2>
                    <p style={{ fontSize: 11, color: '#475569' }}>Compétition mondiale en temps réel</p>
                </div>
            </div>

            {/* My stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 20 }}>
                {[
                    { label: 'Votre rang', val: `#${myRank}`, icon: <Trophy size={16} color="#f59e0b" />, color: '#f59e0b' },
                    { label: 'En ligne', val: '127', icon: <Globe size={16} color="#06b6d4" />, color: '#06b6d4' },
                    { label: 'Balance', val: fmt(balance), icon: <Crown size={16} color="#10b981" />, color: '#10b981' },
                    { label: 'Top %', val: `${Math.max(1, 100 - Math.floor((myRank / (all.length + 50)) * 100))}%`, icon: <Target size={16} color="#8b5cf6" />, color: '#8b5cf6' },
                ].map(s => (
                    <div key={s.label} className="glass-panel" style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                        {s.icon}
                        <div>
                            <div style={{ fontSize: 10, color: '#475569' }}>{s.label}</div>
                            <div style={{ fontSize: 14, fontWeight: 800, color: s.color, fontFamily: 'JetBrains Mono' }}>{s.val}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
                {[{ id: 'lb', label: '🏆 Classement' }, { id: 'ch', label: '⚡ Défis' }].map(t => (
                    <button key={t.id} onClick={() => setTab(t.id)} style={{
                        padding: '7px 16px', borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                        background: tab === t.id ? 'rgba(6,182,212,0.15)' : 'rgba(10,18,48,0.7)',
                        border: tab === t.id ? '1px solid rgba(6,182,212,0.35)' : '1px solid rgba(30,58,143,0.2)',
                        color: tab === t.id ? '#06b6d4' : '#475569',
                    }}>{t.label}</button>
                ))}
            </div>

            {tab === 'lb' ? (
                <div className="glass-panel" style={{ padding: '14px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {all.map((p, i) => (
                            <div key={p.name} className={`lb-row ${p.isMe ? 'me' : ''}`}>
                                <div style={{ width: 28, textAlign: 'center', fontSize: 16, flexShrink: 0 }}>
                                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : <span style={{ fontSize: 11, color: '#334155' }}>#{i + 1}</span>}
                                </div>
                                <div style={{ width: 28, height: 28, borderRadius: '50%', background: strColor(p.name), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, flexShrink: 0, color: '#fff' }}>
                                    {p.name[0]}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                        <span style={{ fontSize: 12, fontWeight: 700, color: p.isMe ? '#60a5fa' : '#e2e8f0' }}>{p.name}</span>
                                        {p.online && <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#10b981', flexShrink: 0 }} />}
                                        {p.isMe && <span style={{ fontSize: 9, color: '#3b82f6', fontWeight: 600 }}>vous</span>}
                                    </div>
                                    <div style={{ fontSize: 10, color: '#334155' }}>{p.lvl}</div>
                                </div>
                                <div style={{ fontFamily: 'JetBrains Mono', fontSize: 12, fontWeight: 700, color: '#94a3b8' }}>{fmt(p.bal)}</div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {challenges.map(c => {
                        const pct = Math.min((c.cur / c.target) * 100, 100)
                        return (
                            <div key={c.name} className="glass-panel" style={{ padding: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                                    <div style={{ width: 36, height: 36, borderRadius: 10, background: `${c.color}18`, border: `1px solid ${c.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                                        {c.icon}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0', marginBottom: 2 }}>{c.name}</div>
                                        <div style={{ fontSize: 10, color: '#475569' }}>{c.desc}</div>
                                    </div>
                                    <div style={{ padding: '4px 10px', borderRadius: 6, background: `${c.color}12`, border: `1px solid ${c.color}22`, fontSize: 10, fontWeight: 700, color: c.color }}>
                                        🎁 {c.reward}
                                    </div>
                                </div>
                                <div className="pbar" style={{ marginBottom: 5 }}>
                                    <div className="pfill" style={{ width: `${pct}%`, background: `linear-gradient(90deg,${c.color}80,${c.color})` }} />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#334155' }}>
                                    <span>{pct.toFixed(1)}%</span>
                                    <span>{pct >= 100 ? '✅ Complété!' : `${fmt(c.cur)} / ${fmt(c.target)}`}</span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

// ═══════════════════════════════════════════════════════════════
// SETTINGS SECTION
// ═══════════════════════════════════════════════════════════════
export function SettingsSection() {
    const { balance, totalEarned, incomePerSec, totalClicks, clickPower, wealthLevel, clickBoosts, buyBoost } = useGameStore()
    const { pct, cur, nxt } = wealthProgress(totalEarned, WEALTH_LEVELS)
    const boosts = Object.values(clickBoosts)

    return (
        <div className="scroll-y" style={{ flex: 1, padding: '24px' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: '#f1f5f9' }}>Paramètres & Progression</h2>
            </div>

            {/* Wealth timeline */}
            <div className="glass-panel" style={{ padding: '20px', marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    🏆 Rang de Fortune — Progression vers le Sommet
                </div>
                <div style={{ position: 'relative', paddingLeft: 30 }}>
                    {/* Vertical line */}
                    <div style={{ position: 'absolute', left: 10, top: 0, bottom: 0, width: 1, background: 'rgba(30,58,143,0.3)' }} />
                    {WEALTH_LEVELS.map((w, i) => {
                        const reached = totalEarned >= w.min
                        const isCur = wealthLevel?.label === w.label
                        return (
                            <div key={w.label} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, position: 'relative' }}>
                                {/* Dot on timeline */}
                                <div style={{
                                    position: 'absolute', left: -30, top: '50%', transform: 'translateY(-50%)',
                                    width: 10, height: 10, borderRadius: '50%',
                                    background: isCur ? w.color : reached ? '#10b981' : '#1e3a5f',
                                    border: `2px solid ${isCur ? w.color : reached ? '#10b981' : '#1e3a5f'}`,
                                    boxShadow: isCur ? `0 0 12px ${w.color}` : 'none',
                                    zIndex: 1,
                                }} />
                                <div style={{
                                    flex: 1, padding: '10px 14px', borderRadius: 10,
                                    background: isCur ? `${w.color}10` : reached ? 'rgba(10,18,48,0.5)' : 'rgba(6,13,31,0.4)',
                                    border: isCur ? `1px solid ${w.color}30` : `1px solid rgba(30,58,143,${reached ? '0.15' : '0.08'})`,
                                    display: 'flex', alignItems: 'center', gap: 12,
                                }}>
                                    <span style={{ fontSize: 18, opacity: reached ? 1 : 0.35 }}>{w.emoji}</span>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 12, fontWeight: 700, color: isCur ? w.color : reached ? '#e2e8f0' : '#334155', marginBottom: 1 }}>
                                            {w.label}
                                        </div>
                                        <div style={{ fontSize: 10, color: '#475569' }}>{fmt(w.min)} requis</div>
                                    </div>
                                    {isCur ? (
                                        <span style={{ fontSize: 10, fontWeight: 700, color: w.color, animation: 'pulseRing 1.5s infinite' }}>← VOUS ICI</span>
                                    ) : reached ? (
                                        <span style={{ fontSize: 12, color: '#10b981' }}>✓</span>
                                    ) : (
                                        <span style={{ fontSize: 12, color: '#1e3a5f' }}>🔒</span>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
                {nxt && (
                    <div style={{ marginTop: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#475569', marginBottom: 5 }}>
                            <span>Progression vers: {nxt.emoji} {nxt.label}</span>
                            <span>{pct.toFixed(1)}%</span>
                        </div>
                        <div className="pbar" style={{ height: 6 }}>
                            <div className="pfill" style={{ width: `${pct}%`, height: '100%', background: `linear-gradient(90deg,${cur?.color},${nxt?.color})` }} />
                        </div>
                    </div>
                )}
            </div>

            {/* Click boosts shop */}
            <div className="glass-panel" style={{ padding: '16px', marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    ⚡ Multiplicateurs de Clic — Shop
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {boosts.map(b => {
                        const canBuy = !b.owned && balance >= b.cost
                        return (
                            <button key={b.id} onClick={() => buyBoost(b.id)} disabled={b.owned || !canBuy}
                                className={`upg-card ${b.owned ? 'maxed' : ''}`}
                                style={{ borderColor: b.owned ? 'rgba(16,185,129,0.25)' : canBuy ? 'rgba(59,130,246,0.2)' : undefined }}>
                                <div style={{ fontSize: 24, marginBottom: 6 }}>{b.icon}</div>
                                <div style={{ fontSize: 12, fontWeight: 700, color: b.owned ? '#10b981' : '#e2e8f0', marginBottom: 3 }}>{b.name}</div>
                                <div style={{ fontSize: 10, color: '#475569', marginBottom: 6 }}>{b.desc}</div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: 11, fontWeight: 700, fontFamily: 'JetBrains Mono', color: b.owned ? '#10b981' : canBuy ? '#10b981' : '#475569' }}>
                                        {b.owned ? '✅ Actif' : fmt(b.cost)}
                                    </span>
                                    <span style={{ fontSize: 10, color: '#334155' }}>×{b.mult}</span>
                                </div>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Stats */}
            <div className="glass-panel" style={{ padding: '16px', marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    📊 Statistiques de Session
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {[
                        { label: 'Total Gagné', val: fmt(totalEarned), icon: '💰', color: '#f59e0b' },
                        { label: 'Revenus/sec', val: fmtIncome(incomePerSec), icon: '⏱️', color: '#10b981' },
                        { label: 'Puissance Clic', val: fmt(clickPower), icon: '👆', color: '#3b82f6' },
                        { label: 'Total Clics', val: totalClicks.toLocaleString(), icon: '🖱️', color: '#8b5cf6' },
                    ].map(s => (
                        <div key={s.label} style={{ padding: '12px', borderRadius: 10, background: 'rgba(10,18,48,0.7)', border: '1px solid rgba(30,58,143,0.15)' }}>
                            <div style={{ fontSize: 16, marginBottom: 4 }}>{s.icon}</div>
                            <div style={{ fontSize: 10, color: '#475569', marginBottom: 3 }}>{s.label}</div>
                            <div style={{ fontSize: 13, fontWeight: 800, color: s.color, fontFamily: 'JetBrains Mono' }}>{s.val}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Reset */}
            <button onClick={() => { if (confirm('⚠️ Réinitialiser toute la progression?')) window.location.reload() }}
                style={{ width: '100%', padding: '12px', borderRadius: 10, fontSize: 13, fontWeight: 600, color: '#ef4444', cursor: 'pointer', transition: 'background 0.15s', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
                🗑️ Réinitialiser la progression
            </button>
        </div>
    )
}
