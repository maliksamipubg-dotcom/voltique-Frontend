import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const STATS = [
  { value: '6-50A', label: 'Charge Rates' },
  { value: '12/24V', label: 'Battery Support' },
  { value: '100%', label: 'Genuine Products' },
]

const Hero = () => {
  return (
    <section className='relative overflow-hidden rounded-3xl sm:rounded-[2rem] bg-gradient-to-br from-[#07111f] via-[#0b1830] to-[#102a4d] text-white shadow-lift border border-line'>
      {/* Circuit pattern overlay */}
      <div
        className='absolute inset-0 opacity-[0.14] pointer-events-none'
        style={{ backgroundImage: `url(${assets.circuit_bg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      ></div>

      {/* Soft depth wash — transform/opacity only, no filters */}
      <div className='absolute -top-24 -left-24 w-80 h-80 orb orb-blue opacity-70 animate-drift'></div>
      <div className='absolute -bottom-28 right-0 w-96 h-96 orb orb-cyan opacity-60 animate-drift' style={{ animationDelay: '-6s' }}></div>

      <div className='relative flex flex-col sm:flex-row items-center'>
        {/* Hero Left Side */}
        <div className='w-full sm:w-1/2 px-6 py-12 sm:px-8 sm:py-16 lg:px-14'>
          <div className='eyebrow border-accent/40 bg-accent/10 text-accent mb-5'>
            <span className='w-1.5 h-1.5 rounded-full bg-accent animate-pulse'></span>
            Power Solutions &amp; Accessories
          </div>

          <h1 className='heading-font text-3xl sm:text-4xl lg:text-5xl xl:text-[3.4rem] font-bold leading-[1.1] tracking-tight text-white'>
            All Power Solutions,
            <br />
            <span className='text-gradient'>Under One Roof.</span>
          </h1>

          <p className='mt-5 text-sm md:text-base text-ink-2 max-w-md leading-relaxed'>
            Battery chargers, stabilizers, and power inverters from Simtek, Osaka, AGS, and Phoenix — plus clamps, cables, and charging accessories built for homes, garages, and workshops.
          </p>

          <div className='mt-8 flex flex-wrap gap-3'>
            <Link to='/collections' className='btn-primary group'>
              SHOP NOW
              <img src={assets.dropdown_icon} className='w-2.5 -rotate-90 icon-on-dark transition-transform duration-500 ease-swift group-hover:translate-x-1' alt='' />
            </Link>
            <Link to='/collections' className='btn-ghost-light border-white/35 hover:border-accent'>EXPLORE CATALOG</Link>
          </div>

          <div className='mt-9 grid grid-cols-3 gap-3 max-w-md'>
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                className='group/stat relative overflow-hidden rounded-2xl bg-surface/90 border border-line-strong py-3.5 px-2 text-center animate-rise transition-colors duration-300 hover:border-accent/60'
                style={{ animationDelay: `${0.15 + i * 0.09}s` }}
              >
                <span className='absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-primary-light via-accent to-transparent'></span>
                <p className='text-lg sm:text-xl font-extrabold text-white tracking-tight'>{stat.value}</p>
                <p className='text-[10px] uppercase tracking-wide text-ink-3 mt-0.5'>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Hero Right Side */}
        <div className='w-full sm:w-1/2 relative'>
          <div className='absolute inset-0 bg-gradient-to-t from-[#07111f]/70 via-transparent to-transparent sm:bg-gradient-to-r sm:from-[#102a4d]/70 sm:via-[#102a4d]/20 sm:to-transparent'></div>
          <img
            className='relative w-full h-auto animate-float'
            src={assets.hero_img}
            fetchPriority="high"
            alt='Voltique Hub power solutions — battery chargers, stabilizers and inverters'
          />
        </div>
      </div>
    </section>
  )
}

export default Hero
