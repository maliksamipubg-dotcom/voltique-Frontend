import React, { useContext } from 'react'
import { ShopContext } from '../contexts/ShopContext'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'
import { getProductUrl } from '../utils/seo'

const stripSpecs = (desc) => {
  let rest = (desc || '').trim();
  const re = /^([^:]{1,100}?):\s*([^.;]+?)\s*\.\s*/;
  let m;
  while ((m = rest.match(re))) {
    rest = rest.slice(m[0].length).trim();
  }
  return rest;
};

const ProductItem = ({id,image,name,price,category,brand,models,description,large,rating,reviewCount,stock}) => {

    const {currency} = useContext(ShopContext);
    const hasReviews = Number(rating) > 0 && Number(reviewCount) > 0;
    const shortDescription = description ? stripSpecs(description) : '';

return (
    <Link className='group flex flex-col h-full min-w-0 bg-white rounded-xl border border-slate-200 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 overflow-hidden text-gray-700 cursor-pointer' to={getProductUrl({ name, _id: id })}>
        <div className='relative bg-white overflow-hidden'>
            <img
                className='w-full h-auto object-contain group-hover:scale-105 transition-transform duration-500'
                src={image && image[0] ? image[0] : assets.device_charger}
                onError={(e)=>{ e.currentTarget.onerror = null; e.currentTarget.src = assets.device_charger }}
                loading="lazy"
                alt={name}
            />
            <span className='absolute top-2 left-2 text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full bg-primary text-white'>
                {category || 'Battery Chargers'}
            </span>
            <span className={`absolute top-2 right-2 flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full text-white ${stock === 'Out of Stock' ? 'bg-red-600' : 'bg-accent'}`}>
                {stock === 'Out of Stock'
                    ? <>Out of Stock</>
                    : <><span className='w-1.5 h-1.5 rounded-full bg-white animate-pulse'></span>In Stock</>
                }
            </span>
        </div>
        <div className={`flex flex-col flex-1 min-w-0 ${large ? 'p-4' : 'p-3'}`}>
            {brand && (
                <p className={`${large ? 'text-[11px]' : 'text-[10px]'} font-semibold uppercase tracking-wider text-sky-600 truncate`}>{brand}</p>
            )}
            <h3 className={`${large ? 'text-[15px] sm:text-base' : 'text-sm'} font-semibold line-clamp-2 leading-snug text-gray-800 mt-0.5`}>{name}</h3>

            <div className='flex items-center flex-wrap gap-x-1.5 gap-y-0.5 mt-1.5'>
                <div className='flex items-center gap-0.5'>
                    {[1,2,3,4,5].map((star) => (
                        <span key={star} className={`${large ? 'text-base sm:text-lg' : 'text-sm'} leading-none ${hasReviews && star <= Math.round(Number(rating)) ? 'text-amber-500' : 'text-slate-300'}`}>★</span>
                    ))}
                </div>
                {hasReviews ? (
                    <span className={`${large ? 'text-sm' : 'text-xs'} font-bold text-gray-700`}>{Number(rating).toFixed(1)}</span>
                ) : null}
                <span className={`${large ? 'text-xs sm:text-sm' : 'text-xs'} text-gray-500`}>
                    {hasReviews ? `(${reviewCount} review${Number(reviewCount) !== 1 ? 's' : ''})` : 'No reviews yet'}
                </span>
            </div>

            {shortDescription && (
                <p className={`${large ? 'text-xs sm:text-sm' : 'text-[11px]'} text-gray-500 mt-1.5 leading-relaxed line-clamp-2`}>{shortDescription}</p>
            )}

            {models && models.length > 0 && (
                <p className={`${large ? 'text-xs sm:text-sm' : 'text-[11px]'} text-slate-500 mt-1.5 truncate`}>Options: {models.join(' | ')}</p>
            )}

            <div className='flex flex-wrap items-center justify-between gap-x-2 gap-y-1.5 mt-auto pt-3'>
                <p className={`${large ? 'text-base sm:text-lg' : 'text-sm'} font-bold text-primary-dark min-w-0`}>{currency} {price}</p>
                <span className={`${large ? 'text-xs' : 'text-[11px]'} font-semibold bg-blue-50 text-primary border border-blue-200 rounded-lg px-2.5 py-1.5 group-hover:bg-primary group-hover:text-white transition-colors duration-300`}>
                    Add to Cart
                </span>
            </div>
        </div>
    </Link>
  )
}

export default ProductItem
