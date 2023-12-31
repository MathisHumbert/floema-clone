import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { gsap } from 'gsap';

import vertex from '../../shaders/plane-vertex.glsl';
import fragment from '../../shaders/plane-fragment.glsl';
import { BREAKPOINT_PHONE } from '../../utils/breakpoints';

export default function Media({
  element,
  image,
  geometry,
  scroll,
  lenisScroll,
  galleryWidth,
  visible,
}) {
  const mesh = useRef();
  const bounds = useRef();
  const extra = useRef(0);
  const { size, viewport } = useThree();
  const texture = window.TEXTURES[image.getAttribute('data-src')];

  const shaderArgs = useMemo(() => {
    return {
      uniforms: {
        uTexture: { value: texture },
        uAlpha: { value: 0 },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
    };
  }, [texture]);

  useEffect(() => {
    if (!visible) return;

    gsap.fromTo(
      mesh.current.material.uniforms.uAlpha,
      { value: 0 },
      { value: 1 }
    );
  }, [visible]);

  useEffect(() => {
    const rect = element.getBoundingClientRect();

    bounds.current = {
      top: rect.top + lenisScroll.current,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    };

    extra.current = 0;

    updateScale();
    updateX();
    updateY();
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
      ((bounds.current.left - x) / size.width) * viewport.width +
      extra.current;
  };

  const updateY = (y = 0) => {
    mesh.current.position.y =
      viewport.height / 2 -
      mesh.current.scale.y / 2 -
      ((bounds.current.top - y) / size.height) * viewport.height;

    const extra = size.width < BREAKPOINT_PHONE ? 15 : 60;

    mesh.current.position.y +=
      Math.cos((mesh.current.position.x / viewport.width) * Math.PI * 0.1) *
        extra -
      extra;
  };

  const updateRotation = () => {
    mesh.current.rotation.z = gsap.utils.mapRange(
      -viewport.width / 2,
      viewport.width / 2,
      Math.PI * 0.1,
      -Math.PI * 0.1,
      mesh.current.position.x
    );
  };

  useFrame(() => {
    if (bounds.current === undefined) return;

    updateX(scroll.current);
    updateY();
    updateRotation();

    const viewportOffset = viewport.width / 2 + 0.25;
    const planeOffset = mesh.current.scale.x / 2;

    if (
      scroll.direction === 'left' &&
      mesh.current.position.x + planeOffset < -viewportOffset
    ) {
      extra.current += galleryWidth.current;
    } else if (
      scroll.direction === 'right' &&
      mesh.current.position.x - planeOffset > viewportOffset
    ) {
      extra.current -= galleryWidth.current;
    }
  });

  return (
    <mesh ref={mesh} geometry={geometry}>
      <rawShaderMaterial args={[shaderArgs]} />
    </mesh>
  );
}
