import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../contexts/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import GoogleButton from '../Components/GoogleButton';
import Seo from '../Components/Seo';

const Login = () => {

  const [currentState, setCurrentState] = useState('Login');
  const { token, setToken, navigate, backendUrl, addToCart, updateQuantity, googleLogin } = useContext(ShopContext)

  const [name,setName] = useState('')
  const [password,setPassword] = useState('')
  const [email,setEmail] = useState('')
  const [googleLoading,setGoogleLoading] = useState(false)

  const onSubmitHandler = async(event) =>{
    event.preventDefault();
    try {
      if (currentState === 'Sign Up') {
        const response = await axios.post(backendUrl + '/api/user/register', {name,email,password})
        if (response.data.success) {
          setToken(response.data.token)
          localStorage.setItem('token', response.data.token)
        }else{
          toast.error(response.data.message)
        }
      }else{
        const response = await axios.post(backendUrl + '/api/user/login',{email,password})
        if (response.data.success) {
          setToken(response.data.token)
          localStorage.setItem('token', response.data.token)
        }else{
          toast.error(response.data.message)
        }
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const onGoogleSignIn = async () => {
    if (googleLoading) return;
    setGoogleLoading(true);
    try {
      await googleLogin();
    } finally {
      setGoogleLoading(false);
    }
  }

  useEffect(()=>{
    if (token) {
      const storeOrder = sessionStorage.getItem('storeOrderProduct');
      sessionStorage.removeItem('storeOrderProduct');
      if (storeOrder) {
        (async () => {
          try {
            const {productId, size, quantity} = JSON.parse(storeOrder);
            await addToCart(productId, size);
            if (quantity > 1) {
              await updateQuantity(productId, size, quantity);
            }
            navigate('/placeOrder');
          } catch (error) {
            console.log(error);
            navigate('/');
          }
        })();
        return;
      }
      const redirect = sessionStorage.getItem('redirectAfterLogin');
      sessionStorage.removeItem('redirectAfterLogin');
      navigate(redirect || '/')
    }
  },[token])

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-dark via-primary-dark to-sky-700'>
      <Seo
        title="Login | Voltique Hub"
        description="Log in or create your Voltique Hub account to manage your cart, track orders and enjoy faster, secure checkout."
        path="/login"
      />
      <h1 className='sr-only'>Login to Voltique Hub</h1>
      <form 
        onSubmit={onSubmitHandler} 
        className='flex flex-col items-center w-[90%] sm:max-w-md m-auto gap-5 p-8 rounded-2xl backdrop-blur-lg bg-white/10 shadow-2xl border border-white/20'
      >
        <div className='inline-flex flex-col items-center gap-2 mb-4'>
          <p className='text-3xl font-extrabold text-white drop-shadow-lg heading-font'>{currentState}</p>
          <hr className='border-none h-[2px] w-12 bg-gradient-to-r from-blue-400 to-sky-400' />
        </div>
        {currentState === 'Login' 
          ? '' 
          : <input 
              onChange={(e)=>setName(e.target.value)} 
              value={name} 
              type="text" 
              placeholder='Name' 
              required   
              className='w-full px-4 py-2 rounded-lg bg-white/90 text-gray-800 border border-gray-200 focus:ring-2 focus:ring-blue-400 outline-none'
            />
        }
        <input 
          onChange={(e)=>setEmail(e.target.value)} 
          value={email} 
          type="email" 
          placeholder='Email' 
          required   
          className='w-full px-4 py-2 rounded-lg bg-white/90 text-gray-800 border border-gray-200 focus:ring-2 focus:ring-blue-400 outline-none'
        />
        <input 
          onChange={(e)=>setPassword(e.target.value)} 
          value={password} 
          type="password" 
          placeholder='Password' 
          required   
          className='w-full px-4 py-2 rounded-lg bg-white/90 text-gray-800 border border-gray-200 focus:ring-2 focus:ring-sky-400 outline-none'
        />
        <div className='w-full flex justify-between gap-x-2 gap-y-1 flex-wrap text-sm text-white/90 mt-[-6px]'>
          <p className='cursor-pointer hover:underline'>Forgot your password?</p>
          {
            currentState === 'Login' 
            ? <p onClick={()=>setCurrentState('Sign Up')} className='cursor-pointer hover:underline'>Create account</p>
            : <p onClick={()=>setCurrentState('Login')} className='cursor-pointer hover:underline'>Login Here</p>
          }
        </div>
        <button 
          className='w-full bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white font-semibold px-6 py-3 mt-4 rounded-lg shadow-md hover:scale-105 transition-transform duration-300'
        >
          {currentState === 'Login' ? 'Sign In' : 'Sign Up'}
        </button>
        <div className='flex items-center gap-3 w-full mt-4'>
          <hr className='flex-1 border-white/20' />
          <p className='text-xs text-white/70'>OR</p>
          <hr className='flex-1 border-white/20' />
        </div>
        <GoogleButton onClick={onGoogleSignIn} loading={googleLoading} />
        <p className='text-xs text-white/80 mt-4'>© {new Date().getFullYear()} Voltique Hub - All rights reserved.</p>
      </form>
    </div>
  )
}

export default Login
