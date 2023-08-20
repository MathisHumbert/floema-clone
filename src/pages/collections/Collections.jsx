import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

import usePage from '../../context/pageContext';
import { linkResolver } from '../../utils/prismic';
import { split } from '../../utils/text';
import Button from '../../components/Button';

export default function Collections() {
  const element = useRef();
  const articlesDescriptions = useRef([]);
  const { dataLoaded, pageLoaded, data, loadPage } = usePage();

  useEffect(() => {
    if (!dataLoaded && !pageLoaded) return;

    loadPage();
  }, [dataLoaded]);

  useEffect(() => {
    if (!element.current || !pageLoaded) return;

    element.current.classList.add('collections--active');

    gsap.set(document.documentElement, {
      backgroundColor: element.current.getAttribute('data-background'),
      color: element.current.getAttribute('data-color'),
    });

    paragraphAnimation();
  }, [pageLoaded]);

  const paragraphAnimation = () => {
    articlesDescriptions.current.forEach((el) => {
      split({ element: el, expression: '<br>' });

      split({ element: el, expression: '<br>' });
    });
  };

  if (!dataLoaded) return null;

  const { collections, home, products } = data;

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
                ref={(el) => {
                  if (el !== null && articlesDescriptions.current.length < 4) {
                    articlesDescriptions.current.push(el);
                  }
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
      {products.map((product, index) => {
        return (
          <article
            key={index}
            className='detail'
            data-background='#BC978C'
            data-color='#F9F1E7'
          >
            <div className='detail__wrapper'>
              <figure className='detail__media'>
                <img
                  data-src={product.data.image.url}
                  alt={product.data.image.alt}
                  className='detail__media__image'
                />
              </figure>
              <div className='detail__information'>
                <p className='detail__information__collection'>
                  <span className='detail__information__collection__text'>
                    {product.data.collection.slug}
                  </span>
                </p>
                <h1
                  className='detail__information__title'
                  dangerouslySetInnerHTML={{
                    __html: product.data.title.replace(' ', '<br>'),
                  }}
                />
                <div className='detail__information__content'>
                  <div className='detail__information__highlights'>
                    {product.data.highlights.map(
                      (highlight, highlightIndex) => (
                        <p
                          className='detail__information__highlight'
                          key={highlightIndex}
                        >
                          {highlight.highlights_icon.toLowerCase() ===
                          'arrow' ? (
                            <svg
                              className='detail__information__highlight__icon detail__information__highlight__icon--arrow'
                              xmlns='http://www.w3.org/2000/svg'
                              viewBox='0 0 40 40'
                            >
                              <path
                                stroke='#fff'
                                d='M14.84,25.46l11.31-11.31'
                              />
                              <path
                                fill='#fff'
                                d='M30.75,9.55l-0.66,2.36l-0.05,2.59l-1.93-2.31l-2.31-1.93l2.59-0.05L30.75,9.55z'
                              />
                              <path
                                fill='#fff'
                                d='M10.25,30.05l0.66-2.36l0.05-2.59l1.93,2.31l2.31,1.93l-2.59,0.05L10.25,30.05z'
                              />
                              <path
                                fill='none'
                                stroke='#fff'
                                d='M20,0.5c10.77,0,19.5,8.73,19.5,19.5S30.77,39.5,20,39.5S0.5,30.77,0.5,20S9.23,0.5,20,0.5z'
                              />
                            </svg>
                          ) : (
                            <svg
                              className='detail__information__highlight__icon detail__information__highlight__icon--star'
                              xmlns='http://www.w3.org/2000/svg'
                              viewBox='0 0 40 40'
                            >
                              <path
                                fill='#fff'
                                d='M24.26,9.87l-2.76,8.6l8.72-2.63l-8.16,4.13l8.15,4.26l-8.71-2.82l2.82,8.91l-4.26-8.34l-4.14,8.15l2.63-8.72 l-8.6,2.75l8.15-4.2l-8.34-4.33l8.78,2.82l-2.82-8.78l4.33,8.34L24.26,9.87z'
                              />
                              <path
                                fill='none'
                                stroke='#fff'
                                d='M20,0.5c10.77,0,19.5,8.73,19.5,19.5S30.77,39.5,20,39.5S0.5,30.77,0.5,20S9.23,0.5,20,0.5z'
                              />
                            </svg>
                          )}
                          <span
                            className='detail__information__highlight__text'
                            dangerouslySetInnerHTML={{
                              __html: highlight.highlights_text.replace(
                                /\n/,
                                '<br>'
                              ),
                            }}
                          />
                        </p>
                      )
                    )}
                  </div>
                  <div className='detail__information__list'>
                    {product.data.informations.map((item, itemIndex) => (
                      <p key={itemIndex} className='detail__information__item'>
                        <strong className='detail__information__item__title'>
                          <span className='detail__information__item__title__text'>
                            {item.informations_label}
                          </span>
                        </strong>
                        <span className='detail__information__item__description'>
                          {item.informations_description}
                        </span>
                      </p>
                    ))}
                  </div>
                  <footer className='detail__information__footer'>
                    <a
                      href={product.data.link_url.url}
                      target='_blank'
                      className='detail__information__link'
                      data-animation='link'
                    >
                      <span>{product.data.link_text}</span>
                    </a>
                  </footer>
                </div>
              </div>
            </div>
            <Button className='detail__button' data-animation='button'>
              <>
                <span>Close</span>
                <svg
                  className='detail__button__icon'
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 124 60'
                >
                  <path
                    fill='none'
                    stroke='#fff'
                    opacity='0.4'
                    d='M62,0.5c33.97,0,61.5,13.21,61.5,29.5S95.97,59.5,62,59.5S0.5,46.29,0.5,30S28.03,0.5,62,0.5z'
                  />
                  <path
                    fill='none'
                    stroke='#fff'
                    d='M62,0.5c33.97,0,61.5,13.21,61.5,29.5S95.97,59.5,62,59.5S0.5,46.29,0.5,30S28.03,0.5,62,0.5z'
                  />
                </svg>
              </>
            </Button>
          </article>
        );
      })}
    </div>
  );
}
