var weather = new MetaWeather('https://ztvoa.herokuapp.com/');
// function to make js syntax better
var $ = function (id) {
  return document.getElementById(id);
};
var temp1, temp2;

// there was only 3 icons on font awesome which match weather so i used both the normal icons 
var iconKey = {
  hc: '<i class="fas fa-cloud"></i>',
  c: '<i class="fas fa-sun"></i>',
  lc: '<i class="fas fa-sun"></i>',
  sn: '<i class="fas fa-umbrella"></i>',
  sl: '<i class="fas fa-umbrella"></i>',
  h: '<i class="fas fa-umbrella"></i>',
  t: '<i class="fas fa-umbrella"></i>',
  hr: '<i class="fas fa-umbrella"></i>',
  lr: '<i class="fas fa-umbrella"></i>',
  s: '<i class="fas fa-umbrella"></i>'
};

// function returns a string stating which city is wammer
function whichIsWarmer() {
  var city1 = $('city1').value;
  var city2 = $('city2').value;
  var text = ' is warmer than '
  if (temp1 && temp2) {
    if (temp1 > temp2) {
      return city1 + text + city2;
    } else {
      return city2 + text + city1;
    }
  } else {
    return 'loading...'
  }
}
// function rounds and formats the weather so it's ready to be printed to the screen 
function roundAndFormat(weatherNow) {
  var maxMin =
    "Max: " + (Math.round(weatherNow.max_temp * 100) / 100) +
    "  <br> Min: " + (Math.round(weatherNow.min_temp * 100) / 100);
  var temp = (Math.round(weatherNow.the_temp * 100) / 100) + " C";
  var icon = "<img width='80' src='https://www.metaweather.com/static/img/weather/" + weatherNow.weather_state_abbr + ".svg' alt='Icon for " + weatherNow.weather_state_name + "'>"
  var type = weatherNow.weather_state_name;
  var wind = "<i style='transform: rotate(" + Math.floor(weatherNow.wind_direction) + "deg);' class='fas fa-arrow-up'></i>"
  var i = iconKey[weatherNow.weather_state_abbr];
  return {
    maxMin,
    temp,
    icon,
    type,
    wind,
    i
  }

}
// function clears the data when it's loading so people don't get wrong data
function showLoadingScreen(city) {
  $(city + "MaxMin").innerHTML = '';
  $(city + "Temp").innerHTML = '<h3>Loading....</h3>';
  $(city + "Icon").innerHTML = '';
  $(city + "Type").innerHTML = '';
  $(city + "Wind").innerHTML = '';
  $(city + "I").innerHTML = '';
}

// function which is called whenever the screen updates. It sets the content of the DOM 
function updateScreen(city, weather) {
  if (city === 'city1') {
    temp1 = weather.temp;
  } else {
    temp2 = weather.temp;
  }
  $(city + "MaxMin").innerHTML = weather.maxMin;
  $(city + "Temp").innerHTML = weather.temp;
  $(city + "Icon").innerHTML = weather.icon;
  $(city + "Type").innerHTML = weather.type;
  $(city + "Wind").innerHTML = weather.wind;
  $(city + "I").innerHTML = weather.i;
  $('output').innerHTML = whichIsWarmer();
}

// function get's new weather info for a single city
function updateCity(city) {
  var currerntCity = $(city).value;
  $(city + 'Name').innerHTML = currerntCity;
  showLoadingScreen(city);
  weather
    .search()
    .query(currerntCity)
    .then(function (res) {
      var cityInfo = JSON.parse(res.response);
      // now we have the city info we need it's weather
      weather
        .location(cityInfo[0].woeid)
        .then(function (res) {
          var weatherInfo = JSON.parse(res.response);
          var weatherNow = weatherInfo.consolidated_weather[0];
          // console.log(weatherNow);
          var formatted = roundAndFormat(weatherNow);
          console.log(formatted);
          updateScreen(city, formatted);
        })
        .catch(function (err) {
          console.log(err);
          console.error("Augh, there was an error!", err.statusText);
        });
    })
    .catch(function (err) {
      console.error("Augh, there was an error!", err.statusText);
    });
}

// Main
function setup() {
  console.info("Updating weather");
  updateCity("city1");
  updateCity("city2");
}
setup();

// update every 30 seconds
let timerId = setTimeout(function update() {
  setup();
}, 30000);
