import { Canvas } from '@react-three/fiber';

import HomeDom from './pages/home/Home';
import HomeThree from './three/Home/Home';

export default function App() {
  return (
    <>
      {/* DOM */}
      <HomeDom />
      {/* THREE */}
      <div className='canvas__wrapper'>
        <Canvas>
          <HomeThree />
        </Canvas>
      </div>
    </>
  );
}
