import { useEffect, useRef } from 'react'
import { useGameStore } from './store/gameStore'
import BgCanvas from './components/BgCanvas'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import ChatPanel from './components/ChatPanel'
import BankSection from './sections/BankSection'
import BusinessSection from './sections/BusinessSection'
import { RealEstateSection, CryptoSection, StocksSection } from './sections/FinanceSections'
import { MultiplayerSection, SettingsSection } from './sections/SocialSections'

function ActiveSection({ section }) {
    switch (section) {
        case 'bank': return <BankSection />
        case 'business': return <BusinessSection />
        case 'realestate': return <RealEstateSection />
        case 'crypto': return <CryptoSection />
        case 'stocks': return <StocksSection />
        case 'multiplayer': return <MultiplayerSection />
        case 'settings': return <SettingsSection />
        default: return <BankSection />
    }
}

export default function App() {
    const { tick, activeSection, balance, wealthLevel } = useGameStore()

    // Game tick every 100ms
    useEffect(() => {
        const iv = setInterval(tick, 100)
        return () => clearInterval(iv)
    }, [tick])

    // Dynamic title
    useEffect(() => {
        const balStr = balance >= 1e9 ? `${(balance / 1e9).toFixed(1)}B`
            : balance >= 1e6 ? `${(balance / 1e6).toFixed(1)}M`
                : `$${Math.floor(balance)}`
        document.title = `${wealthLevel?.emoji || '💰'} ${balStr} — SBUSINESS`
    }, [balance, wealthLevel])

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden', background: '#060d1f', position: 'relative' }}>
            <BgCanvas />

            {/* Ambient glows */}
            <div style={{
                position: 'fixed', top: -200, left: '20%', width: 600, height: 600,
                borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
                background: 'radial-gradient(circle, rgba(29,78,216,0.07) 0%, transparent 70%)',
                filter: 'blur(60px)',
            }} />
            <div style={{
                position: 'fixed', bottom: -200, right: '15%', width: 500, height: 500,
                borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
                background: 'radial-gradient(circle, rgba(124,58,237,0.05) 0%, transparent 70%)',
                filter: 'blur(60px)',
            }} />

            {/* Top bar */}
            <TopBar />

            {/* Main layout */}
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative', zIndex: 1 }}>
                <Sidebar />

                {/* Content area — full height, no scroll at top level, each section manages its own */}
                <main style={{ flex: 1, overflow: 'hidden', display: 'flex', minWidth: 0 }}>
                    <ActiveSection section={activeSection} />
                </main>

                <ChatPanel />
            </div>
        </div>
    )
}
