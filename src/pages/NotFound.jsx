import React from 'react'
import Seo from '../Components/Seo'
import { useNavigate } from 'react-router-dom'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className='pt-14 pb-20 text-center max-w-xl mx-auto'>
      <Seo
        title="Page Not Found | Voltique Hub"
        description="The page you are looking for is unavailable or may have been moved."
        robots="noindex, follow"
      />
      <h1 className='text-2xl sm:text-3xl font-semibold text-ink'>Page not found</h1>
      <p className='mt-3 text-ink-3'>The page you are looking for is unavailable or may have been moved.</p>
      <button onClick={() => navigate('/collections')} className='btn-primary mt-6'>Browse products</button>
    </div>
  )
}

export default NotFound
