import { useState, useEffect, useRef, useCallback } from 'react'

// ==================== SEED DATA ====================
const SEED_NOTES = [
  {
    id: '1',
    title: 'The Art of Product Thinking',
    body: 'Product thinking is about solving real human problems. It\'s not about features—it\'s about outcomes. Every decision should be traced back to the user need it addresses. The best products emerge from deep empathy combined with technical excellence. When building, always ask: what job is this product hired to do?',
    tags: ['product', 'strategy'],
    starred: true,
    deleted: false,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    color: 0
  },
  {
    id: '2',
    title: 'On Simplicity',
    body: '"Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away." — Antoine de Saint-Exupéry\n\nThis quote haunts me. In a world of increasing complexity, the radical act is simplification. Not simple-minded, but elegantly simple. Like a well-crafted sentence that says more with less.',
    tags: ['philosophy', 'design'],
    starred: true,
    deleted: false,
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    color: 1
  },
  {
    id: '3',
    title: 'Kyoto Dreams',
    body: 'Walking through the bamboo groves of Arashiyama at dawn. The light filters through in green-gold shafts. Somewhere a temple bell rings. I want to capture that feeling—that perfect stillness before the world wakes. Maybe build an app around mindful travel journaling...',
    tags: ['travel', 'ideas'],
    starred: false,
    deleted: false,
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 8).toISOString(),
    color: 2
  },
  {
    id: '4',
    title: 'Notes on "Thinking, Fast and Slow"',
    body: 'Kahneman\'s dual system framework:\n\nSystem 1: Fast, automatic, emotional\nSystem 2: Slow, deliberate, logical\n\nKey insight: We overestimate our rational thinking. Most decisions are System 1 making System 2 believe it was their idea. The implications for product design are massive—make the easy path also be the right path.',
    tags: ['books', 'psychology'],
    starred: false,
    deleted: false,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 12).toISOString(),
    color: 3
  },
  {
    id: '5',
    title: 'SaaS Pricing Experiment',
    body: 'What if pricing was truly usage-based? Not just API calls, but value delivered. A tier that scales with customer success. The tricky part: measuring value. Possible proxies: time saved, revenue generated, errors prevented. Need to build the telemetry first before the pricing model.\n\nHypothesis: Customers would pay 2x for guaranteed outcomes vs. raw usage.',
    tags: ['startup', 'pricing'],
    starred: true,
    deleted: false,
    createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 18).toISOString(),
    color: 4
  },
  {
    id: '6',
    title: 'Nocturne',
    body: 'The city sleeps but I am awake\ncounting stars that never break\nsilence speaks in whispers low\n Secrets only night can know\n\n— fragment',
    tags: ['creative', 'poetry'],
    starred: false,
    deleted: false,
    createdAt: new Date(Date.now() - 86400000 * 25).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 25).toISOString(),
    color: 5
  }
]

// ==================== THEMES ====================
// Refined, professional color palettes
const THEMES = {
  cosmic: {
    name: 'COSMIC',
    bg: 'bg-[#0a0612]',
    orb1: 'bg-violet-600/20',
    orb2: 'bg-purple-500/15',
    orb3: 'bg-indigo-500/10',
    sidebar: 'bg-[#0d0820]/80',
    card: 'bg-white/[0.03]',
    cardHover: 'hover:bg-white/[0.08]',
    text: 'text-slate-100',
    textMuted: 'text-slate-400',
    accent: 'text-violet-400',
    accentGlow: 'shadow-[0_0_15px_rgba(139,92,246,0.3)]',
    border: 'border-white/8',
    input: 'bg-white/[0.03] border-white/10',
    activeNav: 'bg-violet-500/10 border-l-violet-400',
    fab: 'bg-violet-600 hover:bg-violet-500',
    searchGlow: 'focus:shadow-[0_0_20px_rgba(139,92,246,0.3)]',
    gradient: 'from-violet-600/20 via-purple-600/10 to-indigo-600/5'
  },
  aurora: {
    name: 'AURORA',
    bg: 'bg-[#050d08]',
    orb1: 'bg-emerald-600/20',
    orb2: 'bg-teal-500/15',
    orb3: 'bg-green-500/10',
    sidebar: 'bg-[#061210]/80',
    card: 'bg-white/[0.03]',
    cardHover: 'hover:bg-white/[0.08]',
    text: 'text-slate-100',
    textMuted: 'text-slate-400',
    accent: 'text-emerald-400',
    accentGlow: 'shadow-[0_0_15px_rgba(52,211,153,0.3)]',
    border: 'border-white/8',
    input: 'bg-white/[0.03] border-white/10',
    activeNav: 'bg-emerald-500/10 border-l-emerald-400',
    fab: 'bg-emerald-600 hover:bg-emerald-500',
    searchGlow: 'focus:shadow-[0_0_20px_rgba(52,211,153,0.3)]',
    gradient: 'from-emerald-600/20 via-teal-600/10 to-green-600/5'
  },
  obsidian: {
    name: 'OBSIDIAN',
    bg: 'bg-[#0a0806]',
    orb1: 'bg-amber-600/20',
    orb2: 'bg-orange-500/15',
    orb3: 'bg-red-500/10',
    sidebar: 'bg-[#0c0908]/80',
    card: 'bg-white/[0.03]',
    cardHover: 'hover:bg-white/[0.08]',
    text: 'text-slate-100',
    textMuted: 'text-slate-400',
    accent: 'text-amber-400',
    accentGlow: 'shadow-[0_0_15px_rgba(251,191,36,0.3)]',
    border: 'border-white/8',
    input: 'bg-white/[0.03] border-white/10',
    activeNav: 'bg-amber-500/10 border-l-amber-400',
    fab: 'bg-amber-600 hover:bg-amber-500',
    searchGlow: 'focus:shadow-[0_0_20px_rgba(251,191,36,0.3)]',
    gradient: 'from-amber-600/20 via-orange-600/10 to-red-600/5'
  },
  glacial: {
    name: 'GLACIAL',
    bg: 'bg-slate-50',
    orb1: 'bg-blue-600/10',
    orb2: 'bg-indigo-500/8',
    orb3: 'bg-sky-500/8',
    sidebar: 'bg-white/80',
    card: 'bg-white/60',
    cardHover: 'hover:bg-white/80',
    text: 'text-slate-800',
    textMuted: 'text-slate-500',
    accent: 'text-blue-600',
    accentGlow: 'shadow-[0_0_15px_rgba(37,99,235,0.2)]',
    border: 'border-slate-200',
    input: 'bg-white/80 border-slate-200',
    activeNav: 'bg-blue-50 border-l-blue-600',
    fab: 'bg-blue-600 hover:bg-blue-500',
    searchGlow: 'focus:shadow-[0_0_20px_rgba(37,99,235,0.2)]',
    gradient: 'from-blue-600/5 via-indigo-600/3 to-sky-600/3'
  }
}

const FONT_PAIRS = [
  { name: 'Editorial', display: 'font-serif', body: 'font-serif', mono: 'font-mono' },
  { name: 'Refined', display: 'font-sans', body: 'font-sans', mono: 'font-mono' },
  { name: 'Impact', display: 'font-bold', body: 'font-medium', mono: 'font-mono' },
  { name: 'Modern', display: 'font-normal', body: 'font-light', mono: 'font-mono' }
]

const CARD_COLORS = ['#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#ec4899']

// ==================== HELPERS ====================
const generateId = () => Date.now() + Math.random().toString(36).substr(2, 9)

const getRelativeTime = (date) => {
  const now = new Date()
  const diff = now - new Date(date)
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return new Date(date).toLocaleDateString()
}

const getWordCount = (text) => text.trim().split(/\s+/).filter(w => w).length

const getReadingTime = (text) => {
  const words = getWordCount(text)
  const mins = Math.ceil(words / 200)
  return `${mins} min read`
}

const hashString = (str) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash)
}

const getTagColor = (tag) => {
  const hues = [0, 30, 60, 120, 180, 240, 280, 320]
  const hue = hues[hashString(tag) % hues.length]
  return `hsl(${hue}, 70%, 50%)`
}

const highlightText = (text, query) => {
  if (!query) return text
  const parts = text.split(new RegExp(`(${query})`, 'gi'))
  return parts.map((part, i) => 
    part.toLowerCase() === query.toLowerCase() 
      ? <mark key={i} className="bg-yellow-500/40 text-inherit rounded px-0.5">{part}</mark>
      : part
  )
}

// ==================== MAIN APP ====================
export default function App() {
  // State
  const [notes, setNotes] = useState([])
  const [selectedNote, setSelectedNote] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [activeFilter, setActiveFilter] = useState('all')
  const [selectedTag, setSelectedTag] = useState(null)
  const [theme, setTheme] = useState('cosmic')
  const [fontPair, setFontPair] = useState(0)
  const [view, setView] = useState('notes')
  const [apiKey, setApiKey] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiResponse, setAiResponse] = useState('')
  const [aiChatMessages, setAiChatMessages] = useState([])
  const [chatInput, setChatInput] = useState('')
  const [askInput, setAskInput] = useState('')
  const [showAskInput, setShowAskInput] = useState(false)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState(null)
  const [rightPanelWidth, setRightPanelWidth] = useState(380)
  const [isResizing, setIsResizing] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [deletingNote, setDeletingNote] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isMobileView, setIsMobileView] = useState(false) // 'notes' | 'editor' | null

  const canvasRef = useRef(null)
  const canvasCtx = useRef(null)
  const particlesRef = useRef([])
  const saveTimeoutRef = useRef(null)
  const searchInputRef = useRef(null)

  const currentTheme = THEMES[theme]
  const currentFonts = FONT_PAIRS[fontPair]

  // Load notes from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('luminary_notes')
    if (saved) {
      setNotes(JSON.parse(saved))
    } else {
      setNotes(SEED_NOTES)
      localStorage.setItem('luminary_notes', JSON.stringify(SEED_NOTES))
    }
  }, [])

  // Save notes to localStorage
  useEffect(() => {
    if (notes.length > 0) {
      setSaving(true)
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
      saveTimeoutRef.current = setTimeout(() => {
        localStorage.setItem('luminary_notes', JSON.stringify(notes))
        setSaving(false)
        setLastSaved(new Date())
      }, 800)
    }
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    }
  }, [notes])

  // Inject Google Fonts
  useEffect(() => {
    const link = document.createElement('link')
    link.href = 'https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Raleway:wght@300;400;500;600;700&family=DM+Sans:wght@400;500;600&display=swap'
    link.rel = 'stylesheet'
    document.head.appendChild(link)
    return () => document.head.removeChild(link)
  }, [])

  // Canvas particle system
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    canvasCtx.current = ctx
    
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Create particles
    const particles = []
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1
      })
    }
    particlesRef.current = particles

    let animationId
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Update and draw particles
      particles.forEach((p, i) => {
        p.x += p.vx
        p.y += p.vy
        
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
        
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = theme === 'glacial' ? 'rgba(37, 99, 235, 0.3)' : 'rgba(167, 139, 250, 0.3)'
        ctx.fill()

        // Draw connections
        particles.slice(i + 1).forEach(p2 => {
          const dx = p.x - p2.x
          const dy = p.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 150) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = theme === 'glacial' 
              ? `rgba(37, 99, 235, ${0.15 * (1 - dist / 150)})`
              : `rgba(167, 139, 250, ${0.15 * (1 - dist / 150)})`
            ctx.lineWidth = 1
            ctx.stroke()
          }
        })

        // Mouse interaction
        const mdx = p.x - mousePos.x
        const mdy = p.y - mousePos.y
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy)
        if (mdist < 100) {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.radius + 2, 0, Math.PI * 2)
          ctx.fillStyle = theme === 'glacial' ? 'rgba(37, 99, 235, 0.6)' : 'rgba(167, 139, 250, 0.6)'
          ctx.fill()
        }
      })

      animationId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationId)
    }
  }, [theme, mousePos])

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
      if (e.key === 'Escape') {
        setSelectedNote(null)
        setShowAskInput(false)
        setAiResponse('')
        if (isMobile) setIsMobileView(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isMobile])

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile) {
        setSidebarCollapsed(true)
      }
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Filter and sort notes
  const filteredNotes = notes
    .filter(note => {
      if (note.deleted && activeFilter !== 'trash') return false
      if (!note.deleted && activeFilter === 'trash') return false
      if (activeFilter === 'starred' && !note.starred) return false
      if (activeFilter === 'all' && note.deleted) return false
      if (selectedTag && !note.tags.includes(selectedTag)) return false
      
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        return (
          note.title.toLowerCase().includes(q) ||
          note.body.toLowerCase().includes(q) ||
          note.tags.some(t => t.toLowerCase().includes(q))
        )
      }
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest': return new Date(b.updatedAt) - new Date(a.updatedAt)
        case 'oldest': return new Date(a.updatedAt) - new Date(b.updatedAt)
        case 'alpha': return a.title.localeCompare(b.title)
        case 'longest': return b.body.length - a.body.length
        default: return 0
      }
    })

  // Get all tags
  const allTags = [...new Set(notes.flatMap(n => n.deleted ? [] : n.tags))]

  // Get total stats
  const totalNotes = notes.filter(n => !n.deleted).length
  const totalWords = notes.filter(n => !n.deleted).reduce((acc, n) => acc + getWordCount(n.body), 0)

  // Note operations
  const createNote = () => {
    const newNote = {
      id: generateId(),
      title: '',
      body: '',
      tags: [],
      starred: false,
      deleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      color: Math.floor(Math.random() * 6)
    }
    setNotes([newNote, ...notes])
    setSelectedNote(newNote)
    setActiveFilter('all')
  }

  const updateNote = (id, updates) => {
    setNotes(notes.map(n => 
      n.id === id 
        ? { ...n, ...updates, updatedAt: new Date().toISOString() }
        : n
    ))
    if (selectedNote?.id === id) {
      setSelectedNote(prev => ({ ...prev, ...updates, updatedAt: new Date().toISOString() }))
    }
  }

  const deleteNote = (id, permanent = false) => {
    if (permanent) {
      setNotes(notes.filter(n => n.id !== id))
    } else {
      setNotes(notes.map(n => 
        n.id === id 
          ? { ...n, deleted: true, updatedAt: new Date().toISOString() }
          : n
      ))
    }
    if (selectedNote?.id === id) {
      setSelectedNote(null)
    }
  }

  const restoreNote = (id) => {
    setNotes(notes.map(n => 
      n.id === id 
        ? { ...n, deleted: false, updatedAt: new Date().toISOString() }
        : n
    ))
  }

  const toggleStar = (id) => {
    const note = notes.find(n => n.id === id)
    updateNote(id, { starred: !note.starred })
  }

  // AI functions
  const callAI = async (prompt, systemPrompt = null) => {
    if (!apiKey) {
      setAiResponse('Please enter your Anthropic API key first.')
      return
    }
    
    setAiLoading(true)
    setAiResponse('')
    
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1024,
          system: systemPrompt || 'You are LUMINARY, an intelligent note assistant. Be concise, insightful, and helpful. Respond in 2-4 sentences max unless asked to expand.',
          messages: [{ role: 'user', content: prompt }]
        })
      })

      const data = await response.json()
      if (data.error) {
        throw new Error(data.error.message)
      }
      
      // Typewriter effect
      const text = data.content[0].text
      for (let i = 0; i < text.length; i++) {
        setAiResponse(text.slice(0, i + 1))
        await new Promise(r => setTimeout(r, 20))
      }
    } catch (err) {
      setAiResponse(`Error: ${err.message}`)
    } finally {
      setAiLoading(false)
    }
  }

  const handleAI = (action) => {
    if (!selectedNote) return
    
    switch (action) {
      case 'summarize':
        callAI(`Summarize this note in 2 sentences:\n\n${selectedNote.title}\n${selectedNote.body}`)
        break
      case 'expand':
        callAI(`Expand this note with more depth and detail:\n\n${selectedNote.title}\n${selectedNote.body}`)
        break
      case 'rewrite':
        callAI(`Rewrite this note to be clearer and more compelling:\n\n${selectedNote.title}\n${selectedNote.body}`)
        break
      case 'ask':
        setShowAskInput(true)
        break
      case 'insights':
        callAI(`What patterns, ideas, or insights do you see in this note?:\n\n${selectedNote.title}\n${selectedNote.body}`)
        break
    }
  }

  const handleAskSubmit = () => {
    if (!askInput.trim() || !selectedNote) return
    callAI(`${askInput}\n\nContext:\n${selectedNote.title}\n${selectedNote.body}`)
    setShowAskInput(false)
    setAskInput('')
  }

  const handleChatSend = () => {
    if (!chatInput.trim()) return
    
    const userMsg = { role: 'user', content: chatInput }
    setAiChatMessages(prev => [...prev, userMsg])
    setChatInput('')
    
    const notesContext = notes
      .filter(n => !n.deleted)
      .map(n => `Title: ${n.title}\nContent: ${n.body}\nTags: ${n.tags.join(', ')}`)
      .join('\n\n---\n\n')
    
    callAI(
      chatInput + '\n\nHere are all my notes for context:\n\n' + notesContext,
      'You are LUMINARY, a helpful AI assistant that can search and analyze the user\'s notes. Be helpful, concise, and insightful.'
    ).then(response => {
      setAiChatMessages(prev => [...prev, { role: 'assistant', content: response || 'No response' }])
    })
  }

  // Resize handler
  const handleResizeStart = (e) => {
    setIsResizing(true)
    const startX = e.clientX
    const startWidth = rightPanelWidth
    
    const handleMove = (e) => {
      const newWidth = startWidth + (e.clientX - startX)
      setRightPanelWidth(Math.max(300, Math.min(600, newWidth)))
    }
    
    const handleUp = () => {
      setIsResizing(false)
      document.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseup', handleUp)
    }
    
    document.addEventListener('mousemove', handleMove)
    document.addEventListener('mouseup', handleUp)
  }

  // Render
  return (
    <div className={`${currentTheme.bg} h-screen w-screen overflow-hidden font-['Raleway'] relative`}>
      {/* Subtle Background Gradient */}
      <div className={`fixed inset-0 bg-gradient-to-br ${currentTheme.gradient} opacity-50`} />
      
      {/* Background Orbs - More Subtle */}
      <div className={`fixed inset-0 pointer-events-none ${currentTheme.orb1} blur-[150px] rounded-full animate-float-1`} style={{ top: '5%', left: '5%', width: '600px', height: '600px', opacity: 0.5 }} />
      <div className={`fixed inset-0 pointer-events-none ${currentTheme.orb2} blur-[120px] rounded-full animate-float-2`} style={{ bottom: '10%', right: '10%', width: '500px', height: '500px', opacity: 0.4 }} />
      
      {/* Particle Canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 1, opacity: 0.6 }} />
      
      {/* Main Layout */}
      <div className={`flex h-full relative z-10 ${currentTheme.text}`} style={{ fontFamily: 'Raleway, sans-serif' }}>
        {/* LEFT SIDEBAR - Desktop */}
        <div className={`${currentTheme.sidebar} backdrop-blur-xl border-r ${currentTheme.border} flex-col ${sidebarCollapsed ? 'w-16' : 'w-64'} transition-all duration-300 animate-slide-in-left hidden md:flex`}>
          {/* Logo */}
          <div className={`p-4 border-b ${currentTheme.border} flex items-center gap-3`}>
            <div className={`w-10 h-10 rounded-xl ${currentTheme.fab} flex items-center justify-center text-xl font-['DM_Serif_Display'] ${currentTheme.accentGlow}`}>
              L
            </div>
            {!sidebarCollapsed && (
              <span className={`text-lg font-['DM_Serif_Display'] ${currentTheme.text}`} style={{ letterSpacing: '0.1em' }}>
                LUMINARY
              </span>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-4 overflow-y-auto">
            {[
              { id: 'all', icon: '📝', label: 'All Notes' },
              { id: 'starred', icon: '⭐', label: 'Starred' },
              { id: 'trash', icon: '🗑️', label: 'Trash' },
              { id: 'chat', icon: '💬', label: 'AI Chat' },
              { id: 'graph', icon: '🕸️', label: 'Graph View' }
            ].map((item, i) => (
              <button
                key={item.id}
                onClick={() => { 
                  if (item.id === 'chat') setView('chat')
                  else if (item.id === 'graph') setView('graph')
                  else { setActiveFilter(item.id); setView('notes') }
                  setSelectedNote(null)
                }}
                className={`w-full px-4 py-3 flex items-center gap-3 transition-all duration-200 border-l-2 ${
                  activeFilter === item.id && view === 'notes'
                    ? `${currentTheme.activeNav} ${currentTheme.accent}`
                    : 'border-transparent hover:bg-white/5'
                }`}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <span className="text-lg">{item.icon}</span>
                {!sidebarCollapsed && <span className={currentTheme.textMuted}>{item.label}</span>}
              </button>
            ))}

            {/* Tags */}
            {!sidebarCollapsed && allTags.length > 0 && (
              <div className="mt-6 px-4">
                <div className={`text-xs uppercase tracking-wider ${currentTheme.textMuted} mb-2`}>Tags</div>
                <div className="flex flex-wrap gap-2">
                  {allTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                      className={`px-2 py-1 rounded-full text-xs flex items-center gap-1.5 transition-all ${
                        selectedTag === tag ? 'bg-white/20' : 'hover:bg-white/10'
                      }`}
                      style={{ color: getTagColor(tag) }}
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: getTagColor(tag) }} />
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </nav>

          {/* Theme Switcher */}
          {!sidebarCollapsed && (
            <div className="p-4 border-t border-white/10">
              <div className={`text-xs uppercase tracking-wider ${currentTheme.textMuted} mb-3`}>Theme</div>
              <div className="flex gap-2">
                {Object.keys(THEMES).map(t => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`w-8 h-8 rounded-full transition-all ${theme === t ? 'ring-2 ring-white ring-offset-2 ring-offset-black' : 'hover:scale-110'}`}
                    style={{ 
                      background: t === 'cosmic' ? 'linear-gradient(135deg, #8b5cf6, #ec4899)' :
                                 t === 'aurora' ? 'linear-gradient(135deg, #10b981, #14b8a6)' :
                                 t === 'obsidian' ? 'linear-gradient(135deg, #f59e0b, #ef4444)' :
                                 'linear-gradient(135deg, #3b82f6, #8b5cf6)'
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Font Switcher */}
          {!sidebarCollapsed && (
            <div className="px-4 pb-4">
              <div className={`text-xs uppercase tracking-wider ${currentTheme.textMuted} mb-2`}>Font</div>
              <select
                value={fontPair}
                onChange={(e) => setFontPair(Number(e.target.value))}
                className={`w-full px-2 py-1.5 rounded text-sm ${currentTheme.input} ${currentTheme.text}`}
              >
                {FONT_PAIRS.map((f, i) => (
                  <option key={i} value={i}>{f.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Collapse Toggle - Desktop only */}
          {!isMobile && (
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={`p-3 border-t ${currentTheme.border} hover:bg-white/10 transition-all`}
          >
            <span className="text-sm">{sidebarCollapsed ? '→' : '←'}</span>
          </button>
          )}
        </div>

        {/* CENTER PANEL */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile Header */}
          {isMobile && (
            <div className={`p-3 border-b ${currentTheme.border} flex items-center justify-between`}>
              <button 
                onClick={() => setMobileMenuOpen(true)}
                className={`p-2 rounded-lg ${currentTheme.input}`}
              >
                ☰
              </button>
              <span className={`font-['DM_Serif_Display'] ${currentTheme.text}`}>LUMINARY</span>
              <button 
                onClick={createNote}
                className={`p-2 rounded-lg ${currentTheme.fab} text-white`}
              >
                +
              </button>
            </div>
          )}

          {/* Top Bar */}
          <div className={`p-4 border-b ${currentTheme.border} backdrop-blur-sm`}>
            <div className={`flex items-center gap-3 ${isMobile ? 'flex-col' : ''}`}>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`flex-1 px-4 py-2 rounded-lg ${currentTheme.input} ${currentTheme.text} placeholder:text-slate-400 focus:outline-none transition-all ${currentTheme.searchGlow}`}
              />
              {!isMobile && (
              <div className={`flex gap-1 ${theme === 'glacial' ? 'bg-slate-200' : 'bg-white/[0.05]'} rounded-lg p-1`}>
                {['newest', 'oldest', 'alpha', 'longest'].map(sort => (
                  <button
                    key={sort}
                    onClick={() => setSortBy(sort)}
                    className={`px-3 py-1 rounded text-xs transition-all ${
                      sortBy === sort 
                        ? (theme === 'glacial' ? 'bg-slate-600 text-white' : 'bg-white/20 text-white') 
                        : (theme === 'glacial' ? 'text-slate-600 hover:text-slate-800' : 'text-white/60 hover:text-white')
                    }`}
                  >
                    {sort.charAt(0).toUpperCase() + sort.slice(1)}
                  </button>
                ))}
              </div>
              )}
            </div>
          </div>

          {/* Notes Grid / Graph View */}
          <div className="flex-1 overflow-y-auto p-4">
            {view === 'graph' ? (
              <KnowledgeGraph 
                notes={notes.filter(n => !n.deleted)} 
                onSelectNote={(note) => { setSelectedNote(note); setView('notes') }}
                theme={currentTheme}
              />
            ) : view === 'chat' ? (
              <AIChatView 
                messages={aiChatMessages}
                input={chatInput}
                onInputChange={setChatInput}
                onSend={handleChatSend}
                loading={aiLoading}
                apiKey={apiKey}
                onApiKeyChange={setApiKey}
                theme={currentTheme}
                fonts={currentFonts}
              />
            ) : filteredNotes.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center animate-fade-in-up">
                <div className={`text-6xl mb-4 ${currentTheme.textMuted}`}>
                  {activeFilter === 'trash' ? '🗑️' : activeFilter === 'starred' ? '⭐' : '📝'}
                </div>
                <div className={`text-xl ${currentTheme.textMuted}`}>
                  {activeFilter === 'trash' ? 'Trash is empty' : 
                   activeFilter === 'starred' ? 'No starred notes' :
                   searchQuery ? 'No notes found' : 'No notes yet'}
                </div>
                {activeFilter !== 'trash' && !searchQuery && (
                  <button 
                    onClick={createNote}
                    className={`mt-4 px-6 py-2 rounded-lg ${currentTheme.fab} text-white font-medium`}
                  >
                    Create your first note
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredNotes.map((note, i) => (
                  <div
                    key={note.id}
                    onClick={() => { 
                      if (deletingNote === note.id) {
                        deleteNote(note.id, true)
                        setDeletingNote(null)
                      } else {
                        setSelectedNote(note)
                      }
                    }}
                    onDoubleClick={() => deletingNote === note.id && setDeletingNote(null)}
                    className={`${currentTheme.card} backdrop-blur-md rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] animate-scale-in ${currentTheme.cardHover} ${currentTheme.border} border ${
                      selectedNote?.id === note.id ? 'ring-2 ring-white/30' : ''
                    }`}
                    style={{ 
                      animationDelay: `${i * 50}ms`,
                      borderTop: `3px solid ${CARD_COLORS[note.color]}`
                    }}
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className={`font-['DM_Serif_Display'] text-lg ${currentTheme.text} truncate`}>
                          {note.title || 'Untitled'}
                        </h3>
                        <button 
                          onClick={(e) => { e.stopPropagation(); toggleStar(note.id) }}
                          className="text-lg hover:scale-110 transition-transform"
                        >
                          {note.starred ? '⭐' : '☆'}
                        </button>
                      </div>
                      <p className={`text-sm ${currentTheme.textMuted} line-clamp-3 mb-3`}>
                        {note.body || 'No content'}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-1 flex-wrap">
                          {note.tags.slice(0, 3).map(tag => (
                            <span 
                              key={tag} 
                              className="px-2 py-0.5 rounded-full text-xs"
                              style={{ backgroundColor: getTagColor(tag) + '30', color: getTagColor(tag) }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <span className={`text-xs ${currentTheme.textMuted}`}>
                          {getRelativeTime(note.updatedAt)}
                        </span>
                      </div>
                    </div>
                    {activeFilter === 'trash' && (
                      <div className={`px-4 pb-4 flex gap-2`}>
                        <button 
                          onClick={(e) => { e.stopPropagation(); restoreNote(note.id) }}
                          className="px-3 py-1 rounded bg-green-600/50 text-white text-sm hover:bg-green-600"
                        >
                          Restore
                        </button>
                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            if (deletingNote === note.id) {
                              deleteNote(note.id, true)
                              setDeletingNote(null)
                            } else {
                              setDeletingNote(note.id)
                            }
                          }}
                          className={`px-3 py-1 rounded text-white text-sm transition-all ${
                            deletingNote === note.id ? 'bg-red-600 animate-pulse' : 'bg-red-600/50 hover:bg-red-600'
                          }`}
                        >
                          {deletingNote === note.id ? 'Confirm?' : 'Delete'}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Status Bar */}
          <div className={`px-4 py-2 border-t ${currentTheme.border} flex items-center justify-between text-xs ${currentTheme.textMuted}`}>
            <span>{totalNotes} notes · {totalWords.toLocaleString()} words</span>
            <span>
              {saving ? (
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                  Saving...
                </span>
              ) : lastSaved ? (
                `Saved ${getRelativeTime(lastSaved)}`
              ) : 'Ready'}
            </span>
          </div>

          {/* FAB */}
          {view === 'notes' && activeFilter !== 'trash' && (
            <button
              onClick={createNote}
              className={`fixed bottom-20 right-8 w-14 h-14 rounded-full ${currentTheme.fab} text-white text-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-20 ${currentTheme.accentGlow} animate-bounce-in`}
            >
              +
            </button>
          )}
        </div>

        {/* RIGHT PANEL */}
        {selectedNote && view === 'notes' && (
          <div 
            className={`${currentTheme.sidebar} backdrop-blur-xl border-l ${currentTheme.border} flex flex-col animate-slide-in-bottom ${
              isMobile ? 'fixed inset-0 z-30 w-full' : ''
            }`}
            style={isMobile ? {} : { width: rightPanelWidth }}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedNote(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-lg z-10"
            >
              ×
            </button>

            {/* Title */}
            <div className="p-4 border-b border-white/10">
              <input
                type="text"
                placeholder="Note title..."
                value={selectedNote.title}
                onChange={(e) => updateNote(selectedNote.id, { title: e.target.value })}
                className={`w-full text-2xl font-['DM_Serif_Display'] bg-transparent border-none focus:outline-none ${currentTheme.text}`}
              />
              <div className={`flex items-center gap-4 mt-2 text-xs ${currentTheme.textMuted}`}>
                <span>{getWordCount(selectedNote.body)} words</span>
                <span>{getReadingTime(selectedNote.body)}</span>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 p-4 overflow-y-auto">
              <textarea
                placeholder="Start writing..."
                value={selectedNote.body}
                onChange={(e) => updateNote(selectedNote.id, { body: e.target.value })}
                className={`w-full h-full bg-transparent border-none focus:outline-none resize-none ${currentTheme.text} font-['DM_Sans']`}
              />
            </div>

            {/* Tags */}
            <div className="p-4 border-t border-white/10">
              <div className="flex flex-wrap gap-2">
                {selectedNote.tags.map(tag => (
                  <span 
                    key={tag}
                    className="px-2 py-1 rounded-full text-xs flex items-center gap-1"
                    style={{ backgroundColor: getTagColor(tag) + '30', color: getTagColor(tag) }}
                  >
                    {tag}
                    <button 
                      onClick={() => updateNote(selectedNote.id, { 
                        tags: selectedNote.tags.filter(t => t !== tag) 
                      })}
                      className="hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  placeholder="Add tag..."
                  className="bg-transparent border-none focus:outline-none text-xs px-2 py-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.target.value.trim()) {
                      if (!selectedNote.tags.includes(e.target.value.trim())) {
                        updateNote(selectedNote.id, { 
                          tags: [...selectedNote.tags, e.target.value.trim()] 
                        })
                      }
                      e.target.value = ''
                    }
                  }}
                />
              </div>
            </div>

            {/* AI Toolbar */}
            <div className="p-4 border-t border-white/10">
              <div className={`text-xs uppercase tracking-wider ${currentTheme.textMuted} mb-2`}>AI Actions</div>
              <div className="flex gap-2 mb-3">
                {[
                  { id: 'summarize', icon: '✦', label: 'Summarize' },
                  { id: 'expand', icon: '⟳', label: 'Expand' },
                  { id: 'rewrite', icon: '✎', label: 'Rewrite' },
                  { id: 'ask', icon: '?', label: 'Ask' },
                  { id: 'insights', icon: '◈', label: 'Insights' }
                ].map(action => (
                  <button
                    key={action.id}
                    onClick={() => handleAI(action.id)}
                    disabled={aiLoading}
                    className={`flex-1 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all text-sm flex flex-col items-center gap-1 disabled:opacity-50 ${currentTheme.accent}`}
                  >
                    <span className="text-lg">{action.icon}</span>
                    {action.label}
                  </button>
                ))}
              </div>
              
              {/* API Key Input */}
              <div className="mb-3">
                <input
                  type="password"
                  placeholder="Anthropic API Key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className={`w-full px-3 py-1.5 rounded text-sm ${currentTheme.input} ${currentTheme.textMuted}`}
                />
              </div>

              {/* Ask Input */}
              {showAskInput && (
                <div className="mb-3 flex gap-2 animate-fade-in-up">
                  <input
                    type="text"
                    placeholder="Ask a question..."
                    value={askInput}
                    onChange={(e) => setAskInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAskSubmit()}
                    className={`flex-1 px-3 py-2 rounded ${currentTheme.input} ${currentTheme.text}`}
                  />
                  <button
                    onClick={handleAskSubmit}
                    className={`px-4 py-2 rounded ${currentTheme.fab} text-white`}
                  >
                    Send
                  </button>
                </div>
              )}

              {/* AI Response */}
              {(aiResponse || aiLoading) && (
                <div className={`p-3 rounded-lg bg-white/5 ${currentTheme.border} border animate-fade-in-up`}>
                  {aiLoading ? (
                    <div className="flex items-center gap-2 text-white/60">
                      <span className="animate-pulse">...</span>
                    </div>
                  ) : (
                    <p className={`text-sm ${currentTheme.text}`}>{aiResponse}</p>
                  )}
                </div>
              )}
            </div>

            {/* Delete Button */}
            <div className="p-4 border-t border-white/10">
              <button
                onClick={() => deleteNote(selectedNote.id)}
                className="w-full py-2 rounded-lg bg-red-600/20 hover:bg-red-600/40 text-red-400 transition-all"
              >
                Move to Trash
              </button>
            </div>

            {/* Resize Handle */}
            <div
              onMouseDown={handleResizeStart}
              className="absolute left-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-white/20"
            />
          </div>
        )}
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobile && mobileMenuOpen && (
        <div className="fixed inset-0 z-40">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Sidebar */}
          <div className={`absolute left-0 top-0 bottom-0 ${currentTheme.sidebar} backdrop-blur-xl border-r ${currentTheme.border} w-64 animate-slide-in-left`}>
            {/* Logo */}
            <div className={`p-4 border-b ${currentTheme.border} flex items-center justify-between`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${currentTheme.fab} flex items-center justify-center text-xl font-['DM_Serif_Display'] ${currentTheme.accentGlow}`}>
                  L
                </div>
                <span className={`text-lg font-['DM_Serif_Display'] ${currentTheme.text}`} style={{ letterSpacing: '0.1em' }}>
                  LUMINARY
                </span>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-white/10"
              >
                ×
              </button>
            </div>

            {/* Navigation */}
            <nav className="py-4">
              {[
                { id: 'all', icon: '📝', label: 'All Notes' },
                { id: 'starred', icon: '⭐', label: 'Starred' },
                { id: 'trash', icon: '🗑️', label: 'Trash' },
                { id: 'chat', icon: '💬', label: 'AI Chat' },
                { id: 'graph', icon: '🕸️', label: 'Graph View' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => { 
                    if (item.id === 'chat') setView('chat')
                    else if (item.id === 'graph') setView('graph')
                    else { setActiveFilter(item.id); setView('notes') }
                    setSelectedNote(null)
                    setMobileMenuOpen(false)
                  }}
                  className={`w-full px-4 py-3 flex items-center gap-3 transition-all border-l-2 ${
                    activeFilter === item.id && view === 'notes'
                      ? `${currentTheme.activeNav} ${currentTheme.accent}`
                      : 'border-transparent hover:bg-white/5'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className={currentTheme.textMuted}>{item.label}</span>
                </button>
              ))}
            </nav>

            {/* Tags */}
            {allTags.length > 0 && (
              <div className="px-4 pb-4">
                <div className={`text-xs uppercase tracking-wider ${currentTheme.textMuted} mb-2`}>Tags</div>
                <div className="flex flex-wrap gap-2">
                  {allTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => {
                        setSelectedTag(selectedTag === tag ? null : tag)
                        setMobileMenuOpen(false)
                      }}
                      className={`px-2 py-1 rounded-full text-xs flex items-center gap-1.5 ${
                        selectedTag === tag ? 'bg-white/20' : 'hover:bg-white/10'
                      }`}
                      style={{ color: getTagColor(tag) }}
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: getTagColor(tag) }} />
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Theme Switcher */}
            <div className="p-4 border-t border-white/10">
              <div className={`text-xs uppercase tracking-wider ${currentTheme.textMuted} mb-3`}>Theme</div>
              <div className="flex gap-2">
                {Object.keys(THEMES).map(t => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`w-8 h-8 rounded-full transition-all ${theme === t ? 'ring-2 ring-white ring-offset-2 ring-offset-black' : 'hover:scale-110'}`}
                    style={{ 
                      background: t === 'cosmic' ? 'linear-gradient(135deg, #8b5cf6, #ec4899)' :
                                 t === 'aurora' ? 'linear-gradient(135deg, #10b981, #14b8a6)' :
                                 t === 'obsidian' ? 'linear-gradient(135deg, #f59e0b, #ef4444)' :
                                 'linear-gradient(135deg, #3b82f6, #8b5cf6)'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSS Keyframes */}
      <style>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient { animation: gradient-shift 15s ease infinite; background-size: 200% 200%; }
        
        @keyframes float-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        
        @keyframes float-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-40px, 20px) scale(0.9); }
          66% { transform: translate(30px, -20px) scale(1.1); }
        }
        
        @keyframes float-3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(20px, 30px) scale(1.05); }
          66% { transform: translate(-30px, -30px) scale(0.95); }
        }
        
        .animate-float-1 { animation: float-1 20s ease-in-out infinite; }
        .animate-float-2 { animation: float-2 25s ease-in-out infinite; }
        .animate-float-3 { animation: float-3 30s ease-in-out infinite; }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.5s ease forwards; }
        
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scale-in { animation: scale-in 0.3s ease forwards; }
        
        @keyframes slide-in-bottom {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-in-bottom { animation: slide-in-bottom 0.4s ease forwards; }
        
        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-in-left { animation: slide-in-left 0.4s ease forwards; }
        
        @keyframes bounce-in {
          0% { opacity: 0; transform: scale(0.3); }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-bounce-in { animation: bounce-in 0.4s ease forwards; }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.3); }
      `}</style>
    </div>
  )
}

// ==================== KNOWLEDGE GRAPH ====================
function KnowledgeGraph({ notes, onSelectNote, theme }) {
  const canvasRef = useRef(null)
  const [hoveredNode, setHoveredNode] = useState(null)
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])

  useEffect(() => {
    if (!canvasRef.current || notes.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Create nodes
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(canvas.width, canvas.height) * 0.35

    const newNodes = notes.map((note, i) => {
      const angle = (i / notes.length) * Math.PI * 2
      return {
        ...note,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        baseX: centerX + Math.cos(angle) * radius,
        baseY: centerY + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        size: Math.min(50, Math.max(20, getWordCount(note.body) / 10)),
        time: Math.random() * Math.PI * 2
      }
    })

    // Create edges (connect notes with shared tags)
    const newEdges = []
    newNodes.forEach((node1, i) => {
      newNodes.slice(i + 1).forEach(node2 => {
        const sharedTags = node1.tags.filter(t => node2.tags.includes(t))
        if (sharedTags.length > 0) {
          newEdges.push({ from: node1.id, to: node2.id, strength: sharedTags.length })
        }
      })
    })

    setNodes(newNodes)
    setEdges(newEdges)

    let animationId
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update node positions (orbital float)
      newNodes.forEach(node => {
        node.time += 0.01
        node.x = node.baseX + Math.sin(node.time) * 20
        node.y = node.baseY + Math.cos(node.time * 0.7) * 20
      })

      // Draw edges
      newEdges.forEach(edge => {
        const from = newNodes.find(n => n.id === edge.from)
        const to = newNodes.find(n => n.id === edge.to)
        if (from && to) {
          ctx.beginPath()
          ctx.moveTo(from.x, from.y)
          ctx.lineTo(to.x, to.y)
          ctx.strokeStyle = `rgba(167, 139, 250, ${0.2 * edge.strength})`
          ctx.lineWidth = edge.strength
          ctx.stroke()
        }
      })

      // Draw nodes
      newNodes.forEach(node => {
        const isHovered = hoveredNode === node.id
        
        // Glow
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.size * 2)
        gradient.addColorStop(0, isHovered ? 'rgba(167, 139, 250, 0.4)' : 'rgba(167, 139, 250, 0.2)')
        gradient.addColorStop(1, 'transparent')
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.size * 2, 0, Math.PI * 2)
        ctx.fill()

        // Node
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2)
        ctx.fillStyle = CARD_COLORS[node.color]
        ctx.fill()

        // Label
        ctx.fillStyle = 'white'
        ctx.font = '12px Raleway'
        ctx.textAlign = 'center'
        ctx.fillText(node.title || 'Untitled', node.x, node.y + node.size + 15)
      })

      animationId = requestAnimationFrame(animate)
    }
    animate()

    return () => cancelAnimationFrame(animationId)
  }, [notes, hoveredNode])

  const handleClick = (e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const clicked = nodes.find(node => {
      const dx = node.x - x
      const dy = node.y - y
      return Math.sqrt(dx * dx + dy * dy) < node.size
    })

    if (clicked) {
      onSelectNote(clicked)
    }
  }

  return (
    <div className="h-full relative">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-pointer"
        onClick={handleClick}
        onMouseMove={(e) => {
          const canvas = canvasRef.current
          const rect = canvas.getBoundingClientRect()
          const x = e.clientX - rect.left
          const y = e.clientY - rect.top

          const hovered = nodes.find(node => {
            const dx = node.x - x
            const dy = node.y - y
            return Math.sqrt(dx * dx + dy * dy) < node.size
          })
          setHoveredNode(hovered?.id || null)
        }}
      />
      {hoveredNode && (
        <div className="absolute top-4 left-4 bg-black/80 px-3 py-2 rounded text-sm">
          Click to open note
        </div>
      )}
    </div>
  )
}

// ==================== AI CHAT VIEW ====================
function AIChatView({ messages, input, onInputChange, onSend, loading, apiKey, onApiKeyChange, theme, fonts }) {
  return (
    <div className="h-full flex flex-col p-4">
      <div className="mb-4">
        <input
          type="password"
          placeholder="Anthropic API Key"
          value={apiKey}
          onChange={(e) => onApiKeyChange(e.target.value)}
          className={`w-full px-3 py-2 rounded ${theme.input} ${theme.textMuted}`}
        />
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.length === 0 ? (
          <div className={`text-center py-8 ${theme.textMuted}`}>
            <div className="text-4xl mb-4">💬</div>
            <p>Start a conversation with AI about your notes</p>
            <p className="text-sm mt-2">Ask "What do I know about..." or "Summarize my notes on..."</p>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                  msg.role === 'user'
                    ? 'bg-violet-600 text-white'
                    : 'bg-white/10 text-white'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/10 px-4 py-2 rounded-2xl">
              <span className="animate-pulse">Thinking...</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Ask anything about your notes..."
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSend()}
          className={`flex-1 px-4 py-2 rounded-lg ${theme.input} ${theme.text}`}
        />
        <button
          onClick={onSend}
          disabled={loading}
          className={`px-6 py-2 rounded-lg ${theme.fab} text-white disabled:opacity-50`}
        >
          Send
        </button>
      </div>
    </div>
  )
}
