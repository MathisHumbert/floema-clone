import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

import usePage from '../../context/pageContext';
import { linkResolver } from '../../utils/prismic';

export default function Collections() {
  const element = useRef();
  const { dataLoaded, pageLoaded, data, loadPage } = usePage();

  useEffect(() => {
    if (!dataLoaded) return;

    loadPage();
    paragraphAnimation();
  }, [dataLoaded]);

  useEffect(() => {
    if (!element.current || !pageLoaded) return;

    element.current.classList.add('collections--active');

    gsap.set(document.documentElement, {
      backgroundColor: element.current.getAttribute('data-background'),
      color: element.current.getAttribute('data-color'),
    });
  }, [pageLoaded]);

  const paragraphAnimation = () => {
    // do animation
  };

  if (!dataLoaded) return null;

  const { collections, home } = data;

  return (
    <div
      ref={element}
      className='collections'
      id='page'
      data-background='#BC978C'
      data-color='#F9F1E7'
    >
      <div className='collections__wrapper'>
        <div className='collections__titles'>
          {[0, 1, 2].map((line) => (
            <div key={line} className='collections__titles__wrapper'>
              {collections.map((collection, index) => (
                <div key={index} className='collections__titles__item'>
                  <div className='collections__titles__label'>
                    <div className='home__titles__label__text'>
                      {home.data.collection}
                      <br />
                      {index == 0
                        ? 'One'
                        : index == 1
                        ? 'Two'
                        : index == 2
                        ? 'Three'
                        : index == 3
                        ? 'Four'
                        : ''}
                    </div>
                  </div>
                  <div className='collections__titles__title'>
                    <div className='collections__titles__title__text'>
                      {collection.data.title}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className='collections__gallery'>
          <div className='collections__gallery__wrapper'>
            {collections.map((collection, index) =>
              collection.data.products.map((product, productIndex) => (
                <a
                  key={productIndex}
                  href={linkResolver(product.products_product)}
                  className='collections__gallery__link'
                  data-index={index}
                >
                  <figure
                    className='collections__gallery__media'
                    data-index={index}
                  >
                    <img
                      data-src={product.products_product.data.image.url}
                      alt={product.products_product.data.image.alt}
                      data-model-src={product.products_product.data.model.url}
                      className='collections__gallery__media__image'
                    />
                  </figure>
                </a>
              ))
            )}
          </div>
        </div>
        <div className='collections__content'>
          {collections.map((collection, index) => (
            <article
              key={index}
              className={`collections__article ${
                index === 0 ? 'collections__article--active' : ''
              }`}
            >
              <h2 className='collections__article__title'>
                <span className='collections__article__title__text'>
                  {collection.data.title} {home.data.collection}
                </span>
              </h2>
              <p
                className='collections__article__description'
                dangerouslySetInnerHTML={{
                  __html: collection.data.description.replace(/\n/g, '<br>'),
                }}
              />
            </article>
          ))}
        </div>
        <div className='collections__mobile'>
          {collections.map((collection, index) => (
            <div key={index} className='collections__mobile__item'>
              <div className='collections__mobile__item__label'>
                {home.data.collection}
                <br />
                {index == 0
                  ? 'One'
                  : index == 1
                  ? 'Two'
                  : index == 2
                  ? 'Three'
                  : index == 3
                  ? 'Four'
                  : ''}
              </div>
              <div className='collections__mobile__item__title'>
                {collection.data.title}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
