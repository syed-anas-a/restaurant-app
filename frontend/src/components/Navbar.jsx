import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/menu', label: 'Menu' },
    { to: '/cart', label: 'Cart' },
    { to: '/orders', label: 'Orders' },
    // TODO: Integration — gate Cart/Orders behind auth:
    // ...(user ? [{ to: '/cart', label: 'Cart' }, { to: '/orders', label: 'Orders' }] : []),
  ]

  const isActive = (path) => location.pathname === path

  return (
    <header className="w-full bg-dark border-b border-dark-border">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex flex-col leading-none">
          <span className="font-display text-gold text-2xl italic tracking-wide">
            Ramaiah
          </span>
          <span className="text-gold-muted text-[10px] tracking-[0.2em] uppercase">
            Restaurant
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm tracking-wide transition-colors ${
                isActive(link.to)
                  ? 'text-gold border-b-2 border-gold pb-0.5'
                  : 'text-text-secondary hover:text-gold'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Auth buttons */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <button
              onClick={logout}
              className="text-sm text-text-secondary hover:text-gold transition-colors"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm text-text-secondary hover:text-gold transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-gold text-gold-text text-sm font-medium px-5 py-2 rounded-md hover:bg-gold-dark transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-gold text-2xl"
          aria-label="Toggle menu"
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-dark-light border-t border-dark-border px-6 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={`block text-sm ${
                isActive(link.to) ? 'text-gold' : 'text-text-secondary'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-dark-border">
            {user ? (
              <button
                onClick={() => {
                  logout()
                  setMobileOpen(false)
                }}
                className="text-sm text-text-secondary"
              >
                Logout
              </button>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm text-text-secondary"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm text-gold"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
