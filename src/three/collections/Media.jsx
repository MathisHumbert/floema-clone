import { useEffect, useMemo, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { gsap } from 'gsap';

import vertex from '../../shaders/plane-vertex.glsl';
import fragment from '../../shaders/plane-fragment.glsl';
import MediaDom from './MediaDom';

export default function Media({
  index,
  element,
  detail,
  geometry,
  scroll,
  activeIndex,
  visible,
  onClose,
}) {
  const group = useRef();
  const jewlery = useRef();
  const model = useRef();
  const collectionsBounds = useRef();
  const x = useRef(0);
  const animation = useRef(0);
  const original = useRef(0);
  const frame = useRef(0);
  const opacity = useRef({
    current: 0,
    target: 0,
    ease: 0.1,
    multiplier: 0,
  });

  const { size, viewport } = useThree();
  const imageElement = element.querySelector(
    '.collections__gallery__media__image'
  );
  const jewleryTexture = window.TEXTURES[imageElement.getAttribute('data-src')];
  const modelTexture =
    window.TEXTURES[imageElement.getAttribute('data-model-src')];

  const detailDom = MediaDom({ element: detail, onClose, index });

  const jewleryShaderArgs = useMemo(() => {
    return {
      uniforms: {
        uTexture: { value: jewleryTexture },
        uAlpha: { value: 0 },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
    };
  }, [jewleryTexture]);

  const modelShaderArgs = useMemo(() => {
    return {
      uniforms: {
        uTexture: { value: modelTexture },
        uAlpha: { value: 0 },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
    };
  }, [modelTexture]);

  useEffect(() => {
    const rect = element.getBoundingClientRect();

    collectionsBounds.current = {
      top: rect.top + scroll.current,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    };

    detailDom.onResize();

    updateScale();
    updateX();
  }, [viewport, size]);

  useEffect(() => {
    original.current =
      -viewport.width / 2 +
      jewlery.current.scale.x / 2 +
      x.current * viewport.width;

    group.current.index = index;
  }, []);

  useEffect(() => {
    if (visible.state) {
      show();

      if (index === visible.index) {
        animateOut();
      }
    } else {
      if (index === visible.index) {
        animateIn();
      } else {
        hide();
      }
    }
  }, [visible]);

  const show = () => {
    gsap.to(opacity.current, {
      multiplier: 1,
      delay: 0.5,
    });
  };

  const hide = () => {
    gsap.to(opacity.current, {
      multiplier: 0,
    });
  };

  const animateIn = () => {
    gsap.to(animation, { current: 1, duration: 2, ease: 'expo.inOut' });

    detailDom.animateIn();
  };

  const animateOut = () => {
    gsap.to(animation, { current: 0, duration: 2, ease: 'expo.inOut' });

    detailDom.animateOut();
  };

  const updateScale = () => {
    const width =
      gsap.utils.interpolate(
        collectionsBounds.current.width,
        detailDom.bounds.current.width,
        animation.current
      ) / size.width;
    const height =
      gsap.utils.interpolate(
        collectionsBounds.current.height,
        detailDom.bounds.current.height,
        animation.current
      ) / size.height;

    jewlery.current.scale.x = width * viewport.width;
    jewlery.current.scale.y = height * viewport.height;

    model.current.scale.x = width * viewport.width;
    model.current.scale.y = height * viewport.height;
  };

  const updateX = (scroll = 0) => {
    const currentX = gsap.utils.interpolate(
      collectionsBounds.current.left + scroll,
      detailDom.bounds.current.left,
      animation.current
    );

    x.current = currentX / window.innerWidth;

    group.current.position.x =
      -viewport.width / 2 +
      jewlery.current.scale.x / 2 +
      x.current * viewport.width;

    group.current.position.z = gsap.utils.interpolate(
      0,
      0.1,
      animation.current
    );

    group.current.rotation.y = gsap.utils.interpolate(
      0,
      2 * Math.PI,
      animation.current
    );
  };

  useFrame(() => {
    if (!collectionsBounds.current) return;

    updateScale();
    updateX(scroll.current);

    const frequency = 500;
    const amplitude = 0.5;

    const sliderY =
      Math.sin(
        (original.current / 10) * (Math.PI * 2) + frame.current / frequency
      ) * amplitude;
    const detailY = 0;

    if (animation.current > 0.01) {
      jewlery.current.material.depthTest = false;
      jewlery.current.material.depthWrite = false;

      model.current.material.depthTest = false;
      model.current.material.depthWrite = false;
    } else {
      jewlery.current.material.depthTest = true;
      jewlery.current.material.depthWrite = true;

      model.current.material.depthTest = true;
      model.current.material.depthWrite = true;
    }

    group.current.position.y = gsap.utils.interpolate(
      sliderY,
      detailY,
      animation.current
    );

    const sliderZ = gsap.utils.mapRange(
      -viewport.width * 0.25,
      viewport.width * 0.25,
      group.current.position.y * 0.3,
      -group.current.position.y * 0.3,
      group.current.position.x
    );
    const detailZ = Math.PI * 0.01;

    group.current.rotation.z = gsap.utils.interpolate(
      sliderZ,
      detailZ,
      animation.current
    );

    opacity.current.target = activeIndex.current === index ? 1 : 0.4;
    opacity.current.current = gsap.utils.interpolate(
      opacity.current.current,
      opacity.current.target,
      opacity.current.ease
    );

    jewlery.current.material.uniforms.uAlpha.value =
      opacity.current.multiplier * opacity.current.current;
    model.current.material.uniforms.uAlpha.value =
      opacity.current.multiplier * opacity.current.current;

    frame.current += 1;
  });

  return (
    <group ref={group}>
      <mesh ref={jewlery} geometry={geometry}>
        <rawShaderMaterial args={[jewleryShaderArgs]} />
      </mesh>
      <mesh ref={model} geometry={geometry} rotation-y={Math.PI}>
        <rawShaderMaterial args={[modelShaderArgs]} />
      </mesh>
    </group>
  );
}
