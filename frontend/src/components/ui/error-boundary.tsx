'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className='flex min-h-[50vh] flex-col items-center justify-center p-6 md:p-8 text-center'>
          {/* Иконка ошибки с мягким фоном */}
          <div className='mb-4 rounded-full bg-destructive/10 p-3'>
            <AlertTriangle
              className='h-8 w-8 text-destructive'
              aria-hidden='true'
            />
          </div>

          <h2 className='mb-2 text-2xl md:text-3xl font-bold text-foreground'>
            Что-то пошло не так
          </h2>

          <p className='mb-8 max-w-md text-muted-foreground'>
            {this.state.error?.message ||
              'Произошла непредвиденная ошибка. Мы уже работаем над её исправлением.'}
          </p>

          {/* Кнопки: на мобильных в колонку и на всю ширину, на десктопе в ряд */}
          <div className='flex flex-col sm:flex-row gap-4 w-full sm:w-auto'>
            <Button
              onClick={this.handleReset}
              variant='outline'
              className='sm:min-w-[180px] focus-visible:ring-brand-focus'
            >
              Попробовать снова
            </Button>

            <Link href='/' className='sm:min-w-[180px]'>
              <Button
                variant='default'
                className='w-full bg-brand hover:bg-brand-hover text-white font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background'
              >
                Вернуться на главную
              </Button>
            </Link>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
