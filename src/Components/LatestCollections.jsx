import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../contexts/ShopContext'
import Title from './Title';
import ProductItem from './ProductItem';
import { Reveal, RevealGroup } from './Reveal';
import ViewAllProductsButton from './ViewAllProductsButton';

const LatestCollections = () => {

    const { products } = useContext(ShopContext);
    const [latestProducts,setLatestProducts] = useState([]);

    useEffect(()=>{
      setLatestProducts(products.slice(0,10));
    },[products])
  return (
    <section className='py-10 sm:py-14'>
      <Reveal className='text-center py-4 sm:py-6 mb-6'>
        <Title text1={'LATEST'} text2={'ARRIVALS'} />
        <h2 className='text-3xl sm:text-4xl font-semibold text-ink heading-font tracking-tight'>Fresh on the shelves</h2>
        <p className='w-full sm:w-3/4 m-auto text-xs sm:text-sm md:text-base text-ink-3 mt-3 leading-relaxed'>
          Newly arrived chargers, stabilizers, inverters, and charging accessories.
        </p>
      </Reveal>

      {/* Rendering Products*/}
      <RevealGroup className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 gap-y-6'>
        {
          latestProducts.map((item,index)=>(
            <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price} discountAmount={item.discountAmount} category={item.category} brand={item.subCategory} models={item.sizes} description={item.description} rating={item.avgRating} reviewCount={item.reviewCount} stock={item.stock}/>
                    ))
        }
      </RevealGroup>

      {/* Centred "View All Products" CTA — placed below the full product grid */}
      <Reveal className='flex justify-center mt-10 sm:mt-14'>
        <ViewAllProductsButton />
      </Reveal>
    </section>
  )
}
export default LatestCollections
