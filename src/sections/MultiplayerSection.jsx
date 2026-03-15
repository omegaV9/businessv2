import { useState } from 'react'
import { useGameStore, WEALTH_LEVELS } from '../store/gameStore'
import { formatMoney } from '../utils/format'
import { Trophy, Crown, Users, Zap } from 'lucide-react'

const FAKE_PLAYERS = [
    { name: 'SophieB', balance: 2.5e12, level: '🌍 TITAN MONDIAL', online: true },
    { name: 'AlexT', balance: 8.2e9, level: '👑 MILLIARDAIRE', online: true },
    { name: 'MarcK', balance: 450e6, level: '🗽 Capitaliste NYC', online: true },
    { name: 'Ryad', balance: 12e6, level: '🚀 Multi-Millionnaire', online: false },
    { name: 'Luna', balance: 1.2e6, level: '💎 Millionnaire', online: true },
    { name: 'Tom', balance: 234e3, level: '📊 Manager Senior', online: false },
    { name: 'Jade', balance: 45e3, level: '🖥️ Cadre Moyen', online: true },
]

export default function MultiplayerSection() {
    const { balance, totalEarned, wealthLevel } = useGameStore()
    const [tab, setTab] = useState('leaderboard')

    // Inject current player
    const allPlayers = [
        { name: 'Vous', balance, level: wealthLevel?.label || '🏚️ Sans Abri', online: true, isMe: true },
        ...FAKE_PLAYERS,
    ].sort((a, b) => b.balance - a.balance)

    const myRank = allPlayers.findIndex(p => p.isMe) + 1

    return (
        <div className="flex flex-col gap-6 animate-slide-up">
            {/* Header */}
            <div className="grid grid-cols-3 gap-4">
                <div className="stat-card text-center">
                    <Users size={20} className="text-blue-400 mx-auto mb-1" />
                    <div className="text-2xl font-black text-white">127</div>
                    <div className="text-xs text-slate-500">En ligne</div>
                </div>
                <div className="stat-card text-center">
                    <Trophy size={20} className="text-yellow-400 mx-auto mb-1" />
                    <div className="text-2xl font-black text-yellow-400">#{myRank}</div>
                    <div className="text-xs text-slate-500">Votre rang</div>
                </div>
                <div className="stat-card text-center">
                    <Crown size={20} className="text-purple-400 mx-auto mb-1" />
                    <div className="text-2xl font-black text-white">{formatMoney(balance)}</div>
                    <div className="text-xs text-slate-500">Votre balance</div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2">
                {['leaderboard', 'challenges'].map(t => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        className="px-4 py-2 rounded-xl text-sm font-semibold transition-all capitalize"
                        style={{
                            background: tab === t ? 'rgba(59,130,246,0.2)' : 'rgba(21,31,56,0.8)',
                            border: `1px solid ${tab === t ? 'rgba(59,130,246,0.4)' : 'rgba(30,58,143,0.3)'}`,
                            color: tab === t ? '#60a5fa' : '#64748b',
                        }}
                    >
                        {t === 'leaderboard' ? '🏆 Classement' : '⚡ Défis'}
                    </button>
                ))}
            </div>

            {tab === 'leaderboard' ? (
                <div className="flex flex-col gap-2">
                    {allPlayers.map((p, i) => (
                        <div
                            key={p.name}
                            className="leaderboard-row"
                            style={p.isMe ? {
                                background: 'rgba(59,130,246,0.1)',
                                border: '1px solid rgba(59,130,246,0.3)',
                            } : {}}
                        >
                            {/* Rank */}
                            <div className="w-8 text-center flex-shrink-0">
                                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : (
                                    <span className="text-xs text-slate-600">#{i + 1}</span>
                                )}
                            </div>

                            {/* Avatar */}
                            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                                style={{ background: stringToColor(p.name) }}>
                                {p.name[0]}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-white">{p.name}</span>
                                    {p.online && <div className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />}
                                    {p.isMe && <span className="text-xs text-blue-400 font-medium">(vous)</span>}
                                </div>
                                <div className="text-xs text-slate-500">{p.level}</div>
                            </div>

                            {/* Balance */}
                            <div className="text-right flex-shrink-0">
                                <div className="text-sm font-mono font-bold text-white">{formatMoney(p.balance)}</div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {[
                        { title: 'Clic Marathon', desc: 'Cliquez 10,000 fois', reward: '$50,000', progress: 45, emoji: '👆' },
                        { title: 'Premier Million', desc: 'Atteignez $1,000,000', reward: 'x5 revenus 1h', progress: 8, emoji: '💰' },
                        { title: 'Investisseur', desc: 'Achetez 10 upgrades', reward: 'Carte Gold', progress: 70, emoji: '📈' },
                        { title: 'Crypto King', desc: 'Investissez dans 3 cryptos', reward: '$500,000', progress: 33, emoji: '₿' },
                    ].map(c => (
                        <div key={c.title} className="stat-card">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-2xl">{c.emoji}</span>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <span className="font-semibold text-white text-sm">{c.title}</span>
                                        <span className="text-xs text-yellow-400 font-mono">{c.reward}</span>
                                    </div>
                                    <span className="text-xs text-slate-500">{c.desc}</span>
                                </div>
                            </div>
                            <div className="progress-bar">
                                <div className="progress-fill" style={{
                                    width: `${c.progress}%`,
                                    background: 'linear-gradient(90deg, #1d4ed8, #7c3aed)',
                                }} />
                            </div>
                            <div className="flex justify-between mt-1">
                                <span className="text-xs text-slate-600">{c.progress}%</span>
                                <span className="text-xs text-slate-600">100%</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

function stringToColor(str) {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }
    const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899']
    return colors[Math.abs(hash) % colors.length]
}
