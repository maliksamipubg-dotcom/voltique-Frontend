import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../contexts/ShopContext'
import Title from '../Components/Title';
import { assets } from '../assets/assets';
import CartTotal from '../Components/CartTotal';
import Seo from '../Components/Seo';
import { Link } from 'react-router-dom';

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
    <div className='border-t pt-10 sm:pt-14'>
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
        <div className='card flex flex-col items-center justify-center gap-4 py-20 px-6 text-center'>
          <div className='w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/[0.08] to-accent/[0.08] flex items-center justify-center'>
            <img src={assets.cart_icon} className='w-9 opacity-60' alt="" />
          </div>
          <p className='text-lg font-semibold text-gray-800'>Your cart is empty</p>
          <p className='text-sm text-gray-400'>Looks like you haven't added anything to your cart yet.</p>
          <Link to='/collections' className='btn-primary mt-2'>CONTINUE SHOPPING</Link>
        </div>
      )}
      {hasItems && (
      <div className='card divide-y divide-slate-100 overflow-hidden'>
        {
          cartData.map((item, index) => {
            const productData = products.find((product) => product._id ===item._id);

            return (
              <div key={index} className='p-4 sm:p-5 text-gray-700 transition-colors duration-300 hover:bg-primary/[0.02]'>
                <div className='flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6'>
                  <div className='flex items-start gap-4 sm:gap-6 flex-1 min-w-0'>
                    <div className='w-16 sm:w-20 shrink-0 rounded-xl border border-slate-200 bg-gradient-to-b from-mist to-white p-1'>
                      <img className='w-full h-auto object-contain' src={productData.image[0]} alt={productData.name} loading="lazy" />
                    </div>
                    <div className='min-w-0'>
                      <p className='text-sm sm:text-lg font-medium break-words text-gray-800'>{productData.name}</p>
                      <div className='flex items-center gap-3 mt-2 flex-wrap'>
                        <p className='font-bold text-primary-dark'>{currency} {productData.price}</p>
                        <p className='px-2.5 py-1 border border-slate-200 bg-mist text-xs rounded-lg'><span className='text-slate-400'>Options: </span>{item.size}</p>
                      </div>
                    </div>
                  </div>
                  <div className='flex items-center justify-between sm:justify-end gap-4 sm:gap-8'>
                    <div className='flex items-center gap-2'>
                      <button onClick={()=>updateQuantity(item._id,item.size,item.quantity-1)} aria-label='Decrease quantity' className='w-9 h-9 flex items-center justify-center border border-slate-300 rounded-xl bg-white text-lg font-medium hover:border-primary hover:text-primary active:scale-95 transition-all duration-300'>-</button>
                      <span className='w-10 text-center font-semibold'>{item.quantity}</span>
                      <button onClick={()=>updateQuantity(item._id,item.size,item.quantity+1)} aria-label='Increase quantity' className='w-9 h-9 flex items-center justify-center border border-slate-300 rounded-xl bg-white text-lg font-medium hover:border-primary hover:text-primary active:scale-95 transition-all duration-300'>+</button>
                    </div>
                    <button onClick={()=>updateQuantity(item._id,item.size,0)} aria-label={`Remove ${productData.name} from cart`} className='w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-600 active:scale-95 transition-all duration-300'>
                      <img className='w-5' src={assets.bin_icon} alt="" />
                    </button>
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
            <button onClick={() => navigate('/placeOrder')} className='btn-primary my-8 w-full sm:w-auto'>PROCEED TO CHECKOUT</button>

          </div>
        </div>
      </div>
      )}
    </div>
  )
}
export default Cart
