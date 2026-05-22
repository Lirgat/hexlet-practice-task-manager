# Task Manager API

[![Maintainability](https://api.codeclimate.com/v1/badges/ваш_репозиторий_id/maintainability)](https://codeclimate.com/github/Lirgat/hexlet-practice-task-manager/maintainability)

## Описание проекта

Task Manager — это RESTful API для управления задачами. Проект разработан в рамках производственной практики по веб-разработке. API поддерживает регистрацию и аутентификацию пользователей с JWT-токенами, а также полный CRUD для задач.

### Основной функционал:
- Регистрация и авторизация пользователей
- Хеширование паролей (bcrypt)
- JWT-аутентификация
- Создание, чтение, обновление и удаление задач
- In-memory хранение данных (для разработки)

## Стек технологий

| Компонент | Технология |
|-----------|------------|
| Backend | Node.js, Express |
| Аутентификация | JWT, bcryptjs |
| База данных | In-memory (для разработки) |
| Деплой | Render.com |

## Как запустить локально

### Требования
- Node.js (версия 16 или выше)
- npm

### Шаг 1: Клонирование репозитория
`git clone https://github.com/Lirgat/hexlet-practice-task-manager.git`
`cd hexlet-practice-task-manager`

### Шаг 2: Установка зависимостей
`cd backend`
`npm install`

### Шаг 3: Настройка окружения
Создайте файл `.env` в папке `backend`:
`echo "PORT=5000" > .env && echo "JWT_SECRET=secret_key" >> .env`

### Шаг 4: Запуск сервера
`npm run dev`

Сервер запустится на `http://localhost:5000`

### Шаг 5: Проверка работы

Проверка здоровья сервера:
`curl http://localhost:5000/api/health`

Регистрация пользователя:
`curl -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"test123","name":"Test User"}'`

Логин (получение токена):
`curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"test123"}'`

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
│ ├── routes/
│ │ ├── auth.js
│ │ └── tasks.js
│ ├── middleware/
│ │ └── auth.js
│ ├── users.db.js
│ ├── server.js
│ ├── package.json
│ └── .env
├── frontend/
└── README.md


## Автор

**Студент:** Выборнов Владимир
**Группа:** 01-23.ИСИП.ОФ.11
**Специальность:** 09.02.07 Информационные системы и программирование