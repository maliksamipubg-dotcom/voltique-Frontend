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

const getStockStatus = (product) => {
  const { specs } = parseSpecs(product.description);
  const stock = specs.find((s) => ['stock', 'stock status'].includes(s.name.trim().toLowerCase()));
  return stock ? stock.value : 'In Stock';
};

const Collections = () => {
  const { products , categories, search , showSearch  } = useContext(ShopContext);
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

    setFilterProducts(productsCopy);
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
  return (
    <div className='flex flex-col lg:flex-row gap-6 lg:gap-8 pt-8 border-t border-slate-200'>
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

      {/* Filter Options */}
      <aside className='w-full lg:w-[280px] lg:min-w-[280px] shrink-0'>
        <p
          onClick={() => setShowFilter(!showFilter)}
          className='text-xl flex items-center cursor-pointer gap-2 font-semibold text-gray-800'
        >
          FILTERS
          <img
            className={`h-3 lg:hidden ${showFilter ? 'rotate-90' : ''}`}
            src={assets.dropdown_icon}
            alt=""
          />
        </p>

        <div className={`mt-4 flex flex-col gap-4 ${showFilter ? '' : 'hidden'} lg:flex`}>
          {/* Category Filter */}
          <div className='border border-slate-200 pl-5 pr-4 py-4 rounded-lg bg-white shadow-card'>
            <p className='mb-3 text-xs font-semibold tracking-wider text-gray-700'>CATEGORY</p>
            <div className='flex flex-col gap-2.5 text-sm font-light text-gray-700'>
              {categoryCounts.map(({ cat, count }, i) => (
                <p className='flex gap-2.5 items-center' key={i}>
                  <input className='w-3.5 h-3.5 accent-primary' type="checkbox" value={cat} checked={category.includes(cat.toLowerCase())} onChange={toggleCategory} /> {cat} <span className='text-xs text-gray-400'>({count})</span>
                </p>
              ))}
            </div>
          </div>

          {/* Brand Filter */}
          <div className='border border-slate-200 pl-5 pr-4 py-4 rounded-lg bg-white shadow-card'>
            <p className='mb-3 text-xs font-semibold tracking-wider text-gray-700'>BRAND</p>
            <div className='flex flex-col gap-2.5 text-sm font-light text-gray-700'>
              {brands.map((b, i) => (
                <p className='flex gap-2.5 items-center' key={i}>
                  <input className='w-3.5 h-3.5 accent-primary' type="checkbox" value={b} onChange={toggleBrand} /> {b}
                </p>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div className='border border-slate-200 pl-5 pr-4 py-4 rounded-lg bg-white shadow-card'>
            <p className='mb-3 text-xs font-semibold tracking-wider text-gray-700'>PRICE</p>
            <div className='flex items-center gap-2'>
              <input
                value={minPrice}
                onChange={(e)=>setMinPrice(e.target.value)}
                className='border border-slate-300 rounded-md px-2.5 py-2 w-full text-sm outline-none focus:border-primary focus:ring-1 focus:ring-blue-500/30'
                type="number"
                min={0}
                placeholder='Min'
              />
              <span className='text-slate-400'>-</span>
              <input
                value={maxPrice}
                onChange={(e)=>setMaxPrice(e.target.value)}
                className='border border-slate-300 rounded-md px-2.5 py-2 w-full text-sm outline-none focus:border-primary focus:ring-1 focus:ring-blue-500/30'
                type="number"
                min={0}
                placeholder='Max'
              />
            </div>
          </div>

          {/* Availability Filter */}
          <div className='border border-slate-200 pl-5 pr-4 py-4 rounded-lg bg-white shadow-card'>
            <p className='mb-3 text-xs font-semibold tracking-wider text-gray-700'>AVAILABILITY</p>
            <div className='flex flex-col gap-2.5 text-sm font-light text-gray-700'>
              {availabilityList.map((avail, i) => (
                <p className='flex gap-2.5 items-center' key={i}>
                  <input className='w-3.5 h-3.5 accent-primary' type="checkbox" value={avail} onChange={toggleAvailability} /> {avail}
                </p>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Right Side */}
      <div className='flex-1 min-w-0'>
        <div className='flex flex-wrap items-center justify-between gap-3 mb-6'>
          <Title text1={'ALL'} text2={'PRODUCTS'} />
          {/* Product Sort */}
          <select onChange={(e)=>setSortType(e.target.value)} className='border border-slate-300 bg-white text-sm px-3 py-2 rounded-lg text-gray-700 outline-none focus:border-primary cursor-pointer'>
            <option value="relavent">Sort by: Relavent</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>

        {/* Map Products */}
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6'>
          {Array.isArray(filterProducts) && filterProducts.length > 0 ? (
            filterProducts.map((item, index) => (
              <ProductItem
                key={index}
                large
                name={item.name}
                id={item._id}
                price={item.price}
                image={item.image}
                category={item.category}
                brand={item.subCategory}
                models={item.sizes}
                description={item.description}
                rating={item.avgRating}
                reviewCount={item.reviewCount}
                stock={item.stock}
              />
            ))
          ) : (
            <p className='text-gray-500 col-span-full text-center py-10'>No products found</p>
          )}
        </div>
      </div>

    </div>
  );
};

export default Collections;
