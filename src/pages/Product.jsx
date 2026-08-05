import React, { useContext,useEffect,useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { ShopContext } from '../contexts/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../Components/RelatedProducts';
import ReviewSection from '../Components/ReviewSection';
import { toast } from 'react-toastify';
import { parseSpecs } from '../utils/specs';

const specIconPaths = {
  brand: 'M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.83zM7 7h.01',
  ampere: 'M13 2 3 14h9l-1 8 10-12h-9l1-8z',
  voltage: 'M22 12h-4l-3 9L9 3l-3 9H2',
  model: 'M9 9h6v6H9zM3 12h2M19 12h2M12 3v2M12 19v2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4',
  type: 'm12 2 10 6.5-10 6.5L2 8.5 12 2zM2 13.5l10 6.5 10-6.5',
  stock: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16zM3.27 6.96 12 12.01l8.73-5.05M12 22.08V12',
  warranty: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4',
  weight: 'M12 3v2M6.5 6.5h11M4 6l1.5 15h13L20 6M12 10v6M9 14l3 2 3-2',
  dimensions: 'M3 21V3h18v18H3zM3 9h18M3 15h18M9 3v18M15 3v18',
  color: 'M12 22a10 10 0 1 1 10-10c0 2.5-2 3-4 3h-2c-1.5 0-2.5 1-2.5 2.5 0 1 .5 2 1 2.5.5.5 1.5 2 .5 2zM7.5 10a1 1 0 1 0 0-.01M12 7a1 1 0 1 0 0-.01M16 10a1 1 0 1 0 0-.01',
  input: 'M21 12H3M15 6l6 6-6 6',
  output: 'M3 12h18M9 6l-6 6 6 6',
  frequency: 'M9 3h6M10 3v4a4 4 0 0 1-4 4H5M14 3v4a4 4 0 0 0 4 4h1M9 21h6M10 21v-2a4 4 0 0 1 4-4h0',
  battery: 'M4 7h13v10H4zM17 10h2v4h-2M7 12h4',
  standard: 'M9 12l2 2 4-4M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z',
  material: 'M12 2l8 5-8 5-8-5 8-5zM4 12l8 5 8-5M4 17l8 5 8-5',
  temperature: 'M8 9a4 4 0 1 1 8 0c0 1.5-1 2.5-1 4h-6c0-1.5-1-2.5-1-4zM12 17v3',
  default: 'M9 12l2 2 4-4',
};

const getSpecIcon = (name) => {
  const key = (name || '').toLowerCase();
  if (key.includes('brand')) return specIconPaths.brand;
  if (key.includes('ampere') || key === 'amp') return specIconPaths.ampere;
  if (key.includes('volt')) return specIconPaths.voltage;
  if (key.includes('model')) return specIconPaths.model;
  if (key.includes('type')) return specIconPaths.type;
  if (key.includes('stock')) return specIconPaths.stock;
  if (key.includes('warrant')) return specIconPaths.warranty;
  if (key.includes('weight') || key.includes('mass')) return specIconPaths.weight;
  if (key.includes('dimension') || key.includes('size') || key.includes('measure')) return specIconPaths.dimensions;
  if (key.includes('color') || key.includes('colour')) return specIconPaths.color;
  if (key.includes('input')) return specIconPaths.input;
  if (key.includes('output')) return specIconPaths.output;
  if (key.includes('freq')) return specIconPaths.frequency;
  if (key.includes('battery') || key.includes('charge')) return specIconPaths.battery;
  if (key.includes('standard') || key.includes('cert')) return specIconPaths.standard;
  if (key.includes('material')) return specIconPaths.material;
  if (key.includes('temp')) return specIconPaths.temperature;
  return specIconPaths.default;
};

const Product = () => {
  const {productId} = useParams();
  const [searchParams] = useSearchParams();
  const {products, currency ,addToCart, updateQuantity, token, navigate} = useContext(ShopContext);
  const [productData,setProductData] = useState(false);
  const [image, setImage] = useState('')
  const [size,setSize] = useState('')
  const [selected, setSelected] = useState({})
  const [quantity,setQuantity] = useState(1)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [zoom, setZoom] = useState({ active: false, x: 50, y: 50 })
  const touchStartX = React.useRef(null)

  const scrollToReviews = () => {
    document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleZoomMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setZoom({ active: true, x: Math.min(100, Math.max(0, x)), y: Math.min(100, Math.max(0, y)) })
  }

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return
    const delta = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(delta) > 40) {
      if (delta < 0) showNext()
      else showPrev()
    }
    touchStartX.current = null
  }

  const orderViaWhatsApp = () => {
    if (needsSelection && !optionSize) {
      toast.error('Select the required options');
      return;
    }
    const message = `Hello, I want to order this product.

Product:
${productData.name}

Price:
Rs. ${productData.price}

${optionSize ? `Option: ${optionSize}

` : ''}Quantity:
${quantity}

Customer Name:
________

Phone:
________

Please confirm my order.`;
    window.open(`https://wa.me/923063720139?text=${encodeURIComponent(message)}`, '_blank');
  }

  const orderViaStore = () => {
    if (needsSelection && !optionSize) {
      toast.error('Select the required options');
      return;
    }
    if (!token) {
      sessionStorage.setItem('storeOrderProduct', JSON.stringify({ productId, size: effectiveSize, quantity }));
      sessionStorage.setItem('redirectAfterLogin', '/product/' + productId);
      navigate('/login');
      return;
    }
    addToCart(productId, effectiveSize);
    if (quantity > 1) {
      updateQuantity(productId, effectiveSize, quantity);
    }
    navigate('/placeOrder');
  }

  const fetchProductData = async () => {
    products.map((item)=>{
      if (item._id === productId) {
        setProductData(item)
        setImage(item.image[0])
        return null;
      }
    })
  }

  useEffect(()=>{
    fetchProductData();
  },[productId, products])

  const brand = productData ? productData.subCategory : '';
  const parsed = productData ? parseSpecs(productData.description) : { specs: [], rest: '' };
  const specs = parsed.specs;
  const descriptionText = parsed.rest || (productData ? productData.description : '');
  const stockSpec = specs.find(s => ['stock', 'stock status'].includes(s.name.toLowerCase()));
  const stockStatus = stockSpec ? stockSpec.value : ((productData && productData.stock) || 'In Stock');
  const inStock = stockStatus.toLowerCase() === 'in stock';
  const currentIndex = productData ? productData.image.indexOf(image) : -1;

  const optionFields = (productData && Array.isArray(productData.options) && productData.options.length > 0) ? productData.options : [];
  const hasSizes = productData && Array.isArray(productData.sizes) && productData.sizes.length > 0;
  const needsSelection = optionFields.length > 0 || hasSizes;
  const optionSize = optionFields.length
    ? optionFields.map(o => selected[o.name]).filter(Boolean).join(' / ')
    : size;
  const effectiveSize = needsSelection ? optionSize : 'Default';

  useEffect(() => {
    if (productData && Array.isArray(productData.options) && productData.options.length > 0) {
      const defaults = {};
      productData.options.forEach(o => {
        if (o.values && o.values.length) defaults[o.name] = o.values[0];
      });
      setSelected(defaults);
    }
  }, [productData]);

  const showPrev = () => {
    if (!productData || productData.image.length < 2) return;
    const idx = currentIndex === -1 ? 0 : currentIndex;
    setImage(productData.image[(idx - 1 + productData.image.length) % productData.image.length]);
  };

  const showNext = () => {
    if (!productData || productData.image.length < 2) return;
    const idx = currentIndex === -1 ? 0 : currentIndex;
    setImage(productData.image[(idx + 1) % productData.image.length]);
  };

  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxOpen, currentIndex]);

  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [lightboxOpen]);

  return productData ? (
    <div className='border-t-2 border-slate-200 pt-10 transition-opacity ease-in duration-500 opacity-100'>
      {/*Product Data */}

      <div className='flex flex-col lg:flex-row gap-10 lg:gap-14'>
        {/*Product Images */}
        <div className='lg:w-[46%] xl:w-[44%] shrink-0'>
          <div className='flex flex-col-reverse gap-3 sm:flex-row lg:sticky lg:top-28'>
            {productData.image.length > 1 && (
              <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[86px] sm:shrink-0 gap-2'>
                {
                  productData.image.map((item,index)=>(
                    <img onClick={()=>setImage(item)} src={item} onError={(e)=>{ e.currentTarget.onerror = null; e.currentTarget.src = assets.device_charger }} key={index} className={`w-16 sm:w-[86px] h-auto object-contain bg-white flex-shrink-0 cursor-pointer border rounded-xl transition-all ${image === item ? 'border-primary ring-1 ring-primary' : 'border-slate-200 hover:border-primary/60'}`} alt="" />
                  ))
                }
              </div>
            )}
            <div className='flex-1 min-w-0'>
              <div onClick={()=>setLightboxOpen(true)} onMouseMove={handleZoomMove} onMouseLeave={() => setZoom({ active: false, x: 50, y: 50 })} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} className='w-full rounded-2xl border border-slate-200 bg-white flex items-center justify-center overflow-hidden cursor-zoom-in group relative'>
                <img className='w-full h-auto object-contain transition-transform duration-200' src={image} onError={(e)=>{ e.currentTarget.onerror = null; e.currentTarget.src = assets.device_charger }} alt="" style={zoom.active ? { transform: 'scale(1.8)', transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined} />
                <span className='absolute bottom-3 right-3 flex items-center gap-1.5 bg-white/90 text-gray-700 text-[11px] font-medium px-2.5 py-1.5 rounded-full shadow-card border border-slate-200 opacity-0 group-hover:opacity-100 transition-opacity'>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className='w-3.5 h-3.5'>
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                  Zoom
                </span>
                {productData.image.length > 1 && (
                  <>
                    <button onClick={(e)=>{ e.stopPropagation(); showPrev(); }} aria-label='Previous image' className='absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 text-gray-700 flex items-center justify-center shadow-card opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white'>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className='w-4 h-4'><path d="m15 18-6-6 6-6" /></svg>
                    </button>
                    <button onClick={(e)=>{ e.stopPropagation(); showNext(); }} aria-label='Next image' className='absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 text-gray-700 flex items-center justify-center shadow-card opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white'>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className='w-4 h-4'><path d="m9 18 6-6-6-6" /></svg>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        {/*Product info */}
        <div className='flex-1 min-w-0'>
          <div className='flex items-center gap-2 mt-2 flex-wrap'>
            <span className='text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full bg-blue-50 text-primary border border-blue-200'>{productData.category}</span>
            {brand && (
              <span className='text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200'>{brand}</span>
            )}
            <span className={`flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full text-white ${inStock ? 'bg-accent' : 'bg-gray-500'}`}>
              <span className='w-1.5 h-1.5 rounded-full bg-white animate-pulse'></span>
              {stockStatus}
            </span>
          </div>
          <h1 className='font-semibold text-2xl sm:text-3xl mt-3 text-gray-900 leading-snug'>{productData.name}</h1>
          {productData.avgRating > 0 ? (
            <button onClick={scrollToReviews} className='mt-2 flex items-center gap-2 group w-fit'>
              <span className='flex items-center gap-0.5'>
                {[1,2,3,4,5].map((star) => (
                  <span key={star} className={`text-sm leading-none ${star <= Math.round(productData.avgRating) ? 'text-amber-500' : 'text-slate-300'}`}>★</span>
                ))}
              </span>
              <span className='text-sm font-semibold text-gray-700'>{productData.avgRating.toFixed(1)}</span>
              <span className='text-sm text-gray-400'>({productData.reviewCount} review{productData.reviewCount !== 1 ? 's' : ''})</span>
              <span className='text-xs text-primary font-medium group-hover:underline'>View all reviews</span>
            </button>
          ) : (
            <button onClick={scrollToReviews} className='mt-2 flex items-center gap-2 w-fit'>
              <span className='flex items-center gap-0.5'>
                {[1,2,3,4,5].map((star) => (
                  <span key={star} className='text-sm leading-none text-slate-300'>★</span>
                ))}
              </span>
              <span className='text-sm text-gray-400'>No reviews yet</span>
              <span className='text-xs text-primary font-medium group-hover:underline'>Be the first to review</span>
            </button>
          )}
          <p className='mt-4 text-3xl sm:text-4xl font-bold text-primary-dark'>{currency}{productData.price}</p>

          <p className='mt-5 text-gray-500 leading-relaxed'>{descriptionText}</p>

          {/*Specifications */}
          {specs.length > 0 && (
          <div className='mt-6 rounded-2xl border border-slate-200 bg-white shadow-card overflow-hidden'>
            <div className='flex items-center gap-2.5 px-5 py-3.5 bg-gradient-to-r from-primary to-primary-dark'>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className='w-4 h-4 text-white shrink-0'>
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
              </svg>
              <p className='text-sm font-semibold text-white'>Specifications</p>
            </div>
            <div className='divide-y divide-slate-100 text-sm'>
              {specs.map((spec, i) => {
                const isStock = ['stock', 'stock status'].includes(spec.name.trim().toLowerCase());
                const stockIn = spec.value.trim().toLowerCase() === 'in stock';
                return (
                  <div key={i} className={`flex items-center justify-between gap-3 flex-wrap px-4 sm:px-5 py-3 sm:py-3.5 ${i % 2 === 1 ? 'bg-slate-50/80' : 'bg-white'}`}>
                    <div className='flex items-center gap-2.5 sm:gap-3 min-w-0'>
                      <span className='w-7 h-7 sm:w-8 sm:h-8 shrink-0 flex items-center justify-center rounded-lg bg-blue-50 text-primary border border-blue-100'>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className='w-3.5 h-3.5 sm:w-4 sm:h-4'>
                          <path d={getSpecIcon(spec.name)} />
                        </svg>
                      </span>
                      <span className='text-slate-600 font-medium min-w-0 break-words'>{spec.name}</span>
                    </div>
                    {isStock ? (
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full text-white shrink-0 ${stockIn ? 'bg-accent' : 'bg-red-600'}`}>
                        <span className='w-1.5 h-1.5 rounded-full bg-white animate-pulse'></span>
                        {spec.value}
                      </span>
                    ) : (
                      <span className='font-semibold text-gray-900 text-right break-words min-w-0'>{spec.value}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          )}

          <div className='flex flex-col gap-4 my-8'>
            {needsSelection && (
              <>
                {optionFields.length > 0 ? (
                  <div className='flex flex-col gap-4'>
                    {optionFields.map((field, fi) => (
                      <div key={fi}>
                        <p className='font-medium text-gray-800'>Select {field.name}</p>
                        <div className='flex gap-2 flex-wrap mt-2'>
                          {field.values.map((val, vi) => (
                            <button onClick={()=>setSelected(prev => ({ ...prev, [field.name]: val }))} className={`border py-2.5 px-5 rounded-lg text-sm font-medium transition-all ${selected[field.name] === val ? 'bg-primary border-primary text-white shadow-card-hover' : 'bg-slate-50 border-slate-300 text-gray-700 hover:border-primary'}`} key={vi}>{val}</button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <p className='font-medium text-gray-800'>Select Ampere</p>
                    <div className='flex gap-2 flex-wrap'>
                      {productData.sizes.map((item,index)=>(
                        <button onClick={()=>setSize(item)} className={`border py-2.5 px-5 rounded-lg text-sm font-medium transition-all ${item === size ? 'bg-primary border-primary text-white shadow-card-hover' : 'bg-slate-50 border-slate-300 text-gray-700 hover:border-primary'}`} key={index}>{item}</button>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
            <div className='flex flex-col gap-2'>
              <p className='font-medium text-gray-800'>Quantity</p>
              <div className='flex items-center gap-3'>
                <button onClick={()=>setQuantity(q => Math.max(1, q - 1))} className='w-10 h-10 border border-slate-300 rounded-lg bg-slate-50 text-gray-700 text-lg font-medium hover:border-primary transition-colors'>-</button>
                <span className='w-12 text-center font-semibold text-lg'>{quantity}</span>
                <button onClick={()=>setQuantity(q => q + 1)} className='w-10 h-10 border border-slate-300 rounded-lg bg-slate-50 text-gray-700 text-lg font-medium hover:border-primary transition-colors'>+</button>
              </div>
            </div>
          </div>
          <div className='flex flex-col sm:flex-row flex-wrap gap-3'>
            <button onClick={()=>addToCart(productData._id,effectiveSize)} className='bg-primary hover:bg-primary-dark text-white px-8 py-3.5 text-sm rounded-lg transition-colors active:bg-primary-dark w-full sm:w-auto'>ADD TO CART</button>
            <button onClick={orderViaStore} className='bg-dark hover:bg-[#10203e] text-white px-8 py-3.5 text-sm rounded-lg transition-colors inline-flex items-center justify-center gap-2 active:bg-[#10203e] w-full sm:w-auto'>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className='w-4 h-4'>
                <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                <path d="M3.27 6.96 12 12.01l8.73-5.05" />
                <path d="M12 22.08V12" />
              </svg>
              ORDER VIA STORE
            </button>
            <button onClick={orderViaWhatsApp} className='bg-[#25D366] hover:bg-[#1DA851] text-white px-8 py-3.5 text-sm rounded-lg transition-colors inline-flex items-center justify-center gap-2 active:bg-[#1DA851] w-full sm:w-auto'>
              <svg viewBox="0 0 448 512" className='w-4 h-4' fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
              </svg>
              ORDER VIA WHATSAPP
            </button>
          </div>
          <hr className='mt-8 sm:w-4/5 border-slate-200' />
          <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
            <p>100% Genuine & Warranty-Backed Power Solutions.</p>
            <p>Cash On Delivery is available on this Product.</p>
            <p>Easy Exchange Policy within 7 days + technical support.</p>
          </div>
        </div>
      </div>
      {/**Description and Review Section */}
      <div className='mt-20'>
        <div className='flex flex-wrap'>
          <b className='border border-slate-200 px-5 py-3 text-sm rounded-t-lg bg-white text-primary'>Description</b>
          <p className='border border-slate-200 px-5 py-3 text-sm rounded-t-lg bg-white text-gray-600'>Specifications & Care</p>
        </div>
        <div className='flex flex-col gap-4 border border-slate-200 px-6 py-6 text-sm text-gray-500 bg-white rounded-b-lg'>
          <p>{productData.description}</p>
          <p>Every Voltique Hub product is engineered for reliable, safe, and dependable performance. Whether you are charging a battery, stabilizing your power supply, or running your home on an inverter, we make sure it works simply and safely.</p>
        </div>
      </div>

      <ReviewSection productId={productData._id} productName={productData.name} autoOpen={searchParams.get('review') === '1'} />

      {/**Display related products */}
      <RelatedProducts category={productData.category} subCategory={productData.subCategory} />

      {/*Product Image Lightbox */}
      {lightboxOpen && (
        <div onClick={()=>setLightboxOpen(false)} className='fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6'>
          <button onClick={()=>setLightboxOpen(false)} aria-label='Close preview' className='absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors'>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className='w-5 h-5'>
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>

          {productData.image.length > 1 && (
            <>
              <button onClick={(e)=>{ e.stopPropagation(); showPrev(); }} aria-label='Previous image' className='absolute left-2 sm:left-5 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors'>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className='w-5 h-5 sm:w-6 sm:h-6'>
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
              <button onClick={(e)=>{ e.stopPropagation(); showNext(); }} aria-label='Next image' className='absolute right-2 sm:right-5 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors'>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className='w-5 h-5 sm:w-6 sm:h-6'>
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </>
          )}

          <div onClick={(e)=>e.stopPropagation()} className='max-w-5xl w-full flex flex-col items-center gap-4'>
            <div className='w-full flex items-center justify-center bg-slate-900/40 border border-white/10 rounded-2xl py-4 sm:py-6 px-4'>
              <img key={image} src={image} onError={(e)=>{ e.currentTarget.onerror = null; e.currentTarget.src = assets.device_charger }} className='max-h-[70vh] sm:max-h-[75vh] w-auto max-w-full object-contain' alt="" />
            </div>

            {productData.image.length > 1 && (
              <>
                <div className='flex items-center justify-center gap-2 sm:gap-3 flex-wrap'>
                  {productData.image.map((item, index) => (
                    <button key={index} onClick={()=>setImage(item)} className={`w-14 sm:w-16 rounded-lg border-2 overflow-hidden bg-white flex items-center justify-center transition-all ${image === item ? 'border-accent ring-2 ring-accent/40' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                      <img src={item} onError={(e)=>{ e.currentTarget.onerror = null; e.currentTarget.src = assets.device_charger }} className='w-full h-auto object-contain' alt="" />
                    </button>
                  ))}
                </div>
                <p className='text-white/60 text-xs sm:text-sm tracking-wide'>{currentIndex === -1 ? 1 : currentIndex + 1} / {productData.image.length}</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  ) : <div className=' opacity-0'></div>
}

export default Product
