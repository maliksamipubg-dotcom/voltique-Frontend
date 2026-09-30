import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'
import { ShopContext } from '../contexts/ShopContext'
import { Reveal, RevealGroup } from './Reveal'

const getCategoryIcon = (name) => {
    const key = (name || '').toLowerCase()
    if (key === 'accessories' || key.includes('accessor') || key.includes('cable') || key.includes('clamp')) {
        return assets.device_accessory
    }
    return assets.device_charger
}

const brands = ['Simtek', 'Osaka', 'AGS', 'Phoenix', 'Voltique Hub', 'Exide']

const CategoryStrip = () => {
    const { products, categories } = useContext(ShopContext)
    const list = Array.isArray(products) ? products : []

    const categoriesList = Array.isArray(categories) && categories.length > 0
        ? categories
        : [...new Set(list.map((p) => p.category).filter(Boolean))].map((name) => ({ name }))

    return (
        <section className='py-12 sm:py-16'>
            <Reveal className='text-center max-w-2xl mx-auto mb-9 sm:mb-12'>
                <p className='eyebrow mb-4'>
                    <span className='w-1.5 h-1.5 rounded-full bg-primary'></span>
                    Browse Catalog
                </p>
                <h2 className='heading-font font-semibold text-3xl sm:text-4xl text-ink tracking-tight'>SHOP BY CATEGORY</h2>
                <p className='mt-3 text-sm text-ink-3 leading-relaxed'>
                    Everything you need for reliable power — chargers, stabilizers, inverters, and charging accessories.
                </p>
            </Reveal>

            <RevealGroup className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl mx-auto'>
                {categoriesList.map((cat, index) => {
                    const name = cat.name
                    const count = list.filter((p) => p.category && p.category.toLowerCase() === name.toLowerCase()).length
                    return (
                        <Link
                            key={cat._id || index}
                            to={`/collections?category=${encodeURIComponent(name)}`}
                            className='group card-interactive sheen relative overflow-hidden p-6 text-center'
                        >
                            <span className='absolute -top-10 -right-10 w-28 h-28 orb orb-blue opacity-0 group-hover:opacity-60 transition-opacity duration-500'></span>
                            <div className='relative'>
                                <div className='w-24 h-24 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/15 to-accent/12 border border-line-strong flex items-center justify-center group-hover:border-primary/55 group-hover:shadow-card-hover transition-all duration-500'>
                                    <img
                                        src={getCategoryIcon(name)}
                                        className='w-16 h-16 object-contain group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 ease-swift'
                                        alt={name}
                                    />
                                </div>
                                <p className='font-semibold text-lg text-ink group-hover:text-primary transition-colors duration-300'>{name}</p>
                                <p className='text-xs text-ink-3 mt-1.5'>Products available in this category</p>
                                <p className='text-xs font-semibold text-primary mt-3'>{count} product{count !== 1 ? 's' : ''}</p>
                            </div>
                        </Link>
                    )
                })}
            </RevealGroup>

            <Reveal delay={80} className='mt-10 sm:mt-14 rounded-3xl bg-white border border-line px-6 py-8 sm:py-10 relative overflow-hidden shadow-card'>
                <div className='absolute -top-16 left-1/4 w-72 h-72 orb orb-blue opacity-70 animate-drift' style={{ animationDelay: '-3s' }}></div>
                <div className='relative'>
                    <p className='text-center text-[11px] tracking-[0.25em] text-ink-3 uppercase mb-5'>Trusted Brands</p>
                    <div className='flex flex-wrap justify-center gap-2.5 sm:gap-3'>
                        {brands.map((brand, index) => (
                            <span
                                key={index}
                                className='bg-white border border-line-strong text-ink text-sm font-semibold px-5 py-2.5 rounded-xl shadow-soft transition-all duration-500 ease-swift hover:border-primary/55 hover:bg-[#F5F9FF] hover:text-primary hover:-translate-y-0.5'
                            >
                                {brand}
                            </span>
                        ))}
                    </div>
                </div>
            </Reveal>
        </section>
    )
}

export default CategoryStrip
