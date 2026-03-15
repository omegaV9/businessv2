import { useEffect, useRef } from 'react'

export default function BgCanvas() {
    const ref = useRef()
    useEffect(() => {
        const c = ref.current
        const ctx = c.getContext('2d')
        let id
        const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight }
        resize()
        window.addEventListener('resize', resize)

        const particles = Array.from({ length: 55 }, () => ({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            r: Math.random() * 1.5 + 0.3,
            vy: -(Math.random() * 0.35 + 0.1),
            vx: (Math.random() - 0.5) * 0.15,
            op: Math.random() * 0.35 + 0.05,
            gold: Math.random() > 0.82,
        }))

        const draw = () => {
            ctx.clearRect(0, 0, c.width, c.height)
            particles.forEach(p => {
                ctx.beginPath()
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
                ctx.fillStyle = p.gold ? '#f59e0b' : '#3b82f6'
                ctx.globalAlpha = p.op
                ctx.fill()
                ctx.globalAlpha = 1
                p.y += p.vy; p.x += p.vx
                if (p.y < -5) { p.y = c.height + 5; p.x = Math.random() * c.width }
            })
            id = requestAnimationFrame(draw)
        }
        draw()
        return () => { cancelAnimationFrame(id); window.removeEventListener('resize', resize) }
    }, [])
    return <canvas ref={ref} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }} />
}
