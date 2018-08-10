let cacheName = 'restaurants_cache_v';
let cacheVersion = 1;

/**
 * Add resources to the cache on service worker install.
 */
self.addEventListener('install', function(event){
    // Wait until promise is returned.
    event.waitUntil(
      caches.open(cacheName + cacheVersion).then(function(cache){
        return cache.addAll(
          [
            '/',
            '/index.html',
            '/index.js',
            '/js/main.js',
            '/js/dbhelper.js',
            '/js/restaurant_info.js',
            '/css/styles.css',
            '/data/restaurants.json',
            '/img/1.jpg',
            '/img/2.jpg',
            '/img/3.jpg',
            '/img/4.jpg',
            '/img/5.jpg',
            '/img/6.jpg',
            '/img/7.jpg',
            '/img/8.jpg',
            '/img/9.jpg',
            '/img/10.jpg',
            '/restaurant.html',
            '/restaurant.html?id=1',
            '/restaurant.html?id=2',
            '/restaurant.html?id=3',
            '/restaurant.html?id=4',
            '/restaurant.html?id=5',
            '/restaurant.html?id=6',
            '/restaurant.html?id=7',
            '/restaurant.html?id=8',
            '/restaurant.html?id=9',
            '/restaurant.html?id=10',
            'https://unpkg.com/leaflet@1.3.1/dist/leaflet.css',
            'https://unpkg.com/leaflet@1.3.1/dist/leaflet.js',
          ]
        );
      })
    );
  });

  /**
   * On request, get data fromS cache first then the server.
   */
  self.addEventListener('fetch', function(event){
    event.respondWith(
      caches.match(event.request).then(function(response){
        return response || fetch(event.request);
      })
    );
  });

  /**
   * Delete old cache.
   */
  self.addEventListener('activate', function(event){
    event.waitUntil(
      caches.keys().then(function(cacheNames){
        return Promise.all(
          cacheNames.filter(function(cacheToDelete){
          }).map(function(cacheToDelete){
            return caches.delete(cacheToDelete);
          })
        );
      })
    );
  });
