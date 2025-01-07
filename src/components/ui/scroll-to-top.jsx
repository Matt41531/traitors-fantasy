import { useEffect } from 'react';
import { useLocation } from 'react-router';

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // Scrolls to the top of the page
  }, [location]); // Dependency array listens for location changes

  return null;
};

export default ScrollToTop;
