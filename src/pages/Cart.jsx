import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../contexts/ShopContext'
import Title from '../Components/Title';
import { assets } from '../assets/assets';
import CartTotal from '../Components/CartTotal';
import Seo from '../Components/Seo';

const Cart = () => {

  const{ products, currency, cartItems,updateQuantity , navigate } = useContext(ShopContext);
  const [cartData,setCartData] = useState([]);
  const hasItems = cartData.length > 0;
  useEffect(()=>{
    if (products.length > 0) {
      const tempData = [];
      for(const items in cartItems){
        for(const item in cartItems[items]){
          if (cartItems[items][item] > 0) {
            tempData.push({
              _id: items,
              size: item,
              quantity: cartItems[items][item]
          })
        }
      }
    }
    setCartData(tempData);
    }
    
  },[cartItems,products])
return (
    <div className='border-t pt-14'>
      <Seo
        title="Your Cart | Voltique Hub"
        description="Review the battery chargers, stabilizers, inverters and accessories in your Voltique Hub cart, then proceed to fast, secure checkout with cash on delivery available."
        path="/cart"
      />
      <h1 className='sr-only'>Your Cart</h1>
      <div className='text-2xl mb-3'>
        <Title text1={'YOUR'} text2={'CART'} />
      </div>
      {!hasItems && (
        <div className='flex flex-col items-center justify-center gap-4 py-20 text-center'>
          <p className='text-lg font-medium text-gray-700'>Your cart is empty</p>
          <p className='text-sm text-gray-400'>Looks like you haven't added anything to your cart yet.</p>
          <button onClick={() => navigate('/collections')} className='mt-2 bg-primary hover:bg-primary-dark text-white text-sm px-8 py-3 rounded-lg transition-colors'>CONTINUE SHOPPING</button>
        </div>
      )}
      {hasItems && (
      <div>
        {
          cartData.map((item, index) => {
            const productData = products.find((product) => product._id ===item._id);

            return (
              <div key={index} className='py-4 border-t border-b text-gray-700'>
                <div className='flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6'>
                  <div className='flex items-start gap-4 sm:gap-6 flex-1 min-w-0'>
                    <img className='w-16 sm:w-20 h-auto object-contain rounded-lg border border-slate-200 bg-white flex-shrink-0' src={productData.image[0]} alt={productData.name} loading="lazy" />
                    <div className='min-w-0'>
                      <p className='text-sm sm:text-lg font-medium break-words'>{productData.name}</p>
                      <div className='flex items-center gap-4 mt-2 flex-wrap'>
                        <p>{currency} {productData.price}</p>
                        <p className='px-2 sm:px-3 sm:py-1 border border-slate-200 bg-slate-50 text-xs'><span className='text-slate-400'>Options: </span>{item.size}</p>
                      </div>
                    </div>
                  </div>
                  <div className='flex items-center justify-between sm:justify-end gap-4 sm:gap-8'>
                    <div className='flex items-center gap-2'>
                      <button onClick={()=>updateQuantity(item._id,item.size,item.quantity-1)} className='w-9 h-9 flex items-center justify-center border border-slate-300 rounded-lg bg-slate-50 text-lg font-medium hover:border-primary transition-colors'>-</button>
                      <span className='w-10 text-center font-semibold'>{item.quantity}</span>
                      <button onClick={()=>updateQuantity(item._id,item.size,item.quantity+1)} className='w-9 h-9 flex items-center justify-center border border-slate-300 rounded-lg bg-slate-50 text-lg font-medium hover:border-primary transition-colors'>+</button>
                    </div>
                    <img onClick={()=>updateQuantity(item._id,item.size,0)} className='w-5 cursor-pointer opacity-70 hover:opacity-100 transition-opacity' src={assets.bin_icon} alt="" />
                  </div>
                </div>
              </div>
            );
          })
        }
      </div>
      )}
      {hasItems && (
      <div className='flex justify-end mt-8'>
        <div className='w-full sm:w-[450px]'>
          <CartTotal/>
          <div className='w-full text-end'>
            <button onClick={() => navigate('/placeOrder')} className='bg-primary hover:bg-primary-dark text-white text-sm my-8 px-8 py-3 rounded-lg transition-colors w-full sm:w-auto'>PROCEED TO CHECKOUT</button>

          </div>
        </div>
      </div>
      )}
    </div>
  )
}
export default Cart
