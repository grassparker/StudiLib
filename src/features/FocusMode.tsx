import { useState, useEffect, useRef } from 'react'
import { supabase } from '../supabase'

interface FocusModeProps {
  task: string
  dayMode: string
  onClose: () => void
}

export default function FocusMode({ task, dayMode, onClose }: FocusModeProps) {
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [nudged, setNudged] = useState(false)
  const [avgDuration, setAvgDuration] = useState<number | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const totalSeconds = useRef(0)

  useEffect(() => {
    const fetchAverage = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const { data } = await supabase
        .from('focus_sessions')
        .select('duration_minutes')
        .eq('user_id', session.user.id)
        .eq('day_mode', dayMode)
        .eq('completed', true)

      if (data && data.length > 0) {
        const avg = data.reduce((sum, s) => sum + s.duration_minutes, 0) / data.length
        setAvgDuration(avg)
      }
    }
    fetchAverage()
  }, [])

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      totalSeconds.current += 1
      setSeconds(totalSeconds.current % 60)
      setMinutes(Math.floor(totalSeconds.current / 60))

      const currentMinutes = totalSeconds.current / 60

      // If we have average data, nudge at 130% of average
      // If no data, nudge at 45 minutes default
      const nudgeAt = avgDuration ? avgDuration * 1.3 : 45

      if (currentMinutes >= nudgeAt && !nudged) {
        setNudged(true)
      }
    }, 1000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [avgDuration, nudged])

  const handleDone = async (completed: boolean) => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    await supabase.from('focus_sessions').insert({
      user_id: session.user.id,
      task_content: task,
      duration_minutes: Math.floor(totalSeconds.current / 60),
      day_mode: dayMode,
      completed
    })

    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
      <div className="glass-card p-10 w-full max-w-md flex flex-col gap-6 text-center">
        
        <p className="text-sm opacity-50 uppercase tracking-widest">Focusing on</p>
        <p className="text-xl font-semibold">{task}</p>

        <div className="text-6xl font-mono font-bold">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>

        {avgDuration && (
          <p className="text-xs opacity-30">
            Your usual focus time on {dayMode} days: ~{Math.round(avgDuration)} mins
          </p>
        )}

        {/* TOUCH GRASS NUDGE */}
        {nudged && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
            <p className="text-green-400 text-sm">🌿 Hey, you've been at this a while.</p>
            <p className="text-green-400/60 text-xs mt-1">Maybe touch some grass? You've earned it.</p>
          </div>
        )}

        <div className="flex flex-col gap-3 mt-4">
          <button
            onClick={() => handleDone(true)}
            className="px-6 py-3 bg-purple-500 text-white rounded-xl active:scale-95 transition-all"
          >
            ✓ Done with this task
          </button>
          <button
            onClick={() => handleDone(false)}
            className="text-sm opacity-40 hover:opacity-100 transition-all py-2"
          >
            Stop for now
          </button>
        </div>

      </div>
    </div>
  )
}