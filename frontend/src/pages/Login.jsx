import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Login() {
    const [form, setForm] = useState({ email: '', password: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const auth = useAuth()
    const navigate = useNavigate() 

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
        setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Basic validation
        if (!form.email || !form.password) {
        setError('Both fields are required.')
        return
        }

        setLoading(true)
        
        try {
            await auth.login(form.email, form.password)
            navigate("/menu/")
        } catch(error) {
            const message = error.response?.data?.detail || "Login failed. Check your credentials"
            setError(message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-sm">
            {/* Heading */}
            <h1 className="font-display text-3xl text-gold italic mb-2">
            Welcome Back
            </h1>
            <p className="text-text-secondary text-sm mb-8">
            Sign in to your account to continue.
            </p>

            {/* Error */}
            {error && (
            <div className="bg-red-900/30 border border-red-800/50 text-red-300 text-sm px-4 py-2.5 rounded-md mb-5">
                {error}
            </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <label htmlFor="email" className="block text-text-secondary text-xs tracking-wide uppercase mb-1.5">
                Email
                </label>
                <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                className="w-full bg-dark-card border border-dark-border rounded-md px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-gold/50 transition-colors"
                placeholder="you@example.com"
                />
            </div>

            <div>
                <label htmlFor="password" className="block text-text-secondary text-xs tracking-wide uppercase mb-1.5">
                Password
                </label>
                <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
                className="w-full bg-dark-card border border-dark-border rounded-md px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-gold/50 transition-colors"
                placeholder="••••••••"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-gold text-gold-text font-medium text-sm tracking-wide py-2.5 rounded-md hover:bg-gold-dark disabled:opacity-50 transition-colors"
            >
                {loading ? 'Signing in…' : 'Sign In'}
            </button>
            </form>

            {/* Register link */}
            <p className="text-center text-text-muted text-sm mt-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-gold hover:text-gold-dark transition-colors">
                Create one
            </Link>
            </p>
        </div>
        </div>
    )
}

export default Login
