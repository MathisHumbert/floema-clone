import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { gsap } from 'gsap';
import imagesLoaded from 'imagesloaded';

import usePage from '../../context/pageContext';
import Media from './Media';

export default function Home() {
  const [gallery, setGallery] = useState(null);
  const [medias, setMedias] = useState(null);
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
  const isDown = useRef(false);

  const { loaded } = usePage();
  const planeGeometry = new THREE.PlaneGeometry(1, 1, 20, 20);

  useEffect(() => {
    if (!loaded) return;

    const galleryElement = document.querySelector('.home__gallery');
    const mediasElements = document.querySelectorAll(
      '.home__gallery__media__image'
    );

    const imgLoaded = imagesLoaded(mediasElements, {
      background: true,
    });

    imgLoaded.on('done', () => {
      setGallery(galleryElement);
      setMedias([...mediasElements]);
    });
  }, [loaded]);

  useEffect(() => {
    window.addEventListener('mousedown', onTouchDown);
    window.addEventListener('mousemove', onTouchMove);
    window.addEventListener('mouseup', onTouchUp);

    window.addEventListener('touchstart', onTouchDown);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchUp);

    document.body.classList.remove('loading');

    () => {
      window.removeEventListener('mousedown', onTouchDown);
      window.removeEventListener('mousemove', onTouchMove);
      window.removeEventListener('mouseup', onTouchUp);

      window.removeEventListener('touchstart', onTouchDown);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchUp);
    };
  }, []);

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
    const distance = scroll.current.start - y;

    scroll.current.target = scroll.current.position + distance;
  };

  const onTouchUp = () => {
    isDown.current = false;
  };

  useFrame(() => {
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

  if (!loaded || !gallery || !medias) return null;

  return (
    <>
      {medias.map((media) => (
        <Media
          key={index}
          element={media}
          galleryElement={gallery}
          geometry={planeGeometry}
          scroll={scroll.current}
          speed={speed.current}
        />
      ))}
    </>
  );
}
