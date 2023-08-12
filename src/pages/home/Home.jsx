import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

import Titles from './Titles';
import { Link } from '../../router/Router';
import Button from '../../components/Button';
import usePage from '../../context/pageContext';
import { linkResolver } from '../../utils/prismic';

export default function Home() {
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

  const { home, collections } = data;

  return (
    <div
      ref={element}
      className='home'
      id='page'
      data-background='#C97164'
      data-color='#F9F1E7'
    >
      <div className='home__wrapper'>
        <Titles collections={collections} />
        <div className='home__gallery'>
          {[...home.data.gallery, ...home.data.gallery].map((media, index) => (
            <figure
              key={index}
              className={`home__gallery__media home__gallery__media--${
                (index % 5) + 1
              }`}
            >
              <img
                src={media.image.url}
                data-src={media.image.url}
                alt={media.image.alt}
                className='home__gallery__media__image'
              />
            </figure>
          ))}
        </div>
        <Link to={linkResolver(home.data.collections)} className='home__link'>
          <Button className='home__link__button' data-animation='button'>
            <span>{home.data.button}</span>
            <svg
              className='home__link__icon'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 288 60'
            >
              <path
                stroke='#fff'
                opacity='0.4'
                fill='none'
                d='M144,0.5c79.25,0,143.5,13.21,143.5,29.5S223.25,59.5,144,59.5S0.5,46.29,0.5,30S64.75,0.5,144,0.5z'
              ></path>
              <path
                stroke='#fff'
                fill='none'
                d='M144,0.5c79.25,0,143.5,13.21,143.5,29.5S223.25,59.5,144,59.5S0.5,46.29,0.5,30S64.75,0.5,144,0.5z'
              ></path>
            </svg>
          </Button>
        </Link>
      </div>
    </div>
  );
}
