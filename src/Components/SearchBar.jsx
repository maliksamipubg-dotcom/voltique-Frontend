import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../contexts/ShopContext'
import { assets } from '../assets/assets';
import { useLocation } from 'react-router-dom';

const SearchBar = () => {

  const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);
  const[visible,setVisible] = useState(false)
  const location = useLocation();

  useEffect(()=>{
    if (location.pathname.includes('collections')) {
        setVisible(true);
    }
    else{
      setVisible(false)
    }

  },[location])

return showSearch && visible ? (
    <div className='site-bleed border-b border-slate-200 bg-white/90 backdrop-blur-md catalog-enter'>
      <div className='site-shell py-5 flex items-center justify-center gap-3'>
        <div className='relative inline-flex items-center bg-white border border-slate-200 hover:border-primary/50 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all duration-300 shadow-soft focus-within:shadow-card rounded-full w-full max-w-xl px-5 py-3'>
          <img className='w-4 opacity-50 shrink-0' src={assets.search_icon} alt="Search" />
          <input
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
            className='flex-1 min-w-0 outline-none bg-transparent text-sm text-gray-800 placeholder:text-gray-400 ml-2.5'
            type="text"
            placeholder='Search chargers, stabilizers, inverters, accessories...'
            aria-label='Search products'
          />
          {search && (
            <span className='text-[11px] font-semibold text-primary tabular-nums shrink-0'>{search.trim().length}</span>
          )}
        </div>
        <button
          type='button'
          onClick={()=>setShowSearch(false)}
          aria-label='Close search'
          className='w-10 h-10 shrink-0 rounded-xl bg-slate-50 flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-600 active:scale-95 transition-all duration-300'
        >
          <img className='w-3' src={assets.cross_icon} alt="" />
        </button>
      </div>
    </div>
  ) : null
}

export default SearchBar
