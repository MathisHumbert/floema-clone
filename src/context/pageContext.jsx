import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useRef,
} from 'react';
import imagesLoaded from 'imagesloaded';
import { TextureLoader } from 'three';
import { gsap } from 'gsap';

import { client } from '../utils/prismic';

const PageContext = createContext({
  data: {},
  dataLoaded: false,
  pageLoaded: false,
  setPageLoaded: () => {},
  page: '',
  setPage: () => {},
  loadPage: () => {},
  asynconPageChange: async () => {},
});

export function PageProvider({ children }) {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [data, setData] = useState({});
  const [pageLoaded, setPageLoaded] = useState(false);
  const [page, setPage] = useState(window.location.pathname);
  const transitionElement = useRef();
  const transtionContext = useRef();
  const transtionProgress = useRef({ value: 0 });
  const transtionColor = useRef();

  useEffect(() => {
    createTransition();
    loadData();
  }, []);

  const createTransition = () => {
    transitionElement.current = document.createElement('canvas');
    transitionElement.current.className = 'transition';
    transitionElement.current.height =
      window.innerHeight * window.devicePixelRatio;
    transitionElement.current.width =
      window.innerWidth * window.devicePixelRatio;

    transtionContext.current = transitionElement.current.getContext('2d');

    document.getElementById('root').appendChild(transitionElement.current);
  };

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

    about.data.gallery.forEach((item) => {
      assets.push(item.image.url);
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
    const images = [...document.querySelectorAll('img')].filter(
      (img) => img.getAttribute('src') !== null
    );

    const imgLoaded = imagesLoaded(images, {
      background: true,
    });

    imgLoaded.on('done', () => {
      setPageLoaded(true);

      if (transtionProgress.value !== 0) {
        hideTransition();
      }
    });
  };

  const onPageChange = () => {
    transtionColor.current = document
      .getElementById('page')
      .getAttribute('data-color');

    // sow tranisition
    return new Promise((resolve) => {
      showTransition(resolve);
    });
  };

  const showTransition = (resolve) => {
    gsap.set(transitionElement.current, { rotation: 0 });

    gsap.to(transtionProgress.current, {
      value: 1,
      duration: 1.5,
      ease: 'expo.inOut',
      onComplete: () => {
        setPageLoaded(false);
        setPage(window.location.pathname);
        resolve();
      },
      onUpdate: updateTransition,
    });
  };

  const hideTransition = () => {
    gsap.set(transitionElement.current, { rotation: 180 });

    gsap.to(transtionProgress.current, {
      value: 0,
      duration: 1.5,
      ease: 'expo.inOut',
      onUpdate: updateTransition,
    });
  };

  const updateTransition = () => {
    transtionContext.current.clearRect(
      0,
      0,
      transitionElement.current.width,
      transitionElement.current.height
    );
    transtionContext.current.save();
    transtionContext.current.beginPath();

    const widthSegments = Math.ceil(transitionElement.current.width / 40);
    transtionContext.current.moveTo(
      transitionElement.current.width,
      transitionElement.current.height
    );
    transtionContext.current.lineTo(0, transitionElement.current.height);

    const t =
      (1 - transtionProgress.current.value) * transitionElement.current.height;
    const amplitude = 250 * Math.sin(transtionProgress.current.value * Math.PI);

    transtionContext.current.lineTo(0, t);

    for (let index = 0; index <= widthSegments; index++) {
      const n = 40 * index;
      const r =
        t -
        Math.sin((n / transitionElement.current.width) * Math.PI) * amplitude;

      transtionContext.current.lineTo(n, r);
    }

    transtionContext.current.fillStyle = transtionColor.current;
    transtionContext.current.fill();
    transtionContext.current.restore();
  };

  const memoedValue = useMemo(
    () => ({
      data,
      pageLoaded,
      setPageLoaded,
      dataLoaded,
      page,
      setPage,
      loadPage,
      onPageChange,
    }),
    [data, pageLoaded, dataLoaded, page]
  );

  return (
    <PageContext.Provider value={memoedValue}>{children}</PageContext.Provider>
  );
}

export default function usePage() {
  return useContext(PageContext);
}
