import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { gsap } from 'gsap';
import normalizeWheel from 'normalize-wheel';
import Prefix from 'prefix';

import Media from './Media';
import usePage from '../../context/pageContext';
import useTouchEvents from '../../hooks/useTouchEvent';
import { getOffset } from '../../utils/dom';

const planeGeometry = new THREE.PlaneGeometry(1, 1, 1, 1);
const transformPrefix = Prefix('transform');

export default function Collections() {
  const [documentsSelected, setDocumentsSelected] = useState(false);
  const [galleryWrapper, setGalleryWrapper] = useState(null);
  const [medias, setMedias] = useState(null);
  const [visible, setVisible] = useState({
    index: null,
    state: true,
  });
  const collection = useRef();
  const collections = useRef();
  const collectionLinks = useRef();
  const titles = useRef();
  const titlesItems = useRef();
  const details = useRef();
  const scroll = useRef({
    current: 0,
    target: 0,
    last: 0,
    position: 0,
    start: 0,
    limit: 0,
    ease: 0.1,
  });
  const isDown = useRef(false);
  const activeIndex = useRef(0);
  const hit = useRef(null);

  const { pageLoaded } = usePage();
  const { size, viewport, camera, raycaster, pointer, scene } = useThree();

  useEffect(() => {
    if (!pageLoaded) return;

    setMedias([...document.querySelectorAll('.collections__gallery__media')]);
    setGalleryWrapper(document.querySelector('.collections__gallery__wrapper'));

    titles.current = document.querySelector('.collections__titles');
    titlesItems.current = [
      ...document.querySelectorAll(
        '.collections__titles__wrapper:nth-child(2) .collections__titles__item'
      ),
    ];

    collection.current = document.querySelector('.collections');
    collections.current = [
      ...document.querySelectorAll('.collections__article'),
    ];
    collectionLinks.current = [
      ...document.querySelectorAll('.collections__gallery__link'),
    ];

    details.current = [...document.querySelectorAll('.detail')];

    setVisible({ index: null, state: true });
    setDocumentsSelected(true);
  }, [pageLoaded]);

  useEffect(() => {
    if (!documentsSelected) return;

    onResize();
  }, [size, viewport, documentsSelected]);

  const onResize = () => {
    scroll.current.last = scroll.current.target = 0;

    scroll.current.limit = galleryWrapper.clientWidth - medias[0].clientWidth;

    collectionLinks.current.forEach((element) => {
      element.bounds = getOffset(element);
    });

    titlesItems.current.forEach((element) => {
      element.bounds = getOffset(element);
    });
  };

  const onOpen = (index) => {
    setVisible({
      index,
      state: false,
    });

    hit.current = null;
    document.body.style.cursor = '';

    collection.current.classList.add('collections--open');
  };

  const onClose = (index) => {
    setVisible({
      index,
      state: true,
    });

    collection.current.classList.remove('collections--open');
  };

  const onWheel = (event) => {
    if (!documentsSelected || !visible.state) return;

    const { pixelY } = normalizeWheel(event);

    scroll.current.target -= pixelY;
  };

  const onTouchDown = (event) => {
    if (!documentsSelected || !visible.state) return;

    isDown.current = true;

    scroll.current.position = scroll.current.current;
    scroll.current.start = event.touches
      ? event.touches[0].clientX
      : event.clientX;
  };

  const onTouchMove = (event) => {
    if (!documentsSelected || !visible.state) return;

    raycaster.setFromCamera(pointer, camera);

    const intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0) {
      const obj = intersects[0].object;
      const parent = obj.parent || null;

      if (parent !== null && parent.index === activeIndex.current) {
        hit.current = parent.index;
        document.body.style.cursor = 'pointer';
      } else {
        hit.current = null;
        document.body.style.cursor = '';
      }
    } else {
      hit.current = null;
      document.body.style.cursor = '';
    }

    if (!isDown.current) return;

    const x = event.touches ? event.touches[0].clientX : event.clientX;

    const distance = scroll.current.start - x;

    scroll.current.target = scroll.current.position - distance;
  };

  const onTouchUp = () => {
    if (!documentsSelected || !visible.state) return;

    isDown.current = false;

    if (hit.current !== null && activeIndex.current === hit.current) {
      onOpen(hit.current);
    }
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

      map[index] += element?.bounds?.width;
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

    let y = 0;

    titlesItems.current.forEach((element, index) => {
      y += element?.bounds?.height * progress[index];
    });

    titles.current.style[
      transformPrefix
    ] = `translateY(calc(-${y}px - 33.33% + ${window.innerHeight * 0.5}px))`;
  };

  useFrame(() => {
    if (!documentsSelected) return;

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

  if (!pageLoaded || !documentsSelected) return null;

  return (
    <>
      {medias.map((media, index) => (
        <Media
          key={index}
          index={index}
          element={media}
          detail={details.current[index]}
          geometry={planeGeometry}
          scroll={scroll.current}
          activeIndex={activeIndex}
          visible={visible}
          onClose={onClose}
        />
      ))}
    </>
  );
}
