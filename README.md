# Nuxt 3 Minimal Starter

Look at the [nuxt 3 documentation](https://v3.nuxtjs.org) to learn more.

## Setup

Make sure to install the dependencies:

```bash
# yarn
yarn install

# npm
npm install

# pnpm
pnpm install --shamefully-hoist
```

## Development Server

Start the development server on http://localhost:3000

```bash
npm run dev
```

## Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

Checkout the [deployment documentation](https://v3.nuxtjs.org/guide/deploy/presets) for more information.

## Nuxt3

В папке pages, account.vue выступает как обертка для дочерних страницы account.

Для получения данных до инициализации, мы используем getServerRequest.
Для отправки запросов используем стандартный axios.
Где требуется добавить токен прокидываем его в headers. Возможно лучше написать общую обертку.
