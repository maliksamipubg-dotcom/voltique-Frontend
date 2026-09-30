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
    if (status === 'Delivered') return 'bg-success/20 text-success-light';
    if (status === 'Cancelled') return 'bg-danger/20 text-danger-light';
    return 'bg-primary/20 text-blue-700';
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
        <div className='flex flex-col gap-5' aria-busy='true' aria-live='polite'>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className='card overflow-hidden'>
              <div className='px-5 py-4 bg-[#F5F9FF] border-b border-line flex items-center justify-between gap-3'>
                <div className='skeleton h-4 w-48'></div>
                <div className='skeleton h-6 w-24 rounded-full'></div>
              </div>
              <div className='px-5 py-4 flex flex-col gap-4'>
                {Array.from({ length: 2 }).map((__, j) => (
                  <div key={j} className='flex items-center gap-3'>
                    <div className='skeleton w-14 h-14 rounded-xl shrink-0'></div>
                    <div className='flex-1 flex flex-col gap-2'>
                      <div className='skeleton h-3.5 w-2/3'></div>
                      <div className='skeleton h-3 w-1/3'></div>
                    </div>
                    <div className='skeleton h-3.5 w-20 shrink-0'></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <span className='sr-only'>Loading your orders…</span>
        </div>
      ) : orders.length === 0 ? (
        <div className='card min-h-[40vh] flex flex-col items-center justify-center gap-4 text-center px-6'>
          <p className='text-lg font-semibold text-ink'>No orders yet</p>
          <p className='text-sm text-ink-3'>When you place an order, it will appear here.</p>
          <button onClick={() => navigate('/collections')} className='btn-primary mt-2'>START SHOPPING</button>
        </div>
      ) : (
        <div className='flex flex-col gap-5'>
          {
            orders.map((order,index)=>(
              <div key={order._id || index} className='card overflow-hidden transition-shadow duration-500 ease-swift hover:shadow-card-hover'>
                <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 bg-gradient-to-r from-primary/10 to-accent/8 border-b border-line'>
                  <div className='flex flex-wrap items-center gap-x-4 gap-y-1 text-sm'>
                    <p className='font-medium text-ink'>Order ID: <span className='text-ink-3'>{order.orderId}</span></p>
                    <p className='text-ink-3'>Date: <span className='text-ink-2'>{new Date(order.date).toDateString()}</span></p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full self-start sm:self-auto shadow-soft ${statusStyle(order.status)}`}>{order.status}</span>
                </div>

                <div className='px-5 py-4 flex flex-col gap-4'>
                  {order.items.map((item, i) => {
                    const review = findReviewForItem(item, order);
                    const delivered = order.status === 'Delivered';
                    return (
                      <div key={i} className='flex flex-col sm:flex-row sm:items-center gap-3'>
                        <div className='w-14 shrink-0 rounded-xl border border-line bg-gradient-to-b from-[#F7FBFF] to-[#EEF6FF] p-1'>
                          <img className='w-full h-auto object-contain' src={item.image?.[0]} alt="" loading="lazy" />
                        </div>
                        <div className='flex-1 min-w-0'>
                          <p className='text-sm font-medium text-ink break-words'>{item.name}</p>
                          <p className='text-xs text-ink-3 mt-0.5'>Model: {item.size} | Qty: {item.quantity}</p>
                          {delivered && (
                            <p className={`text-[11px] font-semibold mt-1 ${review ? 'text-success-light' : 'text-ink-3'}`}>
                              {review ? '✓ You reviewed this product' : 'Order delivered — share your experience!'}
                            </p>
                          )}
                        </div>
                        <p className='text-sm font-semibold text-ink shrink-0'>{currency} {item.price} <span className='text-ink-3 font-normal'>x {item.quantity}</span></p>
                        <div className='flex items-center gap-2 shrink-0 flex-wrap'>
                          <button onClick={() => navigate('/product/' + item._id)} className='chip text-xs py-1.5 px-3'>View</button>
                          {delivered && (
                            review ? (
                              <>
                                <button onClick={() => writeReview(item)} className='chip text-xs py-1.5 px-3 text-amber-300 border-amber-400/40 bg-amber-400/10 hover:bg-amber-400/15'>⭐ Edit Review</button>
                                <button onClick={() => deleteReview(review, item)} disabled={deletingReview === review.reviewId} className='chip text-xs py-1.5 px-3 text-danger-light border-danger/40 bg-danger/10 hover:bg-danger/20 disabled:opacity-50'>🗑 Delete Review</button>
                              </>
                            ) : (
                              <>
                                <button onClick={() => writeReview(item)} className='btn-primary btn-sm'>⭐ Write Review</button>
                                <button onClick={() => buyAgain(item)} className='chip text-xs py-1.5 px-3'>Buy Again</button>
                              </>
                            )
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className='px-5 py-4 border-t border-line bg-[#F8FBFF] flex flex-col md:flex-row md:items-center justify-between gap-4'>
                  <div className='flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-ink-2'>
                    <p>Total: <span className='font-semibold text-ink'>{currency} {order.amount}</span></p>
                    <p>Payment: <span className='text-ink-3'>{order.paymentMethod}</span></p>
                  </div>
                  <div className='flex flex-wrap gap-3'>
                    <button onClick={() => navigate('/track/' + order.orderId)} className='btn-outline btn-sm'>View Details</button>
                    <button onClick={() => navigate('/track/' + order.orderId)} className='btn-primary btn-sm'>Track Order</button>
                    {isCancellable(order.status) && (
                      <button onClick={() => setCancelTarget(order)} className='btn btn-sm border border-danger/40 bg-danger/10 text-danger-light hover:bg-danger/20 hover:border-danger/70'>Cancel Order</button>
                    )}
                  </div>
                </div>
                {cancelStatusMessage(order.status) && (
                  <div className='px-5 py-3 bg-danger/10 border-t border-danger/30'>
                    <p className='text-xs text-danger-light'>{cancelStatusMessage(order.status)}</p>
                  </div>
                )}
              </div>
            ))
          }
        </div>
      )}

      {cancelTarget && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm' onClick={() => setCancelTarget(null)}>
          <div className='bg-white border border-line rounded-2xl max-w-sm w-full shadow-lift p-6 animate-pop-in' onClick={(e) => e.stopPropagation()}>
            <div className='w-12 h-12 rounded-full bg-danger/10 flex items-center justify-center mx-auto mb-4'>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className='text-danger-light'>
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <h3 className='text-center font-semibold text-ink'>Cancel Order</h3>
            <p className='text-sm text-ink-3 text-center mt-2'>Are you sure you want to cancel this order? This action cannot be undone.</p>
            <p className='text-xs text-ink-3 text-center mt-1'>Order #{cancelTarget.orderId}</p>
            <div className='flex gap-3 mt-6'>
              <button onClick={() => setCancelTarget(null)} disabled={cancelling} className='btn btn-sm flex-1 border border-line-strong bg-white text-ink-2 hover:border-primary hover:text-primary disabled:opacity-50'>No, Keep Order</button>
              <button onClick={confirmCancel} disabled={cancelling} className='btn btn-sm flex-1 bg-danger text-white border-danger hover:bg-[#dc2626] shadow-none disabled:opacity-50'>
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
