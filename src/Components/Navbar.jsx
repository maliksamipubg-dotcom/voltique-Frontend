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
      <div className='bg-[#050c17] text-ink-2 border-b border-line-soft'>
        <div className='site-shell'>
          <div className='flex items-center justify-center gap-3 sm:gap-6 py-2 text-[10px] sm:text-[11px] font-medium tracking-wide'>
            <span className='inline-flex items-center gap-1.5'>
              <span className='w-1.5 h-1.5 rounded-full bg-accent animate-pulse'></span>
              Cash on delivery available nationwide
            </span>
            <span className='hidden sm:inline w-1 h-1 rounded-full bg-white/25'></span>
            <span className='hidden sm:inline'>Genuine &amp; warranty-backed power solutions</span>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className={`transition-all duration-500 ease-swift ${scrolled ? 'bg-navy/92 backdrop-blur-xl border-b border-line shadow-nav' : 'bg-navy border-b border-line-soft'}`}>
        <div className='site-shell'>
          <div className='flex items-center justify-between h-[68px] sm:h-[76px] font-medium'>
            {/* Logo */}
            <Link to='/' className='shrink-0 group' aria-label='Voltique Hub home'>
              <img src={assets.logo_light} className='brand-logo transition-transform duration-500 ease-swift group-hover:scale-[1.03]' alt='Voltique Hub Power Solutions' />
            </Link>

            {/* Desktop Menu */}
            <ul className='hidden sm:flex items-center gap-1 text-sm'>
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className='group relative block px-4 py-2.5 rounded-xl font-medium text-ink-2 transition-colors duration-300 hover:text-ink'
                  >
                    {({ isActive }) => (
                      <>
                        <span className={`relative z-10 transition-colors duration-300 ${isActive ? 'text-primary-bright font-bold' : ''}`}>{link.label}</span>
                        <span
                          className={`absolute inset-x-2 -bottom-0.5 h-[2px] rounded-full bg-gradient-to-r from-primary-light to-accent transition-transform duration-500 ease-swift ${
                            isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                          }`}
                          style={{ transformOrigin: 'center' }}
                        ></span>
                        <span
                          className={`absolute inset-0 -z-0 rounded-xl bg-primary/15 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
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
                className='w-10 h-10 flex items-center justify-center rounded-xl text-ink-2 transition-all duration-300 ease-swift hover:bg-primary/20 hover:text-white active:scale-95'
              >
                <img src={assets.search_icon} className='w-[18px] icon-on-dark transition-transform duration-300 hover:scale-110' alt='' />
              </button>

              {/* Profile Dropdown */}
              <div className='relative' ref={profileRef}>
                <div
                  onClick={()=> token ? setProfileOpen(!profileOpen) : navigate('/login')}
                  className='flex items-center gap-2 cursor-pointer w-10 h-10 sm:w-auto sm:h-10 sm:px-3 sm:rounded-xl sm:border sm:border-line sm:bg-surface-2 sm:mr-1 transition-all duration-300 ease-swift hover:border-primary-light hover:bg-primary/15 sm:hover:shadow-glow'
                >
                  {user?.photoURL ? (
                    <img src={user.photoURL} className='w-7 h-7 rounded-full object-cover ring-2 ring-primary/50 shadow-soft' alt={`${user.name || 'User'} profile`} />
                  ) : (
                    <img src={assets.profile_icon} className='w-[18px] icon-on-dark' alt='My account' />
                  )}
                  {user && (
                    <span className='hidden sm:inline text-xs font-semibold text-ink max-w-24 truncate'>{user.name}</span>
                  )}
                </div>
                {/**Dropdown Menu */}
                {token && profileOpen &&
                <div className='absolute right-0 top-full pt-3 z-50 animate-rise-sm'>
                  <div className='flex flex-col w-56 py-2 px-1.5 bg-surface-2 text-ink-2 rounded-2xl shadow-lift border border-line-strong'>
                    {user && (
                      <div className='px-3.5 py-2.5 mb-1 border-b border-line'>
                        <p className='text-sm font-semibold text-ink truncate'>{user.name}</p>
                        <p className='text-xs text-ink-3 truncate'>{user.email}</p>
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
                        className='cursor-pointer px-3.5 py-2.5 rounded-xl text-sm font-medium text-ink-2 transition-all duration-200 hover:bg-primary/20 hover:text-primary-bright hover:translate-x-0.5'
                      >
                        {item.label}
                      </p>
                    ))}
                    <hr className='my-1 border-line'/>
                    <p onClick={()=>{ setProfileOpen(false); logout(); navigate('/login'); }} className='cursor-pointer px-3.5 py-2.5 rounded-xl text-sm font-semibold text-danger-light transition-all duration-200 hover:bg-danger/15 hover:text-danger hover:translate-x-0.5'>Logout</p>
                  </div>
                </div>}
              </div>

              {/* Cart */}
              <Link
                to='/cart'
                aria-label={`Cart with ${getCartCount()} items`}
                className='relative w-10 h-10 flex items-center justify-center rounded-xl text-ink-2 transition-all duration-300 ease-swift hover:bg-primary/20 hover:text-white'
              >
                <img src={assets.cart_icon} className='w-5 min-w-5 icon-on-dark' alt='Shopping cart' />
                <p className='absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-center leading-none bg-primary text-white text-[9px] font-bold rounded-full ring-2 ring-navy shadow-soft'>
                  {getCartCount()}
                </p>
              </Link>

              {/* Mobile Menu Button */}
              <button
                type='button'
                onClick={() => setVisible(true)}
                aria-label='Open menu'
                className='w-10 h-10 flex items-center justify-center rounded-xl text-ink-2 transition-all duration-300 ease-swift hover:bg-primary/20 hover:text-white sm:hidden'
              >
                <img src={assets.menu_icon} className='w-5 icon-on-dark' alt='' />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Menu */}
      {visible && (
        <div onClick={() => setVisible(false)} className='fixed inset-0 z-40 bg-black/70 backdrop-blur-[2px] sm:hidden animate-pop-in' />
      )}
      <div
        className={`fixed top-0 left-0 bottom-0 z-50 w-80 max-w-[85vw] bg-navy border-r border-line shadow-lift sm:hidden transition-transform duration-500 ease-swift flex flex-col ${
          visible ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div
          onClick={() => setVisible(false)}
          className='flex items-center gap-3 p-5 cursor-pointer border-b border-line bg-[#0a1729]'
        >
          <img src={assets.logo_light} className='h-7 w-auto' alt='Voltique Hub' />
          <span className='ml-auto w-9 h-9 flex items-center justify-center rounded-xl bg-surface-2 border border-line text-ink-2'>
            <img className='h-3.5 rotate-180 icon-on-dark-dim' src={assets.dropdown_icon} alt='Close menu' />
          </span>
        </div>

        {/* Sidebar Links */}
        <nav className='flex flex-col p-3 gap-1'>
          {NAV_LINKS.map((link, i) => (
            <NavLink
              key={link.to}
              onClick={() => setVisible(false)}
              style={{ transitionDelay: visible ? `${i * 45}ms` : '0ms' }}
              className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-semibold tracking-wide text-ink-2 transition-all duration-500 ease-swift hover:bg-primary/15 hover:text-primary-bright ${
                visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-3'
              }`}
              to={link.to}
            >
              {link.label}
              <img className='h-2.5 rotate-90 opacity-60 icon-on-dark-dim' src={assets.dropdown_icon} alt='' />
            </NavLink>
          ))}
        </nav>

        <div className='mt-auto p-5 border-t border-line'>
          <p className='text-[11px] uppercase tracking-widest text-ink-3 mb-2'>Need help?</p>
          <a href='https://wa.me/923063720139' target='_blank' rel='noopener noreferrer' className='flex items-center gap-2 text-sm font-semibold text-ink transition-colors hover:text-[#25D366]'>
            <span className='w-2 h-2 rounded-full bg-[#25D366]'></span>
            03063720139
          </a>
          <p className='text-xs text-ink-3 mt-1.5 break-all'>voltiquehubsupport@gmail.com</p>
        </div>
      </div>
    </header>
  )
}

export default Navbar
