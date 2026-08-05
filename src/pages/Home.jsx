import React from 'react'
import Hero from '../Components/Hero'
import CategoryStrip from '../Components/CategoryStrip'
import LatestCollections from '../Components/LatestCollections'
import BestSeller from '../Components/BestSeller'
import OurPolicy from '../Components/OurPolicy'

const Home = () => {
  return (
    <div>
      <Hero/>
      <CategoryStrip/>
      <LatestCollections/>
      <BestSeller/>
      <OurPolicy/>
    </div>
  )
}

export default Home
