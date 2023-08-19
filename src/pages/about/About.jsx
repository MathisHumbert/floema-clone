import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import * as prismic from '@prismicio/client';

import usePage from '../../context/pageContext';
import Parallax from '../../components/Parallax';
import { calculate, split } from '../../utils/text';
import { DEFAULT as ease } from '../../utils/easing';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const element = useRef();
  const paragraphElements = useRef();
  const { dataLoaded, pageLoaded, data, loadPage } = usePage();

  useEffect(() => {
    if (!dataLoaded) return;

    loadPage();
    paragraphAnimation();

    window.addEventListener('resize', () => {
      paragraphElements.current.forEach((el) => {
        el.groupLines = calculate(el.lines);
      });
    });
  }, [dataLoaded]);

  useEffect(() => {
    if (!element.current || !pageLoaded) return;

    element.current.classList.add('about--active');

    gsap.set(document.documentElement, {
      backgroundColor: element.current.getAttribute('data-background'),
      color: element.current.getAttribute('data-color'),
    });
  }, [pageLoaded]);

  const paragraphAnimation = () => {
    paragraphElements.current = [
      ...element.current.querySelectorAll('[data-animation="paragraph"]'),
    ];

    paragraphElements.current.forEach((el) => {
      el.lines = [];
      el.groupLines;
      const paragraphs = [...el.querySelectorAll('h1, h2, p')];

      if (paragraphs.length !== 0) {
        paragraphs.forEach((p) => {
          split({ element: p });
          split({ element: p });

          el.lines.push(...el.querySelectorAll('span span'));
        });
      } else {
        split({ element: el });
        split({ element: el });

        el.lines.push(...el.querySelectorAll('span span'));
      }

      el.groupLines = calculate(el.lines);

      gsap.set(el.groupLines, { yPercent: 100 });

      ScrollTrigger.create({
        trigger: el,
        onEnter: () => {
          el.groupLines.forEach((line, index) => {
            gsap.to(line, {
              yPercent: 0,
              duration: 1.5,
              delay: 0.1 * index,
              ease,
            });
          });
        },
        onEnterBack: () => {
          el.groupLines.forEach((line, index) => {
            gsap.to(line, {
              yPercent: 0,
              duration: 1.5,
              delay: 0.1 * index,
              ease,
            });
          });
        },
        onLeave: () => gsap.set(el.groupLines, { yPercent: 100 }),
        onLeaveBack: () => gsap.set(el.groupLines, { yPercent: 100 }),
      });
    });
  };

  if (!dataLoaded) return null;

  const { about } = data;

  return (
    <div
      ref={element}
      className='about'
      id='page'
      data-background='#B2B8C3'
      data-color='#37384C'
    >
      <div className='about__wrapper'>
        <section className='about__gallery'>
          <div className='about__gallery__wrapper'>
            {about.data.gallery.map((media, index) => (
              <figure key={index} className='about__gallery__media'>
                <img
                  data-src={media.image.url}
                  alt={media.image.alt}
                  className='about__gallery__media__image'
                />
              </figure>
            ))}
          </div>
        </section>
        {about.data.body.map((section, index) => {
          if (section.slice_type === 'title') {
            return (
              <h2
                key={index}
                className='about__title'
                data-animation='paragraph'
                dangerouslySetInnerHTML={{
                  __html: section.primary.text.replace(/\n/g, '<br>'),
                }}
              />
            );
          }

          if (section.slice_type === 'content') {
            return (
              <section
                key={index}
                className={`about__content ${
                  section.primary.type === 'Left'
                    ? 'about__content--left'
                    : 'about__content--right'
                }`}
              >
                <div className='about__content__wrapper'>
                  <div className='about__content__box'>
                    <p
                      className='about__content__label'
                      data-animation='paragraph'
                    >
                      {section.primary.label}
                    </p>
                    <div
                      className='about__content__description'
                      data-animation='paragraph'
                      dangerouslySetInnerHTML={{
                        __html: prismic.asHTML(section.primary.description),
                      }}
                    />
                  </div>
                  <Parallax
                    className='about__content__media'
                    data-animation='parallax'
                  >
                    <img
                      src={section.primary.image.url}
                      alt={section.primary.image.alt}
                      className='about__content__media__image'
                    />
                  </Parallax>
                </div>
              </section>
            );
          }

          if (section.slice_type === 'highlight') {
            return (
              <section className='about__highlight' key={index}>
                <div className='about__highlight__wrapper'>
                  <a
                    href={section.primary.link.url}
                    target='_blank'
                    className='about__highlight__link'
                  >
                    {section.primary.label && (
                      <p
                        className='about__highlight__label'
                        data-animation='paragraph'
                      >
                        {section.primary.label}
                      </p>
                    )}
                    <h3
                      className='about__highlight__title'
                      data-animation='highlight'
                    >
                      {section.primary.title}
                    </h3>
                  </a>
                  <div className='about__highlight__medias'>
                    {section.items.map((media, mediaIndex) => (
                      <Parallax
                        key={mediaIndex}
                        className='about__highlight__media'
                        data-animation='parallax'
                      >
                        <img
                          src={media.image.url}
                          alt={media.image.alt}
                          className='about__highlight__media__image'
                        />
                      </Parallax>
                    ))}
                  </div>
                </div>
              </section>
            );
          }

          if (section.slice_type === 'gallery') {
            return (
              <section key={index} className='about__gallery'>
                <div className='about__gallery__wrapper'>
                  {section.items.map((media, mediaIndex) => (
                    <figure key={mediaIndex} className='about__gallery__media'>
                      <img
                        data-src={media.image.url}
                        alt={media.image.alt}
                        className='about__gallery__media__image'
                      />
                    </figure>
                  ))}
                </div>
              </section>
            );
          }

          return <></>;
        })}
        <footer className='about__footer'>
          <div className='about__footer__copyright'>
            {about.data.footer_copyright}
          </div>
          <div
            className='about__footer__credits'
            dangerouslySetInnerHTML={{
              __html: prismic.asHTML(about.data.footer_credits),
            }}
          />
        </footer>
      </div>
    </div>
  );
}
