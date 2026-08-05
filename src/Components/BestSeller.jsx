import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../contexts/ShopContext'
import Title from './Title';
import ProductItem from '../Components/ProductItem';

const BestSeller = () => {
    const {products} = useContext(ShopContext);
    const [bestSeller,setBestSeller] = useState([]);
    useEffect(()=>{
        const bestProduct = products.filter((item)=>(item.bestseller));
        setBestSeller(bestProduct.slice(0,5))
    },[products])
return (
    <div className='mt-8'>
        <div className='text-center text-3xl py-8'>
        <Title text1={'TOP'} text2={'SELLERS'}/>
        <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
            The most trusted power solutions our customers rely on.
        </p>
        </div>
        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 gap-y-6'>
            {
                bestSeller.map((item,index)=>(
                    <ProductItem key={index} name={item.name} id={item._id} price={item.price} image={item.image} category={item.category} brand={item.subCategory} models={item.sizes} description={item.description} rating={item.avgRating} reviewCount={item.reviewCount} stock={item.stock}/>
                ))
            }
        </div>
    </div>
    )
}
export default BestSeller
