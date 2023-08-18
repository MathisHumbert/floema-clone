import React from 'react';

export default function MediaDom() {
  const media = useRef(null);

  const collection = useRef(null);

  const title = useRef(null);
  const titleSpans = useRef([]);

  const size = useRef(null);
  const sizeIcon = useRef(null);
  const sizeIconPaths = useRef(null);
  const sizeIconLine = useRef(null);
  const sizeSpans = useRef([]);

  const star = useRef(null);
  const starIcon = useRef(null);
  const starIconPath = useRef(null);
  const starSpans = useRef([]);

  const info = useRef(null);
  const infoLabel = useRef(null);
  const infoSpans = useRef(null);

  const disclaimer = useRef(null);
  const disclaimerLabel = useRef(null);
  const disclaimerSpans = useRef(null);

  const link = useRef(null);
  const close = useRef(null);

  useEffect(() => {
    media.current = document.querySelector('.detail__media');

    return () => {
      // Cleanup or finalize animations if needed
    };
  }, []);

  const animateTitle = (animationProps) => {
    if (titleElementRef.current) {
      // Perform your animation logic on the title element.
      // Example: titleElementRef.current.style.color = animationProps.color;
    }
  };

  return {
    animateTitle,
  };
}
