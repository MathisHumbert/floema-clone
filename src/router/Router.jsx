import React, { useEffect, useState } from 'react';
import { gsap } from 'gsap';

import usePage from '../context/pageContext';

export const Route = ({ path, component }) => {
  const { onPageChange } = usePage();

  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  const navigate = async () => {
    await onPageChange();

    setCurrentPath(window.location.pathname);
  };

  useEffect(() => {
    window.addEventListener('navigate', navigate);
    window.addEventListener('popstate', navigate);
  }, []);

  return currentPath === path ? React.createElement(component) : null;
};

export const Link = React.forwardRef(({ to, children, ...props }, ref) => {
  const preventDefault = (e) => {
    e.preventDefault();

    window.history.pushState({}, '', to);
    const LocationChange = new PopStateEvent('navigate');
    window.dispatchEvent(LocationChange);
  };

  return (
    <a ref={ref} href={to} onClick={preventDefault} {...props}>
      {children}
    </a>
  );
});
