import React from 'react'
import Title from '../Components/Title'
import { assets } from '../assets/assets'
import Seo from '../Components/Seo'
import { breadcrumbSchema } from '../utils/seo'

const About = () => {
  return (
    <div>
      <Seo
        title="About Us | Voltique Hub"
        description="Voltique Hub is a specialized store for battery chargers, stabilizers, power inverters and charging accessories. Genuine products, competitive prices and dependable customer support."
        path="/about"
        jsonLd={[breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'About', path: '/about' }])]}
      />
      <h1 className='sr-only'>About Voltique Hub</h1>
      <div className='text-2xl text-center pt-8 border-t border-slate-200'>
        <Title text1={'ABOUT'} text2={'US'} />
      </div>
      <div className='my-10 flex flex-col md:flex-row gap-16 items-center'>
        <img className='w-full md:max-w-[450px] rounded-2xl shadow-card' src={assets.about_img} loading="lazy" alt="Voltique Hub — battery chargers, stabilizers and power inverters" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
          <p>Voltique Hub is a specialized eCommerce store for Battery Chargers, Stabilizers, Power Inverters, and Charging Accessories.
              We supply reliable power equipment from trusted brands with genuine products, competitive prices, and dependable customer support.
              Our goal is to make it easy for customers to find the right charging and power solution through a simple, secure, and user-friendly shopping experience.</p>
          <p>From entry-level chargers to professional heavy-duty models — plus stabilizers, power inverters, cables, clamps, and clips — Voltique Hub has everything you need for reliable power.
              Fast delivery, secure checkout, and certified support with every order.
              At Voltique Hub, we make reliable power simple, modern, and for everyone.</p>
          <b className='text-gray-800'>Our Mission</b>
          <p>Our mission is to provide reliable, efficient, and affordable Battery Chargers, Stabilizers, Power Inverters, and Charging Accessories while ensuring excellent customer service, secure shopping, and fast nationwide delivery.</p>
        </div>
      </div>
      <div className=' text-xl py-4'>
        <Title text1={'WHY'} text2={'CHOOSE US'}/>
      </div>
      <div className='flex flex-col md:flex-row text-sm mb-20'>
        <div className='border border-slate-200 px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5 bg-white rounded-tl-2xl rounded-bl-2xl shadow-card'>
          <b>Certified Quality:</b>
          <p className='text-gray-600'>At Voltique Hub, we are committed to delivering chargers, stabilizers, and power inverters that meet the highest safety and performance standards. Every product is carefully selected and tested to ensure durability, efficiency, and complete peace of mind.</p>
        </div>
        <div className='border border-slate-200 px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5 bg-white shadow-card'>
          <b>Convenience:</b>
          <p className='text-gray-600'>Shopping with Voltique Hub is designed to be simple, fast, and stress-free. From easy navigation and secure checkout to reliable delivery, we make sure you get the right power equipment and accessories quickly and effortlessly.</p>
        </div>
        <div className='border border-slate-200 px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5 bg-white rounded-tr-2xl rounded-br-2xl shadow-card'>
          <b>Expert Support:</b>
          <p className='text-gray-600'>At Voltique Hub, we value every customer and provide expert technical support that goes beyond expectations. Our dedicated team helps you choose the correct charger, stabilizer, or inverter and the right specifications for your needs, ensuring safe and effective performance every time.</p>
        </div>
      </div>
    </div>
  )
}

export default About
