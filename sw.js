// 定义缓存的名称和需要缓存的文件列表
const CACHE_NAME = 'apple-demo-v1';
const urlsToCache = [
  '/', // 缓存根目录（通常是index.html）
  'index.html',
  'manifest.json'
  // 注意：图标是外部链接，通常不缓存，实际项目中建议将图标文件放在自己服务器
];

// 安装阶段：预缓存关键文件
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('已预缓存关键文件');
        return cache.addAll(urlsToCache);
      })
  );
});

// 激活阶段：清理旧缓存
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('删除旧缓存:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 拦截请求：优先从缓存提供，失败则回退到网络
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 如果在缓存中找到，直接返回
        if (response) {
          return response;
        }
        // 否则从网络获取
        return fetch(event.request);
      })
  );
});