# Task Manager — система управления задачами (Kanban-доска)

[![Maintainability](https://api.codeclimate.com/v1/badges/ваш_репозиторий_id/maintainability)](https://codeclimate.com/github/Lirgat/hexlet-practice-task-manager/maintainability)

## 📋 Описание проекта

**Task Manager** — это полноценное веб-приложение для управления задачами по методологии Kanban. Проект разработан в рамках производственной практики по веб-разработке.

### Основной функционал:
- ✅ Регистрация и авторизация пользователей с JWT-токенами
- ✅ Хеширование паролей (bcrypt)
- ✅ Создание, чтение, обновление и удаление задач
- ✅ Drag & Drop — перетаскивание задач между колонками
- ✅ Приоритеты задач (Высокий / Средний / Низкий)
- ✅ Дедлайны и подсветка просроченных задач
- ✅ Поиск и фильтрация задач
- ✅ Статистика прогресса
- ✅ Адаптивный дизайн

## 🛠️ Стек технологий

| Компонент | Технология |
|-----------|------------|
| **Frontend** | React, Vite, Tailwind CSS |
| **Backend** | Node.js, Express |
| **Аутентификация** | JWT, bcryptjs |
| **База данных** | In-memory (для разработки) |
| **Деплой** | SnapDeploy (backend) |

## 🌐 Деплой

| Компонент | Ссылка |
|-----------|--------|
| **Backend API** | [https://hexlet-app.containers.snapdeploy.dev](https://hexlet-app.containers.snapdeploy.dev) |
| **Health check** | [https://hexlet-app.containers.snapdeploy.dev/api/health](https://hexlet-app.containers.snapdeploy.dev/api/health) |

> **Примечание:** Фронтенд запускается локально для демонстрации и разработки.

## 🔐 Тестовые данные

Для проверки функционала используйте:

| Роль | Email | Пароль |
|------|-------|--------|
| Тестовый пользователь | `test@example.com` | `test123` |

## 🚀 Как запустить локально (фронтенд + бэкенд на SnapDeploy)

### Требования
- Node.js (версия 16 или выше)
- npm

### Шаг 1: Клонирование репозитория
```bash
git clone https://github.com/Lirgat/hexlet-practice-task-manager.git
cd hexlet-practice-task-manager
```

### Шаг 2: Настройка окружения
```bash
cd frontend

# Создай файл .env с адресом бэкенда на SnapDeploy
echo "VITE_API_URL=https://hexlet-app.containers.snapdeploy.dev/api" > .env

# Проверь содержимое
cat .env
```

### Шаг 3: Настройка окружения
Создайте файл `.env` в папке `backend`:
`echo "PORT=5000" > .env && echo "JWT_SECRET=secret_key" >> .env`

### Шаг 4: Запуск фронтенда
```bash
npm install
npm run dev
```

Фронтенд запустится на http://localhost:5173

### Шаг 5: Проверка работы
```bash
# Проверка здоровья сервера на SnapDeploy
curl https://hexlet-app.containers.snapdeploy.dev/api/health

# Регистрация
curl -X POST https://hexlet-app.containers.snapdeploy.dev/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","name":"Test User"}'

# Логин
curl -X POST https://hexlet-app.containers.snapdeploy.dev/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Создание задачи (требуется токен)
curl -X POST https://hexlet-app.containers.snapdeploy.dev/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"title":"Новая задача","description":"Описание","status":"todo"}'

```

## API Эндпоинты

| Метод | URL | Описание | Требуется токен |
|-------|-----|----------|-----------------|
| GET | /api/health | Проверка статуса сервера | Нет |
| POST | /api/auth/register | Регистрация пользователя | Нет |
| POST | /api/auth/login | Вход в систему | Нет |
| GET | /api/tasks | Получить все задачи | Да |
| POST | /api/tasks | Создать задачу | Да |
| PUT | /api/tasks/:id | Обновить задачу | Да |
| DELETE | /api/tasks/:id | Удалить задачу | Да |

## Тестовые данные

| Роль | Email | Пароль |
|------|-------|--------|
| Тестовый пользователь | test@example.com | test123 |

## Деплой

Проект будет задеплоен на Render.com:

- API URL: https://hexlet-practice-task-manager.onrender.com
- Health check: https://hexlet-practice-task-manager.onrender.com/api/health

## Структура проекта

hexlet-practice-task-manager/
├── backend/
│   ├── routes/
│   │   ├── auth.js      # Регистрация и логин
│   │   └── tasks.js     # CRUD задач
│   ├── middleware/
│   │   └── auth.js      # JWT проверка
│   ├── users.db.js      # In-memory хранилище
│   ├── server.js        # Точка входа
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── pages/       # Компоненты страниц
│   │   ├── components/  # Переиспользуемые компоненты
│   │   ├── context/     # AuthContext
│   │   ├── api.js       # API клиент
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env             # Переменные окружения
│   └── package.json
└── README.md

## Автор

**Студент:** Выборнов Владимир
**Группа:** 01-23.ИСИП.ОФ.11
**Специальность:** 09.02.07 Информационные системы и программирование