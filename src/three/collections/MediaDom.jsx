import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

import { DEFAULT as ease } from '../../utils/easing';
import { calculate, split } from '../../utils/text';

export default function MediaDom({ element, onClose, index }) {
  const bounds = useRef(null);

  const media = useRef(null);

  const collection = useRef(null);

  const title = useRef(null);
  const titleSpans = useRef([]);

  const size = useRef(null);
  const sizeIcon = useRef(null);
  const sizeIconPaths = useRef(null);
  const sizeIconLine = useRef(null);
  const sizeSpans = useRef([]);
  const sizeLines = useRef(null);

  const star = useRef(null);
  const starIcon = useRef(null);
  const starIconPath = useRef(null);
  const starSpans = useRef([]);
  const starLines = useRef(null);

  const info = useRef(null);
  const infoLabel = useRef(null);
  const infoSpans = useRef(null);
  const infoLines = useRef(null);

  const disclaimer = useRef(null);
  const disclaimerLabel = useRef(null);
  const disclaimerSpans = useRef(null);
  const disclaimerLines = useRef(null);

  const link = useRef(null);
  const close = useRef(null);

  useEffect(() => {
    media.current = element.querySelector('.detail__media');

    collection.current = element.querySelector(
      '.detail__information__collection__text'
    );

    title.current = element.querySelector('.detail__information__title');

    size.current = element.querySelector(
      '.detail__information__highlight:first-of-type .detail__information__highlight__text'
    );
    sizeIcon.current = element.querySelector(
      '.detail__information__highlight__icon--arrow'
    );
    sizeIconPaths.current = element.querySelectorAll(
      '.detail__information__highlight__icon--arrow path:nth-child(2), .detail__information__highlight__icon--arrow path:nth-child(3)'
    );
    sizeIconLine.current = element.querySelector(
      '.detail__information__highlight__icon--arrow path:nth-child(1)'
    );

    star.current = element.querySelector(
      '.detail__information__highlight:last-of-type .detail__information__highlight__text'
    );
    starIcon.current = element.querySelector(
      '.detail__information__highlight__icon--star'
    );
    starIconPath.current = element.querySelector(
      '.detail__information__highlight__icon--star path:first-child'
    );

    info.current = element.querySelector(
      '.detail__information__item:first-of-type .detail__information__item__description'
    );
    infoLabel.current = element.querySelector(
      '.detail__information__item:first-of-type .detail__information__item__title__text'
    );

    disclaimer.current = element.querySelector(
      '.detail__information__item:last-of-type .detail__information__item__description'
    );
    disclaimerLabel.current = element.querySelector(
      '.detail__information__item:last-of-type .detail__information__item__title__text'
    );

    link.current = element.querySelector('.detail__information__link');

    close.current = element.querySelector('.detail__button');

    createTitle();
    createSize();
    createStar();
    createInfo();
    createDisclaimer();
    createLink();

    close.current.addEventListener('click', () => onClose(index));
  }, []);

  const createTitle = () => {
    titleSpans.current = split({
      append: true,
      element: title.current,
      expression: '<br>',
    });

    titleSpans.current.forEach((el) => {
      split({ append: false, element: el, expression: '' });
    });
  };

  const createSize = () => {
    split({ append: true, element: size.current, expression: ' ' });

    split({ append: false, element: size.current, expression: ' ' });

    sizeSpans.current = size.current.querySelectorAll('span span');
  };

  const createStar = () => {
    split({ append: true, element: star.current, expression: ' ' });

    split({ append: false, element: star.current, expression: ' ' });

    starSpans.current = star.current.querySelectorAll('span span');
  };

  const createInfo = () => {
    split({ append: true, element: info.current, expression: ' ' });

    split({ append: false, element: info.current, expression: ' ' });

    infoSpans.current = info.current.querySelectorAll('span span');
  };

  const createDisclaimer = () => {
    split({ append: true, element: disclaimer.current, expression: ' ' });

    split({ append: false, element: disclaimer.current, expression: ' ' });

    disclaimerSpans.current = disclaimer.current.querySelectorAll('span span');
  };

  const createLink = () => {
    if (link.current.children.length === 0) return;

    const text = link.current.children[0].textContent;

    const textElement = document.createElement('div');
    textElement.innerHTML = text;
    const textSpans = split({
      append: false,
      element: textElement,
      expression: '',
    });

    const hoverElement = document.createElement('div');
    hoverElement.innerHTML = text;
    const hoverSpans = split({
      append: false,
      element: hoverElement,
      expression: '',
    });

    link.current.innerHTML = '';
    link.current.appendChild(textElement);
    link.current.appendChild(hoverElement);

    gsap.set(hoverElement, { position: 'absolute', top: 0, left: 0 });

    const tl = gsap.timeline({ paused: true });

    tl.to(
      textSpans,
      {
        ease,
        transform: 'rotate3d(1, 0.2, 0, -90deg)',
        stagger: 0.02,
      },
      0
    );

    tl.fromTo(
      hoverSpans,
      {
        transform: 'rotate3d(1, 0.2, 0, 90deg)',
      },
      {
        ease,
        transform: 'rotate3d(0, 0, 0, 90deg)',
        stagger: 0.02,
      },
      0.05
    );

    const onMouseEnter = () => tl.play();

    const onMouseLeave = () => tl.reverse();

    link.current.addEventListener('mouseenter', onMouseEnter);
    link.current.addEventListener('mouseleave', onMouseLeave);
  };

  const animateIn = () => {
    const tl = gsap.timeline({ delay: 0.5 });

    tl.call(() => element.classList.add('detail--active'));

    tl.fromTo(
      collection.current,
      { y: '100%' },
      { y: 0, duration: 1, ease },
      0
    );

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

    sizeLines.current.forEach((el, index) => {
      tl.fromTo(
        el,
        { y: '100%' },
        { y: '0%', duration: 1, ease, delay: 0.05 * index },
        '-=0.9'
      );
    });

    tl.fromTo(
      sizeIcon.current,
      { autoAlpha: 0, rotation: 45 },
      { autoAlpha: 1, rotation: 0, duration: 1, ease },
      '-=0.9'
    );

    tl.fromTo(
      sizeIconPaths.current[0],
      { autoAlpha: 0, transformOrigin: '50% 50%', x: '-50%' },
      {
        autoAlpha: 1,
        transformOrigin: '50% 50%',
        x: '0%',
        duration: 1.5,
        ease,
      },
      '-=0.9'
    );

    tl.fromTo(
      sizeIconPaths.current[1],
      { autoAlpha: 0, transformOrigin: '50% 50%', x: '-50%' },
      {
        autoAlpha: 1,
        transformOrigin: '50% 50%',
        x: '0%',
        duration: 1.5,
        ease,
      },
      '-=1.5'
    );

    tl.fromTo(
      sizeIconLine.current,
      { autoAlpha: 0, transformOrigin: '50% 50%', scale: 0 },
      {
        autoAlpha: 1,
        transformOrigin: '50% 50%',
        scale: 1,
        duration: 1.5,
        ease,
      },
      '-=1.5'
    );

    starLines.current.forEach((el, index) => {
      tl.fromTo(
        el,
        { y: '100%' },
        { y: '0%', duration: 1, ease, delay: 0.05 * index },
        '-=0.9'
      );
    });

    tl.fromTo(
      starIcon.current,
      { autoAlpha: 0, rotation: 360 },
      { autoAlpha: 1, rotation: 0, duration: 1, ease },
      '-=0.9'
    );

    tl.fromTo(
      starIconPath.current,
      { autoAlpha: 0, transformOrigin: '50% 50%', scale: 0 },
      {
        autoAlpha: 1,
        transformOrigin: '50% 50%',
        scale: 1,
        duration: 1.5,
        ease,
      },
      '-=0.9'
    );

    tl.fromTo(
      infoLabel.current,
      { y: '100%' },
      { y: '0%', duration: 1, ease },
      '-=1.4'
    );

    infoLines.current.forEach((el, index) => {
      tl.fromTo(
        el,
        { y: '100%' },
        { y: '0%', duration: 1, ease, delay: 0.05 * index },
        '-=1'
      );
    });

    tl.fromTo(
      disclaimerLabel.current,
      { y: '100%' },
      { y: '0%', duration: 1, ease },
      '-=0.95'
    );

    disclaimerLines.current.forEach((el, index) => {
      tl.fromTo(
        el,
        { y: '100%' },
        { y: '0%', duration: 1, ease, delay: 0.05 * index },
        '-=1'
      );
    });

    tl.fromTo(
      link.current,
      { y: '100%' },
      { y: '0%', duration: 1, ease },
      '-=0.95'
    );
  };

  const animateOut = () => {
    element.classList.remove('detail--active');
  };

  const onResize = () => {
    bounds.current = media.current.getBoundingClientRect();

    sizeLines.current = calculate(sizeSpans.current);
    starLines.current = calculate(starSpans.current);
    infoLines.current = calculate(infoSpans.current);
    disclaimerLines.current = calculate(disclaimerSpans.current);
  };

  return {
    animateIn,
    animateOut,
    onResize,
    bounds: bounds,
  };
}
