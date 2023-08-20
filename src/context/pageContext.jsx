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
  preloaded: false,
  preloadedPercent: 0,
});

export function PageProvider({ children }) {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [preloaded, setPreloaded] = useState(false);
  const [data, setData] = useState({});
  const [pageLoaded, setPageLoaded] = useState(false);
  const [page, setPage] = useState(window.location.pathname);
  const preloaderElement = useRef(null);
  const preloaderLength = useRef(0);
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
      collection.data.products.forEach(({ products_product }) => {
        const product = productsData.find(
          (product) => product.uid === products_product.uid
        );
        products_product.data = product.data;
        products.push(product);
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

    collections.forEach((collection) => {
      collection.data.products.forEach((item) => {
        assets.push(item.products_product.data.image.url);
        assets.push(item.products_product.data.model.url);
      });
    });

    window.TEXTURES = {};

    const textureLoader = new TextureLoader();

    const loadTextures = assets.map((asset) => {
      return new Promise((resolve) => {
        textureLoader.load(asset, (texture) => {
          window.TEXTURES[asset] = texture;
          onTextureLoaded(assets.length);
          resolve();
        });
      });
    });

    const images = [...document.querySelectorAll('img')].filter(
      (img) => img.getAttribute('src') !== null
    );

    const loadImages = imagesLoaded(images, {
      background: true,
    });

    preloaderElement.current = document.querySelector('.preloader__text');

    await Promise.all([loadImages, loadTextures]);
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

  const onTextureLoaded = (totalTexture) => {
    if (preloaderElement.current === null) {
      preloaderElement.current = document.querySelector(
        '.preloader__number__text'
      );
    }

    preloaderLength.current += 1;

    preloaderElement.current.innerHTML = `${Math.round(
      (preloaderLength.current / totalTexture) * 100
    )}%`;

    if (preloaderLength.current === totalTexture) {
      setPreloaded(true);
    }
  };

  const onPageChange = () => {
    transtionColor.current = document
      .getElementById('page')
      .getAttribute('data-color');

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
      setDataLoaded,
      page,
      setPage,
      loadPage,
      onPageChange,
      preloaded,
    }),
    [data, pageLoaded, dataLoaded, page, preloaded]
  );

  return (
    <PageContext.Provider value={memoedValue}>{children}</PageContext.Provider>
  );
}

export default function usePage() {
  return useContext(PageContext);
}
