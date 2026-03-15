import { useEffect, useRef, useState, useCallback } from 'react'
import L from 'leaflet'
import { useGameStore } from '../store/gameStore'
import { fmt, fmtIncome } from '../utils/format'
import { X, Car, TrendingUp, Star, User, Clock, Navigation, MapPin } from 'lucide-react'

// Fix default Leaflet icon paths broken by Vite bundling
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// ── Paris locations ──────────────────────────────────────────
const LOCATIONS = [
    { name: 'Tour Eiffel', lat: 48.8584, lng: 2.2945, type: 'tourist', fare: 22 },
    { name: 'Louvre', lat: 48.8606, lng: 2.3376, type: 'tourist', fare: 18 },
    { name: 'Montmartre', lat: 48.8867, lng: 2.3431, type: 'nightlife', fare: 25 },
    { name: 'CDG Aéroport', lat: 49.0097, lng: 2.5479, type: 'airport', fare: 58 },
    { name: 'Gare du Nord', lat: 48.8809, lng: 2.3553, type: 'transport', fare: 20 },
    { name: 'Opéra', lat: 48.8719, lng: 2.3316, type: 'premium', fare: 30 },
    { name: 'Bastille', lat: 48.8533, lng: 2.3692, type: 'nightlife', fare: 20 },
    { name: 'La Défense', lat: 48.8918, lng: 2.2378, type: 'business', fare: 38 },
    { name: 'Châtelet', lat: 48.8584, lng: 2.3470, type: 'center', fare: 15 },
    { name: 'Saint-Germain', lat: 48.8534, lng: 2.3488, type: 'premium', fare: 26 },
    { name: 'Pigalle', lat: 48.8833, lng: 2.3333, type: 'nightlife', fare: 22 },
    { name: 'Marais', lat: 48.8573, lng: 2.3592, type: 'premium', fare: 20 },
    { name: 'Invalides', lat: 48.8566, lng: 2.3122, type: 'tourist', fare: 19 },
    { name: 'République', lat: 48.8675, lng: 2.3631, type: 'center', fare: 17 },
    { name: 'Belleville', lat: 48.8721, lng: 2.3798, type: 'local', fare: 14 },
    { name: 'Orly Aéroport', lat: 48.7262, lng: 2.3652, type: 'airport', fare: 46 },
    { name: 'Neuilly', lat: 48.8846, lng: 2.2692, type: 'luxury', fare: 45 },
    { name: 'Vincennes', lat: 48.8482, lng: 2.4397, type: 'suburb', fare: 30 },
]

const ZONE_COLORS = {
    tourist: '#10b981', airport: '#f59e0b', nightlife: '#8b5cf6',
    business: '#3b82f6', premium: '#ec4899', center: '#06b6d4',
    transport: '#f97316', local: '#64748b', suburb: '#94a3b8',
    luxury: '#fbbf24',
}

const ZONE_LABELS = {
    tourist: '🏛️ Tourisme', airport: '✈️ Aéroports', nightlife: '🎭 Nuit',
    business: '💼 Business', premium: '💎 Premium', center: '🏙️ Centre',
    transport: '🚆 Gares', local: '🏘️ Quartiers', suburb: '🌆 Banlieue',
    luxury: '👑 Luxe',
}

const DRIVERS = [
    'Ahmed K.', 'Lucas M.', 'Sofia R.', 'Karim B.', 'Émilie T.',
    'Marco D.', 'Yasmine A.', 'Thomas L.', 'Fatou D.', 'Nicolas P.', 'Ines B.', 'David C.',
]

function haversine(lat1, lng1, lat2, lng2) {
    const R = 6371
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLng = ((lng2 - lng1) * Math.PI) / 180
    const a = Math.sin(dLat / 2) ** 2
        + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function makeTaxiIcon(color = '#f59e0b', status = 'driving', angle = 0) {
    const glow = status === 'driving' ? `drop-shadow(0 0 8px ${color})` : 'none'
    const svg = `<svg viewBox="0 0 24 24" width="22" height="22" xmlns="http://www.w3.org/2000/svg" style="transform: rotate(${angle}deg); filter: ${glow}; transition: transform 0.2s linear">
      <rect x="5" y="2" width="14" height="20" rx="4" fill="${color}" />
      <rect x="6" y="5" width="12" height="4" fill="#0f172a" />
      <rect x="6" y="14" width="12" height="5" fill="#0f172a" />
      <rect x="10" y="8" width="4" height="5" fill="${color}" />
      <circle cx="8" cy="3" r="1.5" fill="#facc15" />
      <circle cx="16" cy="3" r="1.5" fill="#facc15" />
      <circle cx="8" cy="21" r="1.5" fill="#ef4444" />
      <circle cx="16" cy="21" r="1.5" fill="#ef4444" />
    </svg>`
    return L.divIcon({
        html: svg,
        className: '',
        iconSize: [22, 22],
        iconAnchor: [11, 11],
        popupAnchor: [0, -11],
    })
}

const AIRPLANE_SVG = `<svg viewBox="0 0 24 24" width="32" height="32" xmlns="http://www.w3.org/2000/svg" style="transform: rotate({angle}deg); filter: drop-shadow(4px 12px 6px rgba(0,0,0,0.6))">
  <path fill="#e2e8f0" d="M21,16V14L13,9V3.5C13,2.67 12.33,2 11.5,2C10.67,2 10,2.67 10,3.5V9L2,14V16L10,13.5V19L8,20.5V22L11.5,21L15,22V20.5L13,19V13.5L21,16Z" />
</svg>`

function makePlaneIcon(angle = 0) {
    return L.divIcon({
        html: AIRPLANE_SVG.replace('{angle}', angle),
        className: '',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16],
    })
}

function makeLocationIcon(color) {
    return L.divIcon({
        html: `<div style="width:8px;height:8px;border-radius:50%;background:${color};box-shadow:0 0 8px ${color};"></div>`,
        className: '',
        iconSize: [8, 8],
        iconAnchor: [4, 4],
    })
}

// ─────────────────────────────────────────────────────────────
export default function TaxiMapOverlay({
    bizState, onClose, onBuyUpgrade, onHireManager, onFireManager,
}) {
    const { balance } = useGameStore()
    const mapContainerRef = useRef(null)
    const mapRef = useRef(null)
    const markersRef = useRef({})       // { taxiId: L.Marker }
    const zoneLayersRef = useRef([])    // L.Circle / L.Marker items
    const taxiDataRef = useRef([])      // live taxi state (avoid stale closures)
    const planesRef = useRef([])        // live airplane state
    const planeMarkersRef = useRef([])  // leaflet markers for planes
    const animFrameRef = useRef(null)
    const lastTickRef = useRef(Date.now())

    const [taxis, setTaxis] = useState([])
    const [tripLog, setTripLog] = useState([])
    const [sessionEarnings, setSessionEarnings] = useState(0)
    const [sessionTrips, setSessionTrips] = useState(0)
    const [selectedId, setSelectedId] = useState(null)
    const [showZones, setShowZones] = useState(true)

    // ── Derived from upgrades ──────────────────────────────────
    const upgrades = bizState?.upgrades || []
    const fleetSize = 1
        + (upgrades.includes('u1') ? 2 : 0)
        + (upgrades.includes('u3') ? 5 : 0)
    const hasAirport = upgrades.includes('u2')
    const hasApp = upgrades.includes('u4')
    const hasVIP = upgrades.includes('u5')
    const isManaged = bizState?.managed

    const activeZones = ['center', 'transport', 'tourist', 'local']
    if (hasAirport) activeZones.push('airport')
    if (hasApp) activeZones.push('nightlife', 'business', 'premium', 'suburb')
    if (hasVIP) activeZones.push('luxury')

    const availableLocations = LOCATIONS.filter(l => activeZones.includes(l.type))
    const speedMult = (hasApp ? 1.35 : 1) * (isManaged ? 1.12 : 1)

    // ── INIT MAP ──────────────────────────────────────────────
    useEffect(() => {
        if (!mapContainerRef.current || mapRef.current) return

        const map = L.map(mapContainerRef.current, {
            center: [48.862, 2.350],
            zoom: 12,
            zoomControl: false,
            attributionControl: false,
        })

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
            subdomains: 'abcd', maxZoom: 19,
        }).addTo(map)

        // Label layer on top
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png', {
            subdomains: 'abcd', maxZoom: 19, pane: 'overlayPane',
        }).addTo(map)

        L.control.zoom({ position: 'bottomright' }).addTo(map)
        L.control.attribution({ position: 'bottomleft', prefix: '© CartoDB' }).addTo(map)

        mapRef.current = map

        // Init taxis
        const init = Array.from({ length: fleetSize }, (_, i) => {
            const from = availableLocations[Math.floor(Math.random() * availableLocations.length)]
            const to = availableLocations.filter(l => l !== from)[Math.floor(Math.random() * (availableLocations.length - 1))]
            return {
                id: i,
                lat: from.lat + (Math.random() - 0.5) * 0.004,
                lng: from.lng + (Math.random() - 0.5) * 0.004,
                fromName: from.name,
                targetLat: to.lat,
                targetLng: to.lng,
                targetName: to.name,
                fare: to.fare + Math.floor(Math.random() * 12) + (hasVIP ? 20 : 0),
                distKm: haversine(from.lat, from.lng, to.lat, to.lng).toFixed(1),
                status: 'driving',
                driver: DRIVERS[i % DRIVERS.length],
                rating: (4.2 + Math.random() * 0.8).toFixed(1),
                tripsToday: Math.floor(Math.random() * 8),
                earningsToday: Math.floor(Math.random() * 220) + 60,
                progress: 0,
                waitTimer: 0,
            }
        })

        taxiDataRef.current = init
        setTaxis([...init])

        // Create Leaflet markers for each taxi
        init.forEach(t => {
            const m = L.marker([t.lat, t.lng], { icon: makeTaxiIcon('#f59e0b', 'driving', 0), zIndexOffset: 1000 })
                .addTo(map)
                .on('click', () => setSelectedId(prev => prev === t.id ? null : t.id))
            markersRef.current[t.id] = m
        })

        // Init planes
        const initPlanes = Array.from({ length: 4 }, (_, i) => {
            return {
                id: i,
                lat: 48.6 + Math.random() * 0.4,
                lng: 2.0 + Math.random() * 0.6,
                targetLat: 48.6 + Math.random() * 0.4,
                targetLng: 2.0 + Math.random() * 0.6,
                angle: 0,
            }
        })
        planesRef.current = initPlanes
        initPlanes.forEach(p => {
            const pm = L.marker([p.lat, p.lng], { icon: makePlaneIcon(0), zIndexOffset: 2000, interactive: false })
                .addTo(map)
            planeMarkersRef.current[p.id] = pm
        })

        return () => {
            cancelAnimationFrame(animFrameRef.current)
            map.remove()
            mapRef.current = null
            markersRef.current = {}
            planeMarkersRef.current = {}
        }
    }, []) // run once

    // ── ZONE CIRCLES ──────────────────────────────────────────
    useEffect(() => {
        const map = mapRef.current
        if (!map) return

        // Remove old layers
        zoneLayersRef.current.forEach(l => { try { l.remove() } catch (_) { } })
        zoneLayersRef.current = []

        if (!showZones) return

        activeZones.forEach(zone => {
            const locs = LOCATIONS.filter(l => l.type === zone)
            const color = ZONE_COLORS[zone] || '#3b82f6'

            locs.forEach(loc => {
                const circle = L.circle([loc.lat, loc.lng], {
                    radius: 350,
                    color,
                    fillColor: color,
                    fillOpacity: 0.09,
                    weight: 1,
                    opacity: 0.5,
                }).addTo(map)

                const labelIcon = L.divIcon({
                    html: `<div style="
            background:rgba(6,13,31,0.88);
            border:1px solid ${color}50;
            border-radius:5px;
            padding:2px 7px;
            font-size:9px;
            color:${color};
            white-space:nowrap;
            font-family:'JetBrains Mono',monospace;
            font-weight:700;
            pointer-events:none;
          ">${loc.name}</div>`,
                    className: '',
                    iconAnchor: [-4, 8],
                })
                const label = L.marker([loc.lat, loc.lng], { icon: labelIcon, interactive: false }).addTo(map)

                zoneLayersRef.current.push(circle, label)
            })
        })
    }, [showZones, upgrades.length])

    // ── SYNC FLEET SIZE ────────────────────────────────────────
    useEffect(() => {
        const map = mapRef.current
        if (!map) return

        const cur = taxiDataRef.current.length
        if (fleetSize <= cur) return

        for (let i = cur; i < fleetSize; i++) {
            const from = availableLocations[Math.floor(Math.random() * availableLocations.length)]
            const to = availableLocations[Math.floor(Math.random() * availableLocations.length)]
            const t = {
                id: i,
                lat: from.lat + (Math.random() - 0.5) * 0.004,
                lng: from.lng + (Math.random() - 0.5) * 0.004,
                fromName: from.name,
                targetLat: to.lat,
                targetLng: to.lng,
                targetName: to.name,
                fare: to.fare + Math.floor(Math.random() * 12) + (hasVIP ? 20 : 0),
                distKm: haversine(from.lat, from.lng, to.lat, to.lng).toFixed(1),
                status: 'driving',
                driver: DRIVERS[i % DRIVERS.length],
                rating: (4.2 + Math.random() * 0.8).toFixed(1),
                tripsToday: 0,
                earningsToday: 0,
                progress: 0,
                waitTimer: 0,
            }
            taxiDataRef.current.push(t)
            const m = L.marker([t.lat, t.lng], { icon: makeTaxiIcon('#f59e0b', 'driving', 0), zIndexOffset: 1000 })
                .addTo(map)
                .on('click', () => setSelectedId(prev => prev === t.id ? null : t.id))
            markersRef.current[t.id] = m
        }
        setTaxis([...taxiDataRef.current])
    }, [fleetSize])

    // ── ANIMATION LOOP ─────────────────────────────────────────
    useEffect(() => {
        const SPEED_DEG = 0.00055 * speedMult // degrees/frame at ~30fps

        const tick = () => {
            const now = Date.now()
            const dt = Math.min((now - lastTickRef.current) / (1000 / 30), 3) // cap to avoid jumps after tab blur
            lastTickRef.current = now

            let stateChanged = false
            const newTrips = []

            taxiDataRef.current = taxiDataRef.current.map(taxi => {
                // ── WAITING ──
                if (taxi.status === 'waiting') {
                    const nextWait = taxi.waitTimer - dt
                    if (nextWait > 0) return { ...taxi, waitTimer: nextWait }

                    // Start new trip
                    const avail = availableLocations.filter(l => l.name !== taxi.fromName)
                    if (avail.length === 0) return taxi
                    const dest = avail[Math.floor(Math.random() * avail.length)]
                    const dist = haversine(taxi.lat, taxi.lng, dest.lat, dest.lng)
                    const fare = Math.round((dest.fare + Math.floor(Math.random() * 12) + (hasVIP ? 20 : 0)) * (isManaged ? 1.2 : 1))

                    stateChanged = true
                    return {
                        ...taxi,
                        status: 'driving',
                        targetLat: dest.lat + (Math.random() - 0.5) * 0.003,
                        targetLng: dest.lng + (Math.random() - 0.5) * 0.003,
                        targetName: dest.name,
                        fare,
                        distKm: dist.toFixed(1),
                        progress: 0,
                        waitTimer: 0,
                    }
                }

                // ── DRIVING ──
                const dLat = taxi.targetLat - taxi.lat
                const dLng = taxi.targetLng - taxi.lng
                const dist = Math.sqrt(dLat * dLat + dLng * dLng)

                // Calculate angle for orientation (0 is North)
                const dLngScale = dLng * Math.cos(taxi.lat * Math.PI / 180)
                const angle = Math.atan2(dLngScale, dLat) * 180 / Math.PI

                if (dist < 0.0008) {
                    // Arrived
                    const earned = taxi.fare
                    newTrips.push({ earned, driver: taxi.driver, from: taxi.fromName, to: taxi.targetName, dist: taxi.distKm, fare: earned })

                    markersRef.current[taxi.id]?.setIcon(makeTaxiIcon('#f59e0b', 'waiting', angle))
                    stateChanged = true
                    return {
                        ...taxi,
                        lat: taxi.targetLat,
                        lng: taxi.targetLng,
                        fromName: taxi.targetName,
                        status: 'waiting',
                        waitTimer: 2 + Math.random() * 3,
                        tripsToday: taxi.tripsToday + 1,
                        earningsToday: taxi.earningsToday + earned,
                        progress: 1,
                    }
                }

                const step = SPEED_DEG * dt
                const newLat = taxi.lat + (dLat / dist) * step
                const newLng = taxi.lng + (dLng / dist) * step
                const progress = Math.max(0, Math.min(1, 1 - dist / 0.05))

                // Update Leaflet marker position & rotation
                markersRef.current[taxi.id]?.setLatLng([newLat, newLng])
                markersRef.current[taxi.id]?.setIcon(makeTaxiIcon('#f59e0b', 'driving', angle))

                return { ...taxi, lat: newLat, lng: newLng, progress, angle }
            })

            // Update Airplanes
            planesRef.current = planesRef.current.map(plane => {
                const pdLat = plane.targetLat - plane.lat
                const pdLng = plane.targetLng - plane.lng
                const pDist = Math.sqrt(pdLat * pdLat + pdLng * pdLng)

                if (pDist < 0.005) {
                    // Assign new random target
                    return {
                        ...plane,
                        targetLat: 48.6 + Math.random() * 0.4,
                        targetLng: 2.0 + Math.random() * 0.6,
                    }
                }

                const pdLngScale = pdLng * Math.cos(plane.lat * Math.PI / 180)
                const pAngle = Math.atan2(pdLngScale, pdLat) * 180 / Math.PI
                const pSpeed = 0.0012 * dt

                const pNewLat = plane.lat + (pdLat / pDist) * pSpeed
                const pNewLng = plane.lng + (pdLng / pDist) * pSpeed

                planeMarkersRef.current[plane.id]?.setLatLng([pNewLat, pNewLng])
                planeMarkersRef.current[plane.id]?.setIcon(makePlaneIcon(pAngle))

                return { ...plane, lat: pNewLat, lng: pNewLng, angle: pAngle }
            })

            // Process completed trips
            if (newTrips.length > 0) {
                const totalEarned = newTrips.reduce((s, t) => s + t.earned, 0)
                useGameStore.setState(s => ({
                    balance: s.balance + totalEarned,
                    totalEarned: s.totalEarned + totalEarned,
                }))
                setSessionEarnings(prev => prev + totalEarned)
                setSessionTrips(prev => prev + newTrips.length)
                setTripLog(prev => [
                    ...newTrips.map(t => ({
                        id: Date.now() + Math.random(),
                        ...t,
                        ts: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                    })),
                    ...prev.slice(0, 24),
                ])
            }

            if (stateChanged) setTaxis([...taxiDataRef.current])

            animFrameRef.current = requestAnimationFrame(tick)
        }

        animFrameRef.current = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(animFrameRef.current)
    }, [speedMult, hasVIP, isManaged, availableLocations.length])

    // Focus map on selected taxi
    useEffect(() => {
        if (selectedId == null || !mapRef.current) return
        const t = taxiDataRef.current.find(t => t.id === selectedId)
        if (t) mapRef.current.flyTo([t.lat, t.lng], 15, { duration: 0.8 })
    }, [selectedId])

    // ── Computed stats ─────────────────────────────────────────
    const drivingCount = taxis.filter(t => t.status === 'driving').length
    const avgRating = taxis.length
        ? (taxis.reduce((s, t) => s + parseFloat(t.rating), 0) / taxis.length).toFixed(1)
        : '—'
    const selectedTaxi = selectedId != null ? taxis.find(t => t.id === selectedId) : null

    const UPGRADE_DEFS = [
        { id: 'u1', name: '+2 Taxis', cost: 8000, desc: '3 véhicules total', icon: '🚕', color: '#f59e0b' },
        { id: 'u2', name: 'Zone Aéroports', cost: 25000, desc: 'CDG & Orly débloqués', icon: '✈️', color: '#3b82f6' },
        { id: 'u3', name: '+5 Taxis', cost: 80000, desc: '8 véhicules total', icon: '🚖', color: '#f59e0b' },
        { id: 'u4', name: 'Application Mobile', cost: 250000, desc: 'Toutes zones + vitesse', icon: '📱', color: '#10b981' },
        { id: 'u5', name: 'Zone VIP Luxe', cost: 800000, desc: 'Courses premium +$20', icon: '👑', color: '#fbbf24' },
    ]

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 990, display: 'flex', flexDirection: 'column', background: '#060d1f' }}>

            {/* ── TOP BAR ─────────────────────────────────────────── */}
            <div style={{
                height: 54, flexShrink: 0, display: 'flex', alignItems: 'center',
                background: 'rgba(6,13,31,0.98)', borderBottom: '1px solid rgba(30,58,143,0.18)',
                padding: '0 14px', gap: 0, zIndex: 10,
            }}>
                {/* Back */}
                <button onClick={onClose} style={{
                    display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8,
                    color: '#64748b', marginRight: 16, border: '1px solid rgba(30,58,143,0.2)', transition: 'all 0.15s',
                }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(30,58,143,0.2)' }}
                    onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.background = 'transparent' }}
                >
                    <X size={14} />
                    <span style={{ fontSize: 11, fontWeight: 600 }}>Retour</span>
                </button>

                {/* Title */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 20 }}>
                    <span style={{ fontSize: 20 }}>🚕</span>
                    <div>
                        <div style={{ fontSize: 13, fontWeight: 800, color: '#f1f5f9', fontFamily: 'Outfit' }}>Flotte Taxi — Paris</div>
                        <div style={{ fontSize: 9, color: '#475569' }}>OpenStreetMap • Temps réel</div>
                    </div>
                </div>

                <div style={{ width: 1, height: 28, background: 'rgba(30,58,143,0.3)', marginRight: 20 }} />

                {/* KPIs */}
                {[
                    { label: 'En course', val: `${drivingCount}/${fleetSize}`, icon: <Car size={11} />, color: '#f59e0b' },
                    { label: 'Encaissé', val: fmt(sessionEarnings), icon: <TrendingUp size={11} />, color: '#10b981' },
                    { label: 'Courses', val: sessionTrips, icon: <Navigation size={11} />, color: '#3b82f6' },
                    { label: 'Note moy.', val: `${avgRating} ⭐`, icon: <Star size={11} />, color: '#fbbf24' },
                ].map(k => (
                    <div key={k.label} style={{ display: 'flex', alignItems: 'center', gap: 7, marginRight: 20 }}>
                        <span style={{ color: k.color }}>{k.icon}</span>
                        <div>
                            <div style={{ fontSize: 9, color: '#334155', letterSpacing: '0.05em' }}>{k.label}</div>
                            <div style={{ fontSize: 14, fontWeight: 800, color: k.color, fontFamily: 'JetBrains Mono', lineHeight: 1 }}>{k.val}</div>
                        </div>
                    </div>
                ))}

                {/* Controls */}
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
                    <button onClick={() => setShowZones(v => !v)} style={{
                        padding: '5px 12px', borderRadius: 7, fontSize: 10, fontWeight: 700, cursor: 'pointer',
                        background: showZones ? 'rgba(59,130,246,0.15)' : 'rgba(10,18,48,0.6)',
                        border: `1px solid ${showZones ? 'rgba(59,130,246,0.35)' : 'rgba(30,58,143,0.2)'}`,
                        color: showZones ? '#60a5fa' : '#475569', display: 'flex', alignItems: 'center', gap: 5,
                    }}>
                        <MapPin size={10} /> Zones
                    </button>

                    {isManaged ? (
                        <button onClick={onFireManager} style={{
                            padding: '5px 12px', borderRadius: 7, fontSize: 10, fontWeight: 700, cursor: 'pointer',
                            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#ef4444',
                            display: 'flex', alignItems: 'center', gap: 5,
                        }}>
                            <User size={10} /> Licencier manager
                        </button>
                    ) : (
                        <button onClick={onHireManager} disabled={balance < 800} style={{
                            padding: '5px 12px', borderRadius: 7, fontSize: 10, fontWeight: 700, cursor: balance >= 800 ? 'pointer' : 'not-allowed',
                            background: balance >= 800 ? 'rgba(16,185,129,0.15)' : 'rgba(10,18,48,0.4)',
                            border: `1px solid ${balance >= 800 ? 'rgba(16,185,129,0.3)' : 'rgba(30,58,143,0.15)'}`,
                            color: balance >= 800 ? '#10b981' : '#334155',
                            display: 'flex', alignItems: 'center', gap: 5,
                        }}>
                            <User size={10} /> Manager · {fmt(800)}/h
                        </button>
                    )}
                </div>
            </div>

            {/* ── BODY ─────────────────────────────────────────────── */}
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

                {/* LEFT — Fleet list */}
                <div className="scroll-y" style={{
                    width: 210, flexShrink: 0,
                    background: 'rgba(6,13,31,0.95)',
                    borderRight: '1px solid rgba(30,58,143,0.15)',
                    padding: '10px 8px',
                }}>
                    <div style={{ fontSize: 9, fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8, paddingLeft: 4 }}>
                        Flotte · {fleetSize} véhicules
                    </div>

                    {taxis.map(t => (
                        <div key={t.id} onClick={() => setSelectedId(prev => prev === t.id ? null : t.id)}
                            style={{
                                padding: '9px 10px', borderRadius: 10, marginBottom: 5, cursor: 'pointer',
                                background: selectedId === t.id ? 'rgba(245,158,11,0.1)' : 'rgba(10,18,48,0.7)',
                                border: `1px solid ${selectedId === t.id ? 'rgba(245,158,11,0.4)' : t.status === 'driving' ? 'rgba(16,185,129,0.14)' : 'rgba(30,58,143,0.1)'}`,
                                transition: 'all 0.12s',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: t.status === 'driving' ? 6 : 0 }}>
                                <span style={{ fontSize: 15 }}>🚕</span>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: 10, fontWeight: 700, color: '#e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {t.driver}
                                    </div>
                                    <div style={{ fontSize: 8, color: t.status === 'driving' ? '#10b981' : '#f59e0b' }}>
                                        {t.status === 'driving' ? '🟢 En course' : '🟡 Attente'}
                                    </div>
                                </div>
                                <div style={{ fontSize: 9, color: '#fbbf24', flexShrink: 0 }}>⭐{t.rating}</div>
                            </div>

                            {t.status === 'driving' && (
                                <>
                                    <div style={{ fontSize: 8, color: '#475569', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        → <span style={{ color: '#94a3b8', fontWeight: 600 }}>{t.targetName}</span> · {t.distKm}km
                                    </div>
                                    <div style={{ height: 2, background: 'rgba(30,58,143,0.25)', borderRadius: 99 }}>
                                        <div style={{ height: '100%', borderRadius: 99, background: '#10b981', width: `${(t.progress || 0) * 100}%`, transition: 'width 0.4s' }} />
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 3 }}>
                                        <span style={{ fontSize: 9, fontFamily: 'JetBrains Mono', color: '#10b981', fontWeight: 700 }}>${t.fare}</span>
                                    </div>
                                </>
                            )}

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
                                <span style={{ fontSize: 7, color: '#1e3a5f' }}>{t.tripsToday} courses</span>
                                <span style={{ fontSize: 7, color: '#334155', fontFamily: 'JetBrains Mono' }}>{fmt(t.earningsToday)}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CENTER — Leaflet Map */}
                <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                    {/* Map container */}
                    <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

                    {/* Zone legend */}
                    {showZones && (
                        <div style={{
                            position: 'absolute', top: 12, left: 12, zIndex: 500,
                            background: 'rgba(6,13,31,0.9)', borderRadius: 10, padding: '8px 12px',
                            border: '1px solid rgba(30,58,143,0.2)', backdropFilter: 'blur(8px)',
                            maxHeight: 240, overflowY: 'auto',
                        }}>
                            <div style={{ fontSize: 8, color: '#334155', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Zones actives</div>
                            {activeZones.map(z => (
                                <div key={z} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: ZONE_COLORS[z], flexShrink: 0, boxShadow: `0 0 4px ${ZONE_COLORS[z]}` }} />
                                    <span style={{ fontSize: 9, color: '#64748b' }}>{ZONE_LABELS[z]}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Selected taxi popup */}
                    {selectedTaxi && (
                        <div style={{
                            position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)',
                            zIndex: 500, background: 'rgba(6,13,31,0.97)',
                            border: '1px solid rgba(245,158,11,0.35)', borderRadius: 14,
                            padding: '12px 20px', backdropFilter: 'blur(12px)',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.6), 0 0 20px rgba(245,158,11,0.1)',
                            display: 'flex', alignItems: 'center', gap: 16, minWidth: 360,
                        }}>
                            <span style={{ fontSize: 26 }}>🚕</span>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 12, fontWeight: 700, color: '#f1f5f9', marginBottom: 2 }}>{selectedTaxi.driver}</div>
                                <div style={{ fontSize: 10, color: '#475569' }}>
                                    {selectedTaxi.status === 'driving'
                                        ? `${selectedTaxi.fromName} → ${selectedTaxi.targetName} · ${selectedTaxi.distKm} km`
                                        : 'En attente d\'une course'}
                                </div>
                                {selectedTaxi.status === 'driving' && (
                                    <div style={{ height: 2, background: 'rgba(30,58,143,0.2)', borderRadius: 99, marginTop: 5, width: 140 }}>
                                        <div style={{ height: '100%', borderRadius: 99, background: '#10b981', width: `${(selectedTaxi.progress || 0) * 100}%` }} />
                                    </div>
                                )}
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: 16, fontWeight: 900, color: '#10b981', fontFamily: 'JetBrains Mono' }}>${selectedTaxi.fare}</div>
                                <div style={{ fontSize: 8, color: '#334155' }}>course en cours</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: 11, color: '#fbbf24' }}>⭐ {selectedTaxi.rating}</div>
                                <div style={{ fontSize: 8, color: '#334155' }}>{selectedTaxi.tripsToday} courses/j</div>
                            </div>
                            <button onClick={() => setSelectedId(null)} style={{ color: '#334155', marginLeft: 4 }}>
                                <X size={14} />
                            </button>
                        </div>
                    )}
                </div>

                {/* RIGHT — Upgrades + Trip log */}
                <div style={{
                    width: 280, flexShrink: 0, display: 'flex', flexDirection: 'column',
                    background: 'rgba(6,13,31,0.95)', borderLeft: '1px solid rgba(30,58,143,0.15)',
                }}>
                    {/* Upgrades */}
                    <div style={{ padding: '10px 10px', borderBottom: '1px solid rgba(30,58,143,0.12)' }}>
                        <div style={{ fontSize: 9, fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
                            ⚡ Améliorations
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                            {UPGRADE_DEFS.map(u => {
                                const owned = upgrades.includes(u.id)
                                const canAfford = balance >= u.cost
                                return (
                                    <button key={u.id} onClick={() => !owned && onBuyUpgrade(u.id)} disabled={owned || !canAfford}
                                        style={{
                                            padding: '9px 12px', borderRadius: 9, textAlign: 'left', width: '100%',
                                            cursor: owned ? 'default' : canAfford ? 'pointer' : 'not-allowed',
                                            background: owned ? 'rgba(16,185,129,0.07)' : 'rgba(10,18,48,0.7)',
                                            border: `1px solid ${owned ? 'rgba(16,185,129,0.22)' : canAfford ? u.color + '22' : 'rgba(30,58,143,0.1)'}`,
                                            opacity: !owned && !canAfford ? 0.38 : 1, transition: 'all 0.15s',
                                        }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <span style={{ fontSize: 16 }}>{u.icon}</span>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ fontSize: 11, fontWeight: 700, color: owned ? '#10b981' : '#e2e8f0' }}>{u.name}</div>
                                                <div style={{ fontSize: 9, color: '#475569' }}>{u.desc}</div>
                                            </div>
                                            <div style={{ flexShrink: 0 }}>
                                                {owned
                                                    ? <span style={{ fontSize: 11, color: '#10b981' }}>✓</span>
                                                    : <span style={{ fontSize: 10, fontFamily: 'JetBrains Mono', fontWeight: 700, color: canAfford ? '#10b981' : '#475569' }}>{fmt(u.cost)}</span>
                                                }
                                            </div>
                                        </div>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Trip log */}
                    <div className="scroll-y" style={{ flex: 1, padding: '10px' }}>
                        <div style={{ fontSize: 9, fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
                            <Clock size={9} /> Dernières courses
                        </div>

                        {tripLog.length === 0 ? (
                            <div style={{ textAlign: 'center', color: '#1e3a5f', fontSize: 10, paddingTop: 20 }}>
                                Les courses s'afficheront ici...
                            </div>
                        ) : tripLog.map((t, i) => (
                            <div key={t.id} style={{
                                padding: '7px 9px', borderRadius: 8, marginBottom: 5,
                                background: 'rgba(10,18,48,0.6)',
                                border: `1px solid ${i === 0 ? 'rgba(16,185,129,0.22)' : 'rgba(30,58,143,0.1)'}`,
                                animation: i === 0 ? 'slideUp 0.25s ease-out' : 'none',
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                                    <span style={{ fontSize: 10, fontWeight: 600, color: '#94a3b8' }}>{t.driver}</span>
                                    <span style={{ fontSize: 11, fontWeight: 800, color: '#10b981', fontFamily: 'JetBrains Mono' }}>+${t.fare}</span>
                                </div>
                                <div style={{ fontSize: 9, color: '#334155', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {t.from} → {t.to}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                                    <span style={{ fontSize: 8, color: '#1e3a5f' }}>{t.dist} km</span>
                                    <span style={{ fontSize: 8, color: '#1e3a5f' }}>{t.ts}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
