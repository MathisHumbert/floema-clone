import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

import usePage from '../../context/pageContext';

export default function About() {
  const element = useRef();
  const { dataLoaded, pageLoaded, data, loadPage } = usePage();

  useEffect(() => {
    if (!dataLoaded) return;

    loadPage();
  }, [dataLoaded]);

  useEffect(() => {
    if (!element.current || !pageLoaded) return;

    element.current.classList.add('home--active');

    gsap.set(document.documentElement, {
      backgroundColor: element.current.getAttribute('data-background'),
      color: element.current.getAttribute('data-color'),
    });
  }, [pageLoaded]);

  if (!dataLoaded) return null;

  const {} = data;

  return (
    <div
      ref={element}
      className='about'
      id='page'
      data-background='#B2B8C3'
      data-color='#37384C'
    >
      <div className='about__wrapper'>About</div>
    </div>
  );
}
