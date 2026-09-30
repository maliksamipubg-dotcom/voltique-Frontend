import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../contexts/ShopContext'
import Title from './Title';
import ProductItem from '../Components/ProductItem';
import { Reveal, RevealGroup } from './Reveal';

const BestSeller = () => {
    const {products} = useContext(ShopContext);
    const [bestSeller,setBestSeller] = useState([]);
    useEffect(()=>{
        const bestProduct = products.filter((item)=>(item.bestseller));
        setBestSeller(bestProduct.slice(0,5))
    },[products])
return (
    <section className='py-10 sm:py-14'>
        <Reveal className='text-center py-4 sm:py-6 mb-6'>
            <Title text1={'TOP'} text2={'SELLERS'} />
            <h2 className='text-3xl sm:text-4xl font-semibold text-ink heading-font tracking-tight'>Customer favourites</h2>
            <p className='w-full sm:w-3/4 m-auto text-xs sm:text-sm md:text-base text-ink-3 mt-3 leading-relaxed'>
                The most trusted power solutions our customers rely on.
            </p>
        </Reveal>

        <RevealGroup className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 gap-y-6'>
            {
                bestSeller.map((item,index)=>(
                    <ProductItem key={index} name={item.name} id={item._id} price={item.price} image={item.image} category={item.category} brand={item.subCategory} models={item.sizes} description={item.description} rating={item.avgRating} reviewCount={item.reviewCount} stock={item.stock}/>
                ))
            }
        </RevealGroup>
    </section>
    )
}
export default BestSeller
