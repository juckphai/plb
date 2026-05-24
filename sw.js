const CACHE_NAME = 'label-printer-pwa-v11';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json'
];

// ขั้นตอนการติดตั้งและบันทึกไฟล์ลงแคช
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// ขั้นตอนการเปิดใช้งาน และลบแคชเก่าที่ไม่ได้ใช้
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// ดึงข้อมูลจากแคชเมื่อไม่มีอินเทอร์เน็ต (Offline First)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request);
    })
  );
});
