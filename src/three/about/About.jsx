import { useEffect, useState } from 'react';
import * as THREE from 'three';

import usePage from '../../context/pageContext';
import Gallery from './Gallery';

export default function About() {
  const [galleries, setGalleries] = useState(null);
  const { pageLoaded } = usePage();
  const planeGeometry = new THREE.PlaneGeometry();

  useEffect(() => {
    if (!pageLoaded) return;

    const galleriesElements = document.querySelectorAll('.about__gallery');

    setGalleries([...galleriesElements]);
  }, [pageLoaded]);

  if (!pageLoaded || !galleries) return null;

  return (
    <>
      {galleries.map((gallery, index) => (
        <Gallery key={index} element={gallery} geometry={planeGeometry} />
      ))}
    </>
  );
}
