import React from 'react';
import ReactDOM from 'react-dom/client';
import { ReactLenis } from '@studio-freight/react-lenis';

import './styles/index.scss';
import App from './App.jsx';
import { PageProvider } from './context/pageContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <PageProvider>
    <ReactLenis root>
      <App />
    </ReactLenis>
  </PageProvider>
  // </React.StrictMode>
);
