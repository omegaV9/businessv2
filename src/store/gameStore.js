import { create } from 'zustand'

// ─── CONSTANTES ────────────────────────────────────────────────
export const WEALTH_LEVELS = [
    { min: 0, label: 'SDF', emoji: '🏚️', color: '#6b7280', bg: '#111827' },
    { min: 500, label: 'Étudiant Fauché', emoji: '📚', color: '#78716c', bg: '#1c1917' },
    { min: 5000, label: 'Salarié', emoji: '👔', color: '#64748b', bg: '#0f172a' },
    { min: 50000, label: 'Cadre', emoji: '💼', color: '#3b82f6', bg: '#0c1a3a' },
    { min: 500000, label: 'Manager', emoji: '🖥️', color: '#6366f1', bg: '#0e1347' },
    { min: 1e6, label: 'Millionnaire', emoji: '💎', color: '#f59e0b', bg: '#1c1000' },
    { min: 10e6, label: 'Elite', emoji: '🚀', color: '#f97316', bg: '#1a0800' },
    { min: 100e6, label: 'Capitaliste NYC', emoji: '🗽', color: '#ef4444', bg: '#1a0000' },
    { min: 1e9, label: 'MILLIARDAIRE', emoji: '👑', color: '#fbbf24', bg: '#1a1000' },
    { min: 100e9, label: 'TITAN MONDIAL', emoji: '🌍', color: '#a78bfa', bg: '#0d0a1a' },
]

export const BANK_INVESTMENTS = [
    { id: 'b1', name: 'Compte Courant', icon: '🏦', desc: 'Reversement auto. d\'intérêts', cost: 100, income: 0.5, maxLvl: 25 },
    { id: 'b2', name: 'Livret A', icon: '📄', desc: 'Taux régulementé, sans risque', cost: 500, income: 2.5, maxLvl: 25 },
    { id: 'b3', name: 'Plan Épargne', icon: '💹', desc: 'Rendement 4.5% annuel', cost: 2500, income: 10, maxLvl: 25 },
    { id: 'b4', name: 'ETF World', icon: '🌐', desc: 'Exposition marchés mondiaux', cost: 10000, income: 35, maxLvl: 25 },
    { id: 'b5', name: 'Hedge Fund', icon: '🎯', desc: 'Stratégies alternatives', cost: 50000, income: 120, maxLvl: 25 },
    { id: 'b6', name: 'Private Banking', icon: '🔏', desc: 'Gestion de fortune privée', cost: 250000, income: 500, maxLvl: 25 },
    { id: 'b7', name: 'SBank Premium', icon: '💎', desc: 'Le summum des investissements', cost: 1.5e6, income: 2500, maxLvl: 25 },
]

export const BUSINESS_INVESTMENTS = [
    { id: 'bu1', name: 'Freelance', icon: '💻', desc: 'Missions ponctuelles', cost: 200, income: 1, maxLvl: 25 },
    { id: 'bu2', name: 'Agence Digital', icon: '📱', desc: 'Sites web & apps mobiles', cost: 1000, income: 5, maxLvl: 25 },
    { id: 'bu3', name: 'SaaS Product', icon: '🚀', desc: 'Revenu récurrent mensuel', cost: 5000, income: 20, maxLvl: 25 },
    { id: 'bu4', name: 'Franchise', icon: '🏪', desc: 'Royalties automatiques', cost: 25000, income: 80, maxLvl: 25 },
    { id: 'bu5', name: 'PME Industrielle', icon: '🏭', desc: 'Production & distribution', cost: 125000, income: 350, maxLvl: 25 },
    { id: 'bu6', name: 'Conglomérat', icon: '🏙️', desc: 'Multi-secteurs consolidés', cost: 750000, income: 1500, maxLvl: 25 },
    { id: 'bu7', name: 'Empire Global', icon: '👑', desc: 'Dominance mondiale', cost: 5e6, income: 8000, maxLvl: 25 },
]

export const REAL_ESTATE = [
    { id: 'im1', name: 'Studio Paris', icon: '🏠', desc: 'Quartier République', cost: 300, income: 1.5, maxLvl: 25 },
    { id: 'im2', name: 'T3 Lyon', icon: '🏡', desc: 'Presqu\'île, vue Saône', cost: 1500, income: 7, maxLvl: 25 },
    { id: 'im3', name: 'Loft Manhattan', icon: '🗽', desc: '5th Avenue, NYC', cost: 8000, income: 30, maxLvl: 25 },
    { id: 'im4', name: 'Immeuble Haussmann', icon: '🏛️', desc: 'Paris 8e, 12 appartements', cost: 40000, income: 130, maxLvl: 25 },
    { id: 'im5', name: 'Tour de Bureaux', icon: '🏗️', desc: 'La Défense, 30 étages', cost: 200000, income: 600, maxLvl: 25 },
    { id: 'im6', name: 'Resort Maldives', icon: '🏖️', desc: '120 villas sur l\'eau', cost: 1.2e6, income: 3000, maxLvl: 25 },
    { id: 'im7', name: 'Île Privée', icon: '🏝️', desc: 'Juridiction offshore', cost: 8e6, income: 15000, maxLvl: 25 },
]

export const CRYPTO_ASSETS = [
    { id: 'cr1', name: 'Bitcoin', icon: '₿', desc: 'Le roi des cryptos', cost: 500, income: 3, maxLvl: 25 },
    { id: 'cr2', name: 'Ethereum', icon: '⟠', desc: 'Smart contracts & DeFi', cost: 2500, income: 12, maxLvl: 25 },
    { id: 'cr3', name: 'DeFi Protocol', icon: '🔗', desc: 'Yield farming 120% APY', cost: 12000, income: 50, maxLvl: 25 },
    { id: 'cr4', name: 'NFT Rare', icon: '🎨', desc: 'Blue chip collection', cost: 60000, income: 200, maxLvl: 25 },
    { id: 'cr5', name: 'Crypto Fund', icon: '🐋', desc: 'Multi-asset fund managers', cost: 350000, income: 900, maxLvl: 25 },
    { id: 'cr6', name: 'Launchpad', icon: '🌕', desc: 'Early access IDO/IEO', cost: 2e6, income: 4000, maxLvl: 25 },
    { id: 'cr7', name: 'Exchange', icon: '🌐', desc: 'Propre exchange décentralisé', cost: 12e6, income: 20000, maxLvl: 25 },
]

export const STOCKS_ASSETS = [
    { id: 'st1', name: 'Apple (AAPL)', icon: '🍎', desc: 'Tech leader mondal', cost: 400, income: 2, maxLvl: 25 },
    { id: 'st2', name: 'Tesla (TSLA)', icon: '⚡', desc: 'EV & énergie renouvelable', cost: 2000, income: 9, maxLvl: 25 },
    { id: 'st3', name: 'Nvidia (NVDA)', icon: '🖥️', desc: 'Puces IA & gaming', cost: 10000, income: 40, maxLvl: 25 },
    { id: 'st4', name: 'S&P 500 ETF', icon: '📊', desc: '500 plus grandes US companies', cost: 50000, income: 170, maxLvl: 25 },
    { id: 'st5', name: 'Hedge Portfolio', icon: '🛡️', desc: 'Stratégies long/short', cost: 300000, income: 750, maxLvl: 25 },
    { id: 'st6', name: 'Family Office', icon: '🎩', desc: 'Gestion de fortune familiale', cost: 1.8e6, income: 3500, maxLvl: 25 },
    { id: 'st7', name: 'Wall St. Legend', icon: '🏆', desc: 'Market maker statut', cost: 10e6, income: 18000, maxLvl: 25 },
]

export const CLICK_BOOSTS = [
    { id: 'cb1', name: 'Café Forte', icon: '☕', cost: 200, mult: 2, desc: 'Double la puissance de clic' },
    { id: 'cb2', name: 'Séance Coaching', icon: '🎯', cost: 1000, mult: 3, desc: 'Mindset de winner' },
    { id: 'cb3', name: 'Red Bull Pack', icon: '🐂', cost: 5000, mult: 5, desc: 'Focus extrême' },
    { id: 'cb4', name: 'MBA Harvard', icon: '🎓', cost: 25000, mult: 10, desc: 'Business acumen' },
    { id: 'cb5', name: 'Réseau Élite', icon: '🤝', cost: 125000, mult: 25, desc: 'Qui tu connais...' },
    { id: 'cb6', name: 'Team de Traders', icon: '👥', cost: 750000, mult: 75, desc: '10 traders pour toi' },
    { id: 'cb7', name: 'Mentalité Billionaire', icon: '🧠', cost: 5e6, mult: 250, desc: 'Mode dieu activé' },
]

// ─── HELPERS ───────────────────────────────────────────────────
export function upgradeCost(base, lvl) {
    return Math.ceil(base * Math.pow(1.18, lvl))
}

function getCurrentWealth(totalEarned) {
    return [...WEALTH_LEVELS].reverse().find(w => totalEarned >= w.min) || WEALTH_LEVELS[0]
}

function buildUpgradeMap(list) {
    return Object.fromEntries(list.map(u => [u.id, { ...u, level: 0 }]))
}

// ─── STORE ─────────────────────────────────────────────────────
export const useGameStore = create((set, get) => ({
    balance: 0,
    totalEarned: 0,
    clickPower: 1,      // $ per click
    incomePerSec: 0,

    bankInv: buildUpgradeMap(BANK_INVESTMENTS),
    businessInv: buildUpgradeMap(BUSINESS_INVESTMENTS),
    realEstate: buildUpgradeMap(REAL_ESTATE),
    cryptoAssets: buildUpgradeMap(CRYPTO_ASSETS),
    stocksAssets: buildUpgradeMap(STOCKS_ASSETS),

    clickBoosts: Object.fromEntries(CLICK_BOOSTS.map(b => [b.id, { ...b, owned: false }])),

    totalClicks: 0,
    combo: 1,
    comboReset: null,
    wealthLevel: WEALTH_LEVELS[0],

    // Charts history (last 30 points)
    history: Array.from({ length: 30 }, (_, i) => ({ t: i, v: 0 })),

    chatMessages: [
        { id: 1, user: 'System', msg: '🎮 Bienvenue sur SBUSINESS! Construisez votre empire.', sys: true, ts: '17:42' },
        { id: 2, user: 'AlexTrade', msg: 'Viens de passer 1M $! 🎉 Le hedge fund c\'est OP!', ts: '17:43' },
        { id: 3, user: 'MarcWall', msg: 'Quel est votre IPS actuellement?', ts: '17:44' },
        { id: 4, user: 'SophieNYC', msg: 'L\'île privée vient de se débloquer 🏝️', ts: '17:44' },
        { id: 5, user: 'RaChad', msg: 'combo x45 depuis 10min 🔥🔥🔥', ts: '17:45' },
    ],

    activeSection: 'bank',

    // ── ACTIONS ──
    setSection: (s) => set({ activeSection: s }),

    tick: () => {
        const { incomePerSec, balance, totalEarned, history } = get()
        if (incomePerSec <= 0) return
        const delta = incomePerSec / 10
        const nb = balance + delta
        const nte = totalEarned + delta
        const newHistory = [...history.slice(1), { t: Date.now(), v: nb }]
        set({
            balance: nb,
            totalEarned: nte,
            wealthLevel: getCurrentWealth(nte),
            history: newHistory,
        })
    },

    click: (clientX, clientY) => {
        const { clickPower, combo, comboReset, balance, totalEarned, history } = get()
        const isCrit = Math.random() < 0.08
        const comboMult = 1 + Math.min(combo - 1, 49) * 0.06
        const earned = clickPower * comboMult * (isCrit ? 5 : 1)
        const nb = balance + earned
        const nte = totalEarned + earned

        if (comboReset) clearTimeout(comboReset)
        const timer = setTimeout(() => set({ combo: 1, comboReset: null }), 2500)

        const newHistory = [...history.slice(1), { t: Date.now(), v: nb }]

        set({
            balance: nb,
            totalEarned: nte,
            combo: Math.min(combo + 1, 50),
            comboReset: timer,
            totalClicks: get().totalClicks + 1,
            wealthLevel: getCurrentWealth(nte),
            history: newHistory,
        })

        return { earned, isCrit, x: clientX, y: clientY }
    },

    buyUpgrade: (category, id) => {
        const state = get()
        const map = { bank: 'bankInv', business: 'businessInv', realestate: 'realEstate', crypto: 'cryptoAssets', stocks: 'stocksAssets' }
        const key = map[category]
        if (!key) return
        const inv = { ...state[key] }
        const item = inv[id]
        if (!item) return
        const cost = upgradeCost(item.cost, item.level)
        if (state.balance < cost || item.level >= item.maxLvl) return
        inv[id] = { ...item, level: item.level + 1 }
        const newIncome = state.incomePerSec + item.income
        set({ balance: state.balance - cost, incomePerSec: newIncome, [key]: inv })
    },

    buyBoost: (id) => {
        const state = get()
        const boost = state.clickBoosts[id]
        if (!boost || boost.owned || state.balance < boost.cost) return
        set({
            balance: state.balance - boost.cost,
            clickPower: state.clickPower * boost.mult,
            clickBoosts: { ...state.clickBoosts, [id]: { ...boost, owned: true } },
        })
    },

    pushChat: (msg) => {
        set(s => ({
            chatMessages: [...s.chatMessages.slice(-80), {
                id: Date.now() + Math.random(),
                ...msg,
                ts: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            }]
        }))
    },
}))
