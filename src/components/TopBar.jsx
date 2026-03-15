import { useGameStore } from '../store/gameStore'
import { fmt, fmtIncome } from '../utils/format'

export default function TopBar() {
    const { balance, totalEarned, incomePerSec, wealthLevel } = useGameStore()

    return (
        <header style={{
            height: 56,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            background: 'rgba(6,13,31,0.92)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(30,58,143,0.15)',
            zIndex: 50,
            position: 'relative',
        }}>
            {/* Left: Balance */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
                <div>
                    <div style={{ fontSize: 10, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 1 }}>
                        BALANCE TOTALE
                    </div>
                    <div style={{ fontSize: 22, fontWeight: 900, color: '#f1f5f9', fontFamily: 'JetBrains Mono', letterSpacing: '-0.02em' }}>
                        {fmt(balance)}
                    </div>
                </div>

                <div style={{ width: 1, height: 28, background: 'rgba(30,58,143,0.3)' }} />

                <div>
                    <div style={{ fontSize: 10, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 1 }}>
                        REVENU / HEURE
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#10b981', fontFamily: 'JetBrains Mono' }}>
                        +{fmt(incomePerSec * 3600)}/h
                    </div>
                </div>

                <div style={{ width: 1, height: 28, background: 'rgba(30,58,143,0.3)' }} />

                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981', animation: 'pulseRing 2s infinite' }} />
                    <div>
                        <div style={{ fontSize: 10, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 1 }}>
                            GAINS/SEC
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#10b981', fontFamily: 'JetBrains Mono' }}>
                            +{fmtIncome(incomePerSec)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Center: Wealth level pill */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '6px 16px',
                borderRadius: 20, background: `${wealthLevel?.color || '#3b82f6'}12`,
                border: `1px solid ${wealthLevel?.color || '#3b82f6'}25`,
            }}>
                <span style={{ fontSize: 18 }}>{wealthLevel?.emoji}</span>
                <div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>Statut</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: wealthLevel?.color || '#3b82f6' }}>
                        {wealthLevel?.label}
                    </div>
                </div>
            </div>

            {/* Right */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 8,
                    background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                }}>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 6px #ef4444' }} />
                    <span style={{ fontSize: 10, color: '#ef4444', fontWeight: 700, letterSpacing: '0.05em' }}>LIVE</span>
                </div>

                <div style={{
                    display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 10,
                    background: 'rgba(10,18,48,0.8)', border: '1px solid rgba(30,58,143,0.3)',
                    fontSize: 12, color: '#94a3b8', cursor: 'default',
                }}>
                    <div style={{
                        width: 24, height: 24, borderRadius: '50%',
                        background: 'linear-gradient(135deg,#1d4ed8,#7c3aed)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 10, fontWeight: 800, color: 'white',
                    }}>P</div>
                    <span style={{ fontWeight: 600 }}>Player One</span>
                </div>
            </div>
        </header>
    )
}
