import React from 'react'
import { assets } from '../assets/assets'
import { Reveal, RevealGroup } from './Reveal'

const POLICIES = [
  { icon: assets.quality_icon, title: 'Genuine Warranty', copy: 'Warranty-Backed Power Solutions' },
  { icon: assets.exchange_icon, title: 'Easy Exchange Policy', copy: 'Hassle-Free Exchange Within 7 Days' },
  { icon: assets.support_img, title: 'Expert Technical Support', copy: 'Guidance For Every Power Setup' },
]

const OurPolicy = () => {
  return (
    <section className='py-12 sm:py-16'>
      <RevealGroup className='grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6'>
        {POLICIES.map((item) => (
          <div
            key={item.title}
            className='group card-interactive relative overflow-hidden p-6 sm:p-7 text-center flex flex-col items-center'
          >
            <span className='absolute -top-12 -right-12 w-32 h-32 orb orb-cyan opacity-0 group-hover:opacity-50 transition-opacity duration-500'></span>
            <div className='relative w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/15 flex items-center justify-center mb-4 group-hover:shadow-glow transition-shadow duration-500'>
              <img src={item.icon} className='w-9 h-9 object-contain group-hover:scale-110 transition-transform duration-500 ease-swift' alt={item.title} />
            </div>
            <p className='font-semibold text-white text-base group-hover:text-primary transition-colors duration-300'>{item.title}</p>
            <p className='text-ink-3 mt-1.5 text-sm'>{item.copy}</p>
          </div>
        ))}
      </RevealGroup>
    </section>
  )
}

export default OurPolicy
