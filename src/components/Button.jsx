import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

import { split } from '../utils/text';
import { DEFAULT as ease } from '../utils/easing';

export default function Button({ children, ...props }) {
  const element = useRef();

  useEffect(() => {
    if (element.current.children.length === 0) return;

    const text = element.current.textContent;
    const spanElement = element.current.children[0];

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

    spanElement.innerHTML = '';
    spanElement.appendChild(textElement);
    spanElement.appendChild(hoverElement);

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

    const path = element.current.querySelector('path:last-child');
    const pathLength = path.getTotalLength();
    let pathValue = pathLength;

    gsap.set(path, {
      strokeDashoffset: pathLength,
      strokeDasharray: `${pathLength} ${pathLength}`,
    });

    const onMouseEnter = () => {
      pathValue -= pathLength;
      gsap.to(path, {
        strokeDashoffset: pathValue,
        duration: 1,
        ease,
      });

      tl.play();
    };

    const onMouseLeave = () => {
      pathValue -= pathLength;

      gsap.to(path, {
        strokeDashoffset: pathValue,
        duration: 1,
        ease,
      });

      tl.reverse();
    };

    element.current.addEventListener('mouseenter', onMouseEnter);
    element.current.addEventListener('mouseleave', onMouseLeave);
  }, []);

  return (
    <button {...props} ref={element}>
      {children}
    </button>
  );
}
