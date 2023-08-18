import { useEffect, useRef } from 'react';
import Prefix from 'prefix';
import { useLenis } from '@studio-freight/react-lenis';

import { BREAKPOINT_TABLET } from '../utils/breakpoints';
import { getOffset } from '../utils/dom';
import { map, clamp } from '../utils/math';

const transformPrefix = Prefix('transform');

export default function Parallax({ children, ...props }) {
  const element = useRef();
  const media = useRef();
  const parallax = useRef(0);
  const scale = useRef(1.15);
  const amount = useRef(0);
  const offset = useRef();
  const lenisScroll = useRef(0);

  useEffect(() => {
    media.current = element.current.children[0];

    const onResize = () => {
      amount.current = window.innerWidth < BREAKPOINT_TABLET ? 10 : 150;
      offset.current = getOffset(element.current, lenisScroll.current);
    };

    onResize();

    window.addEventListener('resize', onResize);
  }, []);

  useLenis(({ scroll }) => {
    if (offset.current === undefined) return;

    lenisScroll.current = scroll;

    const { innerHeight } = window;

    const offsetBottom = scroll + innerHeight;

    if (offsetBottom >= offset.current.top) {
      parallax.current = clamp(
        -amount.current,
        amount.current,
        map(
          offset.current.top - scroll,
          -offset.current.height,
          innerHeight,
          amount.current,
          -amount.current
        )
      );

      scale.current = clamp(
        1,
        1.15,
        map(
          offset.current.top - scroll,
          -offset.current.height,
          innerHeight,
          1,
          1.15
        )
      );

      media.current.style[
        transformPrefix
      ] = `translate3d(0, ${parallax.current}px, 0) scale(${scale.current})`;
    } else {
      media.current.style[
        transformPrefix
      ] = `translate3d(0, -${amount.current}px, 0) scale(1.15)`;
    }
  });

  return (
    <figure {...props} ref={element}>
      {children}
    </figure>
  );
}
