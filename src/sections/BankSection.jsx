import { useState, useCallback, useRef } from 'react'
import { useGameStore, upgradeCost } from '../store/gameStore'
import { fmt } from '../utils/format'
import { Wifi, Zap, X, Lock, Sparkles, Star, Shield, Crown } from 'lucide-react'

// ─────────────────────────────────────────────
// CARD TIERS
// ─────────────────────────────────────────────
const CARD_TIERS = [
    {
        id: 'classic',
        label: 'Classic',
        req: 0,
        cost: 0,
        gradient: 'linear-gradient(135deg, #1e3a8a 0%, #0f2060 60%, #060d1f 100%)',
        perks: ['Compte standard', 'Revenus passifs de base', 'Accès aux investissements'],
        icon: Zap,
        color: '#3b82f6',
    },
    {
        id: 'gold',
        label: 'Gold',
        req: 10000,
        cost: 8000,
        gradient: 'linear-gradient(135deg, #b45309 0%, #92400e 50%, #451a03 100%)',
        perks: ['+10% sur tous les revenus', 'Priorité aux opportunités', 'Conseiller dédié'],
        icon: Star,
        color: '#f59e0b',
    },
    {
        id: 'diamond',
        label: 'Diamond',
        req: 500000,
        cost: 400000,
        gradient: 'linear-gradient(135deg, #1e40af 0%, #0f3460 50%, #050e24 100%)',
        perks: ['+25% revenus passifs', 'Accès aux hedge funds', 'Analyses exclusives'],
        icon: Shield,
        color: '#60a5fa',
    },
    {
        id: 'platinum',
        label: 'Platinum',
        req: 5000000,
        cost: 4000000,
        gradient: 'linear-gradient(135deg, #374151 0%, #1f2937 50%, #0d1117 100%)',
        perks: ['+50% revenus globaux', 'Gestion fortune privée', 'Réseau exclusif 500'],
        icon: Shield,
        color: '#94a3b8',
    },
    {
        id: 'black',
        label: 'Black',
        req: 50000000,
        cost: 40000000,
        gradient: 'linear-gradient(135deg, #1a1a2e 0%, #13131f 50%, #0d0d0d 100%)',
        perks: ['+100% revenus globaux', 'Statut mondial reconnu', 'Île privée offerte'],
        icon: Crown,
        color: '#fbbf24',
    },
]

function getCurrentTier(totalEarned) {
    return [...CARD_TIERS].reverse().find(t => totalEarned >= t.req) || CARD_TIERS[0]
}

// ─────────────────────────────────────────────
// CARD UPGRADE MODAL
// ─────────────────────────────────────────────
function CardUpgradeModal({ onClose }) {
    const { balance, totalEarned } = useGameStore()
    const currentTier = getCurrentTier(totalEarned)

    const handleUpgrade = (tier) => {
        useGameStore.setState(s => ({ balance: s.balance - tier.cost }))
        onClose()
    }

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed', inset: 0, zIndex: 999,
                background: 'rgba(0,0,0,0.75)',
                backdropFilter: 'blur(10px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
        >
            <div
                onClick={e => e.stopPropagation()}
                className="anim-pop"
                style={{
                    width: 460,
                    background: 'rgba(8,14,36,0.98)',
                    border: '1px solid rgba(59,130,246,0.18)',
                    borderRadius: 22,
                    boxShadow: '0 40px 80px rgba(0,0,0,0.7)',
                    overflow: 'hidden',
                }}
            >
                {/* Header */}
                <div style={{
                    padding: '20px 22px',
                    borderBottom: '1px solid rgba(30,58,143,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                    <div>
                        <div style={{ fontSize: 15, fontWeight: 800, color: '#f1f5f9' }}>Améliorer la Carte</div>
                        <div style={{ fontSize: 10, color: '#475569', marginTop: 2 }}>
                            Budget: <span style={{ color: '#10b981', fontFamily: 'JetBrains Mono', fontWeight: 700 }}>{fmt(balance)}</span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        style={{ color: '#334155', padding: 6, borderRadius: 8, transition: 'color 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#e2e8f0'}
                        onMouseLeave={e => e.currentTarget.style.color = '#334155'}
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Tiers */}
                <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {CARD_TIERS.map(tier => {
                        const Icon = tier.icon
                        const isOwned = currentTier.id === tier.id
                        const unlocked = totalEarned >= tier.req
                        const canAfford = balance >= tier.cost
                        const isPast = CARD_TIERS.indexOf(tier) < CARD_TIERS.indexOf(currentTier)

                        return (
                            <div
                                key={tier.id}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 14,
                                    padding: '13px 15px', borderRadius: 14,
                                    background: isOwned ? `${tier.color}0f` : 'rgba(10,18,48,0.7)',
                                    border: `1px solid ${isOwned ? tier.color + '30' : !unlocked ? 'rgba(30,58,143,0.1)' : canAfford ? tier.color + '18' : 'rgba(30,58,143,0.12)'}`,
                                    opacity: isPast || (!unlocked && !isOwned) ? 0.4 : 1,
                                }}
                            >
                                {/* Card mini preview */}
                                <div style={{
                                    width: 46, height: 28, borderRadius: 6, flexShrink: 0,
                                    background: tier.gradient,
                                    border: `1px solid ${tier.color}25`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <Icon size={12} color={tier.color} />
                                </div>

                                {/* Info */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
                                        <span style={{ fontSize: 13, fontWeight: 700, color: isOwned ? tier.color : '#e2e8f0' }}>
                                            {tier.label}
                                        </span>
                                        {isOwned && (
                                            <span style={{ fontSize: 9, padding: '1px 7px', borderRadius: 5, background: `${tier.color}18`, color: tier.color, fontWeight: 700 }}>
                                                ACTUEL
                                            </span>
                                        )}
                                        {isPast && (
                                            <span style={{ fontSize: 9, color: '#10b981' }}>✓</span>
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                                        {tier.perks.map(p => (
                                            <span key={p} style={{ fontSize: 9, color: '#475569' }}>• {p}</span>
                                        ))}
                                    </div>
                                </div>

                                {/* Action */}
                                <div style={{ flexShrink: 0 }}>
                                    {tier.cost === 0 || isPast || isOwned ? (
                                        <span style={{ fontSize: 10, color: isOwned ? tier.color : '#334155', fontWeight: isOwned ? 700 : 400 }}>
                                            {isOwned ? '✦ Actif' : isPast ? '—' : 'Gratuit'}
                                        </span>
                                    ) : !unlocked ? (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#334155' }}>
                                            <Lock size={11} />
                                            <span style={{ fontSize: 9, fontFamily: 'JetBrains Mono' }}>{fmt(tier.req)}</span>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleUpgrade(tier)}
                                            disabled={!canAfford}
                                            style={{
                                                padding: '6px 14px', borderRadius: 9,
                                                fontSize: 11, fontWeight: 800,
                                                background: canAfford ? tier.color : 'rgba(10,18,48,0.5)',
                                                color: canAfford ? '#fff' : '#334155',
                                                border: 'none',
                                                cursor: canAfford ? 'pointer' : 'not-allowed',
                                                opacity: canAfford ? 1 : 0.6,
                                                transition: 'opacity 0.15s, transform 0.1s',
                                            }}
                                            onMouseDown={e => { if (canAfford) e.currentTarget.style.transform = 'scale(0.95)' }}
                                            onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)' }}
                                        >
                                            {fmt(tier.cost)}
                                        </button>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

// ─────────────────────────────────────────────
// SBANK CARD
// ─────────────────────────────────────────────
function SBankCard({ balance, totalEarned, onClick }) {
    const [hovered, setHovered] = useState(false)
    const tier = getCurrentTier(totalEarned)

    return (
        <div
            onClick={e => { e.stopPropagation(); onClick() }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                width: 320, aspectRatio: '1.586',
                borderRadius: 20,
                background: tier.gradient,
                boxShadow: `
          0 24px 50px rgba(0,0,0,0.6),
          0 0 0 1px ${tier.color}22,
          ${hovered ? `0 0 50px ${tier.color}18` : ''}
        `,
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                transform: hovered ? 'translateY(-6px) scale(1.02)' : 'translateY(0) scale(1)',
                userSelect: 'none',
                flexShrink: 0,
            }}
        >
            {/* Decorative circles */}
            <div style={{ position: 'absolute', top: -50, right: -50, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: -30, left: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.025)', pointerEvents: 'none' }} />

            {/* Shimmer on hover */}
            {hovered && <div className="shimmer" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />}

            {/* Card content */}
            <div style={{ padding: '20px 22px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
                {/* Top */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <div style={{ fontSize: 13, fontWeight: 900, letterSpacing: '0.14em', color: '#fff', fontFamily: 'Outfit' }}>
                            S_BANK
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                            <span style={{ fontSize: 8, color: tier.color, fontWeight: 700, letterSpacing: '0.1em' }}>
                                {tier.label.toUpperCase()}
                            </span>
                        </div>
                    </div>
                    <Wifi size={15} color="rgba(255,255,255,0.38)" style={{ transform: 'rotate(90deg)' }} />
                </div>

                {/* Balance */}
                <div>
                    <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>
                        BALANCE
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 900, color: '#fff', fontFamily: 'JetBrains Mono', letterSpacing: '-0.02em' }}>
                        {fmt(balance)}
                    </div>
                </div>

                {/* Footer */}
                <div>
                    <div style={{ fontFamily: 'JetBrains Mono', color: 'rgba(255,255,255,0.4)', fontSize: 10, letterSpacing: '0.2em', marginBottom: 8 }}>
                        •••• •••• •••• 8842
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <div>
                            <div style={{ fontSize: 7, color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                Card Holder
                            </div>
                            <div style={{ fontSize: 10, fontWeight: 700, color: '#fff', marginTop: 1, letterSpacing: '0.06em' }}>
                                PLAYER ONE
                            </div>
                        </div>
                        <div style={{ display: 'flex' }}>
                            <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#dc2626', opacity: 0.85 }} />
                            <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#f97316', opacity: 0.85, marginLeft: -9 }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom hint */}
            <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                padding: '5px',
                textAlign: 'center',
                background: 'rgba(0,0,0,0.3)',
                backdropFilter: 'blur(4px)',
                fontSize: 8, color: 'rgba(255,255,255,0.38)',
                letterSpacing: '0.1em',
            }}>
                CLIQUEZ POUR AMÉLIORER
            </div>
        </div>
    )
}

// ─────────────────────────────────────────────
// BANK SECTION — MAIN
// ─────────────────────────────────────────────
let floatId = 0

export default function BankSection() {
    const { balance, totalEarned, click, clickPower, combo, wealthLevel } = useGameStore()
    const [floats, setFloats] = useState([])
    const [ripples, setRipples] = useState([])
    const [modal, setModal] = useState(false)
    const zoneRef = useRef()

    const handleClick = useCallback((e) => {
        const res = click(e.clientX, e.clientY)

        // Floating $ text
        const id = ++floatId
        setFloats(p => [...p.slice(-15), { id, ...res }])
        setTimeout(() => setFloats(p => p.filter(f => f.id !== id)), 900)

        // Ripple at click position relative to zone
        const rect = zoneRef.current?.getBoundingClientRect()
        if (rect) {
            const rid = ++floatId
            setRipples(p => [...p.slice(-8), {
                id: rid,
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            }])
            setTimeout(() => setRipples(p => p.filter(r => r.id !== rid)), 700)
        }
    }, [click])

    const comboColor = combo > 35 ? '#ef4444' : combo > 18 ? '#f59e0b' : wealthLevel?.color || '#3b82f6'

    return (
        <div
            ref={zoneRef}
            onClick={handleClick}
            style={{
                flex: 1,
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'crosshair',
                userSelect: 'none',
                background: 'radial-gradient(ellipse at 50% 30%, rgba(29,78,216,0.06) 0%, transparent 70%)',
            }}
        >
            {/* Ripple effects */}
            {ripples.map(r => (
                <div
                    key={r.id}
                    style={{
                        position: 'absolute',
                        left: r.x, top: r.y,
                        width: 260, height: 260,
                        borderRadius: '50%',
                        border: `1px solid ${comboColor}40`,
                        transform: 'translate(-50%,-50%) scale(0)',
                        animation: 'rippleOut 0.7s ease-out forwards',
                        pointerEvents: 'none',
                        zIndex: 1,
                    }}
                />
            ))}

            {/* ── Card at top center ── */}
            <div style={{ marginTop: 32, zIndex: 10 }}>
                <SBankCard balance={balance} totalEarned={totalEarned} onClick={() => setModal(true)} />
            </div>

            {/* ── Combo badge ── */}
            {combo > 2 && (
                <div
                    className="anim-pop"
                    style={{
                        marginTop: 18, zIndex: 10,
                        padding: '5px 14px', borderRadius: 20,
                        background: `${comboColor}12`,
                        border: `1px solid ${comboColor}30`,
                        fontSize: 11, fontWeight: 800, color: comboColor,
                        display: 'flex', alignItems: 'center', gap: 6,
                        pointerEvents: 'none',
                    }}
                >
                    🔥 COMBO ×{combo}
                    <span style={{ fontSize: 9, opacity: 0.7, fontWeight: 400 }}>
                        {(1 + Math.min(combo - 1, 49) * 0.06).toFixed(2)}x
                    </span>
                </div>
            )}

            {/* ── Click power info ── */}
            <div
                style={{
                    marginTop: 14, zIndex: 10,
                    display: 'flex', alignItems: 'center', gap: 6,
                    pointerEvents: 'none',
                }}
            >
                <Zap size={12} color={comboColor} />
                <span style={{
                    fontSize: 11, fontFamily: 'JetBrains Mono', fontWeight: 600,
                    color: comboColor, opacity: 0.8,
                }}>
                    +{fmt(clickPower)}/clic
                </span>
            </div>

            {/* ── "Click anywhere" hint ── */}
            <div style={{
                position: 'absolute', bottom: 24,
                left: 0, right: 0, textAlign: 'center',
                pointerEvents: 'none', zIndex: 10,
            }}>
                <div style={{ fontSize: 10, color: '#1e3a5f', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                    Cliquez n'importe où pour gagner de l'argent
                </div>
            </div>

            {/* ── Floating texts ── */}
            {floats.map(f => (
                <div
                    key={f.id}
                    className={`float-text ${f.isCrit ? 'crit' : ''}`}
                    style={{ left: f.x, top: f.y, transform: 'translate(-50%,-50%)' }}
                >
                    {f.isCrit ? '💥 ' : '+'}{fmt(f.earned)}
                </div>
            ))}

            {/* ── Card upgrade modal ── */}
            {modal && <CardUpgradeModal onClose={() => setModal(false)} />}
        </div>
    )
}
