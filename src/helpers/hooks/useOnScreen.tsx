import { useEffect, useState, useRef } from "react";

export function useOnScreen(ref: any) {
  const [isOnScreen, setIsOnScreen] = useState(false);
  const observerRef = useRef<any>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        setIsOnScreen(entry.isIntersecting);
      },
      {
        root: null, // null означает, что root будет viewport
        rootMargin: "0px",
        threshold: 1.0, // Элемент должен быть полностью видим
      }
    );
  }, []);

  useEffect(() => {
    observerRef.current.observe(ref.current);

    return () => {
      observerRef.current.disconnect();
    };
  }, [ref]);

  return isOnScreen;
}
