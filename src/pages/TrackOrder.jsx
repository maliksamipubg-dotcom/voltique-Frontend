import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ShopContext } from '../contexts/ShopContext'
import Title from '../Components/Title';
import Seo from '../Components/Seo';
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
      <div className='border-t pt-16 min-h-[50vh] flex flex-col gap-4' aria-busy='true' aria-live='polite'>
        <div className='card p-5 sm:p-6 flex flex-col gap-4'>
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
            <div className='skeleton h-10'></div><div className='skeleton h-10'></div><div className='skeleton h-10'></div>
          </div>
          <div className='skeleton h-2.5 w-full'></div>
          <div className='skeleton h-24 w-full'></div>
        </div>
        <p className='text-ink-3 text-sm'>Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className='border-t pt-16 min-h-[50vh] card flex flex-col items-center justify-center gap-4 text-center px-6'>
        <p className='text-lg font-semibold text-white'>Order not found</p>
        <p className='text-sm text-ink-3'>We couldn't find an order with ID <b className='text-ink-2'>{orderId}</b>.</p>
        <button onClick={() => navigate('/orders')} className='btn-primary mt-2'>VIEW MY ORDERS</button>
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
      <Seo title="Track Order | Voltique Hub" description="Track the delivery status of your Voltique Hub order." path={`/track/${orderId}`} robots="noindex, follow" />
      <h1 className='sr-only'>Track Order</h1>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6'>
        <div className='text-2xl'>
          <Title text1={'TRACK'} text2={'ORDER'} />
        </div>
        <div className='flex items-center gap-3 text-sm text-ink-3'>
          {!cancelled && currentStep < STEPS.length - 1 && (
            <span className='flex items-center gap-1.5 text-xs text-ink-3'>
              <span className='w-1.5 h-1.5 rounded-full bg-success animate-pulse'></span>
              Auto-refreshing every 15s
              {lastRefresh && <span>· updated {new Date(lastRefresh).toLocaleTimeString()}</span>}
            </span>
          )}
          <span>Order ID: <span className='font-semibold text-white'>{order.orderId}</span></span>
        </div>
      </div>

      <div className='flex flex-col lg:flex-row gap-6'>
        <div className='flex-1 min-w-0'>
          <div className='card p-5 sm:p-6'>
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm mb-6'>
              <div>
                <p className='text-ink-3'>Order Date</p>
                <p className='font-medium text-white mt-0.5'>{new Date(order.date).toDateString()}</p>
              </div>
              <div>
                <p className='text-ink-3'>Estimated Delivery</p>
                <p className='font-medium text-white mt-0.5'>{new Date(order.estimatedDelivery).toDateString()}</p>
              </div>
              <div>
                <p className='text-ink-3'>Last Updated</p>
                <p className='font-medium text-white mt-0.5'>{new Date(lastUpdated).toDateString()}</p>
              </div>
              {cancelled && order.cancelledAt && (
                <div>
                  <p className='text-danger-light'>Cancelled On</p>
                  <p className='font-medium text-danger-light mt-0.5'>{new Date(order.cancelledAt).toLocaleString()}</p>
                </div>
              )}
            </div>

            <div className='flex flex-col sm:flex-row sm:items-center gap-3 mb-8'>
              <p className='text-sm text-ink-3 shrink-0'>Current Status:</p>
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${cancelled ? 'bg-danger/20 text-danger-light' : 'bg-success/20 text-success-light'}`}>
                {order.status}
              </span>
            </div>

            <div className='mb-8'>
              <div className='flex justify-between text-xs text-ink-3 mb-1.5'>
                <span>{cancelled ? 'Order Cancelled' : 'Order Progress'}</span>
                {!cancelled && <span>{Math.round(progress)}%</span>}
              </div>
              <div className='h-2.5 bg-surface-2 rounded-full overflow-hidden'>
                <div className={`h-full rounded-full transition-all duration-700 ease-swift             ${cancelled ? 'bg-danger' : 'bg-gradient-to-r from-success to-success-deep'}`} style={{ width: progress + '%' }}></div>
              </div>
            </div>

            {cancelled ? (
              <div className='bg-danger/10 border border-danger/40 rounded-xl p-4 text-sm text-danger-light'>
                <p>This order has been cancelled. Please contact support for further assistance.</p>
                {order.cancelledAt && (
                  <p className='mt-1.5 text-danger-light'>Cancelled by {order.cancelledBy || 'Customer'} on {new Date(order.cancelledAt).toLocaleString()}</p>
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
                          <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${reached ? 'bg-success border-success' : 'bg-navy border-line-strong'}`}></div>
                          {index < STEPS.length - 1 && (
                            <div className={`w-0.5 h-full min-h-8 md:hidden ${reached ? 'bg-success' : 'bg-surface-3'}`}></div>
                          )}
                        </div>
                        <div className='min-w-0 md:px-2'>
                          <p className={`text-xs font-medium ${reached ? 'text-white' : 'text-ink-3'}`}>{step}</p>
                          <p className='text-[10px] text-ink-3 mt-0.5'>{reached && date ? new Date(date).toLocaleDateString() : ''}</p>
                        </div>
                      </div>
                      {index < STEPS.length - 1 && (
                        <div className={`hidden md:block absolute top-2 left-[calc(50%+8px)] right-[calc(-50%+8px)] h-0.5 ${reached ? 'bg-success' : 'bg-surface-3'}`}></div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className='w-full lg:w-80 shrink-0'>
          <div className='card p-5'>
            <p className='text-sm font-semibold text-white mb-4'>ITEMS IN ORDER</p>
            <div className='flex flex-col gap-4'>
              {order.items.map((item, index) => (
                <div key={index} className='flex items-center gap-3'>
                  <div className='w-14 shrink-0 rounded-xl border border-line bg-gradient-to-b from-surface-2 to-surface-3 p-1'><img className='w-full h-auto object-contain' src={item.image?.[0]} alt="" loading="lazy" /></div>
                  <div className='min-w-0 flex-1'>
                    <p className='text-sm font-medium text-white break-words'>{item.name}</p>
                    <p className='text-xs text-ink-3 mt-0.5'>Model: {item.size} | Qty: {item.quantity}</p>
                  </div>
                  <p className='text-sm font-semibold text-white shrink-0'>{currency} {item.price * item.quantity}</p>
                </div>
              ))}
            </div>
            <hr className='my-4 border-line' />
            <div className='flex justify-between text-sm'>
              <span className='text-ink-3'>Total Amount</span>
              <span className='font-semibold text-white'>{currency} {order.amount}</span>
            </div>
            <button onClick={() => navigate('/orders')} className='mt-5 w-full border border-line-strong hover:border-primary text-ink-2 hover:text-primary text-sm px-4 py-2.5 rounded-lg transition-colors'>
              VIEW ALL ORDERS
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrackOrder
