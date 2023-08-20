import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

import usePage from '../context/pageContext';
import { split } from '../utils/text';

export default function Preloader() {
  const element = useRef(null);
  const title = useRef(null);
  const titleSpans = useRef(null);
  const numberText = useRef(null);

  const { data, preloaded, setDataLoaded } = usePage();

  useEffect(() => {
    if (!data.preloader) return;

    titleSpans.current = split({
      append: true,
      element: title.current,
      expression: '<br>',
    });

    titleSpans.current.forEach((el) => {
      split({
        append: false,
        element: el,
        expression: '',
      });
    });

    createLoader();
  }, [data]);

  useEffect(() => {
    if (preloaded) {
      onLoaded();
    }
  }, [preloaded]);

  const createLoader = () => {
    const tl = gsap.timeline();

    tl.set(title.current, { autoAlpha: 1 });

    titleSpans.current.forEach((line, index) => {
      const letters = line.querySelectorAll('span');

      const onStart = () => {
        gsap.fromTo(
          letters,
          { autoAlpha: 0, y: '100%', display: 'inline-block' },
          {
            autoAlpha: 1,
            y: '0%',
            display: 'inline-block',
            duration: 1,
            ease: 'back.inOut',
            delay: 0.2,
            stagger: 0.015,
          }
        );
      };

      tl.fromTo(
        line,
        { autoAlpha: 0, y: '100%' },
        {
          autoAlpha: 1,
          y: '0%',
          duration: 1.5,
          ease: 'expo.inOut',
          delay: 0.2 * index,
          onStart,
        },
        0
      );
    });
  };

  const onLoaded = () => {
    const tl = gsap.timeline({ delay: 1, onStart: () => setDataLoaded(true) });

    titleSpans.current.forEach((line, index) => {
      const letters = line.querySelectorAll('span');

      const onStart = () => {
        gsap.to(letters, {
          autoAlpha: 0,
          y: '-100%',
          display: 'inline-block',
          duration: 1,
          ease: 'back.inOut',
          delay: 0.2,
          stagger: 0.015,
        });
      };

      tl.to(
        line,
        {
          autoAlpha: 0,
          y: '-100%',
          duration: 1.5,
          ease: 'expo.inOut',
          delay: 0.2 * index,
          onStart,
        },
        0
      );
    });

    tl.to(numberText.current, { autoAlpha: 0, duration: 1 }, 0).to(
      element.current,
      { autoAlpha: 0, duration: 1 }
    );
  };

  if (!data.preloader) return null;

  return (
    <div ref={element} className='preloader'>
      <p
        ref={title}
        className='preloader__text'
        dangerouslySetInnerHTML={{
          __html: data.preloader.data.title.replace(/\n/g, '<br>'),
        }}
      />
      <div className='preloader__number'>
        <div className='preloader__number__text' ref={numberText}>
          0%
        </div>
      </div>
    </div>
  );
}
