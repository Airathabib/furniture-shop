# 🛋️ Furniture Shop API (Backend)

Полноценный GraphQL API для интернет-магазина мебели, построенный на современной архитектуре с разделением ответственности, строгой типизацией и безопасностью.

## 🛠 Технологический стек

- **Framework:** NestJS (Node.js, TypeScript)
- **API:** GraphQL (Code-First подход, Apollo Server)
- **ORM:** Prisma 7 (с Driver Adapter для PostgreSQL)
- **База данных:** PostgreSQL
- **Аутентификация:** JWT (Passport.js), Role-Based Access Control (RBAC)
- **Валидация:** `class-validator`, `class-transformer`

## 🏗 Архитектура

Проект построен по модульной архитектуре NestJS. Каждый модуль инкапсулирует свою бизнес-логику, DTO и GraphQL-типы.

```mermaid
graph TD
    Client[Frontend / Mobile] -->|GraphQL over HTTP| API[NestJS API Gateway]

    subgraph NestJS Modules
        API --> Auth[Auth Module <br/> JWT, Guards]
        API --> Catalog[Product & Category]
        API --> Cart[Cart Module]
        API --> Order[Order Module <br/> Transactions]
        API --> Wishlist[Wishlist Module]
        API --> Review[Review Module]
    end

    subgraph Data Layer
        Auth --> Prisma[(Prisma ORM)]
        Catalog --> Prisma
        Cart --> Prisma
        Order --> Prisma
        Wishlist --> Prisma
        Review --> Prisma
        Prisma --> DB[(PostgreSQL)]
    end
```

## 🚀 Быстрый старт

### 1. Предварительные требования

- Node.js >= 18.x
- PostgreSQL (локально или через Docker)
- npm или pnpm

### 2. Установка зависимостей

```bash
npm install
```

### 3. Настройка окружения

Создайте файл `.env` в корне папки `backend` на основе `.env.example`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/furniture_shop?schema=public"
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"
NODE_ENV="development"
```

### 4. Подготовка базы данных

```bash
# Генерация Prisma Client и применение схемы к БД
npm run db:push
npm run db:generate

# Наполнение БД тестовыми данными (категории, товары, админ)
npm run db:seed
```

### 5. Запуск сервера

```bash
# Режим разработки с hot-reload
npm run start:dev

# Продакшен сборка
npm run build
npm run start:prod
```

## 📚 Документация API

### Интерактивная консоль (Рекомендуемый способ)

После запуска сервера откройте в браузере:
👉 **http://localhost:3000/graphql**

## 🔐 Аутентификация и Авторизация

1. Зарегистрируйте пользователя или войдите через мутацию `login` / `register`.
2. Скопируйте полученный `accessToken`.
3. В Apollo Sandbox перейдите в **Settings** → **Request Headers** и добавьте:
   ```json
   {
     "Authorization": "Bearer ВАШ_ТОКЕН"
   }
   ```

### Роли:

- `USER`: Может просматривать каталог, управлять своей корзиной, оформлять заказы, оставлять отзывы.
- `ADMIN`: Имеет полный доступ к CRUD-операциям товаров, категорий и управлению статусами заказов.

## 🛡 Обработка ошибок

API использует единую точку форматирования ошибок (`formatError` в `AppModule`). Все ошибки возвращаются в машиночитаемом формате:

```json
{
  "errors": [
    {
      "message": "Пользователь с таким email уже зарегистрирован",
      "extensions": {
        "code": "USER_ALREADY_EXISTS",
        "statusCode": 409
      }
    }
  ]
}
```

Фронтенд может использовать поле `extensions.code` для отображения локализованных сообщений пользователю.

## 🧪 Тестирование

Основные сценарии (User Journey) для проверки:

1. `register` → `login` → получение токена.
2. `addToCart` → `getCart` → проверка суммы.
3. `checkout` → проверка создания `Order` и очистки корзины (транзакция).
4. `toggleWishlist` → проверка поля `isInWishlist` в запросе `products`.
