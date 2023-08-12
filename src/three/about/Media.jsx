import { useEffect, useMemo, useRef } from 'react';
import { useThree } from '@react-three/fiber';

import vertex from '../../shaders/plane-vertex.glsl';
import fragment from '../../shaders/plane-fragment.glsl';

export default function Media({ element, image, geometry }) {
  const mesh = useRef();
  const bounds = useRef();
  const extra = useRef(0);
  const { size, viewport } = useThree();
  const texture = window.TEXTURES[image.getAttribute('data-src')];

  const shaderArgs = useMemo(() => {
    return {
      uniforms: {
        uTexture: { value: texture },
        uAlpha: { value: 1 },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
    };
  }, [texture]);

  useEffect(() => {
    const rect = element.getBoundingClientRect();

    bounds.current = {
      // top: rect.top + scroll.current,
      top: rect.top,
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
      ((bounds.current.left - x) / size.width) * viewport.width;
  };

  const updateY = (y = 0) => {
    mesh.current.position.y =
      viewport.height / 2 -
      mesh.current.scale.y / 2 -
      ((bounds.current.top - y) / size.height) * viewport.height +
      extra.current;
  };

  return (
    <mesh ref={mesh} geometry={geometry}>
      <rawShaderMaterial args={[shaderArgs]} />
    </mesh>
  );
}
