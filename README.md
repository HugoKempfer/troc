<p align="center">
  <img width="256" height="256" src="https://github.com/HugoKempfer/troc/blob/main/public/web-app-manifest-512x512.png?raw=true">
  
</p>

# Troc - Currency Converter


An open-source Progressive Web App (PWA) for currency conversion.

## Features
- **Daily Rate Updates**: Convert between multiple currencies with exchange rates refreshed once per day.
- **Customizable Currency Selection**: Choose which currencies to display via a settings menu with flag icons.
- **Offline Support**: Use cached rates offline thanks to PWA technology.
- **Theme Support**: Automatically switches between light and dark modes based on device preference.
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices.
- **Installable**: Add to your home screen as a PWA.

## Data Source
Exchange rates are sourced from the [Frankfurter API](https://frankfurter.dev/), a free, open-source service that leverages data from the European Central Bank (ECB). Rates are updated daily (typically at midnight UTC) and cached in Troc for 24 hours, supporting conversions between approximately 32 currencies (e.g., USD, EUR, KRW). The API is reliable for general use but limited to daily updates, not real-time, and may be subject to occasional downtime or rate limits for free users.

## Tech Stack
- [Vue 3](https://vuejs.org/) (`<script setup>`) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) + [vite-plugin-pwa](https://vite-pwa-org.netlify.app/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [vue-i18n](https://vue-i18n.intlify.dev/) (English, French, Korean)

## Development
Requires Node.js 20+.

```bash
npm install      # install dependencies
npm run dev      # start the dev server
npm run build    # type-check and build for production
npm run preview  # preview the production build locally
```

Quality checks:

```bash
npm run lint        # ESLint
npm run format      # format with Prettier
npm run type-check  # type-check with vue-tsc
```

## Screenshots
![Troc Screenshot](screenshot.jpg)

## License
Released under the [MIT License](LICENSE).
