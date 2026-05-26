# @anime-ide-code/web

Веб-версия Anime IDE Code: Vite + React 19 + Tailwind 4 + Vidstack.

## Локальная разработка

```bash
# из корня монорепо
pnpm web                  # dev-сервер на http://localhost:5173
pnpm build:web            # прод-билд в apps/web/dist
```

## Деплой на Firebase Hosting

### Первая настройка (один раз)

1. **Создай проект в Firebase Console** — https://console.firebase.google.com/ → Add project.
2. **Подставь project ID** в [.firebaserc](../../.firebaserc): замени `REPLACE_WITH_YOUR_FIREBASE_PROJECT_ID` на ID своего проекта.
3. **Включи Hosting** в Firebase Console: левое меню → Build → Hosting → Get started.
4. **Залогинься** в Firebase CLI (откроет браузер):
   ```bash
   pnpm --filter @anime-ide-code/web firebase:login
   ```
   Альтернативно: `pnpm dlx firebase-tools login`.

### Деплой

```bash
# из корня монорепо
pnpm deploy:web
```

Или ручками из `apps/web`:

```bash
pnpm build
pnpm dlx firebase-tools deploy --only hosting
```

После деплоя URL вида `https://<project-id>.web.app` и `https://<project-id>.firebaseapp.com`.

## Структура

- `src/pages/` — экраны (Home, Search, Favorites, Compiler, Title, Player)
- `src/components/` — переиспользуемые компоненты (Layout, TitleCard, Loader)
- `src/store/` — zustand-сторы с persist в localStorage (favorites, history, compiler)
- бизнес-логика и типы — `@anime-ide-code/shared`

## Конфиг хостинга

[firebase.json](../../firebase.json):
- SPA-rewrites: все пути → `/index.html` (для react-router)
- Immutable cache для статики (JS/CSS/шрифты), no-cache для `index.html`
- `cleanUrls: true` — обрезает `.html` из URL
