import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'
import { ShopContext } from '../contexts/ShopContext'

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
        <div className='my-12'>
            <div className='text-center text-3xl mb-8'>
                <h3 className='heading-font font-semibold text-gray-800'>SHOP BY CATEGORY</h3>
                <p className='mt-2 text-sm text-gray-500'>Everything you need for reliable power — chargers, stabilizers, inverters, and charging accessories.</p>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto'>
                {categoriesList.map((cat, index) => {
                    const name = cat.name
                    const count = list.filter((p) => p.category && p.category.toLowerCase() === name.toLowerCase()).length
                    return (
                        <Link
                            key={cat._id || index}
                            to={`/collections?category=${encodeURIComponent(name)}`}
                            className='group bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-card hover:shadow-card-hover hover:-translate-y-1 hover:border-primary transition-all duration-300'
                        >
                            <img src={getCategoryIcon(name)} className='w-24 h-24 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300' alt={name} />
                            <p className='font-semibold text-base text-gray-800'>{name}</p>
                            <p className='text-xs text-slate-500 mt-1'>Products available in this category</p>
                            <p className='text-xs font-semibold text-primary mt-2'>{count} product{count !== 1 ? 's' : ''}</p>
                        </Link>
                    )
                })}
            </div>
            <div className='mt-10 bg-dark rounded-2xl px-6 py-6'>
                <p className='text-center text-xs tracking-widest text-slate-400 uppercase mb-4'>Trusted Brands</p>
                <div className='flex flex-wrap justify-center gap-3'>
                    {brands.map((brand, index) => (
                        <span key={index} className='bg-white/5 border border-white/10 text-slate-200 text-sm font-semibold px-5 py-2 rounded-lg'>
                            {brand}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default CategoryStrip
