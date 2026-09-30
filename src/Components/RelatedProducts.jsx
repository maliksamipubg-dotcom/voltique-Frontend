import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../contexts/ShopContext'
import ProductItem from './ProductItem';
import Title from './Title';
import { Reveal, RevealGroup } from './Reveal';

const RelatedProducts = ({category,subCategory}) => {

    const { products } = useContext(ShopContext);
    const [related,setRelated] =useState([]);

    useEffect(()=>{
        if (products.length > 0) {
            let productsCopy = products.slice();
            productsCopy = productsCopy.filter((item) => category === item.category);
            productsCopy = productsCopy.filter((item) => subCategory === item.subCategory);
            setRelated(productsCopy.slice(0,5));

        }

    },[products])
    return (
    <section className='my-20 sm:my-24'>
        <Reveal className='text-center py-2 mb-6'>
            <Title text1={'RELATED'} text2={'PRODUCTS'} />
            <h2 className='text-3xl sm:text-4xl font-semibold text-ink heading-font tracking-tight'>You may also like</h2>
        </Reveal>
        <RevealGroup className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 gap-y-6'>
            {related.map((item,index)=>(
                <ProductItem key={index} id={item._id} name={item.name} price={item.price} image={item.image} category={item.category} brand={item.subCategory} models={item.sizes} description={item.description} rating={item.avgRating} reviewCount={item.reviewCount} stock={item.stock} />
            ))}
        </RevealGroup>
    </section>
)
}

export default RelatedProducts
