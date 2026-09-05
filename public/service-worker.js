// Placeholder service worker — replace with your real caching strategy if needed.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());
