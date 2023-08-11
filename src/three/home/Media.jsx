import { useEffect, useMemo, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { gsap } from 'gsap';

import vertex from '../../shaders/home-vertex.glsl';
import fragment from '../../shaders/home-fragment.glsl';

export default function Media({
  element,
  galleryElement,
  geometry,
  scroll,
  speed,
}) {
  const mesh = useRef();
  const bounds = useRef();
  const galleryHeight = useRef(0);
  const extra = useRef(0);
  const { size, viewport } = useThree();
  const texture = window.TEXTURES[element.getAttribute('src')];

  const shaderArgs = useMemo(() => {
    return {
      uniforms: {
        uTexture: { value: texture },
        uAlpha: { value: 0 },
        uSpeed: { value: 0 },
        uViewportSizes: { value: { x: viewport.width, y: viewport.height } },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
    };
  }, [texture]);

  useEffect(() => {
    const timelineIn = gsap.timeline({
      delay: gsap.utils.random(0, 1.5),
      defaults: { duration: 2, ease: 'expo.inOut' },
    });

    timelineIn
      .fromTo(
        mesh.current.material.uniforms.uAlpha,
        { value: 0 },
        { value: 0.4 }
      )
      .fromTo(
        mesh.current.position,
        { z: gsap.utils.random(2, 6) },
        { z: 0 },
        0
      );
  }, []);

  useEffect(() => {
    const rect = element.getBoundingClientRect();

    galleryHeight.current =
      (galleryElement.clientHeight / size.height) * viewport.height;

    bounds.current = {
      top: rect.top + scroll.current,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    };

    extra.current = 0;

    updateScale();
    updateX();
    updateY();

    mesh.current.material.uniforms.uViewportSizes.value = {
      x: viewport.width,
      y: viewport.height,
    };
  }, [viewport, size]);

  const updateScale = () => {
    mesh.current.scale.x = (viewport.width * bounds.current.width) / size.width;
    mesh.current.scale.y =
      (viewport.height * bounds.current.height) / size.height;
  };

  const updateX = (x = 0) => {
    mesh.current.position.x =
      -viewport.width / 2 +
      mesh.current.scale.x / 2 +
      ((bounds.current.left - x) / size.width) * viewport.width;
  };

  const updateY = (y = 0) => {
    mesh.current.position.y =
      viewport.height / 2 -
      mesh.current.scale.y / 2 -
      ((bounds.current.top - y) / size.height) * viewport.height +
      extra.current;
  };

  useFrame(() => {
    if (bounds.current === undefined) return;

    updateY(scroll.current);

    mesh.current.material.uniforms.uSpeed.value = speed.current;

    const viewportOffset = viewport.height / 2;
    const planeOffset = mesh.current.scale.y / 2;

    if (
      scroll.direction === 'top' &&
      mesh.current.position.y + planeOffset < -viewportOffset
    ) {
      extra.current += galleryHeight.current;
    } else if (
      scroll.direction === 'bottom' &&
      mesh.current.position.y - planeOffset > viewportOffset
    ) {
      extra.current -= galleryHeight.current;
    }
  });

  return (
    <mesh ref={mesh} geometry={geometry}>
      <rawShaderMaterial args={[shaderArgs]} />
    </mesh>
  );
}
