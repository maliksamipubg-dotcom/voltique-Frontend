import React, { useContext, useState, useEffect, useRef } from 'react'
import { assets } from '../assets/assets'
import { Link, NavLink } from 'react-router-dom'
import { ShopContext } from '../contexts/ShopContext'
import './Navbar.css'

const Navbar = () => {
  const [visible, setVisible] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef(null)
  const { setShowSearch, getCartCount, navigate , token, user, logout } = useContext(ShopContext)

  useEffect(()=>{
    document.body.style.overflow = visible ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  },[visible])

  useEffect(()=>{
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  },[])
  return (
    <header className='sticky top-0 z-50 bg-white border-b border-slate-200 -mx-4 sm:-mx-[5vw] md:-mx-[7vw] lg:-mx-[9vw] px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
    <div className='flex items-center justify-between py-3 sm:py-4 font-medium'>
      {/* Logo */}
      <Link to='/' className='shrink-0'>
        <img src={assets.logo} className='brand-logo' alt='Voltique Hub Power Solutions' />
      </Link>

      {/* Desktop Menu */}
      <ul className='hidden sm:flex gap-6 text-sm text-gray-700'>
        <NavLink to='/' className='flex flex-col items-center gap-1'>
          <p>HOME</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-primary hidden' />
        </NavLink>

        <NavLink to='/collections' className='flex flex-col items-center gap-1'>
          <p>SHOP</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-primary hidden' />
        </NavLink>

        <NavLink to='/about' className='flex flex-col items-center gap-1'>
          <p>ABOUT</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-primary hidden' />
        </NavLink>

        <NavLink to='/contact' className='flex flex-col items-center gap-1'>
          <p>CONTACT</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-primary hidden' />
        </NavLink>
      </ul>

      {/* Icons */}
      <div className='flex items-center gap-3 sm:gap-6'>
        {/* Search */}
        <img
          onClick={() => setShowSearch(true)}
          src={assets.search_icon}
          className='w-5 cursor-pointer'
          alt=''
        />

        {/* Profile Dropdown */}
        <div className='relative' ref={profileRef}>
          <div onClick={()=> token ? setProfileOpen(!profileOpen) : navigate('/login')} className='flex items-center gap-2 cursor-pointer'>
            {user?.photoURL ? (
              <img src={user.photoURL} className='w-6 h-6 rounded-full object-cover' alt='' />
            ) : (
              <img src={assets.profile_icon} className='w-5 cursor-pointer' alt='' />
            )}
            {user && (
              <span className='hidden sm:inline text-xs font-semibold text-gray-700 max-w-28 truncate'>{user.name}</span>
            )}
          </div>
          {/**Dropdown Menu */}
          {token && profileOpen &&
          <div className='absolute right-0 top-full pt-2 z-50'>
            <div className='flex flex-col w-48 py-2 px-1.5 bg-white text-gray-600 rounded-xl shadow-card-hover border border-slate-200'>
              {user && (
                <div className='px-3 py-2 mb-1 border-b border-slate-100'>
                  <p className='text-sm font-semibold text-gray-800 truncate'>{user.name}</p>
                  <p className='text-xs text-gray-400 truncate'>{user.email}</p>
                </div>
              )}
              <p onClick={()=>{setProfileOpen(false); navigate('/profile');}} className='cursor-pointer hover:bg-slate-50 hover:text-primary px-3 py-2 rounded-lg text-sm'>My Profile</p>
              <p onClick={()=>{setProfileOpen(false); navigate('/orders');}} className='cursor-pointer hover:bg-slate-50 hover:text-primary px-3 py-2 rounded-lg text-sm'>My Orders</p>
              <p onClick={()=>{setProfileOpen(false); navigate('/orders');}} className='cursor-pointer hover:bg-slate-50 hover:text-primary px-3 py-2 rounded-lg text-sm'>Track Orders</p>
              <p onClick={()=>{setProfileOpen(false); navigate('/change-password');}} className='cursor-pointer hover:bg-slate-50 hover:text-primary px-3 py-2 rounded-lg text-sm'>Change Password</p>
              <hr className='my-1'/>
              <p onClick={()=>{setProfileOpen(false); logout(); navigate('/login');}} className='cursor-pointer hover:bg-red-50 hover:text-red-600 px-3 py-2 rounded-lg text-sm'>Logout</p>
            </div>
          </div>}
        </div>

        {/* Cart */}
        <Link to='/cart' className='relative'>
          <img src={assets.cart_icon} className='w-5 min-w-5' alt='' />
          <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-primary text-white aspect-square rounded-full text-[8px]'>
            {getCartCount()}
          </p>
        </Link>

        {/* Mobile Menu Button */}
        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          className='w-5 cursor-pointer sm:hidden'
          alt=''
        />
      </div>

      {/* Mobile Sidebar Menu */}
      {visible && (
        <div onClick={() => setVisible(false)} className='fixed inset-0 z-40 bg-black/40 sm:hidden' />
      )}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-72 max-w-[85vw] bg-white shadow-2xl sm:hidden transition-transform duration-300 ${
          visible ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div
          onClick={() => setVisible(false)}
          className='flex items-center gap-4 p-4 cursor-pointer border-b border-slate-200'
        >
          <img className='h-4 rotate-180' src={assets.dropdown_icon} alt='' />
          <p className='text-sm font-medium text-gray-600'>Back</p>
        </div>

        {/* Sidebar Links */}
        <div className='flex flex-col'>
          <NavLink
            onClick={() => setVisible(false)}
            className='py-3 pl-6 border-b text-gray-700 hover:bg-gray-100'
            to='/'
          >
            HOME
          </NavLink>

          <NavLink
            onClick={() => setVisible(false)}
            className='py-3 pl-6 border-b text-gray-700 hover:bg-gray-100'
            to='/collections'
          >
            SHOP
          </NavLink>

          <NavLink
            onClick={() => setVisible(false)}
            className='py-3 pl-6 border-b text-gray-700 hover:bg-gray-100'
            to='/about'
          >
            ABOUT
          </NavLink>

          <NavLink
            onClick={() => setVisible(false)}
            className='py-3 pl-6 border-b text-gray-700 hover:bg-gray-100'
            to='/contact'
          >
            CONTACT
          </NavLink>
        </div>
      </div>
    </div>
    </header>
  )
}

export default Navbar
