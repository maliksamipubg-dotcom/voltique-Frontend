import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <section className='relative overflow-hidden rounded-2xl bg-gradient-to-br from-dark via-[#10203e] to-primary-dark text-white'>
      {/* Circuit pattern overlay */}
      <div
        className='absolute inset-0 opacity-[0.18] pointer-events-none'
        style={{ backgroundImage: `url(${assets.circuit_bg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      ></div>

      <div className='relative flex flex-col sm:flex-row items-center'>
        {/* Hero Left Side */}
        <div className='w-full sm:w-1/2 px-8 py-12 sm:py-16 lg:px-14'>
          <div className='flex items-center gap-2 mb-4'>
            <p className='w-8 md:w-11 h-[2px] bg-accent'></p>
            <p className='font-medium text-sm md:text-base tracking-widest text-sky-300'>POWER SOLUTIONS & ACCESSORIES</p>
          </div>
          <h1 className='heading-font text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight'>
            All Power Solutions,
            <br />
            <span className='text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-400'>Under One Roof.</span>
          </h1>
          <p className='mt-4 text-sm md:text-base text-slate-300 max-w-md'>
            Battery chargers, stabilizers, and power inverters from Simtek, Osaka, AGS, and Phoenix — plus clamps, cables, and charging accessories built for homes, garages, and workshops.
          </p>
          <div className='mt-7 flex flex-wrap gap-3'>
            <Link to='/collections' className='bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-sky-500 text-white text-sm font-semibold px-8 py-3 rounded-lg shadow-lg shadow-blue-900/40 transition-all duration-300'>
              SHOP NOW
            </Link>
            <Link to='/collections' className='border border-white/30 hover:border-sky-400 hover:text-sky-300 text-sm font-semibold px-8 py-3 rounded-lg transition-colors duration-300'>
              EXPLORE CATALOG
            </Link>
          </div>
          <div className='mt-8 grid grid-cols-3 gap-3 max-w-md text-center'>
            <div className='rounded-xl bg-white/5 border border-white/10 py-3 backdrop-blur-sm'>
              <p className='text-lg font-extrabold text-sky-400'>6-50A</p>
              <p className='text-[10px] uppercase tracking-wide text-slate-400'>Charge Rates</p>
            </div>
            <div className='rounded-xl bg-white/5 border border-white/10 py-3 backdrop-blur-sm'>
              <p className='text-lg font-extrabold text-blue-400'>12/24V</p>
              <p className='text-[10px] uppercase tracking-wide text-slate-400'>Battery Support</p>
            </div>
            <div className='rounded-xl bg-white/5 border border-white/10 py-3 backdrop-blur-sm'>
              <p className='text-lg font-extrabold text-sky-400'>100%</p>
              <p className='text-[10px] uppercase tracking-wide text-slate-400'>Genuine Products</p>
            </div>
          </div>
        </div>

        {/* Hero Right Side */}
        <div className='w-full sm:w-1/2'>
          <img className='w-full h-auto' src={assets.hero_img} fetchPriority="high" alt='Voltique Hub power solutions — battery chargers, stabilizers and inverters' />
        </div>
      </div>
    </section>
  )
}

export default Hero
