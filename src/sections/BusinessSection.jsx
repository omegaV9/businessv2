import { useState, useEffect, useRef, useCallback } from 'react'
import TaxiMapOverlay from './TaxiMap'
import { useGameStore } from '../store/gameStore'
import { fmt, fmtIncome } from '../utils/format'
import {
    Lock, X, ChevronRight, User, Zap,
    TrendingUp, MapPin, Car, ShoppingBag,
    Coffee, Hotel, Building2, Tv2, Plus, Minus, Check
} from 'lucide-react'

// ═══════════════════════════════════════════════════════════════
// BUSINESS DEFINITIONS
// ═══════════════════════════════════════════════════════════════
export const BUSINESSES = [
    {
        id: 'kiosque',
        name: 'Kiosque',
        emoji: '🥤',
        Icon: ShoppingBag,
        color: '#10b981',
        unlock: 0,
        baseIncome: 0.2,
        description: 'Votre premier business. Vendez des snacks et boissons.',
        managerCost: 50,  // per hour
        type: 'shop',
        upgrades: [
            { id: 'u1', name: 'Meilleur emplacement', cost: 200, incomeBonus: 0.3, desc: 'Zone plus fréquentée' },
            { id: 'u2', name: 'Nouveaux produits', cost: 800, incomeBonus: 0.5, desc: 'Gamme étendue' },
            { id: 'u3', name: 'Enseigne lumineuse', cost: 3000, incomeBonus: 1.0, desc: 'Visibilité 24h/24' },
            { id: 'u4', name: 'Fidélité client', cost: 10000, incomeBonus: 2.0, desc: 'Abonnements mensuels' },
        ],
        fees: { buy: 20, sell: 8, margin: 60 },
    },
    {
        id: 'shop',
        name: 'Shop de Mode',
        emoji: '👗',
        Icon: ShoppingBag,
        color: '#ec4899',
        unlock: 2000,
        baseIncome: 1.5,
        description: 'Boutique de vêtements. Gérez les marges d\'achat et de vente.',
        managerCost: 300,
        type: 'shop',
        upgrades: [
            { id: 'u1', name: 'Stock Premium', cost: 2000, incomeBonus: 1.5, desc: 'Marques exclusives' },
            { id: 'u2', name: 'Cabines d\'essayage', cost: 6000, incomeBonus: 3.0, desc: 'Expérience client améliorée' },
            { id: 'u3', name: 'E-commerce', cost: 25000, incomeBonus: 8.0, desc: 'Boutique en ligne 24h' },
            { id: 'u4', name: 'Collection Privée', cost: 100000, incomeBonus: 20.0, desc: 'Éditions limitées' },
        ],
        fees: { buy: 35, sell: 12, margin: 45 },
    },
    {
        id: 'taxi',
        name: 'Flotte Taxi',
        emoji: '🚕',
        Icon: Car,
        color: '#f59e0b',
        unlock: 8000,
        baseIncome: 4.0,
        description: 'Gérez une flotte de taxis. Suivez vos véhicules en temps réel.',
        managerCost: 800,
        type: 'taxi',
        upgrades: [
            { id: 'u1', name: '+2 Taxis', cost: 8000, incomeBonus: 4.0, desc: '3 taxis total', fleetAdd: 2 },
            { id: 'u2', name: 'Zone Aéroport', cost: 25000, incomeBonus: 8.0, desc: 'Courses premium' },
            { id: 'u3', name: '+5 Taxis', cost: 80000, incomeBonus: 15.0, desc: '8 taxis total', fleetAdd: 5 },
            { id: 'u4', name: 'Application Mobile', cost: 250000, incomeBonus: 35.0, desc: 'Réservation directe' },
            { id: 'u5', name: 'Zone Luxe', cost: 800000, incomeBonus: 80.0, desc: 'Courses VIP uniquement' },
        ],
        zones: ['Centre', 'Gare', 'Aéroport', 'Hôtels', 'Clubs'],
    },
    {
        id: 'restaurant',
        name: 'Restaurant',
        emoji: '🍽️',
        Icon: Coffee,
        color: '#f97316',
        unlock: 30000,
        baseIncome: 12.0,
        description: 'Restaurant gastronomique. Menu, personnel, réservations.',
        managerCost: 2000,
        type: 'shop',
        upgrades: [
            { id: 'u1', name: 'Carte des Vins', cost: 30000, incomeBonus: 10.0, desc: 'Sommelier dédié' },
            { id: 'u2', name: 'Chef Étoilé', cost: 120000, incomeBonus: 30.0, desc: 'Réputation Michelin' },
            { id: 'u3', name: 'Terrasse Vue Mer', cost: 400000, incomeBonus: 80.0, desc: '+40 couverts' },
            { id: 'u4', name: 'Franchise x3', cost: 1500000, incomeBonus: 200.0, desc: 'Ouvrez 3 adresses' },
        ],
        fees: { buy: 25, sell: 0, margin: 70 },
    },
    {
        id: 'hotel',
        name: 'Hôtel 4★',
        emoji: '🏨',
        Icon: Hotel,
        color: '#6366f1',
        unlock: 200000,
        baseIncome: 60.0,
        description: 'Hôtel de standing. Gérez les chambres, le spa, les événements.',
        managerCost: 8000,
        type: 'shop',
        upgrades: [
            { id: 'u1', name: 'Suite Présidentielle', cost: 200000, incomeBonus: 50.0, desc: '$5K/nuit' },
            { id: 'u2', name: 'Spa & Wellness', cost: 600000, incomeBonus: 120.0, desc: 'Centre de bien-être' },
            { id: 'u3', name: 'Rooftop Bar', cost: 2000000, incomeBonus: 300.0, desc: 'Bar panoramique' },
            { id: 'u4', name: 'Réseau International', cost: 8000000, incomeBonus: 800.0, desc: '12 hôtels dans le monde' },
        ],
        fees: { buy: 0, sell: 0, margin: 75 },
    },
    {
        id: 'mall',
        name: 'Centre Commercial',
        emoji: '🏬',
        Icon: Building2,
        color: '#8b5cf6',
        unlock: 1500000,
        baseIncome: 400.0,
        description: 'Votre propre mall. Louez les emplacements, gérez les enseignes.',
        managerCost: 40000,
        type: 'shop',
        upgrades: [
            { id: 'u1', name: '+10 Boutiques', cost: 1500000, incomeBonus: 300.0, desc: 'Expansion aile Est' },
            { id: 'u2', name: 'Cinéma IMAX', cost: 5000000, incomeBonus: 800.0, desc: '12 salles de cinéma' },
            { id: 'u3', name: 'Food Court Premium', cost: 15000000, incomeBonus: 2000.0, desc: '30 restaurants' },
            { id: 'u4', name: '2ème Mall', cost: 50000000, incomeBonus: 6000.0, desc: 'Deuxième complexe' },
        ],
    },
    {
        id: 'media',
        name: 'Empire Médias',
        emoji: '📺',
        Icon: Tv2,
        color: '#06b6d4',
        unlock: 10000000,
        baseIncome: 2000.0,
        description: 'Chaîne TV, YouTube, podcasts. Monétisez votre audience mondiale.',
        managerCost: 200000,
        type: 'shop',
        upgrades: [
            { id: 'u1', name: 'Chaîne YouTube 1M', cost: 10000000, incomeBonus: 1500.0, desc: 'Publicités AdSense' },
            { id: 'u2', name: 'Chaîne TV Nationale', cost: 40000000, incomeBonus: 5000.0, desc: 'Audience 10M/soir' },
            { id: 'u3', name: 'Streaming Platform', cost: 150000000, incomeBonus: 15000.0, desc: 'Concurrent Netflix' },
            { id: 'u4', name: 'Réseau Global', cost: 500000000, incomeBonus: 50000.0, desc: '50 pays couverts' },
        ],
    },
]

// ═══════════════════════════════════════════════════════════════
// TAXI MAP COMPONENT
// ═══════════════════════════════════════════════════════════════
function TaxiMap({ fleetSize, zones, color }) {
    const [taxis, setTaxis] = useState(() =>
        Array.from({ length: Math.max(1, fleetSize) }, (_, i) => ({
            id: i,
            x: 15 + Math.random() * 70,
            y: 15 + Math.random() * 70,
            targetX: 15 + Math.random() * 70,
            targetY: 15 + Math.random() * 70,
            zone: zones[Math.floor(Math.random() * zones.length)],
            fare: Math.floor(Math.random() * 40) + 10,
        }))
    )

    useEffect(() => {
        const iv = setInterval(() => {
            setTaxis(prev => prev.map(t => {
                const dx = t.targetX - t.x
                const dy = t.targetY - t.y
                const dist = Math.sqrt(dx * dx + dy * dy)
                if (dist < 2) {
                    return {
                        ...t,
                        targetX: 10 + Math.random() * 80,
                        targetY: 10 + Math.random() * 80,
                        zone: zones[Math.floor(Math.random() * zones.length)],
                        fare: Math.floor(Math.random() * 60) + 15,
                    }
                }
                return {
                    ...t,
                    x: t.x + (dx / dist) * 0.8,
                    y: t.y + (dy / dist) * 0.8,
                }
            }))
        }, 120)
        return () => clearInterval(iv)
    }, [fleetSize, zones])

    const ZONE_DOTS = [
        { label: 'Centre', x: 50, y: 50 },
        { label: 'Gare', x: 20, y: 30 },
        { label: 'Aéroport', x: 75, y: 15 },
        { label: 'Hôtels', x: 80, y: 70 },
        { label: 'Clubs', x: 25, y: 75 },
    ]

    return (
        <div style={{ position: 'relative', width: '100%', height: 180, borderRadius: 10, overflow: 'hidden', background: 'rgba(6,13,31,0.8)', border: '1px solid rgba(30,58,143,0.2)' }}>
            {/* Grid lines */}
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                {[20, 40, 60, 80].map(p => (
                    <g key={p}>
                        <line x1={`${p}%`} y1="0" x2={`${p}%`} y2="100%" stroke="rgba(30,58,143,0.12)" strokeWidth="1" />
                        <line x1="0" y1={`${p}%`} x2="100%" y2={`${p}%`} stroke="rgba(30,58,143,0.12)" strokeWidth="1" />
                    </g>
                ))}
            </svg>

            {/* Zone dots */}
            {ZONE_DOTS.filter(z => (zones || []).includes(z.label)).map(z => (
                <div key={z.label} style={{
                    position: 'absolute',
                    left: `${z.x}%`, top: `${z.y}%`,
                    transform: 'translate(-50%,-50%)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, boxShadow: `0 0 10px ${color}`, opacity: 0.7 }} />
                    <span style={{ fontSize: 7, color: '#334155', whiteSpace: 'nowrap' }}>{z.label}</span>
                </div>
            ))}

            {/* Taxi icons */}
            {taxis.map(t => (
                <div key={t.id} style={{
                    position: 'absolute',
                    left: `${t.x}%`, top: `${t.y}%`,
                    transform: 'translate(-50%,-50%)',
                    transition: 'left 0.12s linear, top 0.12s linear',
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    zIndex: 5,
                }}>
                    <div style={{ fontSize: 12, filter: 'drop-shadow(0 0 4px rgba(245,158,11,0.8))' }}>🚕</div>
                    <div style={{ fontSize: 7, color: '#f59e0b', fontFamily: 'JetBrains Mono', fontWeight: 700, marginTop: -1 }}>
                        ${t.fare}
                    </div>
                </div>
            ))}

            {/* Fleet count */}
            <div style={{ position: 'absolute', top: 6, left: 8, fontSize: 9, color: '#475569' }}>
                <Car size={9} style={{ display: 'inline', marginRight: 3 }} />
                {taxis.length} véhicules actifs
            </div>
        </div>
    )
}

// ═══════════════════════════════════════════════════════════════
// FEE MANAGER (for shop types)
// ═══════════════════════════════════════════════════════════════
function FeeManager({ fees, onChange, color }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
                { key: 'buy', label: 'Coût d\'achat stock (%)', min: 5, max: 60, hint: 'Plus c\'est bas, meilleure est la marge' },
                { key: 'sell', label: 'Frais de vente (%)', min: 0, max: 30, hint: 'Taxes et commissions' },
                { key: 'margin', label: 'Marge sélective (%)', min: 10, max: 90, hint: 'Markup sur chaque produit' },
            ].map(f => (
                <div key={f.key}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 10, color: '#64748b' }}>{f.label}</span>
                        <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono', fontWeight: 700, color }}>{fees[f.key]}%</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <button onClick={() => onChange(f.key, Math.max(f.min, fees[f.key] - 5))} style={{ color: '#ef4444', padding: '2px 6px', borderRadius: 5, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                            <Minus size={10} />
                        </button>
                        <div style={{ flex: 1, height: 4, background: 'rgba(30,58,143,0.2)', borderRadius: 99, overflow: 'hidden' }}>
                            <div style={{ height: '100%', borderRadius: 99, background: color, width: `${((fees[f.key] - f.min) / (f.max - f.min)) * 100}%`, transition: 'width 0.2s' }} />
                        </div>
                        <button onClick={() => onChange(f.key, Math.min(f.max, fees[f.key] + 5))} style={{ color: '#10b981', padding: '2px 6px', borderRadius: 5, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
                            <Plus size={10} />
                        </button>
                    </div>
                    <div style={{ fontSize: 9, color: '#1e3a5f', marginTop: 2 }}>{f.hint}</div>
                </div>
            ))}
        </div>
    )
}

// ═══════════════════════════════════════════════════════════════
// BUSINESS DETAIL MODAL
// ═══════════════════════════════════════════════════════════════
function BusinessModal({ biz, state, onClose, onBuyUpgrade, onHireManager, onFireManager, onFeeChange }) {
    const { balance } = useGameStore()
    const [tab, setTab] = useState('upgrades')

    const Icon = biz.Icon
    const income = biz.baseIncome + (state.upgrades || []).reduce((s, uid) => {
        const u = biz.upgrades.find(u => u.id === uid)
        return s + (u?.incomeBonus || 0)
    }, 0)
    const fleetSize = 1 + (state.upgrades || []).reduce((s, uid) => {
        const u = biz.upgrades.find(u => u.id === uid)
        return s + (u?.fleetAdd || 0)
    }, 0)

    const managerHourlyCost = biz.managerCost
    const managerDailyCost = managerHourlyCost * 24

    return (
        <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div onClick={e => e.stopPropagation()} className="anim-pop" style={{
                width: 500, maxHeight: '85vh',
                background: 'rgba(8,14,36,0.98)',
                border: `1px solid ${biz.color}25`,
                borderRadius: 22,
                boxShadow: `0 40px 80px rgba(0,0,0,0.7), 0 0 60px ${biz.color}10`,
                overflow: 'hidden',
                display: 'flex', flexDirection: 'column',
            }}>
                {/* Header */}
                <div style={{ padding: '18px 20px', borderBottom: '1px solid rgba(30,58,143,0.15)', flexShrink: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 12, background: `${biz.color}18`, border: `1px solid ${biz.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                            {biz.emoji}
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 15, fontWeight: 800, color: '#f1f5f9' }}>{biz.name}</div>
                            <div style={{ fontSize: 10, color: '#475569' }}>{biz.description}</div>
                        </div>
                        <div style={{ textAlign: 'right', marginRight: 8 }}>
                            <div style={{ fontSize: 10, color: '#475569' }}>Income</div>
                            <div style={{ fontSize: 13, fontWeight: 800, color: '#10b981', fontFamily: 'JetBrains Mono' }}>
                                +{fmtIncome(income * (state.managed ? 1.2 : 1))}
                            </div>
                        </div>
                        <button onClick={onClose} style={{ color: '#334155', padding: 6, borderRadius: 8 }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = '#334155'}>
                            <X size={16} />
                        </button>
                    </div>

                    {/* Manager status bar */}
                    <div style={{
                        marginTop: 12, padding: '8px 12px', borderRadius: 10,
                        background: state.managed ? 'rgba(16,185,129,0.08)' : 'rgba(30,58,143,0.1)',
                        border: `1px solid ${state.managed ? 'rgba(16,185,129,0.2)' : 'rgba(30,58,143,0.15)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <User size={13} color={state.managed ? '#10b981' : '#475569'} />
                            <div>
                                <div style={{ fontSize: 11, fontWeight: 700, color: state.managed ? '#10b981' : '#475569' }}>
                                    {state.managed ? '✓ Manager en place' : 'Pas de manager'}
                                </div>
                                <div style={{ fontSize: 9, color: '#334155' }}>
                                    {state.managed ? `Coûte ${fmt(managerDailyCost)}/jour • +20% revenus auto` : `Automatise + ${fmt(managerHourlyCost)}/h`}
                                </div>
                            </div>
                        </div>
                        {state.managed ? (
                            <button onClick={onFireManager} style={{ fontSize: 10, color: '#ef4444', padding: '4px 10px', borderRadius: 7, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', cursor: 'pointer' }}>
                                Licencier
                            </button>
                        ) : (
                            <button onClick={onHireManager} disabled={balance < managerHourlyCost} style={{
                                fontSize: 10, fontWeight: 700, padding: '4px 12px', borderRadius: 7, cursor: balance < managerHourlyCost ? 'not-allowed' : 'pointer',
                                background: balance >= managerHourlyCost ? '#10b981' : 'rgba(10,18,48,0.5)',
                                color: balance >= managerHourlyCost ? '#fff' : '#334155',
                                border: 'none', opacity: balance < managerHourlyCost ? 0.5 : 1,
                            }}>
                                Embaucher · {fmt(managerHourlyCost)}/h
                            </button>
                        )}
                    </div>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: 4, padding: '10px 14px 0', flexShrink: 0 }}>
                    {[
                        { id: 'upgrades', label: '⚡ Améliorations' },
                        biz.type === 'taxi' && { id: 'map', label: '🗺️ Carte' },
                        biz.fees && { id: 'fees', label: '💸 Tarifs' },
                    ].filter(Boolean).map(t => (
                        <button key={t.id} onClick={() => setTab(t.id)} style={{
                            padding: '6px 13px', borderRadius: 9, fontSize: 11, fontWeight: 700, cursor: 'pointer',
                            background: tab === t.id ? `${biz.color}18` : 'rgba(10,18,48,0.5)',
                            border: `1px solid ${tab === t.id ? biz.color + '35' : 'rgba(30,58,143,0.15)'}`,
                            color: tab === t.id ? biz.color : '#475569',
                        }}>{t.label}</button>
                    ))}
                </div>

                {/* Content */}
                <div className="scroll-y" style={{ flex: 1, padding: '14px' }}>
                    {tab === 'upgrades' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {biz.upgrades.map(u => {
                                const owned = (state.upgrades || []).includes(u.id)
                                const canAfford = balance >= u.cost
                                return (
                                    <button key={u.id} onClick={() => !owned && onBuyUpgrade(u.id)} disabled={owned || !canAfford}
                                        style={{
                                            padding: '12px 14px', borderRadius: 12, textAlign: 'left', width: '100%', cursor: owned ? 'default' : canAfford ? 'pointer' : 'not-allowed',
                                            background: owned ? 'rgba(16,185,129,0.06)' : 'rgba(10,18,48,0.8)',
                                            border: `1px solid ${owned ? 'rgba(16,185,129,0.25)' : canAfford ? biz.color + '20' : 'rgba(30,58,143,0.12)'}`,
                                            opacity: !owned && !canAfford ? 0.45 : 1,
                                            transition: 'all 0.15s',
                                            position: 'relative',
                                        }}
                                        onMouseEnter={e => { if (!owned && canAfford) e.currentTarget.style.borderColor = biz.color + '50' }}
                                        onMouseLeave={e => { e.currentTarget.style.borderColor = owned ? 'rgba(16,185,129,0.25)' : canAfford ? biz.color + '20' : 'rgba(30,58,143,0.12)' }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
                                                    <span style={{ fontSize: 12, fontWeight: 700, color: owned ? '#10b981' : '#e2e8f0' }}>{u.name}</span>
                                                    {owned && <Check size={12} color="#10b981" />}
                                                </div>
                                                <div style={{ fontSize: 10, color: '#475569' }}>{u.desc}</div>
                                            </div>
                                            <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                                {owned ? (
                                                    <span style={{ fontSize: 10, color: '#10b981', fontWeight: 700 }}>Actif</span>
                                                ) : (
                                                    <>
                                                        <div style={{ fontSize: 11, fontWeight: 800, fontFamily: 'JetBrains Mono', color: canAfford ? '#10b981' : '#475569' }}>{fmt(u.cost)}</div>
                                                        <div style={{ fontSize: 9, color: biz.color }}>+{fmtIncome(u.incomeBonus)}</div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                )
                            })}
                        </div>
                    )}

                    {tab === 'map' && biz.type === 'taxi' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            <TaxiMap fleetSize={fleetSize} zones={biz.zones} color={biz.color} />
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                                <div style={{ padding: '10px', borderRadius: 10, background: 'rgba(10,18,48,0.7)', border: '1px solid rgba(30,58,143,0.15)', textAlign: 'center' }}>
                                    <div style={{ fontSize: 18, marginBottom: 4 }}>🚕</div>
                                    <div style={{ fontSize: 16, fontWeight: 800, color: '#f59e0b', fontFamily: 'JetBrains Mono' }}>{fleetSize}</div>
                                    <div style={{ fontSize: 9, color: '#475569' }}>Véhicules</div>
                                </div>
                                <div style={{ padding: '10px', borderRadius: 10, background: 'rgba(10,18,48,0.7)', border: '1px solid rgba(30,58,143,0.15)', textAlign: 'center' }}>
                                    <div style={{ fontSize: 18, marginBottom: 4 }}>📍</div>
                                    <div style={{ fontSize: 16, fontWeight: 800, color: biz.color, fontFamily: 'JetBrains Mono' }}>{(state.upgrades || []).filter(uid => biz.upgrades.find(u => u.id === uid && u.id === 'u2')).length > 0 ? 3 : 2}</div>
                                    <div style={{ fontSize: 9, color: '#475569' }}>Zones actives</div>
                                </div>
                                <div style={{ padding: '10px', borderRadius: 10, background: 'rgba(10,18,48,0.7)', border: '1px solid rgba(30,58,143,0.15)', textAlign: 'center' }}>
                                    <div style={{ fontSize: 18, marginBottom: 4 }}>💰</div>
                                    <div style={{ fontSize: 16, fontWeight: 800, color: '#10b981', fontFamily: 'JetBrains Mono' }}>{fmtIncome(income)}</div>
                                    <div style={{ fontSize: 9, color: '#475569' }}>Income/s</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {tab === 'fees' && biz.fees && (
                        <div>
                            <div style={{ fontSize: 10, color: '#475569', marginBottom: 12 }}>
                                Ajustez vos tarifs pour maximiser la rentabilité. La marge nette estimée: <span style={{ color: '#10b981', fontWeight: 700 }}>
                                    {Math.max(0, (state.fees?.margin || biz.fees.margin) - (state.fees?.buy || biz.fees.buy) - (state.fees?.sell || biz.fees.sell))}%
                                </span>
                            </div>
                            <FeeManager fees={state.fees || biz.fees} onChange={onFeeChange} color={biz.color} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

// ═══════════════════════════════════════════════════════════════
// BUSINESS CARD
// ═══════════════════════════════════════════════════════════════
function BizCard({ biz, state, onOpen }) {
    const { balance, totalEarned } = useGameStore()
    const isLocked = totalEarned < biz.unlock && balance < biz.unlock
    const [hov, setHov] = useState(false)

    const income = biz.baseIncome + (state.upgrades || []).reduce((s, uid) => {
        const u = biz.upgrades.find(u => u.id === uid)
        return s + (u?.incomeBonus || 0)
    }, 0) * (state.managed ? 1.2 : 1)

    const upgradesDone = (state.upgrades || []).length
    const upgradesTotal = biz.upgrades.length
    const pct = (upgradesDone / upgradesTotal) * 100

    return (
        <div
            onClick={() => !isLocked && onOpen()}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                padding: '16px 18px', borderRadius: 16,
                background: isLocked ? 'rgba(6,13,31,0.5)' : 'rgba(10,18,48,0.85)',
                border: `1px solid ${isLocked ? 'rgba(30,58,143,0.08)' : hov ? biz.color + '40' : biz.color + '18'}`,
                cursor: isLocked ? 'not-allowed' : 'pointer',
                opacity: isLocked ? 0.45 : 1,
                transition: 'all 0.2s ease',
                transform: (!isLocked && hov) ? 'translateY(-2px)' : 'none',
                boxShadow: (!isLocked && hov) ? `0 12px 28px rgba(0,0,0,0.35), 0 0 20px ${biz.color}10` : 'none',
                position: 'relative', overflow: 'hidden',
            }}
        >
            {/* Color accent line top */}
            {!isLocked && (
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${biz.color}, transparent)`, borderRadius: '16px 16px 0 0' }} />
            )}

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                {/* Icon */}
                <div style={{
                    width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                    background: isLocked ? 'rgba(30,58,143,0.1)' : `${biz.color}15`,
                    border: `1px solid ${isLocked ? 'rgba(30,58,143,0.1)' : biz.color + '25'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 22,
                }}>
                    {isLocked ? <Lock size={16} color="#334155" /> : biz.emoji}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                        <span style={{ fontSize: 13, fontWeight: 800, color: isLocked ? '#334155' : '#e2e8f0' }}>{biz.name}</span>
                        {state.managed && !isLocked && (
                            <span style={{ fontSize: 8, padding: '1px 6px', borderRadius: 5, background: 'rgba(16,185,129,0.15)', color: '#10b981', fontWeight: 700 }}>
                                AUTO
                            </span>
                        )}
                    </div>

                    {isLocked ? (
                        <div style={{ fontSize: 10, color: '#1e3a5f' }}>
                            <Lock size={9} style={{ display: 'inline', marginRight: 3 }} />
                            Débloque à {fmt(biz.unlock)}
                        </div>
                    ) : (
                        <>
                            <div style={{ fontSize: 10, color: '#475569', marginBottom: 6 }}>{biz.description.split('.')[0]}</div>
                            <div className="pbar" style={{ marginBottom: 4 }}>
                                <div className="pfill" style={{ width: `${pct}%`, background: `linear-gradient(90deg,${biz.color}70,${biz.color})` }} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: 9, color: '#334155' }}>{upgradesDone}/{upgradesTotal} améliorations</span>
                                <span style={{ fontSize: 10, fontFamily: 'JetBrains Mono', fontWeight: 700, color: '#10b981' }}>+{fmtIncome(income)}</span>
                            </div>
                        </>
                    )}
                </div>

                {/* Arrow */}
                {!isLocked && (
                    <ChevronRight size={14} color={hov ? biz.color : '#334155'} style={{ flexShrink: 0, marginTop: 2, transition: 'color 0.15s' }} />
                )}
            </div>
        </div>
    )
}

// ═══════════════════════════════════════════════════════════════
// BUSINESS SECTION — MAIN
// ═══════════════════════════════════════════════════════════════
export default function BusinessSection() {
    const { balance, totalEarned, incomePerSec } = useGameStore()
    const [bizStates, setBizStates] = useState(() =>
        Object.fromEntries(BUSINESSES.map(b => [b.id, { upgrades: [], managed: false, fees: b.fees ? { ...b.fees } : undefined }]))
    )
    const [openBiz, setOpenBiz] = useState(null)
    const [taxiMapOpen, setTaxiMapOpen] = useState(false)

    // Business passive income tick — add to game store
    useEffect(() => {
        const totalBizIncome = BUSINESSES.reduce((sum, biz) => {
            const s = bizStates[biz.id]
            if (!s) return sum
            const inc = biz.baseIncome + (s.upgrades || []).reduce((x, uid) => {
                const u = biz.upgrades.find(u => u.id === uid)
                return x + (u?.incomeBonus || 0)
            }, 0)
            return sum + inc * (s.managed ? 1.2 : 1)
        }, 0)

        // Inject into game income
        useGameStore.setState(s => {
            const prevBizIncome = s._bizIncome || 0
            const diff = totalBizIncome - prevBizIncome
            return { incomePerSec: Math.max(0, s.incomePerSec + diff), _bizIncome: totalBizIncome }
        })
    }, [bizStates])

    // Manager cost tick (deduct daily cost every minute for demo)
    useEffect(() => {
        const iv = setInterval(() => {
            BUSINESSES.forEach(biz => {
                if (bizStates[biz.id]?.managed) {
                    const hourlyCost = biz.managerCost
                    useGameStore.setState(s => ({
                        balance: Math.max(0, s.balance - hourlyCost / 60), // per minute
                    }))
                }
            })
        }, 60000)
        return () => clearInterval(iv)
    }, [bizStates])

    const handleBuyUpgrade = (bizId, upgradeId) => {
        const biz = BUSINESSES.find(b => b.id === bizId)
        const u = biz.upgrades.find(u => u.id === upgradeId)
        if (!u || balance < u.cost) return
        useGameStore.setState(s => ({ balance: s.balance - u.cost }))
        setBizStates(prev => ({
            ...prev,
            [bizId]: { ...prev[bizId], upgrades: [...(prev[bizId].upgrades || []), upgradeId] },
        }))
    }

    const handleHireManager = (bizId) => {
        const biz = BUSINESSES.find(b => b.id === bizId)
        if (balance < biz.managerCost) return
        useGameStore.setState(s => ({ balance: s.balance - biz.managerCost }))
        setBizStates(prev => ({ ...prev, [bizId]: { ...prev[bizId], managed: true } }))
    }

    const handleFireManager = (bizId) => {
        setBizStates(prev => ({ ...prev, [bizId]: { ...prev[bizId], managed: false } }))
    }

    const handleFeeChange = (bizId, key, val) => {
        setBizStates(prev => ({
            ...prev,
            [bizId]: { ...prev[bizId], fees: { ...(prev[bizId].fees || {}), [key]: val } },
        }))
    }

    const currentBiz = openBiz ? BUSINESSES.find(b => b.id === openBiz) : null
    const totalBizIncome = BUSINESSES.reduce((sum, biz) => {
        const s = bizStates[biz.id]
        return sum + biz.baseIncome + (s.upgrades || []).reduce((x, uid) => {
            const u = biz.upgrades.find(u => u.id === uid)
            return x + (u?.incomeBonus || 0)
        }, 0) * (s.managed ? 1.2 : 1)
    }, 0)

    const unlockedCount = BUSINESSES.filter(b => totalEarned >= b.unlock || balance >= b.unlock).length

    return (
        <div className="scroll-y" style={{ flex: 1, padding: '24px 28px' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
                <div>
                    <h2 style={{ fontSize: 19, fontWeight: 900, color: '#f1f5f9', marginBottom: 3, fontFamily: 'Outfit' }}>
                        Empire Business
                    </h2>
                    <p style={{ fontSize: 11, color: '#475569' }}>
                        {unlockedCount}/{BUSINESSES.length} entreprises débloquées • Cliquez sur une carte pour gérer
                    </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 9, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>
                        Total Income Business
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#10b981', fontFamily: 'JetBrains Mono' }}>
                        +{fmtIncome(totalBizIncome)}
                    </div>
                </div>
            </div>

            {/* Business cards grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {BUSINESSES.map(biz => (
                    <BizCard
                        key={biz.id}
                        biz={biz}
                        state={bizStates[biz.id]}
                        onOpen={() => {
                            if (biz.id === 'taxi') setTaxiMapOpen(true)
                            else setOpenBiz(biz.id)
                        }}
                    />
                ))}
            </div>

            {/* Regular Modal (non-taxi businesses) */}
            {currentBiz && openBiz && openBiz !== 'taxi' && (
                <BusinessModal
                    biz={currentBiz}
                    state={bizStates[openBiz]}
                    onClose={() => setOpenBiz(null)}
                    onBuyUpgrade={uid => handleBuyUpgrade(openBiz, uid)}
                    onHireManager={() => handleHireManager(openBiz)}
                    onFireManager={() => handleFireManager(openBiz)}
                    onFeeChange={(key, val) => handleFeeChange(openBiz, key, val)}
                />
            )}

            {/* TAXI — Full screen Leaflet map overlay */}
            {taxiMapOpen && (
                <TaxiMapOverlay
                    bizState={bizStates['taxi']}
                    onClose={() => setTaxiMapOpen(false)}
                    onBuyUpgrade={uid => handleBuyUpgrade('taxi', uid)}
                    onHireManager={() => handleHireManager('taxi')}
                    onFireManager={() => handleFireManager('taxi')}
                />
            )}
        </div>
    )
}
