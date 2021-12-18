//source: https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API/Using_the_Geolocation_API

function geoFindMe() {

    const status = document.querySelector('#status');
    const mapLink = document.querySelector('#map-link');
  
    function success(position) {
      lat  = position.coords.latitude;
      lng = position.coords.longitude;

      getBirdList(lat,lng,5)

      //get address
      reverseGeocoding(lat,lng)
  
      status.textContent = '';
      mapLink.href = `https://www.openstreetmap.org/#map=18/${lat}/${lng}`;
      mapLink.textContent = `${lat} °, ${lng} °`;
    }
  
    function error() {
      status.textContent = 'Unable to retrieve your location';
    }
  
    if(!navigator.geolocation) {
      status.textContent = 'Geolocation is not supported by your browser';
    } else {
      status.textContent = 'Locating…';
      navigator.geolocation.getCurrentPosition(success, error);
    }
  
}
  