import React from 'react'
import { assets } from '../assets/assets'

const OurPolicy = () => {
  return (
    <div className='flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-10 text-xs sm:text-sm md:text-base text-gray-700'>

      <div>
        <img src={assets.quality_icon} className='w-12 m-auto mb-5' alt="" />
        <p className=' font-semibold'>Genuine Warranty</p>
        <p className=' text-gray-400'>Warranty-Backed Power Solutions</p>
      </div>
            <div>
        <img src={assets.exchange_icon} className='w-12 m-auto mb-5' alt="" />
        <p className=' font-semibold'>Easy Exchange Policy</p>
        <p className=' text-gray-400'>Hassle-Free Exchange Within 7 Days</p>
      </div>
            <div>
        <img src={assets.support_img} className='w-12 m-auto mb-5' alt="" />
        <p className=' font-semibold'>Expert Technical Support</p>
        <p className=' text-gray-400'>Guidance For Every Power Setup</p>
      </div>
    </div>
  )
}

export default OurPolicy
