import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ShopContext } from '../contexts/ShopContext'
import Title from '../Components/Title';
import axios from 'axios';

const STEPS = ['Order Placed','Order Confirmed','Processing','Packed','Shipped','Out for Delivery','Delivered'];

const normalizeStatus = (status) => {
  const map = {
    'Confirmed': 'Order Confirmed',
    'Packing': 'Processing',
    'Out for delivery': 'Out for Delivery',
  };
  return map[status] || status;
}

const getStepIndex = (status) => {
  const normalized = normalizeStatus(status);
  const index = STEPS.indexOf(normalized);
  return index >= 0 ? index : -1;
}

const TrackOrder = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(null);
  const orderRef = React.useRef(null);
  const setOrderBoth = (next) => {
    orderRef.current = next;
    setOrder(next);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [orderId]);

  useEffect(() => {
    if (!token) {
      sessionStorage.setItem('redirectAfterLogin', '/track/' + orderId);
      navigate('/login');
      return;
    }
    const loadOrder = async () => {
      try {
        const response = await axios.post(backendUrl + '/api/order/track', { orderId }, { headers: { token } });
        if (response.data.success) {
          setOrderBoth(response.data.order);
        } else {
          setOrderBoth(null);
        }
      } catch (error) {
        console.log(error);
        setOrderBoth(null);
      } finally {
        setLoading(false);
      }
    };
    loadOrder();
    const isFinal = (ord) => ord && ['Delivered', 'Cancelled'].includes(normalizeStatus(ord.status));
    const poll = setInterval(async () => {
      if (isFinal(orderRef.current)) {
        clearInterval(poll);
        return;
      }
      try {
        const response = await axios.post(backendUrl + '/api/order/track', { orderId }, { headers: { token } });
        if (response.data.success) {
          const next = response.data.order;
          const prev = orderRef.current;
          if (prev && prev.status === next.status && prev.statusUpdates && next.statusUpdates && prev.statusUpdates.length === next.statusUpdates.length) {
            setLastRefresh(Date.now());
            return;
          }
          setOrderBoth(next);
        }
      } catch (error) {
        console.log(error);
      }
    }, 15000);
    return () => clearInterval(poll);
  }, [orderId, token, backendUrl, navigate]);

  if (loading) {
    return (
      <div className='border-t pt-16 min-h-[50vh] flex items-center justify-center'>
        <p className='text-gray-400 text-sm'>Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className='border-t pt-16 min-h-[50vh] flex flex-col items-center justify-center gap-4 text-center'>
        <p className='text-lg font-medium text-gray-700'>Order not found</p>
        <p className='text-sm text-gray-400'>We couldn't find an order with ID <b>{orderId}</b>.</p>
        <button onClick={() => navigate('/orders')} className='mt-2 bg-primary hover:bg-primary-dark text-white text-sm px-8 py-3 rounded-lg transition-colors'>VIEW MY ORDERS</button>
      </div>
    );
  }

  const currentStep = getStepIndex(order.status);
  const cancelled = normalizeStatus(order.status) === 'Cancelled';
  const progress = cancelled ? 100 : Math.max(0, Math.min(100, (currentStep / (STEPS.length - 1)) * 100));

  const statusDates = {};
  (order.statusUpdates || []).forEach((update) => {
    const key = normalizeStatus(update.status);
    if (!statusDates[key]) {
      statusDates[key] = update.date;
    }
  });

  const lastUpdated = (order.statusUpdates && order.statusUpdates.length > 0)
    ? order.statusUpdates[order.statusUpdates.length - 1].date
    : order.date;

  return (
    <div className='border-t pt-16'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6'>
        <div className='text-2xl'>
          <Title text1={'TRACK'} text2={'ORDER'} />
        </div>
        <div className='flex items-center gap-3 text-sm text-gray-500'>
          {!cancelled && currentStep < STEPS.length - 1 && (
            <span className='flex items-center gap-1.5 text-xs text-gray-400'>
              <span className='w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse'></span>
              Auto-refreshing every 15s
              {lastRefresh && <span>· updated {new Date(lastRefresh).toLocaleTimeString()}</span>}
            </span>
          )}
          <span>Order ID: <span className='font-semibold text-gray-800'>{order.orderId}</span></span>
        </div>
      </div>

      <div className='flex flex-col lg:flex-row gap-6'>
        <div className='flex-1 min-w-0'>
          <div className='border border-slate-200 bg-white rounded-xl p-5 sm:p-6'>
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm mb-6'>
              <div>
                <p className='text-gray-400'>Order Date</p>
                <p className='font-medium text-gray-800 mt-0.5'>{new Date(order.date).toDateString()}</p>
              </div>
              <div>
                <p className='text-gray-400'>Estimated Delivery</p>
                <p className='font-medium text-gray-800 mt-0.5'>{new Date(order.estimatedDelivery).toDateString()}</p>
              </div>
              <div>
                <p className='text-gray-400'>Last Updated</p>
                <p className='font-medium text-gray-800 mt-0.5'>{new Date(lastUpdated).toDateString()}</p>
              </div>
              {cancelled && order.cancelledAt && (
                <div>
                  <p className='text-red-500'>Cancelled On</p>
                  <p className='font-medium text-red-600 mt-0.5'>{new Date(order.cancelledAt).toLocaleString()}</p>
                </div>
              )}
            </div>

            <div className='flex flex-col sm:flex-row sm:items-center gap-3 mb-8'>
              <p className='text-sm text-gray-500 shrink-0'>Current Status:</p>
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${cancelled ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {order.status}
              </span>
            </div>

            <div className='mb-8'>
              <div className='flex justify-between text-xs text-gray-400 mb-1.5'>
                <span>{cancelled ? 'Order Cancelled' : 'Order Progress'}</span>
                {!cancelled && <span>{Math.round(progress)}%</span>}
              </div>
              <div className='h-2 bg-slate-100 rounded-full overflow-hidden'>
                <div className={`h-full rounded-full transition-all duration-500 ${cancelled ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: progress + '%' }}></div>
              </div>
            </div>

            {cancelled ? (
              <div className='bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700'>
                <p>This order has been cancelled. Please contact support for further assistance.</p>
                {order.cancelledAt && (
                  <p className='mt-1.5 text-red-600'>Cancelled by {order.cancelledBy || 'Customer'} on {new Date(order.cancelledAt).toLocaleString()}</p>
                )}
              </div>
            ) : (
              <div className='flex flex-col md:flex-row'>
                {STEPS.map((step, index) => {
                  const reached = index <= currentStep;
                  const date = statusDates[step];
                  return (
                    <div key={step} className={`relative flex-1 pb-6 md:pb-0 ${index < STEPS.length - 1 ? 'md:pb-0' : ''}`}>
                      <div className='flex items-start gap-3 md:flex-col md:items-center md:gap-2 md:text-center'>
                        <div className='flex flex-col items-center'>
                          <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${reached ? 'bg-green-500 border-green-500' : 'bg-white border-slate-300'}`}></div>
                          {index < STEPS.length - 1 && (
                            <div className={`w-0.5 h-full min-h-8 md:hidden ${reached ? 'bg-green-500' : 'bg-slate-200'}`}></div>
                          )}
                        </div>
                        <div className='min-w-0 md:px-2'>
                          <p className={`text-xs font-medium ${reached ? 'text-gray-800' : 'text-gray-400'}`}>{step}</p>
                          <p className='text-[10px] text-gray-400 mt-0.5'>{reached && date ? new Date(date).toLocaleDateString() : ''}</p>
                        </div>
                      </div>
                      {index < STEPS.length - 1 && (
                        <div className={`hidden md:block absolute top-2 left-[calc(50%+8px)] right-[calc(-50%+8px)] h-0.5 ${reached ? 'bg-green-500' : 'bg-slate-200'}`}></div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className='w-full lg:w-80 shrink-0'>
          <div className='border border-slate-200 bg-white rounded-xl p-5'>
            <p className='text-sm font-semibold text-gray-800 mb-4'>ITEMS IN ORDER</p>
            <div className='flex flex-col gap-4'>
              {order.items.map((item, index) => (
                <div key={index} className='flex items-center gap-3'>
                  <img className='w-14 h-auto object-contain rounded-lg border border-slate-200 bg-white flex-shrink-0' src={item.image?.[0]} alt="" loading="lazy" />
                  <div className='min-w-0 flex-1'>
                    <p className='text-sm font-medium text-gray-800 break-words'>{item.name}</p>
                    <p className='text-xs text-gray-400 mt-0.5'>Model: {item.size} | Qty: {item.quantity}</p>
                  </div>
                  <p className='text-sm font-semibold text-gray-800 shrink-0'>{currency}{item.price * item.quantity}</p>
                </div>
              ))}
            </div>
            <hr className='my-4' />
            <div className='flex justify-between text-sm'>
              <span className='text-gray-500'>Total Amount</span>
              <span className='font-semibold text-gray-800'>{currency} {order.amount}</span>
            </div>
            <button onClick={() => navigate('/orders')} className='mt-5 w-full border border-slate-300 hover:border-primary text-gray-700 hover:text-primary text-sm px-4 py-2.5 rounded-lg transition-colors'>
              VIEW ALL ORDERS
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrackOrder
