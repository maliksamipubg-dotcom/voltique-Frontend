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
    return <div className='flex items-center justify-center py-8'><div className='w-6 h-6 border-2 border-slate-200 border-t-primary rounded-full animate-spin'></div></div>;
  }

  return (
    <div className='mt-8'>
      <p className='text-sm font-semibold text-gray-800 mb-4'>MY REVIEWS</p>
      {reviews.length === 0 ? (
        <div className='bg-white border border-slate-200 rounded-2xl p-8 text-center'>
          <p className='text-3xl mb-2'>💬</p>
          <p className='text-sm text-gray-500'>You haven't written any reviews yet.</p>
          <p className='text-xs text-gray-400 mt-1'>You can review products after your order has been delivered.</p>
        </div>
      ) : (
        <div className='flex flex-col gap-4'>
          {reviews.map((review) => (
            <div key={review.reviewId} className='bg-white border border-slate-200 rounded-2xl p-5'>
              <div className='flex items-start justify-between gap-3 flex-wrap'>
                <div className='flex items-center gap-3 min-w-0'>
                  {review.productImage && <img src={review.productImage} alt="" className='w-12 h-auto object-contain rounded-lg border border-slate-200 bg-white shrink-0' />}
                  <div className='min-w-0'>
                    <p className='font-semibold text-gray-800 text-sm break-words'>{review.productName}</p>
                    <div className='flex items-center gap-2 mt-1'>
                      <span className='flex items-center gap-0.5'>
                        {[1,2,3,4,5].map((star) => (
                          <span key={star} className={`text-sm leading-none ${star <= review.rating ? 'text-amber-500' : 'text-slate-300'}`}>★</span>
                        ))}
                      </span>
                      <span className='text-xs text-gray-400'>{new Date(review.date).toLocaleDateString()}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${review.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {review.status === 'Approved' ? 'Live on product page' : 'Hidden by admin'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className='flex gap-2 shrink-0'>
                  <button onClick={() => startEdit(review)} className='px-3 py-1.5 text-xs font-semibold bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors'>Edit</button>
                  <button onClick={() => deleteReview(review.reviewId)} className='px-3 py-1.5 text-xs font-semibold bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors'>Delete</button>
                </div>
              </div>

              {editingId === review.reviewId ? (
                <div className='mt-4 border-t border-slate-100 pt-4 flex flex-col gap-3'>
                  <div className='flex items-center gap-1'>
                    <span className='text-sm text-gray-500 mr-2'>Rating:</span>
                    {[1,2,3,4,5].map((star) => (
                      <button key={star} type='button' onClick={() => setEditRating(star)} className={`text-2xl leading-none transition-transform hover:scale-110 ${star <= editRating ? 'text-amber-500' : 'text-slate-300'}`}>★</button>
                    ))}
                  </div>
                  <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} maxLength={60} placeholder='Review title (optional)' className='px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-primary' />
                  <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} maxLength={500} rows={3} placeholder='Your review...' className='px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-primary resize-none' />
                  <div className='flex gap-3'>
                    <button onClick={() => saveEdit(review.reviewId)} disabled={saving} className='px-5 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50'>SAVE</button>
                    <button onClick={() => setEditingId(null)} className='px-5 py-2 border border-slate-300 text-gray-600 text-xs font-semibold rounded-lg hover:border-primary hover:text-primary transition-colors'>CANCEL</button>
                  </div>
                </div>
              ) : (
                <>
                  {review.title && <p className='font-semibold text-gray-800 mt-3 text-sm'>“{review.title}”</p>}
                  <p className='text-sm text-gray-600 mt-1 leading-relaxed'>{review.description}</p>
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
        <div className='min-h-[40vh] flex items-center justify-center'>
          <div className='w-8 h-8 border-4 border-slate-200 border-t-primary rounded-full animate-spin'></div>
        </div>
      ) : (
        <>
        <div className='flex flex-col md:flex-row gap-6'>
          <div className='w-full md:w-72 shrink-0'>
            <div className='bg-white border border-slate-200 rounded-2xl p-6 flex flex-col items-center text-center shadow-card'>
              {user?.photoURL ? (
                <img src={user.photoURL} alt='Profile' className='w-24 h-24 rounded-full object-cover shadow-card-hover' />
              ) : (
                <div className={`w-24 h-24 rounded-full ${avatarBg} text-white flex items-center justify-center text-3xl font-bold heading-font shadow-card-hover`}>
                  {getInitials(name)}
                </div>
              )}
              <p className='mt-4 text-lg font-semibold text-gray-800 break-words'>{user?.name}</p>
              <p className='text-sm text-gray-400 break-all'>{user?.email}</p>
              <div className='w-full border-t border-slate-100 mt-5 pt-4 flex flex-col gap-3 text-sm'>
                <div className='flex justify-between'>
                  <span className='text-gray-400'>Account Created</span>
                  <span className='font-medium text-gray-700'>{createdAt ? new Date(createdAt).toDateString() : '—'}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-400'>Total Orders</span>
                  <span className='font-medium text-gray-700'>{orderCount}</span>
                </div>
              </div>
            </div>
          </div>

          <div className='flex-1 min-w-0'>
            <div className='bg-white border border-slate-200 rounded-2xl p-6 shadow-card'>
              <p className='text-sm font-semibold text-gray-800 mb-5'>ACCOUNT INFORMATION</p>              <div className='flex flex-col gap-4'>
                <div className='flex flex-col gap-1.5'>
                  <label className='text-sm font-medium text-gray-700'>Full Name</label>
                  <input
                    value={name}
                    onChange={(e)=>onChange('name', e.target.value)}
                    onBlur={()=>onBlur('name')}
                    type="text"
                    placeholder='Enter your full name'
                    className={`w-full border rounded-lg py-2.5 px-4 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 transition ${errors.name ? 'border-red-500 focus:ring-red-500/20' : touched.name && !errors.name ? 'border-green-500 focus:ring-green-500/20' : 'border-gray-300 focus:ring-blue-500/30 focus:border-primary'}`}
                  />
                  {errors.name && <p className='text-xs text-red-600'>{errors.name}</p>}
                </div>

                <div className='flex flex-col gap-1.5'>
                  <label className='text-sm font-medium text-gray-700'>Phone Number <span className='text-gray-400 font-normal'>(Optional)</span></label>
                  <input
                    value={phone}
                    onChange={(e)=>onChange('phone', e.target.value)}
                    onBlur={()=>onBlur('phone')}
                    type="tel"
                    placeholder='03XX-XXXXXXX'
                    className={`w-full border rounded-lg py-2.5 px-4 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 transition ${errors.phone ? 'border-red-500 focus:ring-red-500/20' : touched.phone && !errors.phone ? 'border-green-500 focus:ring-green-500/20' : 'border-gray-300 focus:ring-blue-500/30 focus:border-primary'}`}
                  />
                  {errors.phone && <p className='text-xs text-red-600'>{errors.phone}</p>}
                </div>

                <div className='flex flex-col gap-1.5'>
                  <label className='text-sm font-medium text-gray-700'>Email Address</label>
                  <input
                    value={email}
                    readOnly
                    type="email"
                    className='w-full border border-gray-200 bg-slate-50 text-gray-500 rounded-lg py-2.5 px-4 text-sm cursor-not-allowed'
                  />
                  <p className='text-xs text-gray-400'>Email address cannot be changed.</p>
                </div>
              </div>

              <div className='flex flex-col sm:flex-row gap-3 mt-6'>
                <button onClick={handleSave} disabled={saving} className='bg-primary hover:bg-primary-dark text-white text-sm px-8 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed'>
                  {saving ? 'SAVING...' : 'SAVE CHANGES'}
                </button>
                <button onClick={resetForm} disabled={saving} className='border border-slate-300 hover:border-primary text-gray-700 hover:text-primary text-sm px-8 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed'>
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
