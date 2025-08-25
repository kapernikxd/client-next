import { useState, useRef, useEffect, RefObject } from "react";

/**
 * Хук для определения видимости элемента с использованием IntersectionObserver.
 */
function useVisibility<T extends HTMLElement>(
  rootRef?: RefObject<HTMLElement>
): [RefObject<T>, boolean] {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      console.warn("Element is not attached");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        root: rootRef ? rootRef.current : null,
        threshold: 1.0,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [rootRef]);

  return [ref, isVisible];
}

export default useVisibility;
