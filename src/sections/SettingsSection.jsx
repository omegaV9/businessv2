import { useGameStore, WEALTH_LEVELS, CLICK_UPGRADES } from '../store/gameStore'
import { formatMoney, getWealthProgress } from '../utils/format'
import { ChevronRight, Trash2, Volume2, VolumeX, Globe, Moon } from 'lucide-react'

export default function SettingsSection() {
    const { balance, totalEarned, incomePerSecond, totalClicks, clickValue, wealthLevel,
        purchasedClickUpgrades, buyClickUpgrade, WEALTH_LEVELS: wl } = useGameStore()

    const { progress, current, next } = getWealthProgress(totalEarned, WEALTH_LEVELS)

    return (
        <div className="flex flex-col gap-6 animate-slide-up">
            {/* Wealth Progression */}
            <div className="stat-card">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
                    Progression vers Milliardaire
                </h3>

                <div className="flex flex-col gap-2">
                    {WEALTH_LEVELS.map((level, i) => {
                        const isReached = totalEarned >= level.min
                        const isCurrent = wealthLevel?.label === level.label
                        return (
                            <div key={level.label}
                                className="flex items-center gap-3 p-2 rounded-lg transition-all"
                                style={{
                                    background: isCurrent ? `${level.color}20` : 'transparent',
                                    border: isCurrent ? `1px solid ${level.color}40` : '1px solid transparent',
                                }}>
                                <span className={`text-lg ${!isReached ? 'grayscale opacity-40' : ''}`}>{level.emoji}</span>
                                <div className="flex-1">
                                    <div className="text-xs font-semibold" style={{ color: isReached ? level.color : '#4b5563' }}>
                                        {level.label}
                                    </div>
                                    <div className="text-xs text-slate-600">{formatMoney(level.min)}</div>
                                </div>
                                {isReached && !isCurrent && <span className="text-xs text-green-400">✓</span>}
                                {isCurrent && <span className="text-xs text-white font-bold animate-pulse">← ICI</span>}
                                {!isReached && <span className="text-xs text-slate-700">🔒</span>}
                            </div>
                        )
                    })}
                </div>

                {next && (
                    <div className="mt-4">
                        <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-500">Vers {next.label}</span>
                            <span className="text-slate-500">{progress.toFixed(1)}%</span>
                        </div>
                        <div className="progress-bar h-2">
                            <div className="progress-fill h-2" style={{
                                width: `${progress}%`,
                                background: `linear-gradient(90deg, ${current?.color}, ${next?.color})`,
                            }} />
                        </div>
                    </div>
                )}
            </div>

            {/* Click Power Upgrades */}
            <div>
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
                    Multiplicateurs de Clic
                </h3>
                <div className="grid grid-cols-2 gap-3">
                    {CLICK_UPGRADES.map(upg => {
                        const owned = purchasedClickUpgrades.includes(upg.id)
                        const canAfford = balance >= upg.cost
                        return (
                            <button
                                key={upg.id}
                                onClick={() => buyClickUpgrade(upg.id)}
                                disabled={owned || !canAfford}
                                className={`upgrade-card text-left ${owned ? 'opacity-60' : !canAfford ? 'disabled' : ''}`}
                                style={owned ? { border: '1px solid rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.05)' } : {}}
                            >
                                <div className="text-2xl mb-2">{upg.icon}</div>
                                <div className="font-semibold text-sm text-white mb-1">{upg.name}</div>
                                <div className="text-xs text-slate-500 mb-2">{upg.description}</div>
                                <div className="text-xs font-mono font-bold" style={{ color: owned ? '#10b981' : canAfford ? '#3b82f6' : '#6b7280' }}>
                                    {owned ? '✅ Acheté' : formatMoney(upg.cost)}
                                </div>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Stats */}
            <div className="stat-card">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Statistiques</h3>
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { label: 'Total Gagné', value: formatMoney(totalEarned), icon: '💰' },
                        { label: 'Revenus/sec', value: `${formatMoney(incomePerSecond)}/s`, icon: '⏱️' },
                        { label: 'Par Clic', value: formatMoney(clickValue), icon: '👆' },
                        { label: 'Clics Totaux', value: totalClicks.toLocaleString(), icon: '🖱️' },
                    ].map(stat => (
                        <div key={stat.label} className="p-3 rounded-xl" style={{ background: 'rgba(15,22,41,0.8)', border: '1px solid rgba(30,58,143,0.2)' }}>
                            <div className="text-lg mb-1">{stat.icon}</div>
                            <div className="text-xs text-slate-500 mb-0.5">{stat.label}</div>
                            <div className="text-sm font-mono font-bold text-white">{stat.value}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Reset */}
            <button
                onClick={() => {
                    if (confirm('⚠️ Réinitialiser toute la progression? Cette action est irréversible.')) {
                        window.location.reload()
                    }
                }}
                className="flex items-center justify-center gap-2 p-3 rounded-xl text-red-400 text-sm font-semibold transition-all hover:bg-red-400/10"
                style={{ border: '1px solid rgba(239,68,68,0.2)' }}
            >
                <Trash2 size={14} />
                Réinitialiser la progression
            </button>
        </div>
    )
}
