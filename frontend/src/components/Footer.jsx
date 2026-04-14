import React from 'react'
import './Footer.css'

function Footer() {
  return (
    <footer>
        <div className='brand-container'>
        <a><span className='logo-main'>Ramaiah</span><span className='logo-sub'>RESTAURANT</span></a>
        </div>
        <div className='nav-container'>
            <a className='navlink home'>PRIVACY POLICY</a>
            <a className='navlink menu'>TERMS OF SERVICE</a>
            <a className='navlink gallery'>ACCESSIBILITY</a>
        </div>
        <p className='copy'>&copy; 2026 RAMAIAH RESTAURANT ALL RIGHTS RESERVED</p>
    </footer>
  )
}

export default Footer