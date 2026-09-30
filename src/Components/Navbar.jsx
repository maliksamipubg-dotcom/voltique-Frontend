import React, { useContext, useState, useEffect, useRef } from 'react'
import { assets } from '../assets/assets'
import { Link, NavLink } from 'react-router-dom'
import { ShopContext } from '../contexts/ShopContext'

const NAV_LINKS = [
  { label: 'HOME', to: '/' },
  { label: 'SHOP', to: '/collections' },
  { label: 'ABOUT', to: '/about' },
  { label: 'CONTACT', to: '/contact' },
]

const Navbar = () => {
  const [visible, setVisible] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const profileRef = useRef(null)
  const { setShowSearch, getCartCount, navigate , token, user, logout } = useContext(ShopContext)

  useEffect(()=>{
    document.body.style.overflow = visible ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  },[visible])

  // Shadow + blur intensify once the page is scrolled.
  useEffect(()=>{
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  },[])

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
    <header className='site-bleed sticky top-0 z-50'>
      {/* Trust strip */}
      <div className='bg-dark text-white/80 border-b border-white/5'>
        <div className='site-shell'>
          <div className='flex items-center justify-center gap-3 sm:gap-6 py-1.5 text-[10px] sm:text-[11px] font-medium tracking-wide'>
            <span className='inline-flex items-center gap-1.5'>
              <span className='w-1.5 h-1.5 rounded-full bg-accent-light animate-pulse'></span>
              Cash on delivery available nationwide
            </span>
            <span className='hidden sm:inline w-1 h-1 rounded-full bg-white/25'></span>
            <span className='hidden sm:inline'>Genuine &amp; warranty-backed power solutions</span>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className={`transition-all duration-500 ease-swift ${scrolled ? 'bg-white/85 backdrop-blur-xl border-b border-slate-200/80 shadow-nav' : 'bg-white border-b border-transparent'}`}>
        <div className='site-shell'>
          <div className='flex items-center justify-between h-[68px] sm:h-[76px] font-medium'>
            {/* Logo */}
            <Link to='/' className='shrink-0 group' aria-label='Voltique Hub home'>
              <img src={assets.logo} className='brand-logo transition-transform duration-500 ease-swift group-hover:scale-[1.03]' alt='Voltique Hub Power Solutions' />
            </Link>

            {/* Desktop Menu */}
            <ul className='hidden sm:flex items-center gap-1 text-sm text-gray-700'>
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className='group relative block px-4 py-2.5 rounded-xl font-medium text-gray-600 transition-colors duration-300 hover:text-primary'
                  >
                    {({ isActive }) => (
                      <>
                        <span className={`relative z-10 transition-colors duration-300 ${isActive ? 'text-primary font-semibold' : ''}`}>{link.label}</span>
                        <span
                          className={`absolute inset-x-2 -bottom-0.5 h-[2px] rounded-full bg-gradient-to-r from-primary to-accent transition-transform duration-500 ease-swift ${
                            isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                          }`}
                          style={{ transformOrigin: 'center' }}
                        ></span>
                        <span
                          className={`absolute inset-0 -z-0 rounded-xl bg-primary/[0.06] transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                        ></span>
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* Icons */}
            <div className='flex items-center gap-1.5 sm:gap-2'>
              {/* Search */}
              <button
                type='button'
                onClick={() => setShowSearch(true)}
                aria-label='Search products'
                className='w-10 h-10 flex items-center justify-center rounded-xl text-gray-600 transition-all duration-300 ease-swift hover:bg-primary/[0.08] hover:text-primary active:scale-95'
              >
                <img src={assets.search_icon} className='w-[18px] transition-transform duration-300 hover:scale-110' alt='' />
              </button>

              {/* Profile Dropdown */}
              <div className='relative' ref={profileRef}>
                <div
                  onClick={()=> token ? setProfileOpen(!profileOpen) : navigate('/login')}
                  className='flex items-center gap-2 cursor-pointer w-10 h-10 sm:w-auto sm:h-10 sm:px-3 sm:rounded-xl sm:border sm:border-slate-200 sm:bg-white sm:mr-1 transition-all duration-300 ease-swift hover:border-primary/40 hover:bg-primary/[0.04] sm:hover:shadow-soft'
                >
                  {user?.photoURL ? (
                    <img src={user.photoURL} className='w-7 h-7 rounded-full object-cover ring-2 ring-white shadow-soft' alt={`${user.name || 'User'} profile`} />
                  ) : (
                    <img src={assets.profile_icon} className='w-[18px]' alt='My account' />
                  )}
                  {user && (
                    <span className='hidden sm:inline text-xs font-semibold text-gray-700 max-w-24 truncate'>{user.name}</span>
                  )}
                </div>
                {/**Dropdown Menu */}
                {token && profileOpen &&
                <div className='absolute right-0 top-full pt-3 z-50 animate-rise-sm'>
                  <div className='flex flex-col w-56 py-2 px-1.5 bg-white text-gray-600 rounded-2xl shadow-lift border border-slate-200/80'>
                    {user && (
                      <div className='px-3.5 py-2.5 mb-1 border-b border-slate-100'>
                        <p className='text-sm font-semibold text-gray-800 truncate'>{user.name}</p>
                        <p className='text-xs text-gray-400 truncate'>{user.email}</p>
                      </div>
                    )}
                    {[
                      { label: 'My Profile', action: () => navigate('/profile') },
                      { label: 'My Orders', action: () => navigate('/orders') },
                      { label: 'Track Orders', action: () => navigate('/orders') },
                      { label: 'Change Password', action: () => navigate('/change-password') },
                    ].map((item) => (
                      <p
                        key={item.label}
                        onClick={()=>{ setProfileOpen(false); item.action(); }}
                        className='cursor-pointer px-3.5 py-2.5 rounded-xl text-sm transition-all duration-200 hover:bg-primary/[0.06] hover:text-primary hover:translate-x-0.5'
                      >
                        {item.label}
                      </p>
                    ))}
                    <hr className='my-1 border-slate-100'/>
                    <p onClick={()=>{ setProfileOpen(false); logout(); navigate('/login'); }} className='cursor-pointer px-3.5 py-2.5 rounded-xl text-sm text-red-600 transition-all duration-200 hover:bg-red-50 hover:translate-x-0.5'>Logout</p>
                  </div>
                </div>}
              </div>

              {/* Cart */}
              <Link
                to='/cart'
                aria-label={`Cart with ${getCartCount()} items`}
                className='relative w-10 h-10 flex items-center justify-center rounded-xl text-gray-600 transition-all duration-300 ease-swift hover:bg-primary/[0.08] hover:text-primary'
              >
                <img src={assets.cart_icon} className='w-5 min-w-5' alt='Shopping cart' />
                <p className='absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-center leading-none bg-primary text-white text-[9px] font-bold rounded-full ring-2 ring-white shadow-soft'>
                  {getCartCount()}
                </p>
              </Link>

              {/* Mobile Menu Button */}
              <button
                type='button'
                onClick={() => setVisible(true)}
                aria-label='Open menu'
                className='w-10 h-10 flex items-center justify-center rounded-xl text-gray-600 transition-all duration-300 ease-swift hover:bg-primary/[0.08] hover:text-primary sm:hidden'
              >
                <img src={assets.menu_icon} className='w-5' alt='' />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Menu */}
      {visible && (
        <div onClick={() => setVisible(false)} className='fixed inset-0 z-40 bg-dark/50 backdrop-blur-[2px] sm:hidden animate-pop-in' />
      )}
      <div
        className={`fixed top-0 left-0 bottom-0 z-50 w-80 max-w-[85vw] bg-white shadow-lift sm:hidden transition-transform duration-500 ease-swift flex flex-col ${
          visible ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div
          onClick={() => setVisible(false)}
          className='flex items-center gap-3 p-5 cursor-pointer border-b border-slate-200'
        >
          <img src={assets.logo} className='h-7 w-auto' alt='Voltique Hub' />
          <span className='ml-auto w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 text-gray-500'>
            <img className='h-3.5 rotate-180' src={assets.dropdown_icon} alt='Close menu' />
          </span>
        </div>

        {/* Sidebar Links */}
        <nav className='flex flex-col p-3 gap-1'>
          {NAV_LINKS.map((link, i) => (
            <NavLink
              key={link.to}
              onClick={() => setVisible(false)}
              style={{ transitionDelay: visible ? `${i * 45}ms` : '0ms' }}
              className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-500 ease-swift ${
                visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-3'
              }`}
              to={link.to}
            >
              {link.label}
              <img className='h-2.5 rotate-90 opacity-40' src={assets.dropdown_icon} alt='' />
            </NavLink>
          ))}
        </nav>

        <div className='mt-auto p-5 border-t border-slate-100'>
          <p className='text-[11px] uppercase tracking-widest text-gray-400 mb-2'>Need help?</p>
          <a href='https://wa.me/923063720139' target='_blank' rel='noopener noreferrer' className='flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-[#25D366] transition-colors'>
            <span className='w-2 h-2 rounded-full bg-[#25D366]'></span>
            03063720139
          </a>
          <p className='text-xs text-gray-400 mt-1.5'>voltiquehubsupport@gmail.com</p>
        </div>
      </div>
    </header>
  )
}

export default Navbar
