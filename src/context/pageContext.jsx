import { createContext, useContext, useMemo, useState } from 'react';
import { client } from '../utils/prismic';

const PageContext = createContext({
  loaded: false,
  data: {},
  loadPage: () => {},
});

export function PageProvider({ children }) {
  const [loaded, setLoaded] = useState(false);
  const [data, setData] = useState({});

  const loadPage = async (page) => {
    if (page === 'home') {
      const home = await client.getSingle('home');
      const collectionsOrder = await client.getSingle('collections');
      const collectionsData = await client.getAllByType('collection');

      const collections = collectionsOrder.data.list.map(({ collection }) => {
        const { uid } = collection;
        const data = collectionsData.find((c) => c.uid === uid);

        return data;
      });

      setData({ home, collections });
      setLoaded(true);
    }

    // const products = [];

    // collections.forEach((collection) => {
    //   collection.data.products.forEach(({ products_product: { uid } }) => {
    //     const p = productsData.find((product) => product.uid === uid);
    //     products.push(p);
    //   });
    // });

    // console.log(products);
  };

  const memoedValue = useMemo(
    () => ({ loaded, data, loadPage }),
    [loaded, data]
  );

  return (
    <PageContext.Provider value={memoedValue}>{children}</PageContext.Provider>
  );
}

export default function usePage() {
  return useContext(PageContext);
}
