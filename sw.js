// キャッシュバージョンを上げて強制的に更新させる
const CACHE_NAME = 'photo-frame-v3';
// キャッシュするファイルの一覧（アイコン画像を追加）
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './2376.png'
];

// 1. インストール処理：必要なファイルをキャッシュに保存
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 2. アクティベート処理：古いキャッシュを削除
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. フェッチ処理：ネットワーク通信時にキャッシュがあればそこから返す（オフライン対応）
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
