/*global $*/

/***** $(document).ready(function(){}); *****/

// OPEN
$(function () {

    "use strict";

    var configuration = [
            {
                settings: {
                    label: "Weather",
                    useGeolocation: false, // Get Geolocation coordinates
                    useFile: true // Use a local json file instead of calling the API
                },
                source: {
                    url: "",
                    appId: "393d283150e7d7ced1c524ff318a8870",
                    units: "metric", // unit system // metric,imperial
                    exclude: "", // forecast data to exclude // current,minutely,hourly,daily,alert
                    coordinates: {
                        latitude: 0,
                        longitude: 0
                    },
                    file: "/sample_data/openweathermap_brisbane.json",

                    // Get wheater data using the following REST API service: api.openweathermap.org
                    // Open Weather Map API Documentation @ https://openweathermap.org/api/one-call-api
                    setApiCall: function () {
                        "use strict";
                        var units = "", // unit system // metric,imperial
                            exclude = "",
                            apiCall = "";
                        // Add parameter call only if needed
                        if (this.units) {
                            units = "&units=" + this.units;
                        }
                        // Add parameter call only if needed
                        if (this.exclude) {
                            exclude = "&exclude=" + this.exclude;
                        }
                        apiCall = "https://api.openweathermap.org/data/2.5/onecall?lat=" + this.coordinates.latitude + "&lon=" + this.coordinates.longitude + units + exclude + "&appid=" + this.appId;
                        return apiCall;
                    } // Url to call
                },
                response: {
                    data: {},
                    process: function () {},
                    display: function () {}
                }
        },
            {
                settings: {
                    label: "Location",
                    useGeolocation: false, // Get Geolocation coordinates
                    useFile: true // Use a local json file instead of calling the API
                },
                source: {
                    url: "",
                    appId: "41f101eecefa4f808fa8adfc924a3063",
                    coordinates: {
                        latitude: 0,
                        longitude: 0
                    },
                    file: "/sample_data/opencagedata_brisbane.json",

                    // Get location name using the following REST API service: api.opencagedata.com
                    // Open Cage Data Map API Documentation @ hhttps://opencagedata.com/api
                    setApiCall: function () {
                        "use strict";
                        var apiCall = "https://api.opencagedata.com/geocode/v1/json?key=" + this.appId + "&q=" + this.coordinates.latitude + "+" + this.coordinates.longitude + "&pretty=1&no_annotations=1";
                        return apiCall;
                    } // Url to call
                },
                response: {
                    data: {},
                    process: function () {},
                    display: function () {}
                }
        },
            {
                settings: {
                    label: "Calendar",
                    useGeolocation: false, // Get Geolocation coordinates
                    useFile: true // Use a local json file instead of calling the API
                },
                source: {
                    url: "",
                    appId: "",
                    coordinates: {
                        latitude: 0,
                        longitude: 0
                    },
                    file: "/sample_data/calendardata_brisbane.json",

                    // Get Calendar Data as JSON file from the following service: trumba.com
                    setApiCall: function () {
                        "use strict";
                        var corsProxy = "https://cors-anywhere.herokuapp.com/",
                            apiCall = corsProxy + "http://trumba.com/calendars/brisbane-city-council.json";
                        return apiCall;
                    } // Url to call
                },
                response: {
                    data: {},
                    process: function () {},
                    display: function () {}
                }
        }
    ],
        i = 0,
        l = configuration.length;

    for (i = 0; i < l; i++) {
        apiManager(configuration, i);
    }


});
// CLOSE


/* PROMISE CHAIN */

// wrapping function to set the variable scope
function apiManager(configurationArray, index) {
    "use strict";

    var obj = configurationArray[index];

    getGeolocation(obj)
        .catch(function (error) {
            console.log(error.message);
        })
        .then(function (geolocationResponse) {
            return setCoordinates(obj, geolocationResponse);
        })
        .then(function (coordinated) {
            return setUrl(coordinated);
        })
        .then(function (urled) {
            return fetch(urled.source.url); // fetch the Data using the configuration url
        })
        .then(function (apiResponse) {
            return apiResponse.json(); // parse the data into an object
        })
        .then(function (apiData) {
            obj.response.data = apiData; // store data
        })


        // Debug
        .then(function (apiData) {
            console.log(obj);
        })
        // Error
        .catch(function (error) {
            console.error(error.message);
        });

}

/* RETRIEVING */

// Get the Geolocation coordinates (promise functionality, based on: https://gist.github.com/varmais/74586ec1854fe288d393)
function getGeolocation(configObj) {
    "use strict";

    return new Promise(
        function (resolve, reject) {

            if (navigator.geolocation && configObj.settings.useGeolocation) {
                navigator.geolocation.getCurrentPosition(resolve, reject); // user permission prompt / using default options
                console.log("Geolocation option enabled");

            } else if (navigator.geolocation) {
                reject(new Error("Geolocation option disabled."));
            } else {
                reject(new Error("Browser Geolocation functionality unavailable."));
            }
        });
}

// Set the coordinates to use based on environement and settings (promise functionality)
function setCoordinates(configObj, coordinatesObj) {
    "use strict";

    return new Promise(
        function (resolve, reject) {

            var presetCoordinates = { // default locations
                    Brisbane: { // As a local city
                        latitude: -27.470125,
                        longitude: 153.021072
                    },
                    Pomona: { // As a local town
                        latitude: -26.3630,
                        longitude: 152.8560
                    },
                    Paris: { // As an alternatve
                        latitude: 48.85341,
                        longitude: 2.3488
                    },
                    debug: { // As a dummy position
                        latitude: -99.999999,
                        longitude: 99.999999
                    }
                },
                defaultCoordinates = presetCoordinates.Brisbane; // <-  Set default coordinates HERE

            if (coordinatesObj && configObj.settings.useGeolocation) {
                configObj.source.coordinates = coordinatesObj.coords;
                console.log("Using Geolocation coordinates.");
            } else {
                configObj.source.coordinates = defaultCoordinates;
                console.log("Using default coordinates.");
            }

            if (configObj) {
                resolve(configObj);
            } else {
                reject(new Error("Could not set the coordinates"));
            }

        });
}

// Set data source url (promise functionality)
function setUrl(configObj) {
    "use strict";

    return new Promise(
        function (resolve, reject) {

            if (configObj.settings.useFile) {
                configObj.source.url = configObj.source.file;
            } else {
                configObj.source.url = configObj.source.setApiCall();
            }

            if (configObj) {
                resolve(configObj);
            } else {
                reject(new Error("The Url could not be set"));
            }

        }
    );
}

function storeData(configObj, apiData) {
    "use strict";
    console.log("storeData()"); //DEBUG

    return new Promise(
        function (resolve, reject) {

            // store the fetched Data
            configObj.response.data = apiData;

            if (configObj) {
                resolve(configObj);
            } else {
                reject(new Error("The data could not be stored"));
            }

        });
}

/* PROCESSING */

function processLocationName(locationDataObj) {

    "use strict";
    console.log("processLocationName()"); //DEBUG



}

function processWeather(weatherDataObj) {

    "use strict";
    console.log("processWeather()"); //DEBUG



}

function processCalendar(calendarDataObj) {

    "use strict";
    console.log("processCalendar()"); //DEBUG


    // Narrow the list of events to the next 7 days


    // for each event in the array
    //    for each of the seven next days dates
    //        if the considered date is within the event period:  date >= response[i].startDateTime && date < response[i].endDateTime (on a per day basis)
    //            record the event array index

    // TODO Filter the events to display based on set conditions

}


/* MARKING */

// Display the calendar data
function calendarMarkup(calendarData) {

    "use strict";

    console.log(calendarData); //DEBUG
}

// Display the location Name
function locationNameMarkup(locationData) {

    "use strict";

    var i = 0,
        locationComponents = {},
        locationName = "",
        locationTags = [];

    locationComponents = locationData.results[i].components;

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

    console.log(locationData); //DEBUG
    //    console.log(locationData.results[i].components.city);//DEBUG
    //    console.log(locationData.results[i].components.town);//DEBUG
}

// Display the wheater data
function weatherMarkup(weatherData) {

    "use strict";

    // Insert all the data to display inside the markup
    currentMarkup(weatherData);
    dailyTable(weatherData);
    hourlyTable(weatherData);
    minutelyTable(weatherData);

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
    currentDescription = weatherData.current.weather[i].description;


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



    //    console.log(weatherData);//DEBUG
    //        console.log(dateTag);//DEBUG
    //        console.log(timeTag);//DEBUG
    //        console.log(weatherData.current.dt);//DEBUG
    //        console.log(weatherData.current.temp);//DEBUG
    //        console.log(weatherData.current.weather[i].description);//DEBUG
    //        console.log();//DEBUG


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
        next60minutes[i].passedMinutes = (next60minutes[i].minute + 60 - next60minutes[i].minute) % 60;
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

    console.log(next60minutes); //DEBUG

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
        next48Hours[i].description = d.weather[i].description;

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

    console.log(next48Hours); //DEBUG

}

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
        currentWeek[i].description = d.weather[i].description;

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

        //background: #8ccbff; /* Old browsers
        //background: -moz-linear-gradient(left,  #8ccbff 0%, #ffe575 100%); /* FF3.6-15 */
        //background: -webkit-linear-gradient(left,  #8ccbff 0%,#ffe575 100%); /* Chrome10-25,Safari5.1-6 */
        //background: linear-gradient(to right,  #8ccbff 0%,#ffe575 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
        //filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#8ccbff', endColorstr='#ffe575',GradientType=1 ); /* IE6-9 */

        //Add the row to the table
        graph.append(row);

    }

    //Add the graph
    $("#daily div").append(graph);


    console.log(currentWeek); //DEBUG

}
