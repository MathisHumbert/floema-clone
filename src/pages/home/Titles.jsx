import React, { useEffect, useMemo, useRef } from 'react';
import Prefix from 'prefix';
import normalizeWheel from 'normalize-wheel';

import { getOffset } from '../../utils/dom';
import useTouchEvents from '../../hooks/useTouchEvent';
import { gsap } from 'gsap';

export default function Titles({ collections }) {
  const items = useRef([]);
  const list = useRef();
  const itemsHeightTotal = useRef(0);
  const scroll = useRef({
    current: 0,
    target: 0,
    last: 0,
    position: 0,
    start: 0,
    speed: 2,
    ease: 0.1,
    direction: '',
  });
  const isDown = useRef(false);

  useEffect(() => {
    onResize();

    window.addEventListener('resize', onResize);
    const updateId = requestAnimationFrame(update);

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(updateId);
    };
  }, []);

  const transformPrefix = useMemo(() => Prefix('transform'), []);

  const onResize = () => {
    items.current.forEach((element) => {
      if (element === null) return;

      const offset = getOffset(element, scroll.current.current);

      element.extra = 0;
      element.height = offset.height;
      element.offset = offset.top;
      element.position = 0;
    });

    itemsHeightTotal.current = list.current.clientHeight;
  };

  const onWheel = (event) => {
    const { pixelY } = normalizeWheel(event);

    scroll.current.target += pixelY * 0.5;
    scroll.current.speed = pixelY > 0 ? 2 : -2;
  };

  const onTouchDown = (event) => {
    isDown.current = true;

    scroll.current.position = scroll.current.current;
    scroll.current.start = event.touches
      ? event.touches[0].clientY
      : event.clientY;
  };

  const onTouchMove = (event) => {
    if (!isDown.current) return;

    const y = event.touches ? event.touches[0].clientY : event.clientY;
    const distance = (scroll.current.start - y) * 2;

    scroll.current.target = scroll.current.position + distance;
  };

  const onTouchUp = () => {
    isDown.current = false;
  };

  useTouchEvents(onWheel, onTouchDown, onTouchMove, onTouchUp);

  const transform = (element, y) => {
    element.style[transformPrefix] = `translate3d(0, ${Math.floor(y)}px, 0)`;
  };

  const update = () => {
    scroll.current.target += scroll.current.speed;
    scroll.current.current = gsap.utils.interpolate(
      scroll.current.current,
      scroll.current.target,
      scroll.current.ease
    );

    if (scroll.current.current < scroll.current.last) {
      scroll.current.direction = 'bottom';
    } else {
      scroll.current.direction = 'top';
    }

    items.current.forEach((element) => {
      if (element === null) return;

      element.position = -scroll.current.current - element.extra;

      const offset = element.position + element.offset + element.height;

      element.isBefore = offset < 0;
      element.isAfter = offset > itemsHeightTotal.current;

      if (scroll.current.direction === 'top' && element.isBefore) {
        element.extra = element.extra - itemsHeightTotal.current;

        element.isBefore = false;
        element.isAfter = false;
      }

      if (scroll.current.direction === 'bottom' && element.isAfter) {
        element.extra = element.extra + itemsHeightTotal.current;

        element.isBefore = false;
        element.isAfter = false;
      }

      transform(element, element.position);
    });

    scroll.current.last = scroll.current.current;

    requestAnimationFrame(update);
  };

  return (
    <div className='home__titles' ref={list}>
      {collections.map((collection, index) => (
        <React.Fragment key={index}>
          <div
            className='home__titles__label'
            ref={(el) => items.current.push(el)}
          >
            <div className='home__titles__label__text'>
              Collection{' '}
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
          <div
            className='home__titles__title'
            ref={(el) => items.current.push(el)}
          >
            <div className='home__titles__title__text'>
              {collection.data.title}
            </div>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}
