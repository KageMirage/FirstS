'use client';

import { useCallback, useMemo, useSyncExternalStore } from 'react';
import {
  useSearchParams as useNextSearchParams,
  usePathname as useNextPathname,
  useRouter,
} from 'next/navigation';

export interface SetSearchParamsOptions {
  replace?: boolean;
  pathname?: string;
}

const LOCATION_CHANGE_EVENT = 'applet_location_change';

// Global memory cache of current location string
let currentLocation =
  typeof window !== 'undefined'
    ? `${window.location.pathname}${window.location.search}${window.location.hash}`
    : '/';

const listeners = new Set<() => void>();

export function notifyLocationChange() {
  if (typeof window !== 'undefined') {
    currentLocation = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  }
  listeners.forEach((listener) => {
    try {
      listener();
    } catch {}
  });
}

if (typeof window !== 'undefined') {
  window.addEventListener('popstate', notifyLocationChange);
  window.addEventListener('hashchange', notifyLocationChange);
  window.addEventListener(LOCATION_CHANGE_EVENT, notifyLocationChange);
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

function getClientSnapshot(): string {
  if (typeof window === 'undefined') return '/';
  const real = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  if (real !== currentLocation) {
    currentLocation = real;
  }
  return currentLocation;
}

/**
 * Universal synchronized router hook.
 * Fully hydration-safe for Next.js App Router and iframe embeds.
 * Integrates Next.js server-side query state during SSR/refresh,
 * and synchronizes with fast client-side navigation.
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
  const nextSearchParams = useNextSearchParams();
  const nextPathname = useNextPathname();
  const router = useRouter();

  // Snapshot for SSR and initial hydration matching Next.js App Router
  const serverSnapshot = useMemo(() => {
    const p = nextPathname || '/';
    const q = nextSearchParams?.toString() || '';
    return q ? `${p}?${q}` : p;
  }, [nextPathname, nextSearchParams]);

  const locationString = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    () => serverSnapshot
  );

  const { pathname, searchParams } = useMemo(() => {
    let rawPath = '/';
    let rawQs = '';

    if (locationString) {
      const hashIndex = locationString.indexOf('#');
      const cleanLoc = hashIndex >= 0 ? locationString.slice(0, hashIndex) : locationString;
      const qIndex = cleanLoc.indexOf('?');
      rawPath = qIndex >= 0 ? cleanLoc.slice(0, qIndex) || '/' : cleanLoc || '/';
      rawQs = qIndex >= 0 ? cleanLoc.slice(qIndex + 1) : '';
    }

    const effectivePath =
      rawPath && rawPath !== '/' ? rawPath : nextPathname || rawPath || '/';

    // Prioritize the active client query string, fallback to Next.js query params if empty
    const effectiveQs =
      rawQs !== '' ? rawQs : nextSearchParams ? nextSearchParams.toString() : '';

    return {
      pathname: effectivePath,
      searchParams: new URLSearchParams(effectiveQs),
    };
  }, [locationString, nextPathname, nextSearchParams]);

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
        next = new URLSearchParams(nextInit);
      } else {
        next = new URLSearchParams();
        Object.entries(nextInit).forEach(([key, val]) => {
          if (val !== undefined && val !== null && val !== '') {
            next.set(key, String(val));
          }
        });
      }

      const queryString = next.toString();
      const targetPath =
        options?.pathname !== undefined ? options.pathname : window.location.pathname;

      const newUrl = queryString ? `${targetPath}?${queryString}` : targetPath;

      if (options?.replace) {
        window.history.replaceState(null, '', newUrl);
        try {
          router.replace(newUrl, { scroll: false });
        } catch {}
      } else {
        window.history.pushState(null, '', newUrl);
        try {
          router.push(newUrl, { scroll: false });
        } catch {}
      }

      notifyLocationChange();
    },
    [router]
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
      try {
        router.push(newUrl, { scroll: false });
      } catch {}
      notifyLocationChange();
    },
    [router]
  );

  return [searchParams, setSearchParams, pathname, navigate];
}

export default useSearchParams;
