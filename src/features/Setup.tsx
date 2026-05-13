import { useState } from 'react'
import { supabase } from '../supabase'
import { useNavigate } from 'react-router-dom'

const MODES = ['Grind', 'Chill', 'Creative', 'YouTube', 'Social', 'Errands']

export default function Setup() {
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [modes, setModes] = useState<string[]>([])
  const [startTime, setStartTime] = useState('09:00')
  const [aiContext, setAiContext] = useState('')
  const navigate = useNavigate()

  const toggleMode = (mode: string) => {
    setModes(prev => prev.includes(mode) ? prev.filter(m => m !== mode) : [...prev, mode])
  }

  const handleFinish = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('profiles').insert({
      id: user.id,
      name,
      typical_modes: modes,
      start_time: startTime,
      ai_context: aiContext
    })

    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="glass-card p-10 w-full max-w-lg flex flex-col gap-8">
        
        <p className="text-sm opacity-50">Step {step} of 4</p>

        {step === 1 && (
          <>
            <h1 className="text-2xl font-semibold">What's your name?</h1>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="border rounded-lg px-4 py-3 bg-transparent"
            />
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="text-2xl font-semibold">What kind of days do you usually have?</h1>
            <div className="flex flex-wrap gap-3">
              {MODES.map(mode => (
                <button
                  key={mode}
                  onClick={() => toggleMode(mode)}
                  className={`px-4 py-2 rounded-full border transition-all ${
                    modes.includes(mode) ? 'bg-purple-500 text-white border-purple-500' : 'opacity-60'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h1 className="text-2xl font-semibold">What time do you usually start your day?</h1>
            <input
              type="time"
              value={startTime}
              onChange={e => setStartTime(e.target.value)}
              className="border rounded-lg px-4 py-3 bg-transparent"
            />
          </>
        )}

        {step === 4 && (
          <>
            <h1 className="text-2xl font-semibold">Anything the AI should know about you?</h1>
            <p className="text-sm opacity-50">Optional — e.g. "I have ADHD", "I work best at night"</p>
            <textarea
              placeholder="Tell us anything..."
              value={aiContext}
              onChange={e => setAiContext(e.target.value)}
              rows={4}
              className="border rounded-lg px-4 py-3 bg-transparent resize-none"
            />
          </>
        )}

        <div className="flex justify-between">
          {step > 1 && (
            <button onClick={() => setStep(s => s - 1)} className="opacity-60 hover:opacity-100 text-sm">
              Back
            </button>
          )}
          <button
            onClick={() => step < 4 ? setStep(s => s + 1) : handleFinish()}
            className="ml-auto px-6 py-3 bg-purple-500 text-white rounded-lg"
          >
            {step < 4 ? 'Next' : 'Finish'}
          </button>
        </div>

      </div>
    </div>
  )
}