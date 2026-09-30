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
            <div className='flex justify-between text-ink-2'>
                <p>SubTotal</p>
                <p className='font-medium text-white'>{currency} {subtotal}.00</p>
            </div>
            <hr className='border-line' />
            <div className='flex justify-between text-ink-2'>
                <p>Shipping Fee</p>
                <p className='font-medium text-white'>{currency} {shipping}.00</p>
            </div>
            <hr className='border-line' />
            <div className='flex justify-between items-baseline'>
                <b>Total</b>
                <b className='text-lg text-primary-bright'>{currency} {subtotal + shipping}.00</b>

            </div>
        </div>
    </div>
)
}

export default CartTotal
