'use client';

import React from 'react';
import { ErrorPageView } from '../../components/ErrorPageView';

export default function Page505() {
  return (
    <ErrorPageView 
      code="505" 
      title="Ошибка сервера" 
      buttonText="На главную" 
    />
  );
}
