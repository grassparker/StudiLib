import { useState } from 'react'
import { supabase } from '../supabase'
import { useNavigate } from 'react-router-dom'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async () => {
    setError('')
  
    if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) setError(error.message)
        else navigate('/dashboard')
    } else {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) setError(error.message)
        else navigate('/setup')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="glass-card p-10 w-full max-w-md flex flex-col gap-6">
        <h1 className="text-2xl font-semibold">{isLogin ? 'Welcome back' : 'Create account'}</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="border rounded-lg px-4 py-3 bg-transparent"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="border rounded-lg px-4 py-3 bg-transparent"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button onClick={handleSubmit} className="btn-primary">
          {isLogin ? 'Sign in' : 'Sign up'}
        </button>

        <button onClick={() => setIsLogin(!isLogin)} className="text-sm opacity-60 hover:opacity-100">
          {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  )
}