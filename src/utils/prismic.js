import * as prismic from '@prismicio/client';

export const client = prismic.createClient(
  import.meta.env.VITE_APP_PRISMIC_ENDPOINT,
  {
    accessToken: import.meta.env.VITE_APP_PRISMIC_ACCESS_TOKEN,
    routes: [
      {
        type: 'home',
        path: '/',
      },
      { type: 'about', path: '/about' },
      { type: 'collections', path: '/collections' },
    ],
  }
);

export const linkResolver = (doc) => {
  if (doc.type === 'product') {
    return `/detail/${doc.uid}`;
  }

  if (doc.type === 'collections') {
    return '/collections';
  }

  if (doc.type === 'about') {
    return '/about';
  }

  return '/';
};
