import React from 'react';
import { useThree } from '@react-three/fiber';

export default function Home() {
  const { viewport, size } = useThree();

  return (
    <>
      <mesh
        scale={[
          (400 / size.width) * viewport.width,
          (600 / size.height) * viewport.height,
          1,
        ]}
      >
        <planeGeometry args={[1, 1, 16, 16]} />
        <meshBasicMaterial />
      </mesh>
    </>
  );
}
