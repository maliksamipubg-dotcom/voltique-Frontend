import React from 'react'
import Hero from '../Components/Hero'
import CategoryStrip from '../Components/CategoryStrip'
import LatestCollections from '../Components/LatestCollections'
import BestSeller from '../Components/BestSeller'
import OurPolicy from '../Components/OurPolicy'
import Seo from '../Components/Seo'
import { DEFAULT_TITLE, breadcrumbSchema, organizationSchema } from '../utils/seo'

const Home = () => {
  return (
    <div>
      <Seo
        title={DEFAULT_TITLE}
        description="Shop battery chargers, voltage stabilizers, power inverters and charging accessories in Pakistan. Genuine, warranty-backed power solutions from Voltique Hub with cash on delivery."
        path="/"
        jsonLd={[organizationSchema(), breadcrumbSchema([{ name: 'Home', path: '/' }])]}
      />
      <div className='relative'>
        {/* Hero band — soft white-to-light-blue gradient */}
        <div className='relative overflow-hidden bg-gradient-to-b from-[#F7FBFF] via-[#F1F7FF] to-[#EAF3FF] border-b border-line'>
          <div className='absolute inset-0 pointer-events-none circuit-light opacity-40'></div>
          <div className='relative py-5 sm:py-7'>
            <Hero/>
          </div>
        </div>

        {/* Category band — pure white */}
        <div className='bg-white'>
          <CategoryStrip/>
        </div>

        {/* Latest arrivals band — light blue */}
        <div className='bg-[#F5F9FF] border-y border-line'>
          <LatestCollections/>
        </div>

        {/* Top sellers band — pure white */}
        <div className='bg-white'>
          <BestSeller/>
        </div>

        {/* Policy band — very light blue */}
        <div className='bg-[#EEF6FF] border-t border-line mb-14'>
          <OurPolicy/>
        </div>
      </div>
    </div>
  )
}

export default Home
