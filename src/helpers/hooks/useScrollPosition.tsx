import { useEffect, useState } from 'react';

function useScrollPosition() {
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleScroll = () => {
    const scrollY = window.scrollY;
    setScrollPosition(scrollY);
    localStorage.setItem('scrollPosition', scrollY.toString());
  };

  useEffect(() => {
    const savedScrollPosition = localStorage.getItem('scrollPosition') || '0';

    const checkContentHeight = setInterval(() => {
      const contentHeight = document.body.scrollHeight;
      const windowHeight = window.innerHeight;

      // Проверяем, достаточно ли загружен контент для прокрутки
      if (contentHeight > windowHeight) {
        window.scrollTo(0, parseInt(savedScrollPosition, 10));
        clearInterval(checkContentHeight);
      }
    }, 100); // Проверка каждые 100 мс

    window.addEventListener('scroll', handleScroll);

    return () => {
      clearInterval(checkContentHeight);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return { scrollPosition };
}

export default useScrollPosition;