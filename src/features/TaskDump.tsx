import { useState } from 'react'
import { supabase } from '../supabase'
import { useNavigate } from 'react-router-dom'

export default function TaskDump() {
  const [input, setInput] = useState('')
  const [tasks, setTasks] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()

  const addTask = () => {
    if (!input.trim()) return
    setTasks(prev => [...prev, input.trim()])
    setInput('')
  }

  const removeTask = (i: number) => {
    setTasks(prev => prev.filter((_, idx) => idx !== i))
  }

  const saveTasks = async () => {
    setSaving(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    const rows = tasks.map(content => ({
      user_id: session.user.id,
      content,
      completed: false,
    }))

    await supabase.from('tasks').insert(rows)
    setSaving(false)
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen px-6 py-12 max-w-2xl mx-auto flex flex-col gap-8">
      <div>
        <h1 className="text-4xl font-semibold">What's on your mind?</h1>
        <p className="opacity-50 mt-2">Dump everything for the week. No order, no pressure.</p>
      </div>

      <div className="flex gap-3">
        <input
          type="text"
          placeholder="e.g. finish assignment, call mum, buy groceries..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTask()}
          className="flex-1 border rounded-xl px-4 py-3 bg-transparent"
        />
        <button
          onClick={addTask}
          className="px-6 py-3 bg-purple-500 text-white rounded-xl"
        >
          Add
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {tasks.map((task, i) => (
          <div key={i} className="glass-card px-6 py-4 flex items-center justify-between">
            <p className="opacity-80">{task}</p>
            <button onClick={() => removeTask(i)} className="opacity-30 hover:opacity-100 text-sm ml-4">
              ✕
            </button>
          </div>
        ))}
      </div>

      {tasks.length > 0 && (
        <button
          onClick={saveTasks}
          disabled={saving}
          className="px-6 py-4 bg-purple-500 text-white rounded-xl"
        >
          {saving ? 'Saving...' : `Save ${tasks.length} task${tasks.length > 1 ? 's' : ''}`}
        </button>
      )}
    </div>
  )
}