'use client';

import { useSyncExternalStore } from 'react';
import { getCurrentUserId, getUserName } from '@/lib/auth-utils';

// 1. Стабильный (кэшированный) объект для сервера.
// Это предотвращает бесконечный цикл гидратации.
const SERVER_SNAPSHOT = {
  userId: undefined as string | undefined,
  userName: undefined as string | undefined,
};

// 2. Храним текущий снапшот в модульной области видимости,
// чтобы getSnapshot всегда возвращал одну и ту же ссылку до изменения.
let currentSnapshot = { ...SERVER_SNAPSHOT };

function subscribe(callback: () => void) {
  const handler = () => {
    // Обновляем снапшот только при реальном изменении
    currentSnapshot = {
      userId: getCurrentUserId(),
      userName: getUserName(),
    };
    callback();
  };

  // Инициализируем при первой подписке
  currentSnapshot = {
    userId: getCurrentUserId(),
    userName: getUserName(),
  };

  window.addEventListener('user-session-changed', handler);

  return () => {
    window.removeEventListener('user-session-changed', handler);
  };
}

function getSnapshot() {
  return currentSnapshot;
}

export function useUserSession() {
  return useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => SERVER_SNAPSHOT, // Возвращаем стабильную ссылку для сервера
  );
}

export function notifySessionChanged() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('user-session-changed'));
  }
}
