const popup = L.popup();


function getWeatherMapUrl(latitude, longitude) {
    // alternative using template literal string
    // const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=351ea9159e335c8a8180799a59aa9403`

    const url = new URL('https://api.openweathermap.org/data/2.5/weather');
    // TODO: add units parameter
    const params = { lat: latitude, lon: longitude, appid: '351ea9159e335c8a8180799a59aa9403' };
    url.search = new URLSearchParams(params).toString();
    
    return url.toString();
}

function normalizeUTCTime(utcTime) {
    const ONE_MILLISECOND = 1000;
    const timeInMilliseconds = utcTime * ONE_MILLISECOND;

    const utcDate = new Date(timeInMilliseconds);

    // TODO: add Uhr with template literal string
    return utcDate.toLocaleString('de-DE')
}

// destructuring parameters
function renderPopUpDataSource({
    weatherNormalizedTime, weatherStationName, weatherStationId, weatherLocationLongitude, weatherLocationLatitude
}) {
    // same as renderPopUpDataSource(data)
    // const { weatherNormalizedTime, weatherStationName, weatherStationId, weatherLocationLongitude, weatherLocationLatitude } = data

    const dataSourceContainer = document.createElement('div')
    // TODO: style data source container
    dataSourceContainer.classList.add('popup_datasource')

    const dataSourceTitle = document.createElement('span')
    dataSourceTitle.textContent = "Datasource:"
    dataSourceContainer.appendChild(dataSourceTitle)

    const dataSourceLink = document.createElement('a')
    // TODO: style link
    dataSourceLink.classList.add('popup_link')
    dataSourceLink.href = "https://openweathermap.org/"
    dataSourceLink.textContent = "openweathermap.org"

    const weatherNormalizedTimeElement = document.createElement('span')
    weatherNormalizedTimeElement.textContent = "Measure time: " + weatherNormalizedTime
    dataSourceContainer.appendChild(weatherNormalizedTimeElement)

    const weatherStationNameElement = document.createElement('span')
    weatherStationNameElement.textContent = "Weatherstation: " + weatherStationName
    dataSourceContainer.appendChild(weatherStationNameElement)

    const weatherStationIdElement = document.createElement('span')
    weatherStationIdElement.textContent = "Weatherstation-ID: " + weatherStationId
    dataSourceContainer.appendChild(weatherStationIdElement)

    const weatherStationCoordinatesElement = document.createElement('span')
    weatherStationCoordinatesElement.textContent = "Weatherstation Coordinates: " + weatherLocationLongitude + ", " + weatherLocationLatitude
    dataSourceContainer.appendChild(weatherStationCoordinatesElement)

    return dataSourceContainer
}


function renderMap(latitude, longitude) {
    $.ajax({
        url: getWeatherMapUrl(latitude, longitude),
        dataType: 'json',
        success: handleSuccess,
        error: handleError
    });
}

function handleSuccess(data) {
    // destructuring data.name
    // const name = data.name same as below
    // const { name } = data
    const { name: weatherStationName, id: weatherStationId, dt: weatherTimeInUTC, coord: { lon: weatherLocationLongitude, lat: weatherLocationLatitude } } = data

    // TODO destructure and rename rest of data
    temperature = data.main.temp; // Kelvin
    airpressure = data.main.pressure; // hPa
    airhumidity = data.main.humidity; // %
    temperature_min = data.main.temp_min; // Kelvin
    temperature_max = data.main.temp_max; // Kelvin
    windspeed = data.wind.speed; // Meter per second
    winddirection = data.wind.deg; // Wind from direction x degree from north
    cloudcoverage = data.clouds.all; // Cloudcoverage in %
    weatherconditionid = data.weather[0].id // ID
    weatherconditionstring = data.weather[0].main // Weatheartype
    weatherconditiondescription = data.weather[0].description // Weatherdescription
    weatherconditionicon = data.weather[0].icon // ID of weathericon

    renderWeatherMenu(weatherLocationLatitude, weatherLocationLongitude, weatherStationName);

    // Converting Unix UTC Time
    const weatherNormalizedTime = normalizeUTCTime(weatherTimeInUTC);

    // recalculating
    var weathercondtioniconhtml = "http://openweathermap.org/img/w/" + weatherconditionicon + ".png";
    var temperaturecelsius = Math.round((temperature - 273) * 100) / 100;  // Converting Kelvin to Celsius
    var windspeedknots = Math.round((windspeed * 1.94) * 100) / 100; // Windspeed from m/s in Knots; Round to 2 decimals
    var windspeedkmh = Math.round((windspeed * 3.6) * 100) / 100; // Windspeed from m/s in km/h; Round to 2 decimals
    var winddirectionstring = "Im the wind from direction"; // Wind from direction x as text
    if (winddirection > 348.75 && winddirection <= 11.25) {
        winddirectionstring = "North";
    } else if (winddirection > 11.25 && winddirection <= 33.75) {
        winddirectionstring = "Northnortheast";
    } else if (winddirection > 33.75 && winddirection <= 56.25) {
        winddirectionstring = "Northeast";
    } else if (winddirection > 56.25 && winddirection <= 78.75) {
        winddirectionstring = "Eastnortheast";
    } else if (winddirection > 78.75 && winddirection <= 101.25) {
        winddirectionstring = "East";
    } else if (winddirection > 101.25 && winddirection <= 123.75) {
        winddirectionstring = "Eastsoutheast";
    } else if (winddirection > 123.75 && winddirection <= 146.25) {
        winddirectionstring = "Southeast";
    } else if (winddirection > 146.25 && winddirection <= 168.75) {
        winddirectionstring = "Southsoutheast";
    } else if (winddirection > 168.75 && winddirection <= 191.25) {
        winddirectionstring = "South";
    } else if (winddirection > 191.25 && winddirection <= 213.75) {
        winddirectionstring = "Southsouthwest";
    } else if (winddirection > 213.75 && winddirection <= 236.25) {
        winddirectionstring = "Southwest";
    } else if (winddirection > 236.25 && winddirection <= 258.75) {
        winddirectionstring = "Westsouthwest";
    } else if (winddirection > 258.75 && winddirection <= 281.25) {
        winddirectionstring = "West";
    } else if (winddirection > 281.25 && winddirection <= 303.75) {
        winddirectionstring = "Westnorthwest";
    } else if (winddirection > 303.75 && winddirection <= 326.25) {
        winddirectionstring = "Northwest";
    } else if (winddirection > 326.25 && winddirection <= 348.75) {
        winddirectionstring = "Northnorthwest";
    } else {
        winddirectionstring = " - currently no winddata available - ";
    };

    // TODO: refactor to use template literal string and create a function to render the popup
    const container = document.createElement('div')
    container.classList.add('popup')

    const containerTitle = document.createElement('span')
    containerTitle.textContent = "Weatherdata: "
    container.appendChild(containerTitle)

    const icon = document.createElement('img')
    icon.src = "http://openweathermap.org/img/w/" + weatherconditionicon + ".png";
    container.appendChild(icon)

    const weatherConditionElement = document.createElement('span')
    weatherConditionElement.textContent = "(Weather-ID: " + weatherconditionid + "): " + weatherconditiondescription
    container.appendChild(weatherConditionElement)

    const temperatureElement = document.createElement('span')
    temperatureElement.textContent = "Temperature: " + temperaturecelsius + "°C"
    container.appendChild(temperatureElement)

    const airpressureElement = document.createElement('span')
    airpressureElement.textContent = "Airpressure: " + airpressure + " hPa"
    container.appendChild(airpressureElement)

    const airhumidityElement = document.createElement('span')
    airhumidityElement.textContent = "Humidity: " + airhumidity + "%"
    container.appendChild(airhumidityElement)

    const cloudcoverageElement = document.createElement('span')
    cloudcoverageElement.textContent = "Cloudcoverage: " + cloudcoverage + "%"
    container.appendChild(cloudcoverageElement)

    const windspeedElement = document.createElement('span')
    windspeedElement.textContent = "Windspeed: " + windspeedkmh + " km/h"
    container.appendChild(windspeedElement)

    const winddirectionElement = document.createElement('span')
    winddirectionElement.textContent = "Wind from direction: " + winddirectionstring + " (" + winddirection + "°)"
    container.appendChild(winddirectionElement)
    
    const dataSourceContainer = renderPopUpDataSource({
        weatherNormalizedTime, 
        weatherStationName, 
        weatherStationId, 
        weatherLocationLongitude, 
        weatherLocationLatitude
    })
    container.appendChild(dataSourceContainer)

    popup.setContent(container);
}

function renderWeatherMenu(weatherLocationLatitude, weatherLocationLongitude, weatherStationName) {
    document.getElementById('lat').innerText = "Lat: " + weatherLocationLatitude.toFixed(2);
    document.getElementById('lng').innerText = 'Long: ' + weatherLocationLongitude.toFixed(2);
    document.getElementById('city').innerText = weatherStationName;
}

function handleError() {
    alert("error receiving wind data from openweathermap");
}

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);

    //getting json function
    $(document).ready(function () {
        renderMap(e.latlng.lat, e.latlng.lng);
    });
}

$(document).ready(function () {

    // TODO: get the lat and lng from the user's location
    const latlng = {
        lat: 62.00,
        lng: 12.65
    }

    popup
    .setLatLng(latlng)
    .setContent("You clicked the map at " + latlng.toString())
    .openOn(map);

    renderMap(latlng.lat, latlng.lng);
});