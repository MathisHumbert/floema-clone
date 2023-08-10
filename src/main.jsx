import React from 'react';
import ReactDOM from 'react-dom/client';
import { PrismicProvider } from '@prismicio/react';

import './styles/index.scss';
import App from './App.jsx';
import { client } from './utils/prismic';
import { PageProvider } from './context/pageContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PrismicProvider client={client}>
      <PageProvider>
        <App />
      </PageProvider>
    </PrismicProvider>
  </React.StrictMode>
);
