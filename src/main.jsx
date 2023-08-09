import React from 'react';
import ReactDOM from 'react-dom/client';
import { PrismicProvider } from '@prismicio/react';

import './styles/index.scss';
import App from './App.jsx';
import { client } from './utils/prismic';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PrismicProvider client={client}>
      <App />
    </PrismicProvider>
  </React.StrictMode>
);
