var loc = document.getElementById("wrapper-inner");
var latitude = 0;
var longitude = 0;
var temp,
    modal,
    toggle = 'c';
/***Use HTML5 Geolocation for lat & long*************/
var getUserLocation = function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert("Geolocation not supported by this browser");
  }
};
var showPosition = function showPosition(position) {
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;
  getWeatherInfo();
};
/****************************************************/
var getWeatherInfo = function getWeatherInfo() {
  var url = "https://fcc-weather-api.glitch.me/";
  var info = "/api/current?lon=" + longitude + "&lat=" + latitude + "";
  function makeUrl() {
    return url + "" + info;
  }
  /**************************************************/
  $.getJSON(makeUrl(), function (data) {
    //console.log(data);
    var city = data.name;
    var country = data.sys.country;
    temp = data.main.temp;
    var humidity = data.main.humidity;
    var pressure = data.main.pressure;
    var desc = data.weather[0].description;
    var main = data.weather[0].main;
    //var icon1 = data.weather[0].icon;
    var sunrise = data.sys.sunrise;
    var sunset = data.sys.sunset;
    var lt = data.coord.lat;
    var ln = data.coord.lon;
    var wdeg = data.wind.deg;
    var wspeed = data.wind.speed;
    var descU = desc.charAt(0).toUpperCase() + desc.substring(1);
    /******************details-modal*******************************/
    var dts = new Date().toString().substring(0, 25);
    var convertSunTime = function convertSunTime(suntime) {
      var dtsun = new Date(0);
      dtsun.setUTCSeconds(suntime);
      return dtsun.toLocaleTimeString();
    };
    /*********************degree to cardinal****************/
    var degreeToCardinal = function degreeToCardinal(deg) {
      if (deg > 348.75 && deg <= 360) return 'N';else if (deg >= 0 && deg <= 11.25) return 'N';else if (deg > 11.25 && deg <= 33.75) return 'NNE';else if (deg > 33.75 && deg <= 56.25) return 'NE';else if (deg > 56.25 && deg <= 78.75) return 'ENE';else if (deg > 78.75 && deg <= 101.25) return 'E';else if (deg > 101.25 && deg <= 123.75) return 'ESE';else if (deg > 123.75 && deg <= 146.25) return 'SE';else if (deg > 146.25 && deg <= 168.75) return 'SSE';else if (deg > 168.75 && deg <= 191.25) return 'S';else if (deg > 191.25 && deg <= 213.75) return 'SSW';else if (deg > 213.75 && deg <= 236.25) return 'SW';else if (deg > 236.25 && deg <= 258.75) return 'WSW';else if (deg > 258.75 && deg <= 281.25) return 'W';else if (deg > 281.25 && deg <= 303.75) return 'WNW';else if (deg > 303.75 && deg <= 326.25) return 'NW';else if (deg > 326.25 && deg <= 348.75) return 'NNW';else return "";
    };

    /*******************************************************/

    var html_dt = "";
    html_dt += "<div id='details'>Humidity: " + humidity + "%<br>Pressure: " + pressure + " hpa<br>Wind: " + wspeed + " m/s, " + degreeToCardinal(wdeg) + " (" + wdeg + "&deg;)<br>Cloudiness: " + descU + "<br>CurrentDateTime: " + dts + "<br>Geo Coords: " + "[" + lt + ", " + ln + "]<br>Sunrise: " + convertSunTime(sunrise) + "<br>Sunset: " + convertSunTime(sunset) + "</div>";

    $('.modal-content').append(html_dt);

    /******************Skycons call************************/
    var skycons = new Skycons({ "color": "pink" });
    skycons.add("animate-weather", Skycons.CLEAR);
    skycons.play();

    var currTime = new Date().getTime() / 1000;
    var day = true;
    if (currTime > sunrise && currTime < sunset) {
      day = true;
    } else {
      day = false;
    }
    //skyconlist  = ["clear-day", "clear-night", "partly-cloudy-day","partly-cloudy-night", "cloudy", "rain", "sleet", "snow", "wind", "fog"];
    var wtype = desc.toLowerCase();
    var wid = data.weather[0].id;

    if (wtype.indexOf('thunderstorm') >= 0 || /^2/.test(wid)) {
      skycons.set("animate-weather", 'SLEET');
    } else if (wtype.indexOf('drizzle') >= 0 || /^3/.test(wid)) {
      skycons.set("animate-weather", 'RAIN');
    } else if (wtype.indexOf('rain') >= 0 || /^5/.test(wid)) {
      skycons.set("animate-weather", 'RAIN');
    } else if (wtype.indexOf('snow') >= 0 || /^6/.test(wid)) {
      skycons.set("animate-weather", 'SNOW');
    } else if (wtype.indexOf('MIST') >= 0 || /^7/.test(wid)) {
      skycons.set("animate-weather", 'FOG');
    } else if (wtype.indexOf('wind') >= 0 || /^9/.test(wid)) {
      skycons.set("animate-weather", 'WIND');
    } else if (wtype.indexOf('clear') >= 0 || /^800/.test(wid)) {
      if (day === true) {
        skycons.set("animate-weather", 'CLEAR_DAY');
      } else skycons.set("animate-weather", 'CLEAR_NIGHT');
    } else if (wtype.indexOf('cloud') >= 0 || /^80/.test(wid)) {
      if (day === true) {
        skycons.set("animate-weather", 'PARTLY_CLOUDY_DAY');
      } else skycons.set("animate-weather", 'PARTLY_CLOUDY_NIGHT');
    } else if (wtype.indexOf('breeze') >= 0 || /^9/.test(wid)) {
      skycons.set("animate-weather", 'WIND');
    } else {
      skycons.set("animate-weather", 'CLOUD');
    }

    skycons.play();

    /***************************************************/

    var html = "";
    $('.header').html(city + ", " + country);
    $('.con-temp').html(temp.toFixed(1));
    $('.msg').html(descU);
    $('#c').html("<span id='cent'>&deg;C</span>");
    $('.btn-info').html("<i class='fa fa-search-plus' style='color:blue;font-size:2rem;'></i>");
  }); /********end of api call******/
}; /****End of weather info*****/
/*******************************************/
var tempConversion = function tempConversion() {
  k = temp * 9 / 5 + 32;
  $('.con-temp').html(k.toFixed(1));
};
/********jquery:doc ready**************************************/
$(document).ready(function () {
  getUserLocation();
  $('.type').on('click', function () {
    if (toggle === "c") {
      $('#c').html("<span id='cent'>&deg;F</span>");
      tempConversion();
      toggle = 'f';
    } else {
      $('#c').html("<span id='cent'>&deg;C</span>");
      $('.con-temp').html(temp.toFixed(1));
      toggle = 'c';
    }
  });
  /***details click******/
  modal = $('.details-modal');
  $(".btn-info").on("click", function () {
    modal.css("display", "block");
  });
  modal.on("click", function () {
    modal.css("display", "none");
  });
  /**************************/
});