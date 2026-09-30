import React from 'react'
import Title from '../Components/Title'
import { assets } from '../assets/assets'
import Seo from '../Components/Seo'
import { breadcrumbSchema } from '../utils/seo'
import { Reveal, RevealGroup } from '../Components/Reveal'

const REASONS = [
  {
    title: 'Certified Quality',
    body: 'At Voltique Hub, we are committed to delivering chargers, stabilizers, and power inverters that meet the highest safety and performance standards. Every product is carefully selected and tested to ensure durability, efficiency, and complete peace of mind.',
  },
  {
    title: 'Convenience',
    body: 'Shopping with Voltique Hub is designed to be simple, fast, and stress-free. From easy navigation and secure checkout to reliable delivery, we make sure you get the right power equipment and accessories quickly and effortlessly.',
  },
  {
    title: 'Expert Support',
    body: 'At Voltique Hub, we value every customer and provide expert technical support that goes beyond expectations. Our dedicated team helps you choose the correct charger, stabilizer, or inverter and the right specifications for your needs, ensuring safe and effective performance every time.',
  },
]

const About = () => {
  return (
    <div>
      <Seo
        title="About Us | Voltique Hub"
        description="Voltique Hub is a specialized store for battery chargers, stabilizers, power inverters and charging accessories. Genuine products, competitive prices and dependable customer support."
        path="/about"
        jsonLd={[breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'About', path: '/about' }])]}
      />
      <h1 className='sr-only'>About Voltique Hub</h1>

      <Reveal className='text-center pt-8 sm:pt-12 border-t border-slate-200'>
        <Title text1={'ABOUT'} text2={'US'} />
        <p className='mt-3 text-sm text-gray-500 max-w-xl mx-auto leading-relaxed'>
          Power solutions you can rely on — from entry-level chargers to professional heavy-duty models.
        </p>
      </Reveal>

      <div className='my-10 sm:my-14 flex flex-col md:flex-row gap-10 md:gap-14 items-center'>
        <Reveal className='w-full md:max-w-[450px] shrink-0' delay={60}>
          <div className='relative'>
            <span className='absolute -inset-3 rounded-3xl bg-gradient-to-br from-primary/15 to-accent/15 -z-10'></span>
            <img className='w-full rounded-2xl shadow-lift' src={assets.about_img} loading="lazy" alt="Voltique Hub — battery chargers, stabilizers and power inverters" />
          </div>
        </Reveal>

        <Reveal className='flex flex-col justify-center gap-5 md:w-2/4 text-gray-600' delay={120}>
          <p>Voltique Hub is a specialized eCommerce store for Battery Chargers, Stabilizers, Power Inverters, and Charging Accessories.
            We supply reliable power equipment from trusted brands with genuine products, competitive prices, and dependable customer support.
            Our goal is to make it easy for customers to find the right charging and power solution through a simple, secure, and user-friendly shopping experience.</p>
          <p>From entry-level chargers to professional heavy-duty models — plus stabilizers, power inverters, cables, clamps, and clips — Voltique Hub has everything you need for reliable power.
            Fast delivery, secure checkout, and certified support with every order.
            At Voltique Hub, we make reliable power simple, modern, and for everyone.</p>
          <div className='card p-5 bg-gradient-to-br from-primary/[0.06] to-accent/[0.05]'>
            <p className='eyebrow mb-2.5'>Our Mission</p>
            <p className='text-sm'>Our mission is to provide reliable, efficient, and affordable Battery Chargers, Stabilizers, Power Inverters, and Charging Accessories while ensuring excellent customer service, secure shopping, and fast nationwide delivery.</p>
          </div>
        </Reveal>
      </div>

      <Reveal className='text-center py-4 mb-8'>
        <Title text1={'WHY'} text2={'CHOOSE US'} />
      </Reveal>

      <RevealGroup className='grid grid-cols-1 md:grid-cols-3 gap-5 mb-20'>
        {REASONS.map((item) => (
          <div key={item.title} className='card-interactive relative overflow-hidden px-7 py-8 sm:py-10 flex flex-col gap-3.5'>
            <span className='absolute -top-12 -right-12 w-36 h-36 orb orb-cyan opacity-0 group-hover:opacity-50 transition-opacity duration-500'></span>
            <div className='relative'>
              <span className='w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-light text-white flex items-center justify-center shadow-glow mb-3.5'>
                <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round' className='w-4.5 h-4.5 w-5 h-5'>
                  <path d='M20 6 9 17l-5-5' />
                </svg>
              </span>
              <b className='text-gray-800 text-lg'>{item.title}:</b>
              <p className='text-gray-600 text-sm leading-relaxed mt-1.5'>{item.body}</p>
            </div>
          </div>
        ))}
      </RevealGroup>
    </div>
  )
}

export default About
