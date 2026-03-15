// ─────────────────────────────────────────────
// Sidebar.jsx  —  Navigation latérale
// ─────────────────────────────────────────────
import { Building2, Briefcase, Home, Bitcoin, TrendingUp, Users, Settings } from 'lucide-react'
import { useGameStore } from '../store/gameStore'
import { fmt } from '../utils/format'

const NAVS = [
    { id: 'bank', label: 'Bank', Icon: Building2, color: '#3b82f6' },
    { id: 'business', label: 'Business', Icon: Briefcase, color: '#8b5cf6' },
    { id: 'realestate', label: 'Immobilier', Icon: Home, color: '#10b981' },
    { id: 'crypto', label: 'Crypto', Icon: Bitcoin, color: '#f59e0b' },
    { id: 'stocks', label: 'Stocks', Icon: TrendingUp, color: '#ef4444' },
    { id: 'multiplayer', label: 'Multiplayer', Icon: Users, color: '#06b6d4' },
    { id: 'settings', label: 'Settings', Icon: Settings, color: '#6b7280' },
]

export default function Sidebar() {
    const { activeSection, setSection, balance, wealthLevel, incomePerSec, totalClicks } = useGameStore()

    return (
        <aside className="glass flex flex-col" style={{ width: 224, flexShrink: 0, height: '100%' }}>
            {/* Logo */}
            <div style={{ padding: '20px 16px 12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 2 }}>
                    <div style={{
                        width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                        background: 'linear-gradient(135deg,#1d4ed8,#7c3aed)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 900, fontSize: 16, color: 'white', fontFamily: 'Outfit',
                    }}>S</div>
                    <div>
                        <div style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 15, color: '#f1f5f9', letterSpacing: '0.02em' }}>
                            S_BUSINESS
                        </div>
                        <div style={{ fontSize: 10, color: '#475569' }}>Billionaire Clicker</div>
                    </div>
                </div>
            </div>

            {/* Wealth card */}
            <div style={{
                margin: '0 12px 16px', padding: '10px 12px', borderRadius: 12,
                background: `${wealthLevel?.color || '#3b82f6'}12`,
                border: `1px solid ${wealthLevel?.color || '#3b82f6'}28`
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 20 }}>{wealthLevel?.emoji}</span>
                    <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: wealthLevel?.color || '#3b82f6', lineHeight: 1.2 }}>
                            {wealthLevel?.label}
                        </div>
                        <div style={{ fontSize: 10, color: '#475569', marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {wealthLevel?.desc || 'Faites-vous un nom...'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Nav */}
            <nav style={{ flex: 1, padding: '0 10px', display: 'flex', flexDirection: 'column', gap: 3 }}>
                {NAVS.map(({ id, label, Icon, color }) => {
                    const active = activeSection === id
                    return (
                        <button
                            key={id}
                            className="nav-link"
                            style={active ? {
                                color: '#fff',
                                background: `${color}18`,
                                borderColor: `${color}35`,
                                boxShadow: `0 0 18px ${color}10`,
                            } : {}}
                            onClick={() => setSection(id)}
                        >
                            <div style={{
                                width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                background: active ? `${color}22` : 'rgba(30,58,143,0.2)',
                            }}>
                                <Icon size={14} style={{ color: active ? color : '#475569' }} />
                            </div>
                            <span>{label}</span>
                            {active && (
                                <div style={{ marginLeft: 'auto', width: 5, height: 5, borderRadius: '50%', background: color, boxShadow: `0 0 8px ${color}` }} />
                            )}
                        </button>
                    )
                })}
            </nav>

            {/* Bottom info */}
            <div style={{ padding: '12px', borderTop: '1px solid rgba(30,58,143,0.15)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 10, color: '#475569' }}>Revenus/s</span>
                    <span style={{ fontSize: 10, color: '#10b981', fontFamily: 'JetBrains Mono', fontWeight: 600 }}>
                        +{fmt(incomePerSec)}/s
                    </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 10, color: '#475569' }}>Total clics</span>
                    <span style={{ fontSize: 10, color: '#64748b', fontFamily: 'JetBrains Mono' }}>
                        {totalClicks.toLocaleString()}
                    </span>
                </div>
            </div>
        </aside>
    )
}
