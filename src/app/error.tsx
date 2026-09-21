'use client';

import React, { useEffect } from 'react';
import { ErrorPageView } from '../components/ErrorPageView';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console for debugging
    console.error('App runtime error:', error);
  }, [error]);

  return (
    <ErrorPageView 
      code="505" 
      title="Ошибка сервера" 
      buttonText="На главную"
      onNavigateHome={() => {
        reset();
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
      }}
    />
  );
}
