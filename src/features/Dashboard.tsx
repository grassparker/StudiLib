import { useEffect, useState, useRef } from 'react'
import { supabase } from '../supabase'
import { useNavigate } from 'react-router-dom'
import { getDailySuggestions } from '../gemini'
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { IoArrowForwardSharp } from "react-icons/io5";
import FocusMode from './FocusMode';

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function Dashboard() {
  const [name, setName] = useState('')
  const [aiContext, setAiContext] = useState('')
  const [tasks, setTasks] = useState<string[]>([])
  const [dayMode, setDayMode] = useState('Chill') // Set a default
  const [suggestions, setSuggestions] = useState<{task: string, reason: string}[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'today' | 'tasks' | 'stats'>('today')
  const navigate = useNavigate()
  const MODES = ['Grind', 'Chill', 'Creative', 'Sportive', 'Social']
  const [focusTask, setFocusTask] = useState<string | null>(null)
  const [completedCount, setCompletedCount] = useState(0)
  const [focusCount, setFocusCount] = useState(0)
  const [totalFocusMinutes, setTotalFocusMinutes] = useState(0)
  
  // CRITICAL: This ref prevents the double-call in React Strict Mode
  const initialized = useRef(false)

  useEffect(() => {
    const fetchProfile = async () => {
      if (initialized.current) return
      initialized.current = true

      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        navigate('/auth')
        return
      }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('name, ai_context')
        .eq('id', session.user.id)
        .single()

      const { data: taskData } = await supabase
        .from('tasks')
        .select('content')
        .eq('user_id', session.user.id)
        .eq('completed', false)

      const { count: Completed} = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id)
        .eq('completed', true)

      const { data: focusData } = await supabase
        .from('focus_sessions')
        .select('duration_minutes')
        .eq('user_id', session.user.id)
        .eq('completed', true)

      if (profileData) {
        setName(profileData.name)
        setAiContext(profileData.ai_context)
        const taskList = taskData?.map(t => t.content) || []
        setTasks(taskList)
        setCompletedCount(Completed || 0)

        if (focusData) {
          setFocusCount(focusData.length)
          const totalMins = focusData.reduce((acc, curr) => acc + (curr.duration_minutes || 0), 0)
          setTotalFocusMinutes(totalMins)
        }
        // Fetch AI only once on mount
        fetchAI(taskList, 'Chill', profileData.ai_context, profileData.name)
      }
    }
    fetchProfile()
  }, [navigate])

  const fetchAI = async (t: string[], mode: string, context: string, userName: string) => {
    // 1. GENERATE A UNIQUE KEY FOR THIS REQUEST
    const cacheKey = `gemini_${mode}_${t.join(',')}`;
    const cached = sessionStorage.getItem(cacheKey);

    if (cached) {
      console.log("Using cached suggestions to save quota.");
      setSuggestions(JSON.parse(cached));
      return;
    }

    setIsLoading(true)
    try {
      const results = await getDailySuggestions(t, mode, context, userName)
      setSuggestions(results)
      // 2. SAVE TO CACHE
      sessionStorage.setItem(cacheKey, JSON.stringify(results));
    } catch (err) {
      console.error("Dashboard AI call failed:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleModeChange = (mode: string) => {
    setDayMode(mode)
    // Only call AI if we have the data ready
    if (name) {
      fetchAI(tasks, mode, aiContext, name)
    }
  }

return (
  <div className="min-h-screen px-6 py-12 max-w-2xl mx-auto flex flex-col gap-8">

    {/* HEADER */}
    <div className="flex justify-between items-center">
      <p className="text-xl font-semibold bg-linear-to-r from-blue-800 via-indigo-500 to-purple-600 bg-clip-text text-transparent">Studilib</p>
      <button onClick={() => navigate('/profile')} className="text-sm opacity-40 hover:opacity-100 transition-all">
        Profile
      </button>
    </div>

    {/* GREETING */}
    <div>
      <h1 className="text-4xl font-semibold">
        {getGreeting()}{name ? `, ${name}` : ''}.
      </h1>
      <p className="opacity-50 mt-2">What kind of day is today?</p>
      <div className="flex flex-wrap gap-3 mt-4">
        {MODES.map(mode => (
          <button
            key={mode}
            onClick={() => handleModeChange(mode)}
            disabled={isLoading}
            className={`px-4 py-2 rounded-full border transition-all ${
              dayMode === mode ? 'bg-purple-500 text-white border-purple-500' : 'opacity-60 hover:opacity-100'
            } ${isLoading ? 'cursor-not-allowed' : ''}`}
          >
            {mode}
          </button>
        ))}
      </div>
    </div>

    {/* TABS */}
    <div className="flex gap-1 bg-white/10 p-1 rounded-xl">
      {(['today', 'tasks', 'stats'] as const).map(tab => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
            activeTab === tab ? 'bg-purple-500 text-white' : 'opacity-50 hover:opacity-100'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>

    {/* TODAY TAB */}
    {activeTab === 'today' && (
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Here's what you could do today</h2>
        {isLoading ? (
          <div className="animate-pulse flex flex-col gap-3">
            <div className="h-16 bg-gray-200 dark:bg-zinc-800 rounded-xl" />
            <div className="h-16 bg-gray-200 dark:bg-zinc-800 rounded-xl" />
            <div className="h-16 bg-gray-200 dark:bg-zinc-800 rounded-xl" />
          </div>
        ) : suggestions.length > 0 ? (
          suggestions.map((s, i) => (
            <div key={i} className="glass-card px-6 py-4 flex flex-col gap-1">
              <p className="opacity-80">{s.task}</p>
              <p className="text-sm opacity-40 italic">{s.reason}</p>
            </div>
          ))
        ) : (
          <p className="opacity-40 text-sm">No suggestions yet.</p>
        )}
      </div>
    )}

    {/* TASKS TAB */}
    {activeTab === 'tasks' && (
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Your tasks this week</h2>
        {tasks.length === 0 ? (
          <p className="opacity-40 text-sm">No tasks yet — dump some!</p>
        ) : (
          tasks.map((task, i) => (
            <div key={i} className="glass-card px-6 py-4 flex items-center justify-between">
              <p className="opacity-80">{task}</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setFocusTask(task)}
                  className="text-xs opacity-30 hover:opacity-100 hover:text-blue-500 transition-all"><IoArrowForwardSharp size={24} /></button>
                <button
                  onClick={async () => {
                    const { data: { session } } = await supabase.auth.getSession()
                    if (!session) return
                    await supabase.from('tasks').update({ completed: true })
                      .eq('user_id', session.user.id).eq('content', task)
                    setTasks(prev => prev.filter((_, idx) => idx !== i))
                  }}
                  className="text-xs opacity-30 hover:opacity-100 hover:text-blue-500 transition-all ml-4"
                >
                  <IoCheckmarkDoneSharp size={24} />
                </button>
                </div>
            </div>
          ))
        )}
        <button
          onClick={() => navigate('/dump')}
          className="mt-2 px-6 py-4 bg-purple-500 text-white rounded-xl text-sm active:scale-95 transition-transform"
        >
          + Dump more tasks
        </button>
      </div>
    )}

    {/* STATS TAB */}
    {activeTab === 'stats' && (
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Little things</h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="glass-card px-6 py-5 flex flex-col gap-1">
            <p className="text-3xl font-bold">{completedCount}</p>
            <p className="text-sm opacity-50">tasks completed</p>
          </div>
          <div className="glass-card px-6 py-5 flex flex-col gap-1">
            <p className="text-3xl font-bold">{focusCount}</p>
            <p className="text-sm opacity-50">focus sessions</p>
          </div>
          <div className="glass-card px-6 py-5 flex flex-col gap-1 col-span-2">
            <p className="text-3xl font-bold">{totalFocusMinutes} mins</p>
            <p className="text-sm opacity-50">total focus time</p>
          </div>
        </div>

        <div className="glass-card px-6 py-4 mt-2">
          <p className="text-sm opacity-70">
            {completedCount === 0 && '🌱 Start completing tasks to see your progress.'}
            {completedCount > 0 && completedCount < 5 && `🌿 You've completed ${completedCount} task${completedCount > 1 ? 's' : ''}. Keep going!`}
            {completedCount >= 5 && `🌳 ${completedCount} tasks done. You're on a roll.`}
          </p>
        </div>
      </div>
    )}

    {focusTask && (
      <FocusMode
        task={focusTask}
        dayMode={dayMode}
        onClose={() => setFocusTask(null)}
      />
    )}

  </div>
)
}