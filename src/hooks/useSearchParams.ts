'use client';

import { useCallback, useMemo, useState, useEffect } from 'react';

export interface SetSearchParamsOptions {
  replace?: boolean;
  pathname?: string;
}

// Event type for custom internal navigation
const LOCATION_CHANGE_EVENT = 'applet_location_change';

function getWindowLocation(): string {
  if (typeof window === 'undefined') return '/';
  return `${window.location.pathname}${window.location.search}`;
}

/**
 * Global synchronized router hook.
 * Fully hydration-safe for Next.js App Router and iframe embeds.
 * Any call to setSearchParams or navigate will instantly re-render ALL components
 * using this hook with the exact new searchParams and pathname.
 */
export function useSearchParams(): [
  URLSearchParams,
  (
    nextInit:
      | URLSearchParams
      | Record<string, string | number | boolean | null | undefined>
      | ((prev: URLSearchParams) => URLSearchParams),
    options?: SetSearchParamsOptions
  ) => void,
  string, // current pathname
  (toPath: string, search?: Record<string, string | number | boolean | null | undefined>) => void // navigate helper
] {
  const [locationString, setLocationString] = useState<string>('/');

  useEffect(() => {
    // Sync with actual client location after hydration
    setLocationString(getWindowLocation());

    const onLocationChange = () => {
      setLocationString(getWindowLocation());
    };

    window.addEventListener('popstate', onLocationChange);
    window.addEventListener('hashchange', onLocationChange);
    window.addEventListener(LOCATION_CHANGE_EVENT, onLocationChange);

    return () => {
      window.removeEventListener('popstate', onLocationChange);
      window.removeEventListener('hashchange', onLocationChange);
      window.removeEventListener(LOCATION_CHANGE_EVENT, onLocationChange);
    };
  }, []);

  const { pathname, searchParams } = useMemo(() => {
    const qIndex = locationString.indexOf('?');
    const path = qIndex >= 0 ? locationString.slice(0, qIndex) || '/' : locationString || '/';
    const qs = qIndex >= 0 ? locationString.slice(qIndex + 1) : '';
    return {
      pathname: path,
      searchParams: new URLSearchParams(qs),
    };
  }, [locationString]);

  const setSearchParams = useCallback(
    (
      nextInit:
        | URLSearchParams
        | Record<string, string | number | boolean | null | undefined>
        | ((prev: URLSearchParams) => URLSearchParams),
      options?: SetSearchParamsOptions
    ) => {
      if (typeof window === 'undefined') return;

      const current = new URLSearchParams(window.location.search);
      let next: URLSearchParams;

      if (typeof nextInit === 'function') {
        next = nextInit(current);
      } else if (nextInit instanceof URLSearchParams) {
        next = nextInit;
      } else {
        next = new URLSearchParams();
        Object.entries(nextInit).forEach(([key, val]) => {
          if (val !== undefined && val !== null && val !== '') {
            next.set(key, String(val));
          }
        });
      }

      const queryString = next.toString();
      const targetPath = options?.pathname !== undefined 
        ? options.pathname 
        : window.location.pathname;
        
      const newUrl = queryString ? `${targetPath}?${queryString}` : targetPath;

      if (options?.replace) {
        window.history.replaceState(null, '', newUrl);
      } else {
        window.history.pushState(null, '', newUrl);
      }

      setLocationString(newUrl);
      window.dispatchEvent(new Event(LOCATION_CHANGE_EVENT));
    },
    []
  );

  const navigate = useCallback(
    (toPath: string, search?: Record<string, string | number | boolean | null | undefined>) => {
      if (typeof window === 'undefined') return;

      const sp = new URLSearchParams();
      if (search) {
        Object.entries(search).forEach(([k, v]) => {
          if (v !== undefined && v !== null && v !== '') {
            sp.set(k, String(v));
          }
        });
      }
      const qs = sp.toString();
      const newUrl = qs ? `${toPath}?${qs}` : toPath;

      window.history.pushState(null, '', newUrl);
      setLocationString(newUrl);
      window.dispatchEvent(new Event(LOCATION_CHANGE_EVENT));
    },
    []
  );

  return [searchParams, setSearchParams, pathname, navigate];
}
