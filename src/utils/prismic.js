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
    ],
  }
);
