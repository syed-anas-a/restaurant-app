import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="bg-teal border-t border-dark-border">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <Link to="/" className="flex flex-col leading-none">
          <span className="font-display text-gold text-xl italic tracking-wide">
            Ramaiah
          </span>
          <span className="text-gold-muted text-[9px] tracking-[0.2em] uppercase">
            Restaurant
          </span>
        </Link>

        {/* Links */}
        <div className="flex gap-6 text-text-secondary text-xs tracking-wide">
          <a href="#" className="hover:text-gold transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-gold transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-gold transition-colors">Accessibility</a>
        </div>

        {/* Copyright */}
        <p className="text-text-muted text-xs">
          &copy; {new Date().getFullYear()} Ramaiah Restaurant. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer
