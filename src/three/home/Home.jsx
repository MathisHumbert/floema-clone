import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { gsap } from 'gsap';
import normalizeWheel from 'normalize-wheel';

import usePage from '../../context/pageContext';
import useTouchEvents from '../../hooks/useTouchEvent';
import Media from './Media';

export default function Home() {
  const [gallery, setGallery] = useState(null);
  const [medias, setMedias] = useState(null);
  const [documentsSelected, setDocumentsSelected] = useState(false);
  const [visible, setVisible] = useState(false);
  const scroll = useRef({
    current: 0,
    target: 0,
    last: 0,
    position: 0,
    start: 0,
    ease: 0.1,
    direction: 'top',
  });
  const speed = useRef({
    current: 0,
    target: 0,
    ease: 0.1,
  });
  const velocity = useRef(-2);
  const isDown = useRef(false);

  const { pageLoaded } = usePage();
  const planeGeometry = new THREE.PlaneGeometry(1, 1, 20, 20);

  useEffect(() => {
    if (!pageLoaded) return;

    setGallery(document.querySelector('.home__gallery'));
    setMedias([...document.querySelectorAll('.home__gallery__media__image')]);

    setVisible(true);
    setDocumentsSelected(true);
  }, [pageLoaded]);

  const onWheel = (event) => {
    if (!documentsSelected) return;

    const { pixelY } = normalizeWheel(event);

    scroll.current.target -= pixelY;
    velocity.current = pixelY > 0 ? -2 : 2;
  };

  const onTouchDown = (event) => {
    if (!documentsSelected) return;

    isDown.current = true;

    scroll.current.position = scroll.current.current;
    scroll.current.start = event.touches
      ? event.touches[0].clientY
      : event.clientY;
  };

  const onTouchMove = (event) => {
    if (!isDown.current || !documentsSelected) return;

    const y = event.touches ? event.touches[0].clientY : event.clientY;
    const distance = scroll.current.start - y;

    scroll.current.target = scroll.current.position + distance;
  };

  const onTouchUp = () => {
    if (!documentsSelected) return;

    isDown.current = false;
  };

  useTouchEvents(onWheel, onTouchDown, onTouchMove, onTouchUp);

  useFrame(() => {
    scroll.current.target += velocity.current;

    speed.current.target =
      (scroll.current.target - scroll.current.current) * 0.001;

    speed.current.current = gsap.utils.interpolate(
      speed.current.current,
      speed.current.target,
      speed.current.ease
    );

    scroll.current.current = gsap.utils.interpolate(
      scroll.current.current,
      scroll.current.target,
      scroll.current.ease
    );

    if (scroll.current.current < scroll.current.last) {
      scroll.current.direction = 'top';
    } else if (scroll.current.current > scroll.current.last) {
      scroll.current.direction = 'bottom';
    }

    scroll.current.last = scroll.current.current;
  });

  if (!pageLoaded || !documentsSelected) return null;

  return (
    <>
      {medias.map((media, index) => (
        <Media
          key={index}
          element={media}
          galleryElement={gallery}
          geometry={planeGeometry}
          scroll={scroll.current}
          speed={speed.current}
          visible={visible}
        />
      ))}
    </>
  );
}
