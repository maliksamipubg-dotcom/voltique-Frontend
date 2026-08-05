import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
return (
    <div>
        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 text-sm'>
            <div>
                <img src={assets.logo} className='brand-logo mb-5' alt="Voltique Hub Power Solutions" />
                <p className='w-full md:w-2/3 text-gray-600'>Voltique Hub is your dedicated store for battery chargers, stabilizers, power inverters, and charging accessories — from trusted brands like Simtek, Osaka, AGS, and Phoenix.
                                                                We deliver genuine, warranty-backed power equipment with secure checkout and fast, reliable delivery.
                                                                For homes, garages, and workshops, we keep your batteries charged and your power running — simply, safely, and for everyone.</p>
            </div>
            <div>
                <p className='text-xl font-medium mb-5'>COMPANY</p>
                <ul className='flex flex-col gap-1 text-gray-600'>
                <li>Home</li>
                <li>About Us</li>
                <li>Delivery</li>
                <li>Privacy Policy</li>
                </ul>
            </div>
            <div>
                <p className=' text-xl font-medium mb-5'>GET IN TOUCH</p>
                <ul className=' flex flex-col gap-1 text-gray-600'>
                <li>03063720139</li>
                <li>voltiquehubsupport@gmail.com</li>
                </ul>
            </div>

        </div>
        <div>
            <hr/>
            <p className='py-5 text-sm text-center'>Copyright 2025@ voltiquehub.com - All Rights are Reserved.</p>
        </div>
    </div>
)
}

export default Footer
