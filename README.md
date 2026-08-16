# Stock Alarm and Tracking Station with Mobile Notifications

[English](README.md) | [Türkçe](README_TR.md)

A private, ad-free financial dashboard that tracks BIST, global equities, and crypto assets and sends a mobile push notification when a configured target level is reached.

## Features

- Unlimited alarms with custom notes
- Mobile notifications through ntfy.sh or Telegram
- Browser-generated alert sounds through the Web Audio API
- Live price cards with visual direction indicators
- Local JSON storage for alarms, history, and settings

## Install and run

```bash
npm install
npm start
```

Open `http://localhost:3000` after the server starts.

## Mobile notifications

For ntfy, install the ntfy mobile application, subscribe to the same unique topic configured in the dashboard, and use the test-notification button. Telegram users can configure their bot token and chat ID in the application settings.

## Main files

- `server.js`: market-data polling and notification integrations
- `public/index.html`: dashboard markup
- `public/index.css`: visual theme
- `public/app.js`: search, charts, sounds, and settings
- `data/db.json`: local alarm and settings database

> Market data and alerts may be delayed or unavailable. This software is not investment advice.

