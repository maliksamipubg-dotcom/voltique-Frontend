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
      <Hero/>
      <CategoryStrip/>
      <LatestCollections/>
      <BestSeller/>
      <OurPolicy/>
    </div>
  )
}

export default Home
