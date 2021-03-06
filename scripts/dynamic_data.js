/// Author: José Deza ///

/*global $*/

/***** $(document).ready(function(){}); *****/

// OPEN
$(function () {

    "use strict";

    const configuration = [
            {
                settings: {
                    label: "Weather",
                    useGeolocation: false, // Get Geolocation coordinates
                    useFile: false // Use a local json file instead of calling the API
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
                data: {
                    raw: {},
                    filtered: {}
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
                data: {
                    raw: {},
                    filtered: {}
                }
        },
            {
                settings: {
                    label: "Calendar",
                    useGeolocation: false, // Get Geolocation coordinates
                    useFile: false // Use a local json file instead of calling the API
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
                data: {
                    raw: {},
                    filtered: {}
                }
        }
    ],
        promisesToSync = [];

    // Initialise the data retrieving for each API
    for (let i = 0; i < configuration.length; i++) {
        promisesToSync[i] = retrieveApiData(configuration, i); // Works fine to add the element to the array as with any Object
    }

    // Wait for all the data to be retrieved
    // Then process the data as a whole
    Promise.all(promisesToSync)
        .then(function (configured) {
            console.log(configured);
            return filterCalendar(configured);
        })
        .then(function (filtered) {
            return displayCalendar(filtered);
        })
        .catch(function (error) {
            console.error(error.message);
        });

});
// CLOSE


/* SINGLE API PROMISE CHAIN */

// wrapping promise chain into a function to set the variable scope
function retrieveApiData(configArray, i) {
    "use strict";

    return getGeolocation(configArray[i]) // "return" the chain to make it a promise!
        .catch(function (error) {
            console.log(error.message);
        })
        .then(function (geolocationResponse) {
            return setCoordinates(configArray[i], geolocationResponse);
        })
        .then(function (coordinatesIncluded) {
            return setUrl(coordinatesIncluded); // set the coordinates (Geolocation/default)
        })
        .then(function (urlIncluded) {
            return fetch(urlIncluded.source.url); // fetch the url
        })
        .then(function (apiResponse) {
            return apiResponse.json(); // parse the data as an object
        })
        .then(function (apiData) {
            return storeData(configArray[i], apiData); // return a promise that stores the data
        })
        //  Separate error Handling
        .catch(function (error) {
            console.error(error.message);
        });

}

/* RETRIEVE */

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
                configObj.source.coordinates = coordinatesObj.coords; // Set the geolocation data as coordinates object
                console.log("Using Geolocation coordinates.");
            } else {
                configObj.source.coordinates = defaultCoordinates; // Set the default location as coordinates object
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
                configObj.source.url = configObj.source.file; // Set the relevant file as url
            } else {
                configObj.source.url = configObj.source.setApiCall(); // Set the relevant API call as url
            }

            console.log(configObj.source.url);

            if (configObj) {
                resolve(configObj);
            } else {
                reject(new Error("The Url could not be set"));
            }

        }
    );
}

// Store the data into configuration object
function storeData(configObj, apiDataObj) {
    "use strict";

    return new Promise(
        function (resolve, reject) {

            configObj.data.raw = apiDataObj; // store the fetched Data in the relevant configuration field

            if (configObj) {
                resolve(configObj);
            } else {
                reject(new Error("The data could not be stored"));
            }

        });
}


/* FILTER */

// Narrow the list of events to the next 8 days
function filterCalendar(configArray) {
    "use strict";

    return new Promise(
        function (resolve, reject) {

            let calendarData = configArray[2].data,
                nextDays = configArray[0].data.raw.daily; // TODO Understand how modifications on "nextdays" appply to "configArray[0].data.raw.daily" as well

            // For 8 days from today
            for (let d = 0; d < nextDays.length; d++) {
                let count = 0;

                calendarData.filtered[d] = {}; // initialise object
                calendarData.filtered[d].date = new Date(nextDays[d].dt * 1000); // Get the date for that day
                calendarData.filtered[d].events = [];

                // for each event of the council calendar
                for (let e = 0; e < calendarData.raw.length; e++) {
                    const startDate = new Date(calendarData.raw[e].startDateTime);
                    const endDate = new Date(calendarData.raw[e].endDateTime);

                    // if the event is ongoing
                    if (calendarData.filtered[d].date >= startDate && calendarData.filtered[d].date < endDate) {
                        calendarData.filtered[d].events[count] = calendarData.raw[e]; // Add the event to the list of events that day
                        count++;
                    }
                }
            }

            if (configArray) {
                resolve(configArray);
            } else {
                reject(new Error("The calendar data could not be filtered"));
            }

        });
}

/* DISPLAY */

// Display the calendar data
function displayCalendar(configArray) {
    "use strict";

    return new Promise(
        function (resolve, reject) {

            // TODO set as promise chain to prevent content set before markup?
            setEventsMarkup(configArray); // set the page tags
            displayLocalInfo(configArray); // display the current time, temperature, location etc.
            displayWeekWeather(configArray); // dusplay daily weather forecast
            displayEventsContent(configArray); // set the events content

            if (configArray) {
                resolve(configArray);
            } else {
                reject(new Error("The calendar could not be display."));
            }

        });
}

/*****/

// Generate Events Markup
function setEventsMarkup(configArray) {
    "use strict"

    return new Promise(
        function (resolve, reject) {

            let nextEvents = configArray[2].data.filtered[0].events;

            nextEvents.forEach(function (event, index) {
                document.getElementById("events").innerHTML +=

                    `<div id="event_${index}" class="forecast clearFloats">
                        <img src="" alt="" class="eventImage">
                        <h1 class="title"></h1>
                        <h2 class="location"></h2>
                        <h3 class="dateTimeFormatted"></h3>
                        <p class="description"></p>
                        <p class="venue"></p>
                    </div>`;
            });

            if (configArray) {
                resolve(configArray);
            } else {
                reject(new Error("The HTML markup for the events could not be generated."));
            }

        });
}

// populate the relevant tags based on the class name / requires Jquery
function populateTags(selectorsCss, content) {
    "use strict";
    // Cannot rewrite as setImageSource() due to displayLocalInfo()

    let tags = $(selectorsCss); // Register the tags to change using CSS selectors (#id .class etc.)

    // if the content is valid
    if (content)
        for (let i = 0; i < tags.length; i++)
            tags[i].innerHTML = content;

}

// populate the images based on the url attributes / requires Jquery
function setImageSource(propertyName, eventObj, index) {
    "use strict";

    let tags = $(`#event_${index} .${propertyName}`); // Find the tags (ref. line 383 for the id attribute)

    // if the sought property exists
    if (eventObj[propertyName])
        for (let i = 0; i < tags.length; i++)
            tags[i].src = eventObj[propertyName].url; // Set the value of its property "url" as the image source
}

// Display the local information
function displayLocalInfo(configArray) {
    "use strict";

    return new Promise(
        function (resolve, reject) {

            let weatherData = configArray[0].data.raw;

            populateTags(".currentDate", new Date(weatherData.current.dt * 1000).toDateString());

            populateTags(".currentTime", new Date(weatherData.current.dt * 1000).toTimeString().substr(0, 5));

            populateTags(".currentTemperature", Math.round(weatherData.current.temp) + "ºC");


            if (configArray) {
                resolve(configArray);
            } else {
                reject(new Error("The local info could not be displayed."));
            }

        });


}

// Set the events content // TODO optimise this process! ref. line 326
function displayEventsContent(configArray) {
    "use strict";

    return new Promise(
        function (resolve, reject) {

            let nextEvents = configArray[2].data.filtered[0].events;

            nextEvents.forEach(function (event, index) {

                setImageSource("eventImage", event, index);

                populateTags(`#event_${index} .title`, event.title);

                populateTags(`#event_${index} .location`, event.location);

                populateTags(`#event_${index} .dateTimeFormatted`, event.dateTimeFormatted);

                populateTags(`#event_${index} .description`, event.description);

                //    populateTags(`#event_${index} .venue`, nextDays[0].events[index].venue); // TODO create venue object

            });

            if (configArray) {
                resolve(configArray);
            } else {
                reject(new Error("The events could not all be displayed."));
            }

        });
}

// Generate the Daily weather forecast table
function displayWeekWeather(configArray) {

    "use strict";

    var weatherData = configArray[0].data.raw,
        i = 0,
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

        currentWeek[i].currentDate = new Date(d.dt * 1000); // Get the date of that day
        currentWeek[i].day = days[currentWeek[i].currentDate.getDay()];
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
    table = $("<table class='full-page stripped-format'>");

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
    graph = $("<table class='temperatureGraph full-page stripped-format'>");

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


    //    console.log(currentWeek); //DEBUG

}
