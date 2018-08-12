/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {
  initMap(); // added
  fetchNeighborhoods();
  fetchCuisines();
});

/**
 * Fetch all neighborhoods and set their HTML.
 */
fetchNeighborhoods = () => {
  DBHelper.fetchNeighborhoods((error, neighborhoods) => {
    if (error) { // Got an error
      console.error(error);
    } else {
      self.neighborhoods = neighborhoods;
      fillNeighborhoodsHTML();
    }
  });
}

/**
 * Set neighborhoods HTML.
 */
fillNeighborhoodsHTML = (neighborhoods = self.neighborhoods) => {
  const select = document.getElementById('neighborhoods-select');
  neighborhoods.forEach(neighborhood => {
    const option = document.createElement('option');
    option.innerHTML = neighborhood;
    option.value = neighborhood;
    select.append(option);
  });
}

/**
 * Fetch all cuisines and set their HTML.
 */
fetchCuisines = () => {
  DBHelper.fetchCuisines((error, cuisines) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.cuisines = cuisines;
      fillCuisinesHTML();
    }
  });
}

/**
 * Set cuisines HTML.
 */
fillCuisinesHTML = (cuisines = self.cuisines) => {
  const select = document.getElementById('cuisines-select');

  cuisines.forEach(cuisine => {
    const option = document.createElement('option');
    option.innerHTML = cuisine;
    option.value = cuisine;
    select.append(option);
  });
}

/**
 * Initialize leaflet map, called from HTML.
 */
initMap = () => {
  self.newMap = L.map('map', {
        center: [40.722216, -73.987501],
        zoom: 12,
        scrollWheelZoom: false
      });
  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}', {
    mapboxToken: 'pk.eyJ1IjoicnJiaXo2NjIiLCJhIjoiY2prZm16d3BpMGEzaTNxb2Fpenh1bHdycCJ9.vjf6YJYdVrF2elfE_5fzoA',
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
      '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox.streets'
  }).addTo(newMap);

  updateRestaurants();
}
/* window.initMap = () => {
  let loc = {
    lat: 40.722216,
    lng: -73.987501
  };
  self.map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: loc,
    scrollwheel: false
  });
  updateRestaurants();
} */

/**
 * Update page and map for current restaurants.
 */
updateRestaurants = () => {
  const cSelect = document.getElementById('cuisines-select');
  const nSelect = document.getElementById('neighborhoods-select');

  const cIndex = cSelect.selectedIndex;
  const nIndex = nSelect.selectedIndex;

  const cuisine = cSelect[cIndex].value;
  const neighborhood = nSelect[nIndex].value;

  DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, (error, restaurants) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      resetRestaurants(restaurants);
      fillRestaurantsHTML();
      mediaQueryListener(window.matchMedia('(max-width: 550px)'));
    }
  })
}

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
resetRestaurants = (restaurants) => {
  // Remove all restaurants
  self.restaurants = [];
  const ul = document.getElementById('restaurants-list');
  ul.innerHTML = '';

  // Remove all map markers
  if (self.markers) {
    self.markers.forEach(marker => marker.remove());
  }
  self.markers = [];
  self.restaurants = restaurants;
}

/**
 * Create all restaurants HTML and add them to the webpage.
 */
fillRestaurantsHTML = (restaurants = self.restaurants) => {
  const ul = document.getElementById('restaurants-list');
  restaurants.forEach(restaurant => {
    ul.append(createRestaurantHTML(restaurant));
  });
  addMarkersToMap();
}

/**
 * Create restaurant HTML.
 */
createRestaurantHTML = (restaurant) => {
  const li = document.createElement('li');
  li.classList.add('restaurants-list-item-part');
  li.tabIndex = 0;

  const image = document.createElement('img');
  image.className = 'restaurant-img';
  image.alt = restaurant.name + ' Restaurant Image';
  image.src = DBHelper.imageUrlForRestaurant(restaurant);
  li.append(image);

  const name = document.createElement('h2');
  name.innerHTML = restaurant.name;
  li.append(name);

  const neighborhood = document.createElement('p');
  neighborhood.innerHTML = restaurant.neighborhood;
  li.append(neighborhood);

  const address = document.createElement('p');
  address.innerHTML = restaurant.address;
  li.append(address);

  const more = document.createElement('a');
  more.innerHTML = 'View Details';
  more.href = DBHelper.urlForRestaurant(restaurant);
  more.setAttribute('role', 'button');
  li.append(more)

  return li;
}

/**
 * Add markers for current restaurants to the map.
 */
addMarkersToMap = (restaurants = self.restaurants) => {
  restaurants.forEach(restaurant => {
    // Add marker to the map
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.newMap);
    marker.on('click', onClick);
    function onClick() {
      window.location.href = marker.options.url;
    }
    self.markers.push(marker);
  });

}
/* addMarkersToMap = (restaurants = self.restaurants) => {
  restaurants.forEach(restaurant => {
    // Add marker to the map
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.map);
    google.maps.event.addListener(marker, 'click', () => {
      window.location.href = marker.url
    });
    self.markers.push(marker);
  });
} */

/**
 * Handle media queries.
 */
mediaQueryListener = (mediaQueryList) => {
  switch(mediaQueryList.media){
    case '(max-width: 550px)':
      if(mediaQueryList.matches){
        for (const listEle of restaurantListEle.getElementsByTagName('li')) {
          listEle.classList.replace('restaurants-list-item-part', 'restaurants-list-item-full');
        }
        restaurantListEle.classList.replace('restaurants-list-part', 'restaurants-list-full');
      }
      else{
        for (const listEle of restaurantListEle.getElementsByTagName('li')) {
          listEle.classList.replace('restaurants-list-item-full', 'restaurants-list-item-part');
        }

        restaurantListEle.classList.replace('restaurants-list-full', 'restaurants-list-part');
      }
      break;
    case '(max-width: 320px)':
      if(mediaQueryList.matches){
        for (const selectEle of selectEles) {
          selectEle.classList.replace('filter-options-part', 'filter-options-full');
        }
      }
      else{
        for (const selectEle of selectEles) {
          selectEle.classList.replace('filter-options-full', 'filter-options-part');
        }
      }
      break;
      case '(max-width: 220px)':
      if(mediaQueryList.matches){
        headerLinkEle.classList.replace('large-header', 'small-header');
      }
      else{
        headerLinkEle.classList.replace('small-header', 'large-header');
      }
      break;
  }
}

/**
 * Initialize service worker.
 */
initServiceWorker = () => {
  if('serviceWorker' in navigator){
    navigator.serviceWorker.register('/index.js').then(function(){
      console.log('Registration worked.');
    }).catch(function(){
      console.log('Registration failed.');
    });
  }
  else{
    console.log('Service workers not supported.')
  }
}

let restaurants,
  neighborhoods,
  cuisines
var newMap
var markers = []

// Setup for media queries.
const restaurantListEle = document.getElementById('restaurants-list');
const filterOptionsEle = document.getElementsByClassName('filter-options')[0];
const selectEles = filterOptionsEle.getElementsByTagName('select');
const headerLinkEle = document.getElementsByClassName('large-header')[0];
let mediaQueryList = [
  window.matchMedia('(max-width: 550px)'),
  window.matchMedia('(max-width: 320px)'),
  window.matchMedia('(max-width: 220px)')
];
for (const query of mediaQueryList) {
  mediaQueryListener(query);
  query.addListener(mediaQueryListener);
};

initServiceWorker();



