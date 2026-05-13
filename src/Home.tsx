import { useNavigate } from 'react-router-dom'
import { FaGithub, FaXTwitter, FaInstagram, FaDiscord, FaThreads } from 'react-icons/fa6'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen px-6 flex flex-col justify-between py-16 max-w-3xl mx-auto">
      
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <p className="text-xl font-semibold bg-linear-to-r from-blue-800 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
          Studilib
        </p>
        <button
          onClick={() => navigate('/auth')}
          className="text-sm opacity-40 hover:opacity-100 transition-all"
        >
          Sign in
        </button>
      </div>

      {/* HERO */}
      <div className="flex flex-col gap-8 py-24">
        <p className="text-sm uppercase tracking-widest opacity-40">For the weird, inconsistent, hard-to-predict days</p>
        
        <h1 className="text-6xl md:text-8xl font-semibold leading-none tracking-tight">
          Not every day is a grind day.
        </h1>

        <p className="text-xl opacity-50 max-w-lg leading-relaxed">
          Studilib meets you where you actually are — not where you're supposed to be. Dump your tasks, pick your day, let AI do the rest.
        </p>

        <div className="flex gap-4 items-center mt-4">
          <button
            onClick={() => navigate('/auth')}
            className="px-8 py-4 bg-purple-500 text-white rounded-xl font-medium active:scale-95 transition-all"
          >
            Get started
          </button>
          <p className="text-sm opacity-30">Free. No credit card.</p>
        </div>
      </div>

      {/* FOOTER */}
      <div className="flex justify-between items-center">
        <p className="text-xs bg-linear-to-r from-blue-800 via-indigo-500 to-purple-600 bg-clip-text text-transparent">© 2026 Studilib</p>
        <div className="flex gap-4 items-center">
          <a href="https://github.com/grassparker" target="_blank" rel="noreferrer" className="text-blue-700 opacity-30 hover:opacity-100 transition-all bg-linear-to-r from-blue-800 via-indigo-500 to-purple-600 bg-clip-text">
            <FaGithub size={18} />
          </a>
          <a href="https://x.com/grassparkker" target="_blank" rel="noreferrer" className="text-blue-700 opacity-30 hover:opacity-100 transition-all bg-linear-to-r from-blue-800 via-indigo-500 to-purple-600 bg-clip-text">
            <FaXTwitter size={18} />
          </a>
          <a href="https://www.instagram.com/studilib_dev/" target="_blank" rel="noreferrer" className="text-blue-700 opacity-30 hover:opacity-100 transition-all bg-linear-to-r from-blue-800 via-indigo-500 to-purple-600 bg-clip-text">
            <FaInstagram size={18} />
          </a>
          <a href="https://www.threads.com/@studilib_dev" target="_blank" rel="noreferrer" className="text-blue-700 opacity-30 hover:opacity-100 transition-all bg-linear-to-r from-blue-800 via-indigo-500 to-purple-600 bg-clip-text">
            <FaThreads size={18} />
          </a>
          <a href="https://discord.gg/4ABSHBb4vD" target="_blank" rel="noreferrer" className="text-blue-700 opacity-30 hover:opacity-100 transition-all bg-linear-to-r from-blue-800 via-indigo-500 to-purple-600 bg-clip-text">
            <FaDiscord size={18} />
          </a>
        </div>
      </div>

    </div>
  )
}