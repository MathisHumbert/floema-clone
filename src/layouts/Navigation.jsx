import React from 'react';

import usePage from '../../context/pageContext';

export default function Navigation() {
  const { data } = usePage();

  console.log(data);

  return (
    <nav className='navigation'>
      <a href='/' className='navigation__link'></a>
    </nav>
  );
}
