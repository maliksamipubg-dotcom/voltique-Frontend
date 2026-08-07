import React from 'react'
import { assets } from '../assets/assets'
import Title from '../Components/Title'
import Seo from '../Components/Seo'
import { breadcrumbSchema } from '../utils/seo'

const MAP_EMBED_URL = 'https://www.google.com/maps?q=Pakistan&output=embed'

const contactDetails = [
  {
    label: 'Our Store',
    value: 'Battery Chargers, Stabilizers & Inverters',
    subValue: 'Charging Accessories • Pakistan',
    icon: (
      <svg className='w-6 h-6' fill='none' stroke='currentColor' strokeWidth='1.8' viewBox='0 0 24 24'>
        <path strokeLinecap='round' strokeLinejoin='round' d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
        <path strokeLinecap='round' strokeLinejoin='round' d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
      </svg>
    ),
  },
  {
    label: 'Phone',
    value: '(92) 3063720139',
    subValue: 'Available on WhatsApp',
    icon: (
      <svg className='w-6 h-6' fill='none' stroke='currentColor' strokeWidth='1.8' viewBox='0 0 24 24'>
        <path strokeLinecap='round' strokeLinejoin='round' d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' />
      </svg>
    ),
  },
  {
    label: 'Email',
    value: 'voltiquehubsupport@gmail.com',
    subValue: 'We reply within 24 hours',
    icon: (
      <svg className='w-6 h-6' fill='none' stroke='currentColor' strokeWidth='1.8' viewBox='0 0 24 24'>
        <path strokeLinecap='round' strokeLinejoin='round' d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
      </svg>
    ),
  },
]

const Contact = () => {
  return (
    <div className='w-full max-w-7xl mx-auto'>
      <Seo
        title="Contact Us | Voltique Hub"
        description="Contact Voltique Hub for help choosing battery chargers, stabilizers, inverters or accessories, order tracking and warranty support. WhatsApp (92) 3063720139."
        path="/contact"
        jsonLd={[breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Contact', path: '/contact' }])]}
      />
      <h1 className='sr-only'>Contact Voltique Hub</h1>
      <div className='text-center text-2xl pt-10 border-t border-slate-200'>
        <Title text1={'CONTACT'} text2={'US'} />
      </div>
      <p className='text-center text-gray-500 mt-4 mb-10 max-w-xl mx-auto px-4'>
        Have a question about a charger, stabilizer, or inverter — or an order? Our team is here to help you find the perfect power solution.
      </p>
      <div className='flex flex-col md:flex-row gap-8 md:gap-10 mb-16 items-center md:items-stretch'>
        <div className='w-full md:w-3/5 grid grid-cols-1 sm:grid-cols-3 gap-5'>
          {contactDetails.map((item) => (
            <div
              key={item.label}
              className='group flex flex-col h-full min-w-0 bg-white border border-slate-200 rounded-2xl shadow-card p-6 hover:shadow-card-hover hover:border-primary/30 transition-all duration-300'
            >
              <div className='w-12 h-12 flex items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300'>
                {item.icon}
              </div>
              <p className='font-semibold text-textPrimary mt-4'>{item.label}</p>
              <p className='text-gray-600 text-sm mt-1 leading-snug break-words'>{item.value}</p>
              <p className='text-gray-400 text-xs mt-1'>{item.subValue}</p>
            </div>
          ))}
        </div>
        <div className='w-full md:w-2/5 flex flex-col justify-center items-center gap-6 text-center md:text-left md:items-start'>
          <p className='font-semibold text-2xl text-gray-600'>Get in Touch</p>
          <p className='text-gray-500 max-w-md leading-relaxed'>
            Whether you need help choosing the right charger, stabilizer, or inverter, tracking an order, or a warranty question, feel free to
            reach out. We look forward to hearing from you.
          </p>
          <img className='w-full md:max-w-[420px] rounded-2xl shadow-card hover:shadow-card-hover transition-shadow duration-300' src={assets.contact_img} loading="lazy" alt="Contact Voltique Hub for battery chargers, stabilizers and inverters" />
        </div>
      </div>
      <div className='mb-20'>
        <iframe
          title='Voltique Hub Location'
          src={MAP_EMBED_URL}
          className='w-full h-[320px] sm:h-[420px] rounded-2xl shadow-card border border-slate-200'
          loading='lazy'
          allowFullScreen
          referrerPolicy='no-referrer-when-downgrade'
        />
      </div>
    </div>
  )
}

export default Contact
