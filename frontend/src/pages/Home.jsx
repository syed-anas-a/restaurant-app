import React from 'react'
import heroImg from '../assets/images/home/hero.png'
import bowlImg from '../assets/images/home/bowl.png'
import diningImg from '../assets/images/home/dining.png'
import cocktailImg from '../assets/images/home/cocktail.png'
import mortarImg from '../assets/images/home/mortar.png'
import jarsImg from '../assets/images/home/jars.png'
import './Home.css'

function Home() {
  return (
    <div className='home-pg'>

      <div className='hero-container'>
        <h1 className='hero-title'>
          <span>A</span>
          <span>Heritage</span>
          <span>of</span>
          <em>Saffron & Soul</em>
        </h1>
        <p className='hero-text'>Discover a tapestry of flavors curated through 
          generations. Every dish is a legacy, every spice a story,
          and every moment an invitation to the extraordinary.
        </p>
        <button className='btn-menu'>EXPLORE THE MENU</button>
        <div className="hero-media">
          <img src={heroImg} alt="Signature dish" className="hero-img" />
        </div>
      </div>
      
      <div className='sec-container'>
        <div>
          <h4>Curated Spirits & Ancient Spices</h4>
          <p>"From the high mountains of Kashmir to the coast of Malabar, 
            we source only the singular best."
          </p>
        </div>
        <div className='grid-img-container'>
          <img src={cocktailImg} className='grid-img'></img>
          <img src={mortarImg} className='grid-img'></img>
          <img src={jarsImg} className='grid-img'></img>
        </div>
      </div>

      <div className='dining-container'>
        <div>
          <h4>A Symphony of Atmosphere</h4>
          <p>Step into a sanctuary where time slows down. Our interiors
            are designed as a dialogue between modern luxury and
            ancient Indian heritage, featuring hand-carved stone and
            warm amber lighting that cradles your experience.
          </p>
        </div>
        <div className='dining-img'>
          <img src={diningImg}></img>
        </div>
      </div>

    </div>
  )
}

export default Home