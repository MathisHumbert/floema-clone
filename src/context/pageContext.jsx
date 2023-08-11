import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import imagesLoaded from 'imagesloaded';
import { TextureLoader } from 'three';

import { client } from '../utils/prismic';

const PageContext = createContext({
  data: {},
  dataLoaded: false,
  pageLoaded: false,
  loadPage: () => {},
});

export function PageProvider({ children }) {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [data, setData] = useState({});
  const [pageLoaded, setPageLoaded] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const about = await client.getSingle('about');
    const home = await client.getSingle('home');
    const navigation = await client.getSingle('navigation');
    const preloader = await client.getSingle('preloader');

    const collectionsOrder = await client.getSingle('collections');
    const collectionsData = await client.getAllByType('collection');

    const productsData = await client.getAllByType('product');

    const collections = collectionsOrder.data.list.map(({ collection }) => {
      const { uid } = collection;
      const data = collectionsData.find((c) => c.uid === uid);

      return data;
    });

    const products = [];

    collections.forEach((collection) => {
      collection.data.products.forEach(({ products_product: { uid } }) => {
        const p = productsData.find((product) => product.uid === uid);
        products.push(p);
      });
    });

    setData({ about, collections, home, navigation, preloader, products });

    const assets = [];

    home.data.gallery.forEach((item) => {
      assets.push(item.image.url);
    });

    about.data.body.forEach((section) => {
      if (section.slice_type === 'gallery') {
        section.items.forEach((item) => {
          assets.push(item.image.url);
        });
      }
    });

    window.TEXTURES = {};

    const textureLoader = new TextureLoader();

    const texturePromises = assets.map((asset) => {
      return new Promise((resolve) => {
        textureLoader.load(asset, (texture) => {
          window.TEXTURES[asset] = texture;
          resolve();
        });
      });
    });

    await Promise.all(texturePromises);

    setDataLoaded(true);

    // add preloader animation
  };

  const loadPage = () => {
    const imgLoaded = imagesLoaded(document.querySelectorAll('img'), {
      background: true,
    });

    imgLoaded.on('done', () => {
      setPageLoaded(true);
    });
  };

  const memoedValue = useMemo(
    () => ({ data, pageLoaded, dataLoaded, loadPage }),
    [data, pageLoaded, dataLoaded]
  );

  return (
    <PageContext.Provider value={memoedValue}>{children}</PageContext.Provider>
  );
}

export default function usePage() {
  return useContext(PageContext);
}
