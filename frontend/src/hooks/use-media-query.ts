import { useState, useEffect } from 'react';

type MediaQueryInput = number | string;

export const useMediaQuery = (input: MediaQueryInput = 768): boolean => {
  const query = typeof input === 'number' ? `(max-width: ${input}px)` : input;

  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);

    update();
    media.addEventListener('change', update);

    return () => media.removeEventListener('change', update);
  }, [query]);

  return matches;
};
