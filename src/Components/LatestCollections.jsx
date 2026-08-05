import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../contexts/ShopContext'
import Title from './Title';
import ProductItem from './ProductItem';

const LatestCollections = () => {

    const { products } = useContext(ShopContext);
    const [latestProducts,setLatestProducts] = useState([]);

    useEffect(()=>{
      setLatestProducts(products.slice(0,10));
    },[products])
  return (
    <div className='mt-10 mb-8'>
      <div className='text-center py-8 text-3xl'>
        <Title text1={'LATEST'} text2={'ARRIVALS'} />
        <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
        Newly arrived chargers, stabilizers, inverters, and charging accessories.
        </p>
      </div>
      {/* Rendering Products*/}
      <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 gap-y-6'>
        {
          latestProducts.map((item,index)=>(
            <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price} category={item.category} brand={item.subCategory} models={item.sizes} description={item.description} rating={item.avgRating} reviewCount={item.reviewCount} stock={item.stock}/>
                    ))
        }

      </div>
    </div>
  )
}
export default LatestCollections
