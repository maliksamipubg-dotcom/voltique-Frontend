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
    <div className='site-bleed min-h-screen relative overflow-hidden flex items-center justify-center bg-gradient-to-br from-navy via-navy-soft to-[#123a6b] py-14'>
      <div className='absolute -top-24 -left-24 w-96 h-96 orb orb-blue opacity-50 animate-drift'></div>
      <div className='absolute -bottom-32 -right-20 w-[30rem] h-[30rem] orb orb-cyan opacity-40 animate-drift' style={{ animationDelay: '-7s' }}></div>
      <Seo
        title="Login | Voltique Hub"
        description="Log in or create your Voltique Hub account to manage your cart, track orders and enjoy faster, secure checkout."
        path="/login"
      />
      <h1 className='sr-only'>Login to Voltique Hub</h1>
      <form 
        onSubmit={onSubmitHandler} 
        className='relative flex flex-col items-center w-[90%] sm:max-w-md m-auto gap-5 p-7 sm:p-8 rounded-3xl glass shadow-lift border border-line-strong animate-rise'
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
              className='field-dark'
            />
        }
        <input 
          onChange={(e)=>setEmail(e.target.value)} 
          value={email} 
          type="email" 
          placeholder='Email' 
          required   
          className='field-dark'
        />
        <input 
          onChange={(e)=>setPassword(e.target.value)} 
          value={password} 
          type="password" 
          placeholder='Password' 
          required   
          className='field-dark'
        />
        <div className='w-full flex justify-between gap-x-2 gap-y-1 flex-wrap text-sm text-ink-2 mt-[-6px]'>
          <p className='cursor-pointer hover:text-accent transition-colors duration-300'>Forgot your password?</p>
          {
            currentState === 'Login' 
            ? <p onClick={()=>setCurrentState('Sign Up')} className='cursor-pointer hover:text-accent transition-colors duration-300'>Create account</p>
            : <p onClick={()=>setCurrentState('Login')} className='cursor-pointer hover:text-accent transition-colors duration-300'>Login Here</p>
          }
        </div>
        <button 
          className='btn-primary w-full mt-4'
        >
          {currentState === 'Login' ? 'Sign In' : 'Sign Up'}
        </button>
        <div className='flex items-center gap-3 w-full mt-4'>
          <hr className='flex-1 border-line-strong' />
          <p className='text-xs text-ink-3'>OR</p>
          <hr className='flex-1 border-line-strong' />
        </div>
        <GoogleButton onClick={onGoogleSignIn} loading={googleLoading} />
        <p className='text-xs text-ink-3 mt-4'>© {new Date().getFullYear()} Voltique Hub - All rights reserved.</p>
      </form>
    </div>
  )
}

export default Login
