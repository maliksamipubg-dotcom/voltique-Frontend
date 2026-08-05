import React, { useContext, useEffect, useRef, useState } from 'react'
import { ShopContext } from '../contexts/ShopContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const maskEmail = (email) => {
  if (!email) return ''
  const [name, domain] = email.split('@')
  if (!domain) return email
  const visible = name.slice(0, 3)
  return `${visible}${'*'.repeat(Math.max(2, name.length - 3))}@${domain}`
}

const Stars = ({ rating, size = 'text-base' }) => {
  return (
    <span className={`inline-flex gap-0.5 ${size}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= Math.round(rating) ? 'text-amber-500' : 'text-slate-300'}>★</span>
      ))}
    </span>
  )
}

const formatDate = (ts) => {
  const d = new Date(ts)
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

const ReviewForm = ({ productId, onSaved }) => {
  const { token, user, backendUrl, navigate } = useContext(ShopContext)
  const [loading, setLoading] = useState(true)
  const [eligible, setEligible] = useState(false)
  const [existingReview, setExistingReview] = useState(null)
  const [deliveredOrders, setDeliveredOrders] = useState([])
  const [rating, setRating] = useState(0)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [orderId, setOrderId] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const check = async () => {
      try {
        const response = await axios.post(backendUrl + '/api/review/eligibility', { userId: user._id, productId }, { headers: { token } })
        if (response.data.success) {
          setEligible(response.data.eligible)
          setExistingReview(response.data.review)
          const orders = response.data.deliveredOrders || []
          setDeliveredOrders(orders)
          if (orders.length > 0 && !response.data.review) {
            setOrderId(orders[0].orderId)
          }
          if (response.data.review) {
            setRating(response.data.review.rating)
            setTitle(response.data.review.title || '')
            setDescription(response.data.review.description || '')
          }
        } else {
          toast.error(response.data.message)
        }
      } catch (error) {
        console.log(error)
        toast.error(error.message)
      } finally {
        setLoading(false)
      }
    }
    if (user && user._id) check()
  }, [user, productId, token, backendUrl])

  const submit = async () => {
    if (!rating) {
      toast.error('Please select a rating')
      return
    }
    if (!description.trim()) {
      toast.error('Please write a review')
      return
    }
    if (!existingReview && !orderId) {
      toast.error('Please select the order for this product')
      return
    }
    setSubmitting(true)
    try {
      const response = await axios.post(backendUrl + '/api/review/add', {
        userId: user._id,
        productId,
        orderId: existingReview ? existingReview.orderId : orderId,
        rating,
        title,
        description
      }, { headers: { token } })
      if (response.data.success) {
        toast.success(response.data.message)
        onSaved()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  const updateReview = async () => {
    if (!rating) {
      toast.error('Please select a rating')
      return
    }
    if (!description.trim()) {
      toast.error('Please write a review')
      return
    }
    setSubmitting(true)
    try {
      const response = await axios.post(backendUrl + '/api/review/update', {
        userId: user._id,
        reviewId: existingReview.reviewId,
        rating,
        title,
        description
      }, { headers: { token } })
      if (response.data.success) {
        toast.success(response.data.message)
        onSaved()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  const deleteReview = async () => {
    if (!window.confirm('Are you sure you want to delete your review?')) return
    setSubmitting(true)
    try {
      const response = await axios.post(backendUrl + '/api/review/delete', {
        userId: user._id,
        reviewId: existingReview.reviewId
      }, { headers: { token } })
      if (response.data.success) {
        toast.success(response.data.message)
        onSaved()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className='flex items-center justify-center py-8'><div className='w-6 h-6 border-2 border-slate-200 border-t-primary rounded-full animate-spin'></div></div>
  }

  if (!token) {
    return (
      <div className='text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-300'>
        <p className='text-gray-600 text-sm'>Share your experience with this product.</p>
        <button onClick={() => { sessionStorage.setItem('redirectAfterLogin', window.location.pathname + window.location.search); navigate('/login') }} className='mt-3 px-6 py-2.5 bg-primary hover:bg-primary-dark text-white text-sm rounded-lg transition-colors'>Login to Write a Review</button>
      </div>
    )
  }

  if (!eligible) {
    return (
      <div className='text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-300'>
        <p className='text-gray-600 text-sm'>You can review this product after your order has been delivered.</p>
      </div>
    )
  }

  return (
    <div className='bg-white rounded-xl border border-slate-200 p-5'>
      <h4 className='font-semibold text-gray-800 mb-4'>{existingReview ? 'Edit Your Review' : 'Write a Review'}</h4>
      <div className='flex items-center gap-1 mb-4'>
        <span className='text-sm text-gray-500 mr-2'>Your rating:</span>
        {[1, 2, 3, 4, 5].map((star) => (
          <button key={star} type='button' data-review-star={star} onClick={() => setRating(star)} className={`text-2xl leading-none transition-transform hover:scale-110 ${star <= rating ? 'text-amber-500' : 'text-slate-300'}`}>★</button>
        ))}
      </div>

      {!existingReview && deliveredOrders.length > 1 && (
        <div className='mb-4'>
          <p className='text-sm text-gray-500 mb-1.5'>Order:</p>
          <select value={orderId} onChange={(e) => setOrderId(e.target.value)} className='w-full max-w-sm px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white outline-none focus:border-primary'>
            {deliveredOrders.map((o) => <option key={o._id} value={o.orderId}>Order {o.orderId} — {formatDate(o.date)}</option>)}
          </select>
        </div>
      )}

      <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={60} placeholder='Review title (optional)' className='w-full max-w-sm px-3 py-2 border border-slate-300 rounded-lg text-sm mb-3 outline-none focus:border-primary' />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} maxLength={500} rows={4} placeholder='Share your experience with this product...' className='w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-primary resize-none' />
      <p className='text-xs text-gray-400 mt-1'>{description.length}/500</p>
      <div className='flex gap-3 mt-3 flex-wrap'>
        <button onClick={existingReview ? updateReview : submit} disabled={submitting} className='px-6 py-2.5 bg-primary hover:bg-primary-dark text-white text-sm rounded-lg transition-colors disabled:opacity-50'>
          {submitting ? 'SUBMITTING...' : existingReview ? 'UPDATE REVIEW' : 'SUBMIT REVIEW'}
        </button>
        {existingReview && (
          <button onClick={deleteReview} disabled={submitting} className='px-6 py-2.5 border border-red-200 text-red-600 text-sm rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50'>
            DELETE
          </button>
        )}
      </div>
    </div>
  )
}

const ReviewSection = ({ productId, productName, autoOpen = false }) => {
  const { backendUrl, token, user, navigate } = useContext(ShopContext)
  const [reviews, setReviews] = useState([])
  const [avgRating, setAvgRating] = useState(0)
  const [totalReviews, setTotalReviews] = useState(0)
  const [distribution, setDistribution] = useState({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 })
  const [sort, setSort] = useState('recent')
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const reviewFormRef = useRef(null)
  const autoOpenHandled = useRef(false)
  const [eligibility, setEligibility] = useState(null)

  // Fetches whether the current user may review this product by reusing the
  // existing /api/review/eligibility endpoint (no backend changes).
  const loadEligibility = async () => {
    if (!token || !user) {
      setEligibility({ eligible: false, hasReviewed: false, review: null, deliveredOrders: [] })
      return
    }
    try {
      const response = await axios.post(backendUrl + '/api/review/eligibility', { userId: user._id, productId }, { headers: { token } })
      if (response.data.success) {
        setEligibility({
          eligible: response.data.eligible,
          hasReviewed: response.data.hasReviewed,
          review: response.data.review,
          deliveredOrders: response.data.deliveredOrders || []
        })
      } else {
        setEligibility({ eligible: false, hasReviewed: false, review: null, deliveredOrders: [] })
      }
    } catch (error) {
      console.log(error)
      setEligibility({ eligible: false, hasReviewed: false, review: null, deliveredOrders: [] })
    }
  }

  useEffect(() => {
    loadEligibility()
  }, [token, user, productId, backendUrl])

  // The "Write Review" button is only shown to customers who bought this
  // product (order Delivered) and have not reviewed it yet.
  const hasReviewed = Boolean(eligibility?.hasReviewed)
  const canReview = Boolean(eligibility?.eligible && !eligibility.hasReviewed)
  const myReview = eligibility?.review || null

  // Smoothly scroll the review form into view, clear of the sticky navbar.
  // `scroll-mt-24` on the form container handles the header offset.
  const scrollToReviewForm = () => {
    if (reviewFormRef.current) {
      reviewFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Focus the first interactive field (star rating) once the form is on screen.
  const focusReviewForm = () => {
    const firstStar = reviewFormRef.current?.querySelector('[data-review-star="1"]')
    if (firstStar) {
      firstStar.focus({ preventScroll: true })
      return
    }
    reviewFormRef.current?.querySelector('input, textarea, select')?.focus({ preventScroll: true })
  }

  // Arriving via the "Write Review" button (?review=1):
  // - eligible & not reviewed: open the form and scroll straight to it
  // - already reviewed: keep the form closed and show their existing review
  // - not eligible: leave everything closed
  useEffect(() => {
    if (!autoOpen || loading || eligibility === null || autoOpenHandled.current) return
    autoOpenHandled.current = true
    if (hasReviewed) {
      setShowForm(false)
      const myReviewEl = document.getElementById('my-review')
      const target = myReviewEl || document.getElementById('reviews-section')
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }
    if (canReview) {
      setShowForm(true)
      const t = setTimeout(() => {
        scrollToReviewForm()
        focusReviewForm()
      }, 200)
      return () => clearTimeout(t)
    }
  }, [autoOpen, loading, eligibility, hasReviewed, canReview])

  const fetchReviews = async () => {
    setLoading(true)
    try {
      const response = await axios.post(backendUrl + '/api/review/product', { productId, sort })
      if (response.data.success) {
        setReviews(response.data.reviews)
        setAvgRating(response.data.avgRating)
        setTotalReviews(response.data.totalReviews)
        setDistribution(response.data.distribution)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (productId) fetchReviews()
  }, [productId, sort])

  const markHelpful = async (review) => {
    if (!token) {
      sessionStorage.setItem('redirectAfterLogin', window.location.pathname)
      navigate('/login')
      return
    }
    try {
      const response = await axios.post(backendUrl + '/api/review/helpful', { userId: user._id, reviewId: review.reviewId }, { headers: { token } })
      if (response.data.success) {
        toast.success(response.data.message)
        fetchReviews()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const maxCount = Math.max(...Object.values(distribution), 1)

  return (
    <div id='reviews-section' className='mt-16 scroll-mt-24'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6'>
        <div>
          <h3 className='text-xl font-bold text-gray-900'>Customer Reviews</h3>
          <p className='text-sm text-gray-500 mt-1'>See what our customers say about this product.</p>
        </div>
        {canReview ? (
          <button onClick={() => setShowForm(prev => !prev)} className='px-6 py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-medium rounded-lg transition-colors w-fit'>
            {showForm ? 'Hide Review Form' : 'Write a Review'}
          </button>
        ) : myReview ? (
          <div className='w-full sm:w-auto bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-card'>
            <p className='text-[11px] font-semibold uppercase tracking-wide text-primary mb-1'>Your Review</p>
            <Stars rating={myReview.rating} size='text-sm' />
            {myReview.title && <p className='text-sm font-semibold text-gray-800 mt-1'>“{myReview.title}”</p>}
            <p className='text-xs text-gray-600 mt-1 leading-relaxed max-w-xs whitespace-pre-wrap'>{myReview.description}</p>
          </div>
        ) : null}
      </div>

      {totalReviews > 0 && (
        <div className='grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6 bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-8'>
          <div className='flex md:flex-col items-center md:items-start gap-4 md:gap-2'>
            <p className='text-5xl font-bold text-gray-900'>{avgRating.toFixed(1)}</p>
            <div>
              <div className='flex items-center gap-2'>
                <Stars rating={avgRating} />
                <span className='text-sm text-gray-500'>{totalReviews} review{totalReviews !== 1 ? 's' : ''}</span>
              </div>
              <p className='text-xs text-gray-400 mt-1'>based on verified customer reviews</p>
            </div>
          </div>
          <div className='flex flex-col gap-1.5'>
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className='flex items-center gap-3'>
                <span className='text-xs text-gray-600 w-8 text-right'>{star} ★</span>
                <div className='flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden'>
                  <div className='h-full bg-amber-500 rounded-full' style={{ width: `${(distribution[star] || 0) / maxCount * 100}%` }}></div>
                </div>
                <span className='text-xs text-gray-500 w-8'>{distribution[star] || 0}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {showForm && <div ref={reviewFormRef} id='review-form' className='mb-8 scroll-mt-24'><ReviewForm productId={productId} onSaved={() => { setShowForm(false); fetchReviews(); loadEligibility() }} /></div>}

      {totalReviews > 0 && (
        <div className='flex items-center justify-between gap-3 flex-wrap mb-4'>
          <p className='text-sm font-semibold text-gray-700'>{totalReviews} review{totalReviews !== 1 ? 's' : ''}</p>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className='px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white text-gray-700 outline-none focus:border-primary'>
            <option value="recent">Most Recent</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>
      )}

      {loading ? (
        <div className='flex items-center justify-center py-10'><div className='w-8 h-8 border-2 border-slate-200 border-t-primary rounded-full animate-spin'></div></div>
      ) : reviews.length === 0 ? (
        <div className='text-center py-12 bg-white border border-slate-200 rounded-2xl'>
          <p className='text-4xl mb-3'>💬</p>
          <p className='text-gray-600 text-sm'>No reviews yet. Be the first to review this product!</p>
        </div>
      ) : (
        <div className='flex flex-col gap-4'>
          {reviews.map((review) => (
            <div key={review.reviewId} id={user && review.customerEmail === user.email ? 'my-review' : undefined} className={`bg-white border border-slate-200 rounded-2xl p-5 ${user && review.customerEmail === user.email ? 'scroll-mt-24' : ''}`}>
              <div className='flex items-start justify-between gap-3 flex-wrap'>
                <div className='flex items-center gap-3 min-w-0'>
                  <div className='w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0'>
                    {(review.customerName || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div className='min-w-0'>
                    <div className='flex items-center gap-2 flex-wrap'>
                      <p className='font-semibold text-gray-800 text-sm'>{review.customerName || 'Customer'}</p>
                      {review.verified && (
                        <span className='flex items-center gap-1 text-[10px] font-semibold bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full'>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4L4.2 7.7l5.4-.8L12 2z"/></svg>
                          Verified Purchase
                        </span>
                      )}
                    </div>
                    <p className='text-xs text-gray-400 mt-0.5'>{maskEmail(review.customerEmail)} · {formatDate(review.date)}</p>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <Stars rating={review.rating} size='text-sm' />
                  {review.updatedDate && <span className='text-[10px] text-gray-400'>· Edited</span>}
                </div>
              </div>
              {review.title && <p className='font-semibold text-gray-800 mt-3'>“{review.title}”</p>}
              <p className='text-gray-600 text-sm leading-relaxed mt-1.5 whitespace-pre-wrap'>{review.description}</p>
              <div className='mt-3 pt-3 border-t border-slate-100 flex items-center justify-between'>
                <button onClick={() => markHelpful(review)} className='flex items-center gap-1.5 text-xs text-gray-500 hover:text-primary transition-colors'>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"/></svg>
                  Helpful ({review.helpful || 0})
                </button>
                <p className='text-xs text-gray-400'>Order {review.orderId}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ReviewSection
