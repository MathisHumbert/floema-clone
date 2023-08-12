import { Canvas } from '@react-three/fiber';

import HomeDom from './pages/home/Home';
import HomeThree from './three/home/Home';
import AboutDom from './pages/about/About';
import AboutThree from './three/about/About';

import { Route } from './router/Router';
import Navigation from './layouts/Navigation';

export default function App() {
  return (
    <>
      {/* DOM */}
      <Navigation />
      <Route path='/' component={HomeDom} />
      <Route path='/about' component={AboutDom} />
      {/* THREE */}
      <div className='canvas__wrapper'>
        <Canvas>
          <Route path='/' component={HomeThree} />
          <Route path='/about' component={AboutThree} />
        </Canvas>
      </div>
    </>
  );
}
