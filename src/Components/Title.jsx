import React from 'react'

const Title = ({ text1, text2 }) => {

  return (
    <div className='inline-flex gap-2 items-center mb-3'>
      <p className='text-gray-500'>
        {text1} <span className='text-primary-dark font-semibold'>{text2}</span>
      </p>
      <p className='w-8 sm:w-12 h-[2px] bg-gradient-to-r from-primary to-accent rounded-full'></p>
    </div>
  )
}

export default Title
