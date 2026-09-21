'use client';

import React from 'react';
import { ErrorPageView } from '../components/ErrorPageView';

export default function NotFound() {
  return (
    <ErrorPageView 
      code="404" 
      title="Страница не найдена" 
      buttonText="На главную" 
    />
  );
}
