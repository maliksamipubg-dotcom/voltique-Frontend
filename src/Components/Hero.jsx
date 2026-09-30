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
    <section className='relative overflow-hidden rounded-3xl sm:rounded-[2.25rem] bg-gradient-to-br from-[#FFFFFF] via-[#F7FBFF] to-[#EAF3FF] text-ink shadow-lift border border-line'>
      {/* Circuit pattern overlay — tinted pale blue for the light theme */}
      <div
        className='absolute inset-0 opacity-60 pointer-events-none circuit-light'
        style={{ backgroundImage: `url(${assets.circuit_bg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      ></div>

      {/* Soft premium blue glow — transform/opacity only, no filters */}
      <div className='absolute -top-24 -left-24 w-80 h-80 orb orb-blue opacity-90 animate-drift'></div>
      <div className='absolute -bottom-28 right-0 w-96 h-96 orb orb-cyan opacity-80 animate-drift' style={{ animationDelay: '-6s' }}></div>

      <div className='relative flex flex-col sm:flex-row items-center'>
        {/* Hero Left Side */}
        <div className='w-full sm:w-1/2 px-6 py-12 sm:px-8 sm:py-16 lg:px-14'>
          <div className='eyebrow mb-5'>
            <span className='w-1.5 h-1.5 rounded-full bg-primary animate-pulse'></span>
            Power Solutions &amp; Accessories
          </div>

          <h1 className='heading-font text-3xl sm:text-4xl lg:text-5xl xl:text-[3.4rem] font-bold leading-[1.12] tracking-tight text-ink'>
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
              <img src={assets.dropdown_icon} className='w-2.5 -rotate-90 icon-light transition-transform duration-500 ease-swift group-hover:translate-x-1' alt='' />
            </Link>
            <Link to='/collections' className='btn-outline'>EXPLORE CATALOG</Link>
          </div>

          <div className='mt-9 grid grid-cols-3 gap-3 max-w-md'>
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                className='group/stat relative overflow-hidden rounded-2xl bg-white/85 border border-line py-3.5 px-2 text-center animate-rise shadow-card transition-all duration-300 hover:border-primary/45 hover:shadow-card-hover'
                style={{ animationDelay: `${0.15 + i * 0.09}s` }}
              >
                <span className='absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-primary via-accent to-transparent'></span>
                <p className='text-lg sm:text-xl font-extrabold text-ink tracking-tight'>{stat.value}</p>
                <p className='text-[10px] uppercase tracking-wide text-ink-3 mt-0.5'>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Hero Right Side — the artwork is a dark showcase panel, framed
            deliberately so it reads as an intentional product visual. */}
        <div className='w-full sm:w-1/2 relative p-4 sm:p-6 lg:p-8'>
          <div className='relative rounded-[1.75rem] overflow-hidden bg-[#0B1220] ring-1 ring-[#C3D9F2] shadow-[0_28px_60px_-28px_rgba(11,18,32,0.55)] animate-float'>
            <img
            className='relative w-full h-auto block'
            src={assets.hero_img}
            fetchPriority="high"
            alt='Voltique Hub power solutions — battery chargers, stabilizers and inverters'
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
