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
    const isOut = stock === 'Out of Stock';

return (
    <Link
        className='group card-interactive sheen relative flex flex-col h-full min-w-0 overflow-hidden text-ink-2 cursor-pointer'
        to={getProductUrl({ name, _id: id })}
    >
        <div className='relative bg-gradient-to-b from-[#F7FBFF] to-[#EAF3FF] overflow-hidden'>
            <span className='absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent'></span>
            <img
                className='w-full h-auto object-contain p-2 group-hover:scale-105 group-hover:-translate-y-0.5 transition-transform duration-700 ease-swift'
                src={image && image[0] ? image[0] : assets.device_charger}
                onError={(e)=>{ e.currentTarget.onerror = null; e.currentTarget.src = assets.device_charger }}
                loading="lazy"
                alt={name}
            />
            <div className='absolute inset-x-0 top-0 p-2.5 flex items-start justify-between gap-2 pointer-events-none'>
                {category && (
                    <span
                        className='badge min-w-0 max-w-[62%] bg-white/95 text-primary border border-primary/35 shadow-soft'
                        title={category}
                    >
                        <span className='truncate'>{category}</span>
                    </span>
                )}
                <span className={`badge shrink-0 shadow-soft ${isOut ? 'bg-[#FEF2F2] text-danger-light border-danger/40' : 'bg-[#EAFBF1] text-success-deep border-success/40'}`}>
                    {isOut ? 'Out of Stock' : <><span className='w-1.5 h-1.5 rounded-full bg-success animate-pulse'></span>In Stock</>}
                </span>
            </div>
        </div>

        <div className={`flex flex-col flex-1 min-w-0 ${large ? 'p-4' : 'p-3.5'}`}>
            {brand && (
                <p className={`${large ? 'text-[11px]' : 'text-[10px]'} font-bold uppercase tracking-wider text-accent-ink truncate`}>{brand}</p>
            )}
            <h3 className={`${large ? 'text-[15px] sm:text-base' : 'text-sm'} font-semibold line-clamp-2 leading-snug text-ink mt-0.5 transition-colors duration-300 group-hover:text-primary`}>{name}</h3>

            <div className='flex items-center flex-wrap gap-x-1.5 gap-y-0.5 mt-1.5'>
                <div className='flex items-center gap-0.5'>
                    {[1,2,3,4,5].map((star) => (
                        <span key={star} className={`${large ? 'text-base sm:text-lg' : 'text-sm'} leading-none ${hasReviews && star <= Math.round(Number(rating)) ? 'text-amber-400' : 'text-line-strong'}`}>★</span>
                    ))}
                </div>
                {hasReviews ? (
                    <span className={`${large ? 'text-sm' : 'text-xs'} font-bold text-ink`}>{Number(rating).toFixed(1)}</span>
                ) : null}
                <span className={`${large ? 'text-xs sm:text-sm' : 'text-xs'} text-ink-3`}>
                    {hasReviews ? `(${reviewCount} review${Number(reviewCount) !== 1 ? 's' : ''})` : 'No reviews yet'}
                </span>
            </div>

            {shortDescription && (
                <p className={`${large ? 'text-xs sm:text-sm' : 'text-[11px]'} text-ink-3 mt-1.5 leading-relaxed line-clamp-2`}>{shortDescription}</p>
            )}

            {models && models.length > 0 && (
                <p className={`${large ? 'text-xs sm:text-sm' : 'text-[11px]'} text-ink-3 mt-1.5 truncate`}>Options: {models.join(' | ')}</p>
            )}

            <div className='flex flex-wrap items-center justify-between gap-x-2 gap-y-1.5 mt-auto pt-3.5 border-t border-line'>
                <p className={`${large ? 'text-base sm:text-lg' : 'text-sm'} font-extrabold text-primary min-w-0`}>{currency} {price}</p>
                <span className={`${large ? 'text-xs' : 'text-[11px]'} font-semibold bg-primary text-white border border-primary rounded-lg px-2.5 py-1.5 group-hover:bg-primary-dark group-hover:border-primary-dark group-hover:shadow-glow transition-all duration-300 ease-swift`}>
                    Add to Cart
                </span>
            </div>
        </div>
    </Link>
  )
}

export default ProductItem
