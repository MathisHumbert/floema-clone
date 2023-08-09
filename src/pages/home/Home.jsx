import React from 'react';
import { useSinglePrismicDocument } from '@prismicio/react';

export default function Home() {
  const [home] = useSinglePrismicDocument('home');

  return (
    <div className='home home--active'>
      <div className='home__wrapper'>HOME</div>
    </div>
  );
}
