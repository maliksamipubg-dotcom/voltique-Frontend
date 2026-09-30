import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../contexts/ShopContext'
import Title from '../Components/Title';
import Seo from '../Components/Seo';
import axios from 'axios';
import { toast } from 'react-toastify';

const hasUppercase = (v) => /[A-Z]/.test(v);
const hasLowercase = (v) => /[a-z]/.test(v);
const hasNumber = (v) => /[0-9]/.test(v);
const hasSpecial = (v) => /[!@#$%^&*(),.?":{}|<>]/.test(v);

const ChangePassword = () => {
  const { backendUrl, token, navigate } = useContext(ShopContext);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!token) {
      sessionStorage.setItem('redirectAfterLogin', '/change-password');
      navigate('/login');
    }
  }, [token, navigate]);

  const validateNewPassword = (value) => {
    if (!value) return 'Please enter a new password.';
    if (value.length < 8) return 'Password must be at least 8 characters.';
    if (!hasUppercase(value)) return 'Password must include an uppercase letter.';
    if (!hasLowercase(value)) return 'Password must include a lowercase letter.';
    if (!hasNumber(value)) return 'Password must include a number.';
    if (!hasSpecial(value)) return 'Password must include a special character.';
    return '';
  };

  const validateConfirm = (value) => {
    if (!value) return 'Please confirm your new password.';
    if (value !== newPassword) return 'Passwords do not match.';
    return '';
  };

  const onBlur = (field) => {
    setTouched(t => ({ ...t, [field]: true }));
    let err = '';
    if (field === 'oldPassword') err = oldPassword ? '' : 'Please enter your old password.';
    if (field === 'newPassword') err = validateNewPassword(newPassword);
    if (field === 'confirmPassword') err = validateConfirm(confirmPassword);
    setErrors(e => ({ ...e, [field]: err }));
  };

  const onChange = (field, value) => {
    if (field === 'oldPassword') setOldPassword(value);
    if (field === 'newPassword') setNewPassword(value);
    if (field === 'confirmPassword') setConfirmPassword(value);
    if (touched[field]) {
      const err = field === 'oldPassword' ? (value ? '' : 'Please enter your old password.') : field === 'newPassword' ? validateNewPassword(value) : validateConfirm(value);
      setErrors(e => ({ ...e, [field]: err }));
    }
  };

  const inputClass = (field) => `w-full border rounded-xl py-3 px-4 text-sm text-gray-800 placeholder-gray-400 outline-none transition-all duration-200 focus:ring-4 ${errors[field] ? 'border-red-500 focus:ring-red-500/15 bg-red-50/30' : touched[field] && !errors[field] ? 'border-green-500 focus:ring-green-500/15 bg-green-50/20' : 'border-slate-300 focus:ring-primary/10 focus:border-primary'}`;

  const RULES = [
    { label: 'At least 8 characters', test: (v) => v.length >= 8 },
    { label: 'Uppercase letter', test: hasUppercase },
    { label: 'Lowercase letter', test: hasLowercase },
    { label: 'Number', test: hasNumber },
    { label: 'Special character', test: hasSpecial },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const oldErr = oldPassword ? '' : 'Please enter your old password.';
    const newErr = validateNewPassword(newPassword);
    const confirmErr = validateConfirm(confirmPassword);
    setTouched({ oldPassword: true, newPassword: true, confirmPassword: true });
    setErrors({ oldPassword: oldErr, newPassword: newErr, confirmPassword: confirmErr });
    if (oldErr || newErr || confirmErr) return;

    setSubmitting(true);
    try {
      const response = await axios.post(backendUrl + '/api/user/change-password', { oldPassword, newPassword }, { headers: { token } });
      if (response.data.success) {
        toast.success('Password changed successfully.');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTouched({});
        setErrors({});
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='border-t pt-14 max-w-3xl mx-auto'>
      <Seo title="Change Password | Voltique Hub" description="Update your Voltique Hub account password securely." path="/change-password" robots="noindex, follow" />
      <h1 className='sr-only'>Change Password</h1>
      <div className='text-2xl mb-6'>
        <Title text1={'CHANGE'} text2={'PASSWORD'} />
      </div>

      <div className='card p-6 sm:p-7'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <div className='flex flex-col gap-1.5'>
            <label className='text-sm font-medium text-gray-700'>Old Password</label>
            <input
              value={oldPassword}
              onChange={(e)=>onChange('oldPassword', e.target.value)}
              onBlur={()=>onBlur('oldPassword')}
              type="password"
              placeholder='Enter your current password'
              className={inputClass('oldPassword')}
            />
            {errors.oldPassword && <p className='text-xs text-red-600 animate-rise-sm'>{errors.oldPassword}</p>}
          </div>

          <div className='flex flex-col gap-1.5'>
            <label className='text-sm font-medium text-gray-700'>New Password</label>
            <input
              value={newPassword}
              onChange={(e)=>onChange('newPassword', e.target.value)}
              onBlur={()=>onBlur('newPassword')}
              type="password"
              placeholder='Enter a new password'
              className={inputClass('newPassword')}
            />
            {errors.newPassword && <p className='text-xs text-red-600 animate-rise-sm'>{errors.newPassword}</p>}
            {!errors.newPassword && (
              <ul className='text-xs text-gray-400 flex flex-wrap gap-2 mt-1'>
                {RULES.map((rule) => {
                  const passed = rule.test(newPassword);
                  return (
                    <li key={rule.label} className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 transition-colors duration-300 ${passed ? 'text-green-700 bg-green-50 border-green-200' : 'bg-mist border-slate-200'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${passed ? 'bg-green-500' : 'bg-slate-300'}`}></span>
                      {rule.label}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className='flex flex-col gap-1.5'>
            <label className='text-sm font-medium text-gray-700'>Confirm New Password</label>
            <input
              value={confirmPassword}
              onChange={(e)=>onChange('confirmPassword', e.target.value)}
              onBlur={()=>onBlur('confirmPassword')}
              type="password"
              placeholder='Re-enter your new password'
              className={inputClass('confirmPassword')}
            />
            {errors.confirmPassword && <p className='text-xs text-red-600 animate-rise-sm'>{errors.confirmPassword}</p>}
          </div>

          <div className='flex flex-col sm:flex-row gap-3 mt-4'>
            <button type='submit' disabled={submitting} className='btn-primary disabled:opacity-50 disabled:pointer-events-none'>
              {submitting ? 'UPDATING...' : 'UPDATE PASSWORD'}
            </button>
            <button type='button' onClick={()=>navigate('/profile')} disabled={submitting} className='btn-outline disabled:opacity-50 disabled:pointer-events-none'>
              CANCEL
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ChangePassword
