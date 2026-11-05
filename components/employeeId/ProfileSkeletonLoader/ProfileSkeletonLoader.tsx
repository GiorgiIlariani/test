import React from 'react';

const ProfileSkeletonLoader = () => {
  return (
    <section className='grid grid-rows-[1fr]  transition-all duration-300 ease-out'>
      {Array.from(Array(5).keys()).map((item) => (
        <div
          key={item}
          className={`group overflow-hidden h-88 animate-pulse rounded-md bg-gray-300 border-[#F5F6F8]  my-6 p-5 w-280 mx-auto transition-all duration-300 relative`}
        />
      ))}
    </section>
  );
};

export default ProfileSkeletonLoader;
