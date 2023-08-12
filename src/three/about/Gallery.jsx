import React, { useEffect, useRef, useState } from 'react';
import Media from './Media';

export default function Gallery({ element, geometry }) {
  const [medias, setMedias] = useState(null);
  const [images, setImages] = useState(null);
  const group = useRef();

  useEffect(() => {
    const mediasElements = element.querySelectorAll('.about__gallery__media');
    const imagesElements = element.querySelectorAll(
      '.about__gallery__media__image'
    );

    setMedias([...mediasElements]);
    setImages([...imagesElements]);
  }, []);

  if (!medias || !images) return null;

  return (
    <group ref={group}>
      {medias.map((media, index) => (
        <Media
          key={index}
          element={media}
          image={images[index]}
          geometry={geometry}
        />
      ))}
    </group>
  );
}
