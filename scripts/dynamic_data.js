/*global $*/

/***** Functions ********/

// Generate the Daily Forecast table
function dailyTable(weatherData) {

    "use strict";

    var i = 0,
        l = weatherData.daily.length,
        d = {},
        newDate = "",
        days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], // to display only the day
        currentWeek = [],
        rangeTag = "",
        rangeBar = "",
        lowestTemperature = 0, // range lowest limit
        highestTemperature = 0,
        rangeScale = 8, // pixels per degree

        row = "",
        table = "",
        graph = "";

    // Record the relevant data in an arrray of objects
    // Deduce the lowest & highest Temperature of the week
    for (i = 0; i < l; i++) {

        d = weatherData.daily[i]; // data for that day
        currentWeek[i] = {}; // initialise object

        currentWeek[i].date = new Date(d.dt * 1000); // Get the date of that day
        currentWeek[i].day = days[currentWeek[i].date.getDay()];
        currentWeek[i].minTemperature = Math.round(d.temp.min);
        currentWeek[i].maxTemperature = Math.round(d.temp.max);
        currentWeek[i].description = d.weather[0].description;

        if (i === 0) {
            lowestTemperature = currentWeek[i].minTemperature;
        } else if (lowestTemperature > currentWeek[i].minTemperature) {
            lowestTemperature = currentWeek[i].minTemperature;
        }

        if (i === 0) {
            highestTemperature = currentWeek[i].maxTemperature;
        } else if (highestTemperature < currentWeek[i].maxTemperature) {
            highestTemperature = currentWeek[i].maxTemperature;
        }
    }

    l = currentWeek.length;

    // Set a New table
    table = $("<table class='half-page stripped-format'>");

    // Add data row by row
    for (i = 0; i < l; i++) {


        //Set a new row
        row = $("<tr>");

        //Add name of the day in the row
        if (i === 0) {
            row.append("<th>Today</th>");
        } else if (i === 1) {
            row.append("<th>Tomorrow</th>");
        } else {
            row.append("<th>" + currentWeek[i].day + "</th>");
        }

        //Add the descritpion in the row
        row.append("<td>" + currentWeek[i].description + "</td>");

        //Add the row to the table
        table.append(row);

    }

    //Add the the table
    $("#daily div").append(table);



    //GRAPH

    // Set a New table for the graph
    graph = $("<table class='temperatureGraph half-page stripped-format'>");

    // Add data row by row
    for (i = 0; i < l; i++) {

        //Set a new row
        row = $("<tr>");

        //Add name of the day in the row
        if (i === 0) {
            row.append("<th>Today</th>");
        } else if (i === 1) {
            row.append("<th>Tomorrow</th>");
        } else {
            row.append("<th>" + currentWeek[i].day + "</th>");
        }

        // Set the temperature as a range bar
        rangeTag = $("<td class='temperatureRange'>"); // table cell containing the temperature bar
        rangeBar = $("<div class='rangeBar'>"); // temperature visualisation bar

        rangeBar.append("<span class='minTemperature'>" + currentWeek[i].minTemperature + "</span>");
        rangeBar.append("<span class='maxTemperature'>" + currentWeek[i].maxTemperature + "</span>");

        // Include the range bar into the table cell
        rangeTag.append(rangeBar);
        // Add the range bar in the row
        row.append(rangeTag);

        // Dynamic styling of the bar
        rangeBar.css("left", (currentWeek[i].minTemperature - lowestTemperature) * rangeScale + "px"); // will centre the graph
        rangeBar.css("width", (currentWeek[i].maxTemperature - currentWeek[i].minTemperature) * rangeScale + "px");

        // Dynamic temperature gradient
        // create a gradient function to include all the browaser variances
        // set the colour based on the temperature From LowestTemperature to HighsetTemperature

        //background: #8ccbff; /* Old browsers */
        //background: -moz-linear-gradient(left,  #8ccbff 0%, #ffe575 100%); /* FF3.6-15 */
        //background: -webkit-linear-gradient(left,  #8ccbff 0%,#ffe575 100%); /* Chrome10-25,Safari5.1-6 */
        //background: linear-gradient(to right,  #8ccbff 0%,#ffe575 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
        //filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#8ccbff', endColorstr='#ffe575',GradientType=1 ); /* IE6-9 */

        //Add the row to the table
        graph.append(row);

    }

    //Add the graph
    $("#daily div").append(graph);


    /* DEBUG */
    console.log(currentWeek);

}

// Generate the hourly Forecast table
function hourlyTable(weatherData) {

    "use strict";

    var i = 0,
        l = weatherData.hourly.length,
        d = {},
        next48Hours = [],
        row = "",
        table1 = "",
        table2 = "";

    // Record the relevant data in an arrray of objects
    for (i = 0; i < l; i++) {

        d = weatherData.hourly[i]; // data for that hour
        next48Hours[i] = {}; // initialise object

        next48Hours[i].date = new Date(d.dt * 1000); // Get the date of that day
        next48Hours[i].hour = next48Hours[i].date.toTimeString().substr(0, 5);
        next48Hours[i].temperature = Math.round(d.temp);
        next48Hours[i].description = d.weather[0].description;

    }

    l = next48Hours.length;

    // Set a New table
    table1 = $("<table class='half-page stripped-format'>");
    table2 = $("<table class='half-page stripped-format'>");

    // Add data row by row
    for (i = 0; i < 12; i++) {

        //Set a new row
        row = $("<tr>");

        //Add name of the day in the row
        if (i === 0) {
            row.append("<th>For an hour</th>");
        } else {
            row.append("<th>At " + next48Hours[i].hour + "</th>"); // Add the time
        }

        row.append("<td>" + next48Hours[i].description + "</td>"); //Add the descritpion in the row
        table1.append(row); //Add the row to the table

    }

    // Add data row by row
    for (i = 12; i < 24; i++) {


        //Set a new row
        row = $("<tr>");

        row.append("<th>At " + next48Hours[i].hour + "</th>"); // Add the time
        row.append("<td>" + next48Hours[i].description + "</td>"); //Add the descritpion in the row
        table1.append(row); //Add the row to the table

        //Add the row to the table
        table2.append(row);

    }


    //Add the the table
    $("#hourly div").append(table1);
    $("#hourly div").append(table2);

    /* DEBUG */
    console.log(next48Hours);

}

// Generate the Minutely Forecast table
function minutelyTable(weatherData) {

    "use strict";

    var i = 0,
        l = weatherData.minutely.length,
        d = {},
        next60minutes = [],
        row = "",
        table1 = "",
        table2 = "";

    // Record the relevant data in an arrray of objects
    for (i = 0; i < l; i += 5) {

        d = weatherData.minutely[i]; // data for that minute
        next60minutes[i] = {}; // initialise object

        next60minutes[i].date = new Date(d.dt * 1000); // Get the date of that minute
        next60minutes[i].minute = next60minutes[i].date.getMinutes();
        next60minutes[i].passedMinutes = (next60minutes[i].minute + 60 - next60minutes[0].minute) % 60;
        next60minutes[i].precipitation = Math.round(d.precipitation);

    }

    l = next60minutes.length;

    // Set a New table
    table1 = $("<table class='half-page stripped-format'>");
    table2 = $("<table class='half-page stripped-format'>");

    // Add data row by row
    for (i = 0; i < 30; i += 5) {

        //Set a new row
        row = $("<tr>");

        //Add name of the day in the row
        if (i === 0) {
            row.append("<th>For now</th>");
        } else {
            row.append("<th>In " + next60minutes[i].passedMinutes + " minutes</th>"); // Add the time
        }

        row.append("<td>" + next60minutes[i].precipitation + "% chances of rain</td>"); //Add the precipitation in the row
        table1.append(row); //Add the row to the table

    }

    // Add data row by row
    for (i = 30; i < 60; i += 5) {


        //Set a new row
        row = $("<tr>");

        row.append("<th>In " + next60minutes[i].passedMinutes + " minutes</th>"); // Add the time
        row.append("<td>" + next60minutes[i].precipitation + "% chances of rain</td>"); //Add the descritpion in the row
        table1.append(row); //Add the row to the table

        //Add the row to the table
        table2.append(row);

    }


    //Add the the table
    $("#minutely div").append(table1);
    $("#minutely div").append(table2);

    /* DEBUG */
    console.log(next60minutes);

}

// Generate the Current weather report
function currentMarkup(weatherData) {

    "use strict";

    var i = "0",
        timeTags = [],
        dateTags = [],
        temperatureTags = [],
        descriptionTags = [],
        currentDateTime = "",
        currentTime = "",
        currentDate = "",
        currentTemperature = "",
        currentDescription = "";


    // Register the tags to change
    dateTags = $(".date");
    timeTags = $(".time");
    temperatureTags = $(".temperature");
    descriptionTags = $(".description");

    //Create new date and time object (*1000 to get milliseconds)
    currentDateTime = new Date(weatherData.current.dt * 1000);

    // Create separate strings
    currentDate = currentDateTime.toDateString();
    currentTime = currentDateTime.toTimeString().substr(0, 5);
    currentTemperature = Math.round(weatherData.current.temp) + "ºC";
    currentDescription = weatherData.current.weather[0].description;


    // REPLACE content with textContent
    // Does not parse the string which Prevents HTML injection
    // Overwrites all the children nodes with one text node

    for (i = 0; i < dateTags.length; i++) {
        dateTags[i].textContent = currentDate;
    }

    for (i = 0; i < timeTags.length; i++) {
        timeTags[i].textContent = currentTime;
    }

    for (i = 0; i < temperatureTags.length; i++) {
        temperatureTags[i].textContent = currentTemperature;
    }

    for (i = 0; i < descriptionTags.length; i++) {
        descriptionTags[i].textContent = currentDescription;
    }


    /* DEBUG */
    //    console.log(weatherData);
    //        console.log(dateTag);
    //        console.log(timeTag);
    //        console.log(weatherData.current.dt);
    //        console.log(weatherData.current.temp);
    //        console.log(weatherData.current.weather[0].description);
    //        console.log();


}

/*****/

// Display the location Name
function displayLocationName(locationData) {

    "use strict";

    var i = 0,
        locationComponents = {},
        locationName = "",
        locationTags = [];

    locationComponents = locationData.results[0].components;

    // Retrieved the city or town name depending on the data output
    if (locationComponents.city) {
        locationName = locationComponents.city;
    } else if (locationComponents.town) {
        locationName = locationComponents.town;
    }

    //        locationTag = $("<h1>").html(locationName); // Set the tag to display the time and date // html() vs text()
    //        $("#current").append(locationTag); // Display the time and date


    locationTags = $(".location");

    for (i = 0; i < locationTags.length; i++) {
        locationTags[i].textContent = locationName;
    }

    /* DEBUG */
    console.log(locationData);
    //    console.log(locationData.results[0].components.city);
    //    console.log(locationData.results[0].components.town);
}

// Display the wheater data
function displayWeather(weatherData) {

    "use strict";

    /* Insert all the data to display inside the markup */
    currentMarkup(weatherData);
    dailyTable(weatherData);
    hourlyTable(weatherData);
    minutelyTable(weatherData);

}

// Display the calendar data
function displayCalendar(calendarData) {

    "use strict";

    /* DEBUG */
    console.log(calendarData);
}

/*****/

function processLocationName(locationData) {

    "use strict";

    //TODO process location name

    // Call location name display
    displayLocationName(locationData);

    /* DEBUG */
    console.log("processed location name!");
}

function processWeather(weatherData) {

    "use strict";

    //TODO process weather data

    displayWeather(weatherData);

    /* DEBUG */
    console.log("processed weather data!");
}

function processCalendar(calendarData) {

    "use strict";

    //TODO process calendar data

    // call calendar data display
    displayCalendar(calendarData);

    /* DEBUG */
    console.log("processed calendar data!");
}

function processGatheredResponses(gatheredData){
    //TODO process Object containing all data
}

/*****/

// Get location name using the following REST API service: api.opencagedata.com
function getLocationName(key, lat, lon) {

    "use strict";

    /* Using Open Cage Data Map API // Documentation @ hhttps://opencagedata.com/api */

    var geoCodeUrl = "https://api.opencagedata.com/geocode/v1/json?key=" + key + "&q=" + lat + "+" + lon + "&pretty=1&no_annotations=1"; // API call

    //Make API call through Http GET request / call location name data processing
    $.get(geoCodeUrl, processLocationName);

    /* DEBUG */
    console.log(geoCodeUrl);
}

// Get wheater data using the following REST API service: api.openweathermap.org
function getWeather(appid, lat, lon) {

    "use strict";

    /* Using Open Weather Map API // Documentation @ https://openweathermap.org/api/one-call-api */

    var i = 0,
        units = "metric", // unit system // metric,imperial
        exclude = "", // forecast data to exclude // current,minutely,hourly,daily,alert
        url = "";


    if (units) { // Add parameter call only if needed
        units = "&units=" + units;
    }
    if (exclude) { // Add parameter call only if needed
        exclude = "&exclude=" + exclude;
    }


    url = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + units + exclude + "&appid=" + appid; // API call

    //Make API call through Http GET request / call weather data processing
    $.get(url, processWeather);

    /* DEBUG */
    console.log(url);

}

// Get Calendar Data as JSON file from the following service: trumba.com
function getCalendar(calendarData) {

    "use strict";

    url = "http://trumba.com/calendars/brisbane-city-council.json"; // API call

    //get JSON file through Http GET request / call calendar data processing
    $.get(url, processCalendar);

    /* DEBUG */
    console.log(url);
}

/*****/

function gatherResponses(latitude, longitude) {

    "use strict";

    // Call API to get location name and format display
    getLocationName("41f101eecefa4f808fa8adfc924a3063", latitude, longitude);
    // Using quotes to help considering all following properties type as string?

    // Call API to get weather data and format display
    getWeather("393d283150e7d7ced1c524ff318a8870", latitude, longitude);

    // Call API to get Brisbane City Council data and format display
    getCalendar();

    //TODO Return all gathered data as an object

    //TODO call gathered data processing

    /* DEBUG */
    console.log("All data gathered!");
}

/*****/

// Executed if the browser geolocation is successful
function geolocSuccess(geolocReport) {

    "use strict";

    // Store latitude and longitude from the geolocated data
    var geolocLatitude = geolocReport.coords.latitude,
        geolocLongitude = geolocReport.coords.longitude;

    // gather all the data based on geolocation
    gatherResponses(geolocLatitude, geolocLongitude);

    /* DEBUG */
    //console.log(navigator.geolocation);
    //console.log(geolocReport);

}

// Executed if the browser geolocation is unsuccessful
function geolocError(errorReport) {

    "use strict";

    //window.alert(errorReport.message + "\n\"Brisbane\" will be used as a default location.");

    // Set the default location as a fallback for latitude and longitude
    var locations = {
            Paris: { // Because Brisbane and Pomona don't provide minutely data
                lat: 48.85341,
                lon: 2.3488
            },
            Brisbane: { // As a local city
                lat: -27.470125,
                lon: 153.021072
            },
            Pomona: { // As a local town
                lat: -26.3630,
                lon: 152.8560
            }
        },
        defaultLatitude = locations.Brisbane.lat,
        defaultLongitude = locations.Brisbane.lon;

    // gather all the data based on default location
    gatherResponses(defaultLatitude, defaultLongitude);

    /* DEBUG */
    //console.log(errorReport.message);
}

// Executed when in "Dev Mode" / API calls are replaced by sample data to prevent reaching quotas.
function useSampleFile() {

    "use strict";

    // fetch the Open Weather Map sample file in the app folder
    fetch("/sample_data/openweathermap_brisbane.json")
        .then(function (weatherResponse) {
            console.log("Weather Data * Loaded");
            return weatherResponse.json(); // parse the Json data and return it to following function
        })
        .then(processWeather)
        .catch(function (weatherError) {
            alert("The \"api.openweathermap.org\" sample Json file could not be loaded due to the following error:\n\n\"" + weatherError + "\"");
        });

    // fetch the Open Cage Data sample file in the app folder
    fetch("/sample_data/opencagedata_brisbane.json")
        .then(function (locationResponse) {
            console.log("Location Data * Loaded");
            return locationResponse.json(); // parse the Json data and return it to following function
        })
        .then(processLocationName)
        .catch(function (locationError) {
            alert("The \"api.opencagedata.com\"sample Json file could not be loaded due to the following error:\n\n\"" + locationError + "\"");
        });

    // fetch the City Council Calendar Data sample file in the app folder
    fetch("/sample_data/calendardata_brisbane.json")
        .then(function (calendarResponse) {
            console.log("Calendar Data * Loaded");
            return calendarResponse.json(); // parse the Json data and return it to following function
        })
        .then(processCalendar)
        .catch(function (calendarError) {
            alert("The Brisbane City Council sample Json file could not be loaded due to the following error:\n\n\"" + calendarError + "\"");
        });

    /* DEBUG */

}

//TODO use one function to fetch all data
//TODO fetch data based on object containing API calls
function fetchDataSources(dataSources,devMode) {

    "use strict";

if(devMode===true){

    dataSource = {};

} else {



}

    // fetch the Open Weather Map sample file in the app folder
    fetch("/sample_data/openweathermap_brisbane.json")
        .then(function (weatherResponse) {
            console.log("Weather Data * Loaded");
            return weatherResponse.json(); // parse the Json data and return it to following function
        })
        .then(processWeather)
        .catch(function (weatherError) {
            alert("The \"api.openweathermap.org\" sample Json file could not be loaded due to the following error:\n\n\"" + weatherError + "\"");
        });

    // fetch the Open Cage Data sample file in the app folder
    fetch("/sample_data/opencagedata_brisbane.json")
        .then(function (locationResponse) {
            console.log("Location Data * Loaded");
            return locationResponse.json(); // parse the Json data and return it to following function
        })
        .then(processLocationName)
        .catch(function (locationError) {
            alert("The \"api.opencagedata.com\"sample Json file could not be loaded due to the following error:\n\n\"" + locationError + "\"");
        });

    // fetch the City Council Calendar Data sample file in the app folder
    fetch("/sample_data/calendardata_brisbane.json")
        .then(function (calendarResponse) {
            console.log("Calendar Data * Loaded");
            return calendarResponse.json(); // parse the Json data and return it to following function
        })
        .then(processCalendar)
        .catch(function (calendarError) {
            alert("The Brisbane City Council sample Json file could not be loaded due to the following error:\n\n\"" + calendarError + "\"");
        });

    /* DEBUG */

}


/* $(document).ready(function*(){}); */
/************** START ****************/

$(function () {

    "use strict";

    var devMode = true; // "Dev Mode" toggle

    if (devMode === true) {

        useSampleFile();
        console.log("DEV MODE * Enabled");

    } else {

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(geolocSuccess, geolocError); // browser geolocation prompt
        }

    }

});

/*************** END *****************/
