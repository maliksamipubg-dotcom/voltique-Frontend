import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../contexts/ShopContext'
import Title from '../Components/Title';
import Seo from '../Components/Seo';
import axios from 'axios';
import { toast } from 'react-toastify';

const isValidPhone = (phone) => {
  if (!phone) return true;
  const cleaned = phone.replace(/[\s-]/g, '');
  return /^03\d{9}$/.test(cleaned) || /^\+923\d{8}$/.test(cleaned) || /^923\d{8}$/.test(cleaned);
};

const getInitials = (name) => {
  if (!name) return 'U';
  return name.trim().split(/\s+/).map(w => w[0]).slice(0,2).join('').toUpperCase();
};

const MyReviews = () => {
  const { backendUrl, token, user } = useContext(ShopContext);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const loadReviews = async () => {
    try {
      const response = await axios.post(backendUrl + '/api/review/my-reviews', { userId: user._id }, { headers: { token } });
      if (response.data.success) {
        setReviews(response.data.reviews);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user._id) loadReviews();
  }, [user]);

  const startEdit = (review) => {
    setEditingId(review.reviewId);
    setEditRating(review.rating);
    setEditTitle(review.title || '');
    setEditDescription(review.description || '');
  };

  const saveEdit = async (reviewId) => {
    if (!editDescription.trim()) {
      toast.error('Please write a review');
      return;
    }
    setSaving(true);
    try {
      const response = await axios.post(backendUrl + '/api/review/update', {
        userId: user._id,
        reviewId,
        rating: editRating,
        title: editTitle,
        description: editDescription
      }, { headers: { token } });
      if (response.data.success) {
        toast.success(response.data.message);
        setEditingId(null);
        loadReviews();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      const response = await axios.post(backendUrl + '/api/review/delete', { userId: user._id, reviewId }, { headers: { token } });
      if (response.data.success) {
        toast.success(response.data.message);
        loadReviews();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  if (loading) {
    return <div className='card p-5 flex flex-col gap-3' aria-busy='true' aria-live='polite'><div className='skeleton w-12 h-12 rounded-xl'></div><div className='skeleton h-4 w-2/3'></div><div className='skeleton h-3.5 w-full'></div><div className='skeleton h-3.5 w-3/4'></div><span className='sr-only'>Loading your reviews�</span></div>;
  }

  return (
    <div className='mt-8'>
      <p className='text-sm font-semibold text-white mb-4'>MY REVIEWS</p>
      {reviews.length === 0 ? (
        <div className='card p-8 text-center bg-gradient-to-b from-surface-2 to-surface-3'>
          <p className='text-3xl mb-2'>💬</p>
          <p className='text-sm text-ink-3'>You haven't written any reviews yet.</p>
          <p className='text-xs text-ink-3 mt-1'>You can review products after your order has been delivered.</p>
        </div>
      ) : (
        <div className='flex flex-col gap-4'>
          {reviews.map((review) => (
            <div key={review.reviewId} className='card p-5 transition-shadow duration-500 ease-swift hover:shadow-card-hover'>
              <div className='flex items-start justify-between gap-3 flex-wrap'>
                <div className='flex items-center gap-3 min-w-0'>
                  {review.productImage && <img src={review.productImage} alt="" className='w-12 h-auto object-contain rounded-xl border border-line bg-surface-2 shrink-0' />}
                  <div className='min-w-0'>
                    <p className='font-semibold text-white text-sm break-words'>{review.productName}</p>
                    <div className='flex items-center gap-2 mt-1'>
                      <span className='flex items-center gap-0.5'>
                        {[1,2,3,4,5].map((star) => (
                          <span key={star} className={`text-sm leading-none ${star <= review.rating ? 'text-amber-400' : 'text-ink-4'}`}>★</span>
                        ))}
                      </span>
                      <span className='text-xs text-ink-3'>{new Date(review.date).toLocaleDateString()}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${review.status === 'Approved' ? 'bg-success/20 text-success-light' : 'bg-amber-400/15 text-amber-300'}`}>
                        {review.status === 'Approved' ? 'Live on product page' : 'Hidden by admin'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className='flex gap-2 shrink-0'>
                  <button onClick={() => startEdit(review)} className='chip text-xs py-1.5 px-3'>Edit</button>
                  <button onClick={() => deleteReview(review.reviewId)} className='chip text-xs py-1.5 px-3 text-danger-light border-danger/40 bg-danger/10 hover:bg-danger/20'>Delete</button>
                </div>
              </div>

              {editingId === review.reviewId ? (
                <div className='mt-4 border-t border-line pt-4 flex flex-col gap-3'>
                  <div className='flex items-center gap-1'>
                    <span className='text-sm text-ink-3 mr-2'>Rating:</span>
                    {[1,2,3,4,5].map((star) => (
                      <button key={star} type='button' onClick={() => setEditRating(star)} className={`text-2xl leading-none transition-transform hover:scale-110 ${star <= editRating ? 'text-amber-400' : 'text-ink-4'}`}>★</button>
                    ))}
                  </div>
                  <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} maxLength={60} placeholder='Review title (optional)' className='field' />
                  <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} maxLength={500} rows={3} placeholder='Your review...' className='field resize-none' />
                  <div className='flex gap-3'>
                    <button onClick={() => saveEdit(review.reviewId)} disabled={saving} className='btn-primary btn-sm disabled:opacity-50'>SAVE</button>
                    <button onClick={() => setEditingId(null)} className='btn btn-sm border border-line-strong text-ink-2 hover:border-primary hover:text-primary'>CANCEL</button>
                  </div>
                </div>
              ) : (
                <>
                  {review.title && <p className='font-semibold text-white mt-3 text-sm'>“{review.title}”</p>}
                  <p className='text-sm text-ink-2 mt-1 leading-relaxed'>{review.description}</p>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Profile = () => {
  const { backendUrl, token, user, setUser, navigate } = useContext(ShopContext);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [orderCount, setOrderCount] = useState(0);
  const [createdAt, setCreatedAt] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const loadProfile = async () => {
    try {
      const response = await axios.post(backendUrl + '/api/user/profile', {}, { headers: { token } });
      if (response.data.success) {
        const profile = response.data.user;
        setUser(profile);
        setName(profile.name || '');
        setPhone(profile.phone || '');
        setEmail(profile.email || '');
        setCreatedAt(profile.createdAt);
        setOrderCount(response.data.orderCount || 0);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!token) {
      sessionStorage.setItem('redirectAfterLogin', '/profile');
      navigate('/login');
      return;
    }
    loadProfile();
  }, [token]);

  const validateName = (value) => {
    if (!value.trim()) return 'Please enter your full name.';
    if (value.trim().length < 3) return 'Name must be at least 3 characters.';
    if (!/^[A-Za-z ]+$/.test(value.trim())) return 'Name can only contain letters and spaces.';
    return '';
  };

  const validatePhone = (value) => {
    if (!value) return '';
    if (!isValidPhone(value)) return 'Please enter a valid Pakistani mobile number.';
    return '';
  };

  const onBlur = (field) => {
    setTouched(t => ({ ...t, [field]: true }));
    let err = '';
    if (field === 'name') err = validateName(name);
    if (field === 'phone') err = validatePhone(phone);
    setErrors(e => ({ ...e, [field]: err }));
  };

  const onChange = (field, value) => {
    if (field === 'name') setName(value);
    if (field === 'phone') setPhone(value);
    if (touched[field]) {
      const err = field === 'name' ? validateName(value) : validatePhone(value);
      setErrors(e => ({ ...e, [field]: err }));
    }
  };

  const resetForm = () => {
    setName(user?.name || '');
    setPhone(user?.phone || '');
    setTouched({});
    setErrors({});
  };

  const handleSave = async () => {
    const nameErr = validateName(name);
    const phoneErr = validatePhone(phone);
    setTouched({ name: true, phone: true });
    setErrors({ name: nameErr, phone: phoneErr });
    if (nameErr || phoneErr) return;

    setSaving(true);
    try {
      const response = await axios.post(backendUrl + '/api/user/update-profile', { name: name.trim(), phone: phone.replace(/[\s-]/g, '') }, { headers: { token } });
      if (response.data.success) {
        setUser(response.data.user);
        toast.success('Profile updated successfully.');
        setTouched({});
        setErrors({});
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const avatarBg = 'bg-gradient-to-br from-primary to-accent';

  return (
    <div className='border-t pt-14 max-w-3xl mx-auto'>
      <Seo title="My Profile | Voltique Hub" description="Manage your Voltique Hub account and profile details." path="/profile" robots="noindex, follow" />
      <h1 className='sr-only'>My Profile</h1>
      <div className='text-2xl mb-6'>
        <Title text1={'MY'} text2={'PROFILE'} />
      </div>

      {loading ? (
        <div className='flex flex-col gap-6' aria-busy='true' aria-live='polite'>
          <div className='skeleton w-full md:w-72 h-72 rounded-2xl self-center md:self-start'></div>
          <div className='card p-6 flex flex-col gap-4'>
            <div className='skeleton h-4 w-40'></div>
            <div className='skeleton h-11 w-full'></div>
            <div className='skeleton h-11 w-full'></div>
            <div className='skeleton h-11 w-full'></div>
            <div className='skeleton h-11 w-40 mt-2'></div>
          </div>
          <span className='sr-only'>Loading your profile…</span>
        </div>
      ) : (
        <>
        <div className='flex flex-col md:flex-row gap-6'>
          <div className='w-full md:w-72 shrink-0'>
            <div className='card relative overflow-hidden p-6 flex flex-col items-center text-center'>
              <span className='absolute -top-14 -right-14 w-40 h-40 orb orb-blue opacity-40 animate-drift'></span>
              <div className='relative flex flex-col items-center w-full'>
                {user?.photoURL ? (
                  <img src={user.photoURL} alt='Profile' className='w-24 h-24 rounded-full object-cover ring-4 ring-primary/50 shadow-card-hover' />
                ) : (
                  <div className={`w-24 h-24 rounded-full ${avatarBg} text-white flex items-center justify-center text-3xl font-bold heading-font shadow-card-hover`}>
                    {getInitials(name)}
                  </div>
                )}
                <p className='mt-4 text-lg font-semibold text-white break-words'>{user?.name}</p>
                <p className='text-sm text-ink-3 break-all'>{user?.email}</p>
                <div className='w-full border-t border-line mt-5 pt-4 flex flex-col gap-3 text-sm'>
                  <div className='flex justify-between'>
                    <span className='text-ink-3'>Account Created</span>
                    <span className='font-medium text-ink-2'>{createdAt ? new Date(createdAt).toDateString() : '—'}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-ink-3'>Total Orders</span>
                    <span className='font-medium text-ink-2'>{orderCount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='flex-1 min-w-0'>
            <div className='card p-6'>
              <p className='text-sm font-semibold text-white mb-5'>ACCOUNT INFORMATION</p>              <div className='flex flex-col gap-4'>
                <div className='flex flex-col gap-1.5'>
                  <label className='text-sm font-medium text-ink-2'>Full Name</label>
                  <input
                    value={name}
                    onChange={(e)=>onChange('name', e.target.value)}
                    onBlur={()=>onBlur('name')}
                    type="text"
                    placeholder='Enter your full name'
                    className={`w-full border rounded-xl py-3 px-4 text-sm text-white placeholder-ink-4 outline-none transition-all duration-200 focus:ring-4 ${errors.name ? 'border-danger focus:ring-red-500/15 bg-danger/10' : touched.name && !errors.name ? 'border-success focus:ring-green-500/15 bg-success/10' : 'border-line-strong focus:ring-primary/25 focus:border-primary'}`}
                  />
                  {errors.name && <p className='text-xs text-danger-light animate-rise-sm'>{errors.name}</p>}
                </div>

                <div className='flex flex-col gap-1.5'>
                  <label className='text-sm font-medium text-ink-2'>Phone Number <span className='text-ink-3 font-normal'>(Optional)</span></label>
                  <input
                    value={phone}
                    onChange={(e)=>onChange('phone', e.target.value)}
                    onBlur={()=>onBlur('phone')}
                    type="tel"
                    placeholder='03XX-XXXXXXX'
                    className={`w-full border rounded-xl py-3 px-4 text-sm text-white placeholder-ink-4 outline-none transition-all duration-200 focus:ring-4 ${errors.phone ? 'border-danger focus:ring-red-500/15 bg-danger/10' : touched.phone && !errors.phone ? 'border-success focus:ring-green-500/15 bg-success/10' : 'border-line-strong focus:ring-primary/25 focus:border-primary'}`}
                  />
                  {errors.phone && <p className='text-xs text-danger-light animate-rise-sm'>{errors.phone}</p>}
                </div>

                <div className='flex flex-col gap-1.5'>
                  <label className='text-sm font-medium text-ink-2'>Email Address</label>
                  <input
                    value={email}
                    readOnly
                    type="email"
                    className='w-full border border-line bg-surface-2 text-ink-3 rounded-xl py-3 px-4 text-sm cursor-not-allowed'
                  />
                  <p className='text-xs text-ink-3'>Email address cannot be changed.</p>
                </div>
              </div>

              <div className='flex flex-col sm:flex-row gap-3 mt-6'>
                <button onClick={handleSave} disabled={saving} className='btn-primary disabled:opacity-50 disabled:pointer-events-none'>
                  {saving ? 'SAVING...' : 'SAVE CHANGES'}
                </button>
                <button onClick={resetForm} disabled={saving} className='btn-outline disabled:opacity-50 disabled:pointer-events-none'>
                  CANCEL
                </button>
              </div>
            </div>
          </div>
        </div>

        <MyReviews />
        </>
      )}
    </div>
  )
}

export default Profile
