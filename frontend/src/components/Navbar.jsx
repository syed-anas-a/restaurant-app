import React from 'react'
import './Navbar.css'

function Navbar() {
  return (
    <header>
      <div className='brand-container'>
        <a><span className='logo-main'>Ramaiah</span><span className='logo-sub'>RESTAURANT</span></a>
      </div>
      <div className='nav-container'>
        <a className='navlink home'>Home</a>
        <a className='navlink menu'>Menu</a>
        <a className='navlink gallery'>Gallery</a>
        <a className='navlink contact'>Contact Us</a>
      </div>
      <div className='btn-container'>
        <button className='btn-order'>Place Order</button>
        <button className='btn-table'>Book a table</button>
      </div>
    </header>
  )
}

export default Navbar