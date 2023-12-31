import { useEffect, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useLenis } from '@studio-freight/react-lenis';
import { gsap } from 'gsap';

import Media from './Media';
import useTouchEvents from '../../hooks/useTouchEvent';

export default function Gallery({ element, geometry }) {
  const [wrapper, setWrapper] = useState(null);
  const [medias, setMedias] = useState(null);
  const [images, setImages] = useState(null);
  const [documentsSelected, setDocumentsSelected] = useState(false);
  const [visible, setVisible] = useState(false);
  const group = useRef();
  const scroll = useRef({
    current: 0,
    target: 0,
    last: 0,
    position: 0,
    start: 0,
    ease: 0.1,
    velocity: 1,
    direction: 'top',
  });
  const lenisScroll = useRef({
    current: 0,
    velocity: 0,
  });
  const galleryWidth = useRef(0);
  const isDown = useRef(false);
  const { size, viewport } = useThree();

  useEffect(() => {
    setMedias([...element.querySelectorAll('.about__gallery__media')]);
    setImages([...element.querySelectorAll('.about__gallery__media__image')]);
    setWrapper(element.querySelector('.about__gallery__wrapper'));

    setDocumentsSelected(true);
    setVisible(true);
  }, []);

  useEffect(() => {
    if (!documentsSelected) return;

    galleryWidth.current = (wrapper.clientWidth / size.width) * viewport.width;
  }, [size, viewport, wrapper]);

  const onTouchDown = (event) => {
    if (!documentsSelected) return;

    isDown.current = true;

    scroll.current.position = scroll.current.current;
    scroll.current.start = event.touches
      ? event.touches[0].clientX
      : event.clientX;
  };

  const onTouchMove = (event) => {
    if (!isDown.current || !documentsSelected) return;

    const x = event.touches ? event.touches[0].clientX : event.clientX;
    const distance = scroll.current.start - x;

    scroll.current.target = scroll.current.position + distance;
  };

  const onTouchUp = () => {
    if (!documentsSelected) return;

    isDown.current = false;
  };

  useTouchEvents(() => {}, onTouchDown, onTouchMove, onTouchUp);

  useLenis((lenis) => {
    lenisScroll.current.current = lenis.scroll;
    lenisScroll.current.velocity = lenis.velocity;
  });

  useFrame(() => {
    if (group.current === undefined) return;

    const y = lenisScroll.current.current / size.height;

    if (scroll.current.current < scroll.current.target) {
      scroll.current.direction = 'left';
      scroll.current.velocity = -1;
    } else if (scroll.current.current > scroll.current.target) {
      scroll.current.direction = 'right';
      scroll.current.velocity = 1;
    }

    scroll.current.target -= scroll.current.velocity;
    scroll.current.target += lenisScroll.current.velocity;

    scroll.current.current = gsap.utils.interpolate(
      scroll.current.current,
      scroll.current.target,
      scroll.current.ease
    );

    group.current.position.y = y * viewport.height;
  });

  if (!documentsSelected) return null;

  return (
    <group ref={group}>
      {medias.map((media, index) => (
        <Media
          key={index}
          element={media}
          image={images[index]}
          geometry={geometry}
          scroll={scroll.current}
          lenisScroll={lenisScroll.current}
          galleryWidth={galleryWidth}
          visible={visible}
        />
      ))}
    </group>
  );
}
