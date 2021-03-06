/**
 * Add resources to the cache on service worker install.
 */
self.addEventListener('install', function(event){
    // Wait until promise is returned.
    event.waitUntil(
      caches.open(CACHE_NAME + cacheVersion).then(function(cache){
        return cache.addAll(
          [
            '/',
            '/index.html',
            '/index.js',
            '/js/dbhelper.js',
            '/js/main.js',
            '/js/restaurant_info.js',
            '/css/styles.css',
            '/data/restaurants.json',
            '/img',
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

const CACHE_NAME = 'restaurants_cache_v';
let cacheVersion = 1;