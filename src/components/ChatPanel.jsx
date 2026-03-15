import { useState, useEffect, useRef } from 'react'
import { Send } from 'lucide-react'
import { useGameStore } from '../store/gameStore'

const BOT_PLAYERS = [
    { user: 'AlexTrade', msgs: ['Je viens de dépasser 10M $! 🎉', 'Le hedge fund c\'est vraiment OP', 'Combo x45 pendant 5min solid'] },
    { user: 'MarcWall', msgs: ['Votre IPS c\'est quoi?', 'J\'arrive pas à me stop 😅', 'Nouveau bâtiment acheté 🏙️'] },
    { user: 'SophieNYC', msgs: ['L\'île privée VIENT de drop!', 'Qui farm encore à 3h?? 🙋', 'J\'ai 500M passif/h maintenant'] },
    { user: 'RaChad', msgs: ['TITAN MONDIAL ATTEINT 👑', 'Combo x50 c\'est jouissif', 'On stop pas les gagnants'] },
    { user: 'LunaK', msgs: ['Premier million tomorrow 🚀', 'Conseil: maxi l\'immobilier', 'Ce jeu devrait être illégal 😭'] },
    { user: 'System', sys: true, msgs: ['🏆 AlexTrade a atteint MILLIARDAIRE!', '💰 Nouveau record: $4.2T au classement!', '⚡ Événement: x2 revenus pendant 30min!'] },
]

export default function ChatPanel() {
    const { chatMessages, pushChat } = useGameStore()
    const [input, setInput] = useState('')
    const endRef = useRef()

    useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [chatMessages])

    useEffect(() => {
        const iv = setInterval(() => {
            const bot = BOT_PLAYERS[Math.floor(Math.random() * BOT_PLAYERS.length)]
            const msg = bot.msgs[Math.floor(Math.random() * bot.msgs.length)]
            pushChat({ user: bot.user, msg, sys: !!bot.sys })
        }, 3500 + Math.random() * 5000)
        return () => clearInterval(iv)
    }, [])

    const send = () => {
        const t = input.trim()
        if (!t) return
        pushChat({ user: 'Vous', msg: t, me: true })
        setInput('')
    }

    return (
        <div style={{
            width: 240, flexShrink: 0, display: 'flex', flexDirection: 'column', height: '100%',
            background: 'rgba(6,13,31,0.75)', backdropFilter: 'blur(24px)',
            borderLeft: '1px solid rgba(30,58,143,0.15)',
        }}>
            {/* Header */}
            <div style={{ padding: '14px 14px 10px', borderBottom: '1px solid rgba(30,58,143,0.12)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>Global Chat</div>
                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5 }}>
                        <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
                        <span style={{ fontSize: 10, color: '#475569' }}>127 online</span>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="scroll-y" style={{ flex: 1, padding: '10px 10px' }}>
                {chatMessages.map(m => (
                    <div key={m.id} style={{ marginBottom: 10, animation: 'slideUp 0.25s ease-out both' }}>
                        {m.sys ? (
                            <div style={{
                                padding: '7px 10px', borderRadius: 9,
                                background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.18)',
                                display: 'flex', gap: 7, alignItems: 'flex-start',
                            }}>
                                <span style={{ fontSize: 11 }}>⚡</span>
                                <div>
                                    <span style={{ fontSize: 11, fontWeight: 700, color: '#f59e0b' }}>System</span>
                                    <p style={{ fontSize: 11, color: '#d97706', marginTop: 1, lineHeight: 1.35 }}>{m.msg}</p>
                                </div>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', gap: 7, alignItems: 'flex-start' }}>
                                <div style={{
                                    width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                                    background: strToColor(m.user), display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 11, fontWeight: 800, color: '#fff', marginTop: 1,
                                }}>{m.user[0]}</div>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                        <span style={{ fontSize: 11, fontWeight: 700, color: strToColor(m.user) }}>{m.user}</span>
                                        {m.me && <span style={{ fontSize: 9, color: '#3b82f6', fontWeight: 600 }}>(vous)</span>}
                                        <span style={{ fontSize: 9, color: '#1e3a5f' }}>{m.ts}</span>
                                    </div>
                                    <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 2, lineHeight: 1.4 }}>{m.msg}</p>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                <div ref={endRef} />
            </div>

            {/* Input */}
            <div style={{ padding: '10px', borderTop: '1px solid rgba(30,58,143,0.12)' }}>
                <div style={{ display: 'flex', gap: 6 }}>
                    <input
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && send()}
                        placeholder="Écrire..."
                        style={{
                            flex: 1, background: 'rgba(10,18,48,0.8)', border: '1px solid rgba(30,58,143,0.2)',
                            borderRadius: 9, padding: '7px 10px', fontSize: 11, color: '#e2e8f0',
                            transition: 'border-color 0.15s',
                        }}
                        onFocus={e => e.target.style.borderColor = 'rgba(59,130,246,0.45)'}
                        onBlur={e => e.target.style.borderColor = 'rgba(30,58,143,0.2)'}
                    />
                    <button
                        onClick={send}
                        style={{
                            width: 32, height: 32, borderRadius: 9, flexShrink: 0,
                            background: 'linear-gradient(135deg,#1d4ed8,#3b82f6)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'transform 0.1s',
                        }}
                        onMouseDown={e => e.currentTarget.style.transform = 'scale(0.9)'}
                        onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <Send size={12} color="white" />
                    </button>
                </div>
            </div>
        </div>
    )
}

function strToColor(s) {
    let h = 0
    for (let i = 0; i < s.length; i++) h = s.charCodeAt(i) + ((h << 5) - h)
    const cols = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#f97316']
    return cols[Math.abs(h) % cols.length]
}
