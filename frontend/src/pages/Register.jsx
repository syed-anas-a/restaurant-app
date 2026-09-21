import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Register() {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: '',
  })
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

    // Validation
    if (!form.first_name || !form.email || !form.password) {
      setError('First name, email, and password are required.')
      return
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (form.password !== form.confirm_password) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      const {confirm_password, ...credentials} = form
      await auth.register(credentials)
      navigate('/menu/')
    } catch(error) {
      const message = error.response?.data?.detail || "Registration unsuccessfull. Try Again"
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
          Create Account
        </h1>
        <p className="text-text-secondary text-sm mb-8">
          Join us and start ordering.
        </p>

        {/* Error */}
        {error && (
          <div className="bg-red-900/30 border border-red-800/50 text-red-300 text-sm px-4 py-2.5 rounded-md mb-5">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="first_name" className="block text-text-secondary text-xs tracking-wide uppercase mb-1.5">
                First Name
              </label>
              <input
                id="first_name"
                name="first_name"
                type="text"
                autoComplete="given-name"
                value={form.first_name}
                onChange={handleChange}
                className="w-full bg-dark-card border border-dark-border rounded-md px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-gold/50 transition-colors"
                placeholder="Syed Anas"
              />
            </div>
            <div>
              <label htmlFor="last_name" className="block text-text-secondary text-xs tracking-wide uppercase mb-1.5">
                Last Name
              </label>
              <input
                id="last_name"
                name="last_name"
                type="text"
                autoComplete="family-name"
                value={form.last_name}
                onChange={handleChange}
                className="w-full bg-dark-card border border-dark-border rounded-md px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-gold/50 transition-colors"
                placeholder="Ali"
              />
            </div>
          </div>

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
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              className="w-full bg-dark-card border border-dark-border rounded-md px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-gold/50 transition-colors"
              placeholder="Min. 8 characters"
            />
          </div>

          <div>
            <label htmlFor="confirm_password" className="block text-text-secondary text-xs tracking-wide uppercase mb-1.5">
              Confirm Password
            </label>
            <input
              id="confirm_password"
              name="confirm_password"
              type="password"
              autoComplete="new-password"
              value={form.confirm_password}
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
            {loading ? 'Creating Account…' : 'Create Account'}
          </button>
        </form>

        {/* Login link */}
        <p className="text-center text-text-muted text-sm mt-8">
          Already have an account?{' '}
          <Link to="/login" className="text-gold hover:text-gold-dark transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register
