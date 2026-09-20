'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

export function GlobalErrorHandler() {
  useEffect(() => {
    // Обработка необработанных ошибок JavaScript
    const handleError = (event: ErrorEvent) => {
      console.error('Global Error:', event.error);
      toast.error('Ошибка приложения', {
        description: event.message || 'Произошла непредвиденная ошибка.',
      });
    };

    // Обработка необработанных промисов
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled Promise Rejection:', event.reason);
      toast.error('Ошибка', {
        description: 'Произошла ошибка при загрузке данных.',
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener(
        'unhandledrejection',
        handleUnhandledRejection,
      );
    };
  }, []);

  return null; // Этот компонент ничего не рендерит
}
