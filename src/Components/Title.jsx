import React from 'react'

const Title = ({ text1, text2 }) => {
  return (
    <p className='inline-flex gap-2.5 items-center mb-3'>
      <span className='text-gray-500'>
        {text1} <span className='text-primary font-semibold'>{text2}</span>
      </span>
      <span className='w-8 sm:w-12 h-[2px] bg-gradient-to-r from-primary to-accent rounded-full'></span>
    </p>
  )
}

export default Title
