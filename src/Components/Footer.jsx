import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const Footer = () => {
return (
    <footer className='site-bleed mt-14 relative overflow-hidden bg-gradient-to-b from-[#F5F9FF] to-[#EAF3FF] text-ink border-t border-line'>
        {/* Ambient depth */}
        <div className='absolute -top-24 -left-20 w-96 h-96 orb orb-blue opacity-60 animate-drift'></div>
        <div className='absolute -bottom-32 right-0 w-[28rem] h-[28rem] orb orb-cyan opacity-50 animate-drift' style={{ animationDelay: '-9s' }}></div>

        <div className='site-shell relative'>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2.2fr_1fr_1.2fr] gap-10 lg:gap-14 py-14 text-sm'>
                <div>
                    <img src={assets.logo} className='brand-logo brand-logo-light mb-5' alt="Voltique Hub Power Solutions" />
                    <p className='text-ink-2 leading-relaxed max-w-md'>
                        Voltique Hub is your dedicated store for battery chargers, stabilizers, power inverters, and charging accessories — from trusted brands like Simtek, Osaka, AGS, and Phoenix.
                        We deliver genuine, warranty-backed power equipment with secure checkout and fast, reliable delivery.
                        For homes, garages, and workshops, we keep your batteries charged and your power running — simply, safely, and for everyone.
                    </p>
                    <div className='mt-6 flex flex-wrap gap-2'>
                        {['Simtek', 'Osaka', 'AGS', 'Phoenix', 'Exide'].map((brand) => (
                            <span key={brand} className='rounded-lg border border-line bg-white px-3 py-1.5 text-[11px] font-semibold text-ink shadow-soft'>{brand}</span>
                        ))}
                    </div>
                </div>

                <nav aria-label='Company'>
                    <p className='text-ink font-bold tracking-[0.15em] text-[11px] uppercase mb-5'>COMPANY</p>
                    <ul className='flex flex-col gap-1 text-ink-2'>
                        {[
                            { label: 'Home', to: '/' },
                            { label: 'About Us', to: '/about' },
                            { label: 'Contact', to: '/contact' },
                            { label: 'Shop', to: '/collections' },
                        ].map((item) => (
                            <li key={item.label}>
                                <Link to={item.to} className='inline-block py-1.5 hover:text-primary transition-colors duration-300 hover:translate-x-1'>{item.label}</Link>
                            </li>
                        ))}
                        <li className='py-1.5 text-ink-3'>Delivery</li>
                        <li className='py-1.5 text-ink-3'>Privacy Policy</li>
                    </ul>
                </nav>

                <div>
                    <p className='text-ink font-bold tracking-[0.15em] text-[11px] uppercase mb-5'>GET IN TOUCH</p>
                    <ul className='flex flex-col gap-2 text-ink-2'>
                        <li>
                            <a href='tel:03063720139' className='inline-flex items-center gap-2 hover:text-primary transition-colors duration-300'>
                                <span className='w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse'></span>
                                03063720139
                            </a>
                        </li>
                        <li>
                            <a href='mailto:voltiquehubsupport@gmail.com' className='hover:text-primary transition-colors duration-300 break-all'>voltiquehubsupport@gmail.com</a>
                        </li>
                    </ul>
                    <a
                        href='https://wa.me/923063720139'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='btn-whatsapp btn-sm mt-5'
                    >
                        Chat on WhatsApp
                    </a>
                </div>
            </div>

            <div className='rule-gradient'></div>
            <p className='py-5 text-xs sm:text-sm text-ink-3 text-center'>Copyright 2025@ voltiquehub.com - All Rights are Reserved.</p>
        </div>
    </footer>
)
}
export default Footer
