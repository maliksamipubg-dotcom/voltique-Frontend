import React, { useContext, useEffect, useRef, useState } from 'react'
import Title from '../Components/Title'
import CartTotal from '../Components/CartTotal'
import Seo from '../Components/Seo'
import { ShopContext } from '../contexts/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const baseInputClass = 'w-full border rounded-lg py-2.5 px-4 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 transition'

const isValidName = (value) => {
  const v = value.trim();
  if (!v) return 'Please enter your full name.';
  if (v.length < 3) return 'Name must be at least 3 characters.';
  if (!/^[A-Za-z ]+$/.test(v)) return 'Name can only contain letters and spaces.';
  return '';
}

const isValidPhone = (value) => {
  const cleaned = value.replace(/[\s-]/g, '');
  return /^03\d{9}$/.test(cleaned) || /^\+923\d{8}$/.test(cleaned) || /^923\d{8}$/.test(cleaned);
}

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

const isValidAddress = (value) => {
  const v = value.trim();
  if (v.length < 10) return false;
  if (!/[A-Za-z]/.test(v)) return false;
  if (!v.includes(' ')) return false;
  if (/^(test|abc|xyz|asdf|qwerty|n\/a|none)(\s+(test|abc|xyz|asdf|qwerty|n\/a|none))*$/i.test(v)) return false;
  return true;
}

const isValidCity = (value) => /^[A-Za-z]{3,}$/.test(value.trim());

const isValidPostal = (value) => {
  if (!value.trim()) return true;
  return /^\d{4,6}$/.test(value.trim());
}

const PlaceOrder = () => {
  const [method,setMethod] = useState('COD');
  const [placing, setPlacing] = useState(false);
  const {navigate,backendUrl,token,cartItems,setCartItems,getCartAmount,delivery_fee,products} = useContext(ShopContext);

  useEffect(()=>{
    window.scrollTo(0, 0);
    if (!token) {
      sessionStorage.setItem('redirectAfterLogin', '/placeOrder');
      navigate('/login')
    }
  },[token, navigate])

  const autoFilledRef = useRef(false);
  const loadLatestOrderDetails = async () => {
    if (!token || autoFilledRef.current) return;
    try {
      const response = await axios.post(backendUrl + '/api/order/userorders',{}, { headers:{ token }})
      if (response.data.success && Array.isArray(response.data.orders) && response.data.orders.length > 0) {
        const latest = response.data.orders[0];
        const addr = latest.address || {};
        if (autoFilledRef.current) return;
        autoFilledRef.current = true;
        setFormData(prev => ({
          ...prev,
          fullName: [addr.firstName, addr.lastName].filter(Boolean).join(' '),
          phone: addr.phone || '',
          email: addr.email || '',
          street: addr.street || '',
          city: addr.city || '',
          state: addr.state || '',
          zipcode: addr.zipcode || '',
          country: addr.country || 'Pakistan'
        }));
      }
    } catch (error) {
      console.log(error)
    }
  };

  useEffect(()=>{
    if (token) {
      loadLatestOrderDetails()
    }
  },[token])
  const [formData,setFormData] = useState({
    fullName:'',
    phone:'',
    email:'',
    street:'',
    city:'',
    state:'',
    zipcode:'',
    country:'Pakistan',
    notes:''
  })
  const [touched,setTouched] = useState({})
  const [errors,setErrors] = useState({})

  const getFieldError = (field, value) => {
    switch (field) {
      case 'fullName': return isValidName(value);
      case 'phone': {
        const v = value.trim();
        if (!v) return 'Please enter a valid Pakistani mobile number.';
        if (!isValidPhone(v)) return 'Please enter a valid Pakistani mobile number.';
        return '';
      }
      case 'email': {
        const v = value.trim();
        if (!v) return 'Please enter a valid email address.';
        if (!isValidEmail(v)) return 'Please enter a valid email address.';
        return '';
      }
      case 'street': {
        const v = value.trim();
        if (!v) return 'Please enter a complete delivery address.';
        if (!isValidAddress(v)) return 'Please enter a complete delivery address.';
        return '';
      }
      case 'city': {
        const v = value.trim();
        if (!v) return 'Please enter a valid city name.';
        if (!isValidCity(v)) return 'Please enter a valid city name.';
        return '';
      }
      case 'zipcode': {
        const v = value.trim();
        if (!v) return '';
        if (!isValidPostal(v)) return 'Postal code must be between 4 and 6 digits.';
        return '';
      }
      case 'country': {
        const v = value.trim();
        if (!v) return 'Please enter a valid country.';
        return '';
      }
      default: return '';
    }
  }

  const onChangeHandler = (event)=>{
    const name = event.target.name
    const value = event.target.value
    autoFilledRef.current = true
    setFormData(data => ({...data,[name]:value}))
    if (touched[name]) {
      setErrors(e => ({...e, [name]: getFieldError(name, value)}))
    }
  }
  const onBlurHandler = (event)=>{
    const name = event.target.name
    setTouched(t => ({...t, [name]: true}))
    setErrors(e => ({...e, [name]: getFieldError(name, event.target.value)}))
  }

  const inputClass = (field) => {
    const isError = errors[field];
    const isValid = touched[field] && !isError;
    return `${baseInputClass} ${isError ? 'border-red-500 focus:ring-red-500/20' : isValid ? 'border-green-500 focus:ring-green-500/20' : 'border-gray-300 focus:ring-blue-500/30 focus:border-primary'}`
  }

  const renderFieldError = (field) => errors[field] ? <p className='text-xs text-red-600'>{errors[field]}</p> : null;

  const hasCartItems = () => {
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0) return true;
      }
    }
    return false;
  }

  const isFormValid = () => {
    const mustFill = ['fullName','phone','email','street','city','country'];
    const optional = ['zipcode'];
    return mustFill.every((field) => {
      const err = getFieldError(field, formData[field]);
      if (err) return false;
      return formData[field].trim().length > 0;
    }) && optional.every((field) => !getFieldError(field, formData[field]));
  }

  const focusFirstError = () => {
    const mustFill = ['fullName','phone','email','street','city','country'];
    for (const field of mustFill) {
      const err = getFieldError(field, formData[field]);
      if (err || !formData[field].trim()) {
        const el = document.getElementById('field-' + field);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.focus({ preventScroll: true });
        }
        return;
      }
    }
    const optional = ['zipcode'];
    for (const field of optional) {
      if (getFieldError(field, formData[field])) {
        const el = document.getElementById('field-' + field);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.focus({ preventScroll: true });
        }
        return;
      }
    }
  }

  const onSubmitHandler = async (event)=>{
    event.preventDefault()
    if (placing) return;
    if (!hasCartItems()) {
      toast.error('Your cart is empty. Please add products first.')
      navigate('/cart')
      return
    }
    const newErrors = {}
    let hasError = false
    for (const field of ['fullName','phone','email','street','city','zipcode','country']) {
      const err = getFieldError(field, formData[field])
      if (err) hasError = true
      newErrors[field] = err
    }
    setErrors(newErrors)
    setTouched({ fullName:true, phone:true, email:true, street:true, city:true, zipcode:true, country:true })
    if (hasError) {
      focusFirstError()
      return
    }
    setPlacing(true)
    try {
      let orderItems = []
      for(const items in cartItems){
        for(const item in cartItems[items]){
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(products.find(product => product._id === items))
            if (itemInfo) {
              itemInfo.size = item
              itemInfo.quantity =cartItems[items][item]
              orderItems.push(itemInfo)
            }
          }
        }
      }
      const nameParts = formData.fullName.trim().split(/\s+/)
      const address = {
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' '),
        email: formData.email,
        street: formData.street,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        zipcode: formData.zipcode,
        phone: formData.phone,
        notes: formData.notes
      }
      let orderData = {
        address: address,
        items: orderItems,
        amount: getCartAmount() + delivery_fee
      }
      switch(method){
        //Api calls for cod
        case 'COD': {
          const response = await axios.post(backendUrl + '/api/order/place',orderData,{headers:{token}})
          if (response.data.success) {
            const orderId = response.data.order?.orderId;
            setCartItems({})
            if (orderId) {
              toast.success(`Order placed successfully! Your Order ID: ${orderId}`)
              navigate(`/track/${orderId}`)
            } else {
              navigate('/orders')
            }
          }else{
            toast.error(response.data.message)
          }
          break;
        }
        default:
          break;
        }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } finally {
      setPlacing(false)
    }
  }

  const cartHasItems = hasCartItems();

  return (
    <form onSubmit={onSubmitHandler} noValidate className='flex flex-col lg:flex-row justify-between gap-8 pt-5 sm:pt-14 min-h-[80vh] border-t'>
      <Seo title="Checkout | Voltique Hub" description="Secure checkout for battery chargers, stabilizers and inverters from Voltique Hub." path="/placeOrder" robots="noindex, follow" />
      <h1 className='sr-only'>Checkout</h1>
      <div className='flex flex-col gap-5 w-full lg:max-w-[540px]'>
        {/*Left Side */}
        <div className='text-xl sm:text-2xl'>
          <Title text1={'DELIVERY'} text2={'INFORMATION'} />
        </div>
        <div className='flex flex-col gap-2'>
          <label className='text-sm font-medium text-gray-700'>Full Name</label>
          <input required onChange={onChangeHandler} onBlur={onBlurHandler} id='field-fullName' name='fullName' value={formData.fullName} className={inputClass('fullName')} type="text" placeholder='Enter your full name' />
          {renderFieldError('fullName')}
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div className='flex flex-col gap-2'>
            <label className='text-sm font-medium text-gray-700'>Phone Number</label>
            <input required onChange={onChangeHandler} onBlur={onBlurHandler} id='field-phone' name='phone' value={formData.phone} className={inputClass('phone')} type="tel" placeholder='03XX-XXXXXXX' />
            {renderFieldError('phone')}
          </div>
          <div className='flex flex-col gap-2'>
            <label className='text-sm font-medium text-gray-700'>Email Address</label>
            <input required onChange={onChangeHandler} onBlur={onBlurHandler} id='field-email' name='email' value={formData.email} className={inputClass('email')} type="email" placeholder='your@email.com' />
            {renderFieldError('email')}
          </div>
        </div>
        <div className='flex flex-col gap-2'>
          <label className='text-sm font-medium text-gray-700'>Complete Address</label>
          <input required onChange={onChangeHandler} onBlur={onBlurHandler} id='field-street' name='street' value={formData.street} className={inputClass('street')} type="text" placeholder='House #, Street, Area' />
          {renderFieldError('street')}
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div className='flex flex-col gap-2'>
            <label className='text-sm font-medium text-gray-700'>City</label>
            <input required onChange={onChangeHandler} onBlur={onBlurHandler} id='field-city' name='city' value={formData.city} className={inputClass('city')} type="text" placeholder='City' />
            {renderFieldError('city')}
          </div>
          <div className='flex flex-col gap-2'>
            <label className='text-sm font-medium text-gray-700'>State <span className='text-gray-400 font-normal'>(Optional)</span></label>
            <input onChange={onChangeHandler} name='state' value={formData.state} className={baseInputClass + ' border-gray-300 focus:ring-blue-500/30 focus:border-primary'} type="text" placeholder='Province / State' />
          </div>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div className='flex flex-col gap-2'>
            <label className='text-sm font-medium text-gray-700'>Postal Code <span className='text-gray-400 font-normal'>(Optional)</span></label>
            <input onChange={onChangeHandler} onBlur={onBlurHandler} id='field-zipcode' name='zipcode' value={formData.zipcode} className={inputClass('zipcode')} type="text" placeholder='Postal Code' />
            {renderFieldError('zipcode')}
          </div>
          <div className='flex flex-col gap-2'>
            <label className='text-sm font-medium text-gray-700'>Country</label>
            <input required onChange={onChangeHandler} onBlur={onBlurHandler} id='field-country' name='country' value={formData.country} className={inputClass('country')} type="text" placeholder='Country' />
            {renderFieldError('country')}
          </div>
        </div>
        <div className='flex flex-col gap-2'>
          <label className='text-sm font-medium text-gray-700'>Order Notes <span className='text-gray-400 font-normal'>(Optional)</span></label>
          <textarea onChange={onChangeHandler} name='notes' value={formData.notes} rows={3} className={baseInputClass + ' border-gray-300 focus:ring-blue-500/30 focus:border-primary resize-none'} placeholder='Any special instructions for your order'></textarea>
        </div>
      </div>
      {/*Right Side */}
      <div className='mt-2 lg:mt-8 w-full lg:w-auto min-w-0'>
        <div className='mt-8 w-full sm:min-w-80'>
          <CartTotal/>
        </div>
        <div className='mt-12'>
          <Title text1={'PAYMENT'} text2={'METHOD'}/>
          {/*Payment Method Selection */}
          <div className='flex gap-3 flex-col lg:flex-row'>
            <div onClick={()=>setMethod('COD')} className='flex items-center gap-3 border-2 border-green-500 bg-green-50 p-3 px-4 rounded-lg cursor-pointer flex-wrap'>
              <p className={`min-w-3.5 h-3.5 border-2 border-green-500 rounded-full ${method === 'COD' ? 'bg-green-500' : ''}`}></p>
              <p className='text-gray-700 text-sm font-semibold mx-2 sm:mx-4'>CASH ON DELIVERY</p>
              <span className='text-[10px] font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full uppercase tracking-wide'>Only Method</span>
            </div>
          </div>
          <div className='w-full text-end mt-8'>
            <button
              type='submit'
              disabled={!cartHasItems || !isFormValid() || placing}
              className='bg-primary hover:bg-primary-dark disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-8 sm:px-16 py-3 text-sm rounded-lg transition-colors w-full sm:w-auto'
            >
              {placing ? 'PLACING ORDER...' : 'PLACE ORDER'}
            </button>
          </div>
        </div>

      </div>
    </form>
  )
}
export default PlaceOrder
