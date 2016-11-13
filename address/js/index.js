$(document).ready(function () {
    // test for presence of geolocation
    if(navigator && navigator.geolocation) {
      // make the request for the user's position
      navigator.geolocation.getCurrentPosition(geo_success, geo_error);
    } else {
      // use MaxMind IP to location API fallback
      printAddress(geoip_latitude(), geoip_longitude(), true);
    }
  });

 
 
function geo_success(position) {
  printAddress(position.coords.latitude, position.coords.longitude);
}
 
function geo_error(err) {
  // instead of displaying an error, fall back to MaxMind IP to location library
  printAddress(geoip_latitude(), geoip_longitude(), true);
}
 
// use Google Maps API to reverse geocode our location
function printAddress(latitude, longitude, isMaxMind) {
    // set up the Geocoder object
    var geocoder = new google.maps.Geocoder();
 
    // turn coordinates into an object
    var yourLocation = new google.maps.LatLng(latitude, longitude);
 
    // find out info about our location
    geocoder.geocode({ 'latLng': yourLocation }, function (results, status) {
    if(status == google.maps.GeocoderStatus.OK) {
      if(results[0]) {
        $('#results').fadeOut(function() {
          $(this).html('<p><b>Your Current Position address within few meters from</p><p><em>' + results[0].formatted_address + '</em></p>').fadeIn();
        })
      } else {
        error('Google did not return any results.');
      }
    } else {
      error("Reverse Geocoding failed due to: " + status);
    }
  });
 
  // if we used MaxMind for location, add attribution link
  if(isMaxMind) {
    $('body').append('<p><a href="https://www.maxmind.com" target="_blank">IP to Location Service Provided by MaxMind</a></p>');
  }
}
 
function error(msg) {
  alert(msg);
}



var weatherData = {
  city: document.querySelector ("#city"),
  weather: document.querySelector ("#weather"),
  temperature: document.querySelector("#temperature"),
  temperatureValue: 0,
  units: "°C"
  
};

function roundTemperature(temperature){
			temperature = temperature.toFixed(1);
			return temperature;
		}

function switchUnits (){
  
  if (weatherData.units == "°C") {
    weatherData.temperatureValue = roundTemperature(weatherData.temperatureValue * 9/5 + 32);
    weatherData.units = "°F";
  
} else {
  weatherData.temperatureValue = roundTemperature ((weatherData.temperatureValue -32) * 5/9);
    weatherData.units = "°C";  
}

  weatherData.temperature.innerHTML = weatherData.temperatureValue + weatherData.units + " ";
}


function getLocationAndWeather(){
  if (window.XMLHttpRequest){
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("load", function() {
      var response = JSON.parse(xhr.responseText);

      console.log(response);
      var position = {
        latitude: response.latitude,
        longitude: response.longitude
      };
      var cityName = response.city;

      var weatherSimpleDescription = response.weather.simple;
      var weatherDescription = response.weather.description;
      var weatherTemperature = roundTemperature(response.weather.temperature);

      weatherData.temperatureValue = weatherTemperature;

      loadBackground(position.latitude, position.longitude, weatherSimpleDescription);
     
      weatherData.weather.innerHTML =  ", " + weatherDescription;
      weatherData.temperature.innerHTML = weatherTemperature + weatherData.units;
    }, false);

    xhr.addEventListener("error", function(err){
      alert("Could not complete the request");
    }, false);

    xhr.open("GET", "https://fourtonfish.com/tutorials/weather-web-app/getlocationandweather.php?owapikey=be0b3e214608df7acc454c798df210d2&units=metric", true);
    xhr.send();
  }
  else{
    alert("Unable to fetch the location and weather data.");
  }           
}


function loadBackground(lat, lon, weatherTag) {
  var script_element = document.createElement('script');

  script_element.src = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=1452866c8cea54acd0075022ef573a07&lat=" + lat + "&lon=" + lon + "&accuracy=1&tags=" + weatherTag + "&sort=relevance&extras=url_l&format=json";
  
  document.getElementsByTagName('head')[0].appendChild(script_element);
}

function jsonFlickrApi(data){
  if (data.photos.pages > 0){
    //var randomPhotoId = parseInt(data.photos.total);
    var photo = data.photos.photo[Math.floor(Math.random()*parseInt(data.photos.photo.length))];
    document.querySelector("body").style.backgroundImage = "url('" + photo.url_l + "')";
    document.querySelector("#image-source").setAttribute("href", "https://www.flickr.com/photos/" + photo.owner + "/" + photo.id);
  }
  else{
    document.querySelector("body").style.backgroundImage = "url('https://fourtonfish.com/tutorials/weather-web-app/images/default.jpg')";
    document.querySelector("#image-source").setAttribute("href", "https://www.flickr.com/photos/superfamous/310185523/sizes/o/");
  }
}

getLocationAndWeather();
