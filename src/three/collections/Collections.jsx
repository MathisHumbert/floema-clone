import { useEffect, useRef, useState } from 'react';
import { act, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { gsap } from 'gsap';
import normalizeWheel from 'normalize-wheel';

import usePage from '../../context/pageContext';
import useTouchEvents from '../../hooks/useTouchEvent';
import Media from './Media';

export default function Collections() {
  const [galleryWrapper, setGalleryWrapper] = useState(null);
  const [medias, setMedias] = useState(null);
  const collection = useRef();
  const collections = useRef();
  const collectionLinks = useRef();
  const scroll = useRef({
    current: 0,
    target: 0,
    last: 0,
    position: 0,
    start: 0,
    limit: 0,
    velocity: 0,
    direction: 'right',
    ease: 0.1,
  });
  const isDown = useRef(false);
  const activeIndex = useRef(0);
  const { pageLoaded } = usePage();
  const planeGeometry = new THREE.PlaneGeometry(1, 1, 1, 1);
  const { size, viewport } = useThree();

  useEffect(() => {
    if (!pageLoaded) return;

    const galleryWrapperElement = document.querySelector(
      '.collections__gallery__wrapper'
    );
    const mediasElements = document.querySelectorAll(
      '.collections__gallery__media'
    );
    const collectionsElement = document.querySelector('.collections');
    const collectionsElements = document.querySelectorAll(
      '.collections__article'
    );
    const collectionsElementsLinks = document.querySelectorAll(
      '.collections__gallery__link'
    );

    setMedias([...mediasElements]);
    setGalleryWrapper(galleryWrapperElement);

    collection.current = collectionsElement;
    collections.current = [...collectionsElements];
    collectionLinks.current = [...collectionsElementsLinks];
  }, [pageLoaded]);

  useEffect(() => {
    if (!galleryWrapper) return;

    scroll.current.last = scroll.current.target = 0;

    scroll.current.limit = galleryWrapper.clientWidth - medias[0].clientWidth;
  }, [size, viewport, galleryWrapper]);

  const onWheel = (event) => {
    const { pixelY } = normalizeWheel(event);

    scroll.current.target -= pixelY;
  };

  const onTouchDown = (event) => {
    isDown.current = true;

    scroll.current.position = scroll.current.current;
    scroll.current.start = event.touches
      ? event.touches[0].clientX
      : event.clientX;
  };

  const onTouchMove = (event) => {
    if (!isDown.current) return;

    const x = event.touches ? event.touches[0].clientX : event.clientX;
    const distance = scroll.current.start - x;

    scroll.current.target = scroll.current.position - distance;
  };

  const onTouchUp = () => {
    isDown.current = false;
  };

  useTouchEvents(onWheel, onTouchDown, onTouchMove, onTouchUp);

  const onChange = (index) => {
    if (index === Infinity) return;
    activeIndex.current = index;

    const selectedCollection = Number(
      medias[activeIndex.current].getAttribute('data-index')
    );

    collections.current.forEach((element, elementIndex) => {
      if (elementIndex === selectedCollection) {
        element.classList.add('collections__article--active');
      } else {
        element.classList.remove('collections__article--active');
      }
    });
  };

  const onUpdateTitle = () => {
    const map = {
      0: 0,
      1: 0,
      2: 0,
      3: 0,
      4: 0,
    };

    collectionLinks.current.forEach((element) => {
      const index = element.getAttribute('data-index');
    });

    const progress = [
      gsap.utils.clamp(
        0,
        1,
        gsap.utils.mapRange(0, map[0], 0, 1, -scroll.current.current)
      ),
      gsap.utils.clamp(
        0,
        1,
        gsap.utils.mapRange(0, map[1], 0, 1, -scroll.current.current - map[0])
      ),
      gsap.utils.clamp(
        0,
        1,
        gsap.utils.mapRange(
          0,
          map[2],
          0,
          1,
          -scroll.current.current - map[0] - map[1]
        )
      ),
      gsap.utils.clamp(
        0,
        1,
        gsap.utils.mapRange(
          0,
          map[3],
          0,
          1,
          -scroll.current.current - map[0] - map[1] - map[2]
        )
      ),
    ];
  };

  useFrame(() => {
    if (!medias) return;

    scroll.current.target = gsap.utils.clamp(
      -scroll.current.limit,
      0,
      scroll.current.target
    );

    scroll.current.current = gsap.utils.interpolate(
      scroll.current.current,
      scroll.current.target,
      scroll.current.ease
    );

    if (scroll.current.current < scroll.current.last) {
      scroll.current.direction = 'left';
    } else if (scroll.current.current > scroll.current.last) {
      scroll.current.direction = 'right';
    }

    scroll.current.last = scroll.current.current;

    const index = Math.floor(
      Math.abs(
        (scroll.current.current - medias[0].clientWidth / 2) /
          scroll.current.limit
      ) *
        (medias.length - 1)
    );

    if (activeIndex.current !== index) {
      onChange(index);
    }

    onUpdateTitle();
  });

  if (!pageLoaded || !medias) return null;

  return (
    <>
      {medias.map((media, index) => (
        <Media
          key={index}
          index={index}
          element={media}
          geometry={planeGeometry}
          scroll={scroll.current}
          activeIndex={activeIndex}
        />
      ))}
    </>
  );
}
