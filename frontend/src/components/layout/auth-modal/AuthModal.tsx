'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { saveUserSession } from '@/lib/auth-utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ErrorMessage } from '@/components/ui/error-message';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useMutation } from '@apollo/client/react';
import { REGISTER_MUTATION } from '@/constants/constants';
import { LOGIN_MUTATION } from '@/graphql/mutations';
import {
  ApolloErrorLike,
  AuthModalProps,
  AuthMode,
  LoginMutationData,
  RegisterMutationData,
} from '@/types/types';

export function AuthModal({
  isOpen,
  onClose,
  initialMode = 'login',
}: AuthModalProps) {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>(initialMode);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [registerMutation, { loading: registerLoading }] =
    useMutation<RegisterMutationData>(REGISTER_MUTATION);
  const [loginMutation, { loading: loginLoading }] =
    useMutation<LoginMutationData>(LOGIN_MUTATION);

  const isLoading = registerLoading || loginLoading;

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setErrorMessage('');
  };

  const handleModeSwitch = (newMode: AuthMode) => {
    setMode(newMode);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (mode === 'register') {
      if (password !== confirmPassword) {
        setErrorMessage('Пароли не совпадают');
        return;
      }
      if (password.length < 6) {
        setErrorMessage('Пароль должен содержать минимум 6 символов');
        return;
      }

      try {
        const { data, error } = await registerMutation({
          variables: {
            input: { name: name.trim() || undefined, email, password },
          },
        });

        let errorMsg = 'Ошибка регистрации. Проверьте данные.';

        if (error) {
          const apolloError = error as ApolloErrorLike;
          errorMsg =
            apolloError.graphQLErrors?.[0]?.message ||
            apolloError.message ||
            errorMsg;
        }

        if (error || !data?.register?.userId) {
          console.error('Ошибка регистрации:', error, data);
          setErrorMessage(errorMsg);
          return;
        }

        const displayName =
          data.register.name ||
          data.register.email.split('@')[0] ||
          'Пользователь';

        saveUserSession(data.register.userId, displayName);

        toast.success(`Добро пожаловать, ${displayName}!`, {
          description: 'Аккаунт успешно создан.',
        });

        resetForm();
        onClose();
        router.refresh();
      } catch (err: unknown) {
        console.error('Исключение при регистрации:', err);
        const safeError =
          err instanceof Error
            ? err.message
            : 'Произошла неизвестная ошибка при регистрации.';
        setErrorMessage(safeError);
      }
    } else if (mode === 'login') {
      try {
        const { data, error } = await loginMutation({
          variables: { input: { email, password } },
        });

        let errorMsg = 'Неверный email или пароль.';

        if (error) {
          const apolloError = error as ApolloErrorLike;
          errorMsg =
            apolloError.graphQLErrors?.[0]?.message ||
            apolloError.message ||
            errorMsg;
        }

        if (error || !data?.login?.userId) {
          console.error('Ошибка входа:', error, data);
          setErrorMessage(errorMsg);
          return;
        }

        const displayName =
          data.login.name || data.login.email.split('@')[0] || 'Пользователь';

        saveUserSession(data.login.userId, displayName);

        toast.success(`С возвращением, ${displayName}!`, {
          description: 'Вы успешно вошли в систему.',
        });

        resetForm();
        onClose();
        router.refresh();
      } catch (err: unknown) {
        console.error('Исключение при входе:', err);
        const safeError =
          err instanceof Error
            ? err.message
            : 'Произошла неизвестная ошибка при входе.';
        setErrorMessage(safeError);
      }
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          resetForm();
          onClose();
        }
      }}
    >
      <DialogContent className='sm:max-w-[425px] p-0 overflow-hidden'>
        <div className='p-6'>
          <DialogHeader className='mb-4'>
            <DialogTitle className='text-2xl font-bold text-center'>
              {mode === 'login' ? 'Вход в аккаунт' : 'Создание аккаунта'}
            </DialogTitle>
            <DialogDescription className='text-center'>
              {mode === 'login'
                ? 'Введите свои данные для доступа к личному кабинету'
                : 'Заполните форму, чтобы начать покупки'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className='space-y-4'>
            {mode === 'register' && (
              <div className='space-y-2'>
                <Label htmlFor='name'>Имя (необязательно)</Label>
                <Input
                  id='name'
                  type='text'
                  placeholder='Иван Иванов'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                  className='h-11 focus-brand'
                />
              </div>
            )}

            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                placeholder='example@mail.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className='h-11 focus-brand'
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='password'>Пароль</Label>
              <Input
                id='password'
                type='password'
                placeholder='••••••••'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className='h-11 focus-brand'
              />
            </div>

            {mode === 'register' && (
              <div className='space-y-2'>
                <Label htmlFor='confirmPassword'>Подтвердите пароль</Label>
                <Input
                  id='confirmPassword'
                  type='password'
                  placeholder='••••••••'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className='h-11 focus-brand'
                />
              </div>
            )}

            <ErrorMessage message={errorMessage} />

            <Button
              type='submit'
              className='w-full h-11 text-base bg-brand hover:bg-brand-hover text-white focus-brand mt-2'
              disabled={isLoading}
            >
              {isLoading
                ? 'Обработка...'
                : mode === 'login'
                  ? 'Войти'
                  : 'Зарегистрироваться'}
            </Button>
          </form>

          <div className='mt-6 text-center text-sm'>
            <span className='text-muted-foreground'>
              {mode === 'login' ? 'Нет аккаунта? ' : 'Уже есть аккаунт? '}
            </span>
            <button
              type='button'
              onClick={() =>
                handleModeSwitch(mode === 'login' ? 'register' : 'login')
              }
              className='text-brand font-medium hover:text-brand-hover transition-colors underline underline-offset-4'
            >
              {mode === 'login' ? 'Зарегистрироваться' : 'Войти'}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
