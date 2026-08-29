import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../contexts/ShopContext'
import Title from '../Components/Title';
import Seo from '../Components/Seo';
import axios from 'axios';
import { toast } from 'react-toastify';

const Orders = () => {
  const {backendUrl, token, currency, navigate, addToCart, user} = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [myReviews, setMyReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingReview, setDeletingReview] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const loadOrderData = async () => {
    try {
      if (!token) {
        return null 
      }
      const response = await axios.post( backendUrl + '/api/order/userorders',{},{headers:{ token }})
      if(response.data.success){
        setOrders(response.data.orders)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const loadMyReviews = async () => {
    try {
      if (!token || !user) return
      const response = await axios.post(backendUrl + '/api/review/my-reviews', { userId: user._id }, { headers: { token } })
      if (response.data.success) {
        setMyReviews(response.data.reviews)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    loadOrderData()
    loadMyReviews()
  },[token, user])

  const findReviewForItem = (item, order) => {
    return myReviews.find(r => r.productId === item._id && r.orderId === order.orderId) || null
  }

  const deleteReview = async (review, item) => {
    if (!window.confirm('Are you sure you want to delete your review?')) return
    setDeletingReview(review.reviewId)
    try {
      const response = await axios.post(backendUrl + '/api/review/delete', { userId: user._id, reviewId: review.reviewId }, { headers: { token } })
      if (response.data.success) {
        toast.success(response.data.message)
        setMyReviews(prev => prev.filter(r => r.reviewId !== review.reviewId))
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } finally {
      setDeletingReview(null)
    }
  }

  const writeReview = (item) => {
    navigate('/product/' + item._id + '?review=1')
  }

  const statusStyle = (status) => {
    if (status === 'Delivered') return 'bg-green-100 text-green-700';
    if (status === 'Cancelled') return 'bg-red-100 text-red-700';
    return 'bg-blue-100 text-blue-700';
  };

  const buyAgain = (item) => {
    addToCart(item._id, item.size);
    toast.success('Added to cart');
    navigate('/cart');
  };

  const isCancellable = (status) => ['Order Placed', 'Order Confirmed', 'Processing'].includes(status);

  const cancelStatusMessage = (status) => {
    switch (status) {
      case 'Packed': return 'This order has already been packed and can no longer be cancelled.';
      case 'Shipped': return 'This order has already been shipped and cannot be cancelled.';
      case 'Delivered': return 'This order has already been delivered.';
      case 'Cancelled': return 'This order has already been cancelled.';
      default: return null;
    }
  };

  const confirmCancel = async () => {
    if (!cancelTarget) return
    setCancelling(true)
    try {
      const response = await axios.post(backendUrl + '/api/order/cancel', { userId: user._id, orderId: cancelTarget._id }, { headers: { token } })
      if (response.data.success) {
        toast.success(response.data.message)
        setOrders(prev => prev.map(o => o._id === cancelTarget._id ? response.data.order : o))
        setCancelTarget(null)
      } else {
        toast.error(response.data.message)
        setCancelTarget(null)
        loadOrderData()
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } finally {
      setCancelling(false)
    }
  };

  return (
    <div className='border-t pt-16'>
      <Seo title="My Orders | Voltique Hub" description="Track and manage your Voltique Hub orders." path="/orders" robots="noindex, follow" />
      <h1 className='sr-only'>My Orders</h1>
      <div className='text-2xl mb-6'>
        <Title text1={'MY'} text2={'ORDERS'}/>
      </div>

      {loading ? (
        <div className='min-h-[40vh] flex items-center justify-center'>
          <div className='w-8 h-8 border-4 border-slate-200 border-t-primary rounded-full animate-spin'></div>
        </div>
      ) : orders.length === 0 ? (
        <div className='min-h-[40vh] flex flex-col items-center justify-center gap-4 text-center'>
          <p className='text-lg font-medium text-gray-700'>No orders yet</p>
          <p className='text-sm text-gray-400'>When you place an order, it will appear here.</p>
          <button onClick={() => navigate('/collections')} className='mt-2 bg-primary hover:bg-primary-dark text-white text-sm px-8 py-3 rounded-lg transition-colors'>START SHOPPING</button>
        </div>
      ) : (
        <div className='flex flex-col gap-5'>
          {
            orders.map((order,index)=>(
              <div key={order._id || index} className='bg-white border border-slate-200 rounded-2xl shadow-card overflow-hidden'>
                <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 bg-slate-50 border-b border-slate-200'>
                  <div className='flex flex-wrap items-center gap-x-4 gap-y-1 text-sm'>
                    <p className='font-medium text-gray-800'>Order ID: <span className='text-gray-500'>{order.orderId}</span></p>
                    <p className='text-gray-500'>Date: <span className='text-gray-700'>{new Date(order.date).toDateString()}</span></p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full self-start sm:self-auto ${statusStyle(order.status)}`}>{order.status}</span>
                </div>

                <div className='px-5 py-4 flex flex-col gap-4'>
                  {order.items.map((item, i) => {
                    const review = findReviewForItem(item, order);
                    const delivered = order.status === 'Delivered';
                    return (
                      <div key={i} className='flex flex-col sm:flex-row sm:items-center gap-3'>
                        <img className='w-14 h-auto object-contain rounded-lg border border-slate-200 bg-white flex-shrink-0' src={item.image?.[0]} alt="" loading="lazy" />
                        <div className='flex-1 min-w-0'>
                          <p className='text-sm font-medium text-gray-800 break-words'>{item.name}</p>
                          <p className='text-xs text-gray-400 mt-0.5'>Model: {item.size} | Qty: {item.quantity}</p>
                          {delivered && (
                            <p className={`text-[11px] font-semibold mt-1 ${review ? 'text-green-600' : 'text-slate-400'}`}>
                              {review ? '✓ You reviewed this product' : 'Order delivered — share your experience!'}
                            </p>
                          )}
                        </div>
                        <p className='text-sm font-semibold text-gray-800 shrink-0'>{currency} {item.price} <span className='text-gray-400 font-normal'>x {item.quantity}</span></p>
                        <div className='flex items-center gap-2 shrink-0 flex-wrap'>
                          <button onClick={() => navigate('/product/' + item._id)} className='text-xs text-gray-500 hover:text-primary transition-colors'>View</button>
                          {delivered && (
                            review ? (
                              <>
                                <button onClick={() => writeReview(item)} className='text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1.5 rounded-lg hover:bg-amber-100 transition-colors'>⭐ Edit Review</button>
                                <button onClick={() => deleteReview(review, item)} disabled={deletingReview === review.reviewId} className='text-xs font-semibold bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50'>🗑 Delete Review</button>
                              </>
                            ) : (
                              <>
                                <button onClick={() => writeReview(item)} className='text-xs font-semibold bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primary-dark transition-colors'>⭐ Write Review</button>
                                <button onClick={() => buyAgain(item)} className='text-xs font-semibold bg-slate-100 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-slate-200 transition-colors'>Buy Again</button>
                              </>
                            )
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className='px-5 py-4 border-t border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4'>
                  <div className='flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-gray-600'>
                    <p>Total: <span className='font-semibold text-gray-800'>{currency} {order.amount}</span></p>
                    <p>Payment: <span className='text-gray-500'>{order.paymentMethod}</span></p>
                  </div>
                  <div className='flex flex-wrap gap-3'>
                    <button onClick={() => navigate('/track/' + order.orderId)} className='border border-slate-300 hover:border-primary text-gray-700 hover:text-primary text-xs sm:text-sm px-4 py-2.5 rounded-lg transition-colors font-medium'>View Details</button>
                    <button onClick={() => navigate('/track/' + order.orderId)} className='bg-primary hover:bg-primary-dark text-white text-xs sm:text-sm px-4 py-2.5 rounded-lg transition-colors font-medium'>Track Order</button>
                    {isCancellable(order.status) && (
                      <button onClick={() => setCancelTarget(order)} className='border border-red-200 hover:border-red-400 bg-red-50 hover:bg-red-100 text-red-600 text-xs sm:text-sm px-4 py-2.5 rounded-lg transition-colors font-medium'>Cancel Order</button>
                    )}
                  </div>
                </div>
                {cancelStatusMessage(order.status) && (
                  <div className='px-5 py-3 bg-red-50/60 border-t border-red-100'>
                    <p className='text-xs text-red-600'>{cancelStatusMessage(order.status)}</p>
                  </div>
                )}
              </div>
            ))
          }
        </div>
      )}

      {cancelTarget && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50' onClick={() => setCancelTarget(null)}>
          <div className='bg-white rounded-2xl max-w-sm w-full shadow-xl p-6' onClick={(e) => e.stopPropagation()}>
            <div className='w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4'>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className='text-red-600'>
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <h3 className='text-center font-semibold text-gray-900'>Cancel Order</h3>
            <p className='text-sm text-gray-500 text-center mt-2'>Are you sure you want to cancel this order? This action cannot be undone.</p>
            <p className='text-xs text-gray-400 text-center mt-1'>Order #{cancelTarget.orderId}</p>
            <div className='flex gap-3 mt-6'>
              <button onClick={() => setCancelTarget(null)} disabled={cancelling} className='flex-1 py-2.5 text-sm font-semibold border border-slate-300 text-gray-600 rounded-lg hover:border-primary hover:text-primary transition-colors disabled:opacity-50'>No, Keep Order</button>
              <button onClick={confirmCancel} disabled={cancelling} className='flex-1 py-2.5 text-sm font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50'>
                {cancelling ? 'CANCELLING...' : 'Yes, Cancel Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Orders
