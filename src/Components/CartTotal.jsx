import React, { useContext } from 'react'
import { ShopContext } from '../contexts/ShopContext'
import Title from './Title';

const CartTotal = () => {
    const {currency,delivery_fee,getCartAmount} = useContext(ShopContext);
    const subtotal = getCartAmount();
    const shipping = subtotal === 0 ? 0 : delivery_fee;
return (
    <div className='w-full'>
        <div className='text-2xl'>
            <Title text1={'CART'} text2={'TOTALS'} />
        </div>
        <div className='flex flex-col gap-2 mt-2 text-sm'>
            <div className='flex justify-between'>
                <p>SubTotal</p>
                <p>{currency} {subtotal}.00</p>
            </div>
            <hr />
            <div className='flex justify-between'>
                <p>Shipping Fee</p>
                <p>{currency} {shipping}.00</p>
            </div>
            <hr />
            <div className='flex justify-between'>
                <b>Total</b>
                <b>{currency} {subtotal + shipping}.00</b>

            </div>
        </div>
    </div>
)
}

export default CartTotal
