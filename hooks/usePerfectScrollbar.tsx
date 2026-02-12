import { useEffect, useRef } from 'react';

interface UsePerfectScrollbarOptions {
  suppressScrollX?: boolean;
  wheelPropagation?: boolean;
}

function usePerfectScrollbar(options: UsePerfectScrollbarOptions = {}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    // Set overflow styles
    element.style.overflowY = 'auto';
    element.style.overflowX = options.suppressScrollX ? 'hidden' : 'auto';
    
    // Add custom scrollbar class for styling
    element.classList.add('custom-scrollbar');

    return () => {
      element.classList.remove('custom-scrollbar');
    };
  }, [options.suppressScrollX]);

  return scrollRef;
}

export default usePerfectScrollbar;

