import React, { useEffect, useState } from 'react';

import usePage from '../context/pageContext';

export const Route = ({ path, component }) => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  const navigate = () => {
    setCurrentPath(window.location.pathname);
  };

  useEffect(() => {
    window.addEventListener('navigate', navigate);
    window.addEventListener('popstate', navigate);
  }, []);

  return currentPath === path ? React.createElement(component) : null;
};

export const Link = ({ to, children }) => {
  const { setLoaded } = usePage();

  const preventDefault = (e) => {
    e.preventDefault();

    setLoaded(false);

    window.history.pushState({}, '', to);
    const LocationChange = new PopStateEvent('navigate');
    window.dispatchEvent(LocationChange);
  };

  return (
    <a href={to} onClick={preventDefault}>
      {children}
    </a>
  );
};
