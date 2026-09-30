import React, { useContext } from 'react'
import { ShopContext } from '../contexts/ShopContext'
import Title from './Title';

const CartTotal = () => {
    const {currency,delivery_fee,getCartAmount} = useContext(ShopContext);
    const subtotal = getCartAmount();
    const shipping = subtotal === 0 ? 0 : delivery_fee;
return (
    <div className='w-full card p-5 sm:p-6'>
        <div className='text-2xl'>
            <Title text1={'CART'} text2={'TOTALS'} />
        </div>
        <div className='flex flex-col gap-2 mt-3 text-sm'>
            <div className='flex justify-between text-gray-600'>
                <p>SubTotal</p>
                <p className='font-medium text-gray-800'>{currency} {subtotal}.00</p>
            </div>
            <hr className='border-slate-100' />
            <div className='flex justify-between text-gray-600'>
                <p>Shipping Fee</p>
                <p className='font-medium text-gray-800'>{currency} {shipping}.00</p>
            </div>
            <hr className='border-slate-100' />
            <div className='flex justify-between items-baseline'>
                <b>Total</b>
                <b className='text-lg text-primary-dark'>{currency} {subtotal + shipping}.00</b>

            </div>
        </div>
    </div>
)
}

export default CartTotal
