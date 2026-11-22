import React, { useContext, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ShopContext } from '../contexts/ShopContext'
import { assets } from '../assets/assets';
import Title from '../Components/Title';
import ProductItem from '../Components/ProductItem';
import Seo from '../Components/Seo';
import { breadcrumbSchema } from '../utils/seo';
import { parseSpecs } from '../utils/specs';

const availabilityList = ['In Stock', 'Out of Stock'];

// Category that must always sit at the very bottom of the All Products listing.
const LAST_CATEGORY = 'accessories';

// Groups products into contiguous category blocks using the existing `category`
// field, so products of the same category are never separated. The relative
// order inside each block is preserved, blocks appear in the order their
// category is first seen in the incoming list (so newly added products join
// their own category block automatically), and Accessories is always pinned
// last. Sorting by price still applies afterwards, untouched.
const groupByCategory = (list) => {
  const groups = new Map();
  (Array.isArray(list) ? list : []).forEach((item) => {
    const name = (item && item.category ? String(item.category).trim() : '') || 'Other';
    const key = name.toLowerCase();
    if (!groups.has(key)) {
      groups.set(key, { isLast: key === LAST_CATEGORY, items: [] });
    }
    groups.get(key).items.push(item);
  });
  // Array#sort is stable, so non-`isLast` groups keep first-seen category order.
  return [...groups.values()]
    .sort((a, b) => (a.isLast === b.isLast ? 0 : a.isLast ? 1 : -1))
    .flatMap((group) => group.items);
};

// Premium loading popup shown over the catalog while the real product request
// is in flight. Announced as a busy region for screen readers.
const CatalogLoader = () => (
  <div
    className='fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6'
    role='status'
    aria-live='polite'
    aria-busy='true'
  >
    <div className='absolute inset-0 bg-gradient-to-br from-primary/10 via-white/60 to-accent/10 backdrop-blur-md' aria-hidden='true' />

    <div className='relative w-full max-w-sm overflow-hidden rounded-[2rem] border border-white/80 bg-white/90 px-7 py-9 text-center shadow-lift backdrop-blur-xl animate-pop-in sm:max-w-md sm:px-10 sm:py-11'>
      <div className='pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full bg-primary/20 blur-3xl animate-drift' aria-hidden='true' />
      <div className='pointer-events-none absolute -bottom-12 -left-10 h-36 w-36 rounded-full bg-accent/20 blur-3xl animate-drift' aria-hidden='true' />

      <div className='relative mx-auto flex h-24 w-24 items-center justify-center sm:h-28 sm:w-28'>
        <span className='absolute inset-0 rounded-full border border-primary/15' aria-hidden='true' />
        <span className='absolute inset-0 rounded-full border-[3px] border-transparent border-t-primary border-r-accent animate-spin' aria-hidden='true' />
        <span className='absolute inset-2 rounded-full border border-dashed border-accent/50 animate-[spin_6s_linear_infinite]' aria-hidden='true' />
        <span className='absolute inset-0 flex items-center justify-center animate-float'>
          <span className='flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white shadow-glow sm:h-16 sm:w-16'>
            <svg className='h-8 w-8' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
              <path d='M4.5 8.5h15l-1.2 11H5.7L4.5 8.5Z' />
              <path d='M9 8.5V6.8a3 3 0 0 1 6 0v1.7' />
              <path d='m12.8 11-2.6 3.6h2l-1 3.1 3-4.1h-2l1-2.6Z' fill='currentColor' stroke='none' />
            </svg>
          </span>
        </span>
        <span className='absolute -right-1 top-2 h-2.5 w-2.5 rounded-full bg-accent animate-pulse' aria-hidden='true' />
        <span className='absolute bottom-3 -left-1 h-2 w-2 rounded-full bg-primary animate-pulse' aria-hidden='true' />
      </div>

      <h2 className='relative mt-6 font-display text-xl font-bold tracking-tight text-ink sm:text-2xl'>Products Are Loading...</h2>
      <p className='relative mt-2 text-sm text-ink-3'>Getting the good stuff ready for you.</p>

      <div className='relative mt-6 flex items-center justify-center gap-2' aria-hidden='true'>
        <span className='h-2 w-2 rounded-full bg-primary animate-bounce' />
        <span className='h-2 w-2 rounded-full bg-primary/70 animate-bounce [animation-delay:120ms]' />
        <span className='h-2 w-2 rounded-full bg-accent animate-bounce [animation-delay:240ms]' />
      </div>
    </div>
  </div>
);

const getStockStatus = (product) => {
  const { specs } = parseSpecs(product.description);
  const stock = specs.find((s) => ['stock', 'stock status'].includes(s.name.trim().toLowerCase()));
  return stock ? stock.value : 'In Stock';
};

const Collections = () => {
  const { products , categories, search , showSearch, productsLoading } = useContext(ShopContext);
  const [searchParams] = useSearchParams();
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [brand, setBrand] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortType,setSortType] = useState('relavent')

  const brands = [...new Set(products.map((p) => p.subCategory).filter(Boolean))];

  const allCategories = [...new Set([
    ...(Array.isArray(categories) ? categories.map((c) => c.name).filter(Boolean) : []),
    ...(Array.isArray(products) ? products.map((p) => p.category).filter(Boolean) : []),
  ])];

  const categoryCounts = allCategories.map((cat) => ({
    cat,
    count: (Array.isArray(products) ? products : []).filter((p) => p.category && p.category.toLowerCase() === cat.toLowerCase()).length,
  }));

  const categoryParam = searchParams.get('category') || '';
  const activeCategory = categoryParam && allCategories.some((c) => c.toLowerCase() === categoryParam.toLowerCase())
    ? allCategories.find((c) => c.toLowerCase() === categoryParam.toLowerCase())
    : '';

  useEffect(() => {
    const param = searchParams.get('category');
    if (param && allCategories.some((c) => c.toLowerCase() === param.toLowerCase())) {
      setCategory([param.toLowerCase()]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, categories, searchParams]);

  const toggleCategory = (e) => {
    const value = e.target.value.toLowerCase();
    setCategory(prev =>
      prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
    );
  };

  const toggleBrand = (e) => {
    const value = e.target.value.toLowerCase();
    setBrand(prev =>
      prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
    );
  };

  const toggleAvailability = (e) => {
    const value = e.target.value.toLowerCase();
    setAvailability(prev =>
      prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
    );
  };

  const applyFilter = () => {
    if (!Array.isArray(products)) return;

    let productsCopy = [...products];

    if (showSearch && search) {
      productsCopy = productsCopy.filter(item =>item.name.toLowerCase().includes(search.toLowerCase()))
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter(item =>
        item.category && category.includes(item.category.toLowerCase())
      );
    }

    if (brand.length > 0) {
      productsCopy = productsCopy.filter(item =>
        item.subCategory && brand.includes(item.subCategory.toLowerCase())
      );
    }

    if (availability.length > 0) {
      const inStock = availability.includes('in stock');
      const outOfStock = availability.includes('out of stock');
      productsCopy = productsCopy.filter(item => {
        const status = getStockStatus(item);
        return (inStock && status.toLowerCase() === 'in stock') || (outOfStock && status.toLowerCase() !== 'in stock');
      });
    }

    if (minPrice !== '') {
      productsCopy = productsCopy.filter(item => item.price >= Number(minPrice));
    }
    if (maxPrice !== '') {
      productsCopy = productsCopy.filter(item => item.price <= Number(maxPrice));
    }

    // Default (relevant) listing is grouped by category so each category shows
    // as one unbroken block with Accessories last. Price sorts bypass this.
    setFilterProducts(groupByCategory(productsCopy));
  };
  const sortProduct = () => {
    let fpCopy = filterProducts.slice();
    switch(sortType){
      case'low-high':
        setFilterProducts(fpCopy.sort((a,b)=>(a.price - b.price)));
        break;
      case'high-low':
        setFilterProducts(fpCopy.sort((a,b)=>(b.price - a.price)));
        break;

      default:
        applyFilter();
        break;

    }
  }

  useEffect(() => {
    applyFilter();
  }, [category, brand, availability, minPrice, maxPrice, products, search, showSearch]);

  useEffect(()=>{
    sortProduct();

  },[sortType])

  // Show the loading screen only while the catalog is genuinely still being
  // fetched and there is nothing to display yet. Cached/already loaded products
  // skip it completely.
  const showCatalogLoader = productsLoading && (!Array.isArray(products) || products.length === 0);

  const resultCount = Array.isArray(filterProducts) ? filterProducts.length : 0;

  return (
    <div className='flex flex-col lg:flex-row gap-6 lg:gap-8 pt-8'>
      <Seo
        title={activeCategory ? `${activeCategory} | Voltique Hub` : 'Shop All Products | Voltique Hub'}
        description={activeCategory
          ? `Buy ${activeCategory} online in Pakistan at Voltique Hub. Genuine, warranty-backed ${activeCategory.toLowerCase()} from trusted brands with fast nationwide delivery.`
          : 'Shop all battery chargers, stabilizers, power inverters and charging accessories online. Filter by category, brand, price and availability at Voltique Hub.'}
        path={activeCategory ? `/collections?category=${encodeURIComponent(activeCategory)}` : '/collections'}
        jsonLd={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Shop', path: '/collections' },
            ...(activeCategory ? [{ name: activeCategory, path: `/collections?category=${encodeURIComponent(activeCategory)}` }] : []),
          ]),
        ]}
      />
      <h1 className='sr-only'>Shop Battery Chargers, Stabilizers &amp; Inverters</h1>

      {showCatalogLoader ? <CatalogLoader /> : (
      <>
      {/* Filter Options */}
      <aside className='w-full lg:w-[280px] lg:min-w-[280px] shrink-0'>
        <button
          type='button'
          onClick={() => setShowFilter(!showFilter)}
          aria-expanded={showFilter}
          className='card w-full flex items-center justify-between px-5 py-4 lg:shadow-none lg:border-0 lg:bg-transparent lg:p-0 font-semibold text-ink transition-colors duration-300 hover:text-primary'
        >
          <span className='text-base tracking-[0.15em]'>FILTERS</span>
          <span className='w-8 h-8 rounded-xl bg-primary/12 border border-primary/35 flex items-center justify-center lg:hidden'>
            <img
              className={`h-3 transition-transform duration-500 ease-swift ${showFilter ? 'rotate-90' : ''} icon-ink-dim`}
              src={assets.dropdown_icon}
              alt=""
            />
          </span>
        </button>

        <div className={`mt-4 flex flex-col gap-4 ${showFilter ? '' : 'hidden'} lg:flex`}>
          {/* Category Filter */}
          <div className='card p-5'>
            <p className='mb-3.5 text-[11px] font-semibold tracking-[0.15em] text-ink-3 uppercase'>Category</p>
            <div className='flex flex-col gap-3 text-sm font-light text-ink-2'>
              {categoryCounts.map(({ cat, count }, i) => (
                <label className='flex gap-2.5 items-center cursor-pointer group' key={i}>
                  <input className='w-3.5 h-3.5 accent-primary cursor-pointer' type="checkbox" value={cat} checked={category.includes(cat.toLowerCase())} onChange={toggleCategory} />
                  <span className='group-hover:text-primary transition-colors duration-200'>{cat}</span>
                  <span className='ml-auto text-xs text-ink-3'>({count})</span>
                </label>
              ))}
            </div>
          </div>

          {/* Brand Filter */}
          <div className='card p-5'>
            <p className='mb-3.5 text-[11px] font-semibold tracking-[0.15em] text-ink-3 uppercase'>Brand</p>
            <div className='flex flex-col gap-3 text-sm font-light text-ink-2'>
              {brands.map((b, i) => (
                <label className='flex gap-2.5 items-center cursor-pointer group' key={i}>
                  <input className='w-3.5 h-3.5 accent-primary cursor-pointer' type="checkbox" value={b} onChange={toggleBrand} />
                  <span className='group-hover:text-primary transition-colors duration-200'>{b}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div className='card p-5'>
            <p className='mb-3.5 text-[11px] font-semibold tracking-[0.15em] text-ink-3 uppercase'>Price</p>
            <div className='flex items-center gap-2'>
              <input
                value={minPrice}
                onChange={(e)=>setMinPrice(e.target.value)}
                className='field px-3 py-2 w-full'
                type="number"
                min={0}
                placeholder='Min'
                aria-label='Minimum price'
              />
              <span className='text-ink-3'>-</span>
              <input
                value={maxPrice}
                onChange={(e)=>setMaxPrice(e.target.value)}
                className='field px-3 py-2 w-full'
                type="number"
                min={0}
                placeholder='Max'
                aria-label='Maximum price'
              />
            </div>
          </div>

          {/* Availability Filter */}
          <div className='card p-5'>
            <p className='mb-3.5 text-[11px] font-semibold tracking-[0.15em] text-ink-3 uppercase'>Availability</p>
            <div className='flex flex-col gap-3 text-sm font-light text-ink-2'>
              {availabilityList.map((avail, i) => (
                <label className='flex gap-2.5 items-center cursor-pointer group' key={i}>
                  <input className='w-3.5 h-3.5 accent-primary cursor-pointer' type="checkbox" value={avail} onChange={toggleAvailability} />
                  <span className='group-hover:text-primary transition-colors duration-200'>{avail}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Right Side */}
      <div className='flex-1 min-w-0'>
        <div className='flex flex-wrap items-center justify-between gap-3 mb-6'>
          <div>
            <Title text1={'ALL'} text2={'PRODUCTS'} />
            <p className='text-xs text-ink-3 -mt-1'>{resultCount} item{resultCount !== 1 ? 's' : ''} available</p>
          </div>
          {/* Product Sort */}
          <select
            onChange={(e)=>setSortType(e.target.value)}
            aria-label='Sort products'
            className='field w-auto cursor-pointer'
          >
            <option value="relavent">Sort by: Relavent</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>

        {/* Map Products */}
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 catalog-enter'>
          {Array.isArray(filterProducts) && filterProducts.length > 0 ? (
            filterProducts.map((item, index) => (
              <ProductItem
                key={index}
                large
                name={item.name}
                id={item._id}
                price={item.price}
                discountAmount={item.discountAmount}
                image={item.image}
                category={item.category}
                brand={item.subCategory}
                models={item.sizes}
                description={item.description}
                rating={item.avgRating}
                reviewCount={item.reviewCount}
                stock={item.stock}
                soldCount={item.soldCount}
              />
            ))
          ) : (
            <div className='col-span-full card py-16 px-6 text-center'>
              <div className='w-16 h-16 mx-auto rounded-2xl bg-primary/15 border border-line flex items-center justify-center mb-4'>
                <img src={assets.search_icon} className='w-7 icon-ink-dim' alt='' />
              </div>
              <p className='text-ink-2 font-semibold'>No products found</p>
              <p className='text-sm text-ink-3 mt-1'>Try adjusting your category, brand, or price filters.</p>
            </div>
          )}
        </div>
      </div>
      </>
      )}

    </div>
  );
};

export default Collections;
