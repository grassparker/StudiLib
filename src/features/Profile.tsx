import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { useNavigate } from 'react-router-dom'

const MODES = ['Grind', 'Chill', 'Creative', 'YouTube', 'Social', 'Errands']

export default function Profile() {
  const [name, setName] = useState('')
  const [modes, setModes] = useState<string[]>([])
  const [startTime, setStartTime] = useState('09:00')
  const [aiContext, setAiContext] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { navigate('/auth'); return }

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (data) {
        setName(data.name || '')
        setModes(data.typical_modes || [])
        setStartTime(data.start_time || '09:00')
        setAiContext(data.ai_context || '')
      }
    }
    fetchProfile()
  }, [])

  const toggleMode = (mode: string) => {
    setModes(prev => prev.includes(mode) ? prev.filter(m => m !== mode) : [...prev, mode])
  }

  const handleSave = async () => {
    setSaving(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    await supabase.from('profiles').upsert({
      id: session.user.id,
      name,
      typical_modes: modes,
      start_time: startTime,
      ai_context: aiContext
    })

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate('/auth')
  }

  return (
    <div className="min-h-screen px-6 py-12 max-w-2xl mx-auto flex flex-col gap-8">
      
      <div className="flex justify-between items-center">
        <button onClick={() => navigate('/dashboard')} className="text-sm opacity-40 hover:opacity-100 transition-all">
          ← Back
        </button>
        <button onClick={handleSignOut} className="text-sm opacity-40 hover:opacity-100 hover:text-red-400 transition-all">
          Sign out
        </button>
      </div>

      <h1 className="text-4xl font-semibold">Your profile</h1>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm opacity-50">Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="border rounded-xl px-4 py-3 bg-transparent"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm opacity-50">Your usual day modes</label>
          <div className="flex flex-wrap gap-3">
            {MODES.map(mode => (
              <button
                key={mode}
                onClick={() => toggleMode(mode)}
                className={`px-4 py-2 rounded-full border transition-all ${
                  modes.includes(mode) ? 'bg-purple-500 text-white border-purple-500' : 'opacity-60 hover:opacity-100'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm opacity-50">What time do you usually start your day?</label>
          <input
            type="time"
            value={startTime}
            onChange={e => setStartTime(e.target.value)}
            className="border rounded-xl px-4 py-3 bg-transparent"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm opacity-50">Things Gemini should know about you</label>
          <textarea
            value={aiContext}
            onChange={e => setAiContext(e.target.value)}
            rows={4}
            className="border rounded-xl px-4 py-3 bg-transparent resize-none"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-4 bg-purple-500 text-white rounded-xl transition-all active:scale-95"
        >
          {saved ? 'Saved! ✓' : saving ? 'Saving...' : 'Save changes'}
        </button>
      </div>
    </div>
  )
}