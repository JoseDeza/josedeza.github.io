$(function () {

    "use strict";

    var sampleFile = false, // "Dev Mode" toggle to prevent making API calls using sample json files instead
        geolocation = true, // "Geo Mode" toggle to store browser geolocation coordinates
        configurationParameters = {
            source: {
                url: "",
                appId: "393d283150e7d7ced1c524ff318a8870",
                latitude: 0,
                longitude: 0,
                units: "metric", // unit system // metric,imperial
                exclude: "", // forecast data to exclude // current,minutely,hourly,daily,alert
                // Get wheater data using the following REST API service: api.openweathermap.org
                // Open Weather Map API Documentation @ https://openweathermap.org/api/one-call-api
                setApiCall: function () {
                    "use strict";

                    var i = 0,
                        units = "", // unit system // metric,imperial
                        exclude = "",
                        apiCall = "";

                    if (this.units) { // Add parameter call only if needed
                        units = "&units=" + this.units;
                    }
                    if (this.exclude) { // Add parameter call only if needed
                        exclude = "&exclude=" + this.exclude;
                    }

                    apiCall = "https://api.openweathermap.org/data/2.5/onecall?lat=" + this.latitude + "&lon=" + this.longitude + units + exclude + "&appid=" + this.appId; // API call

                    return apiCall;

                }, // Url to call
                clientFile: "", // User browser local storage
                serverFile: "",
                sampleFile: "/sample_data/openweathermap_brisbane.json"
            }
        },
        candidateLocations = {
            TestPosition: { // As a dummy position
                lat: -99.999999,
                lon: 99.999999
            },
            Paris: { // As an alternatve
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
        }, // list of candidate locations
        defaultLocation = candidateLocations.TestPosition; // default location

    console.log("The initial latitude is: " + configurationParameters.source.latitude);
    console.log("The initial longitude is: " + configurationParameters.source.longitude);

    setGeolocation(geolocation, defaultLocation, configurationParameters)
        .then(function (obj1) {
            console.log("obj1 Congif latitude is: " + obj1.source.latitude);
            console.log("obj1 Config longitude is: " + obj1.source.longitude);
            console.log("obj1 Config url is: " + obj1.source.url);
            console.log(obj1);
            return setUrl(sampleFile, obj1);
        })
        .then(function (obj2) {
            console.log("obj2 Congif latitude is: " + obj2.source.latitude);
            console.log("obj2 Config longitude is: " + obj2.source.longitude);
            console.log("obj2 Config url is: " + obj2.source.url);
            console.log(obj2);
        }).catch(function (error) {
            console.log(error.message);
        });


});

//Declare functions with promise functionality ///////

function setGeolocation(toggleBool, defaultPositionObj, configObj) {
    "use strict";

    return new Promise(
        function (resolve, reject) {


            var geolocAllowed = function (geolocPosition) {

                    "use strict";
                    // Test calls
                    console.log("Config latitude: " + configObj.source.latitude);
                    console.log("Config longitude: " + configObj.source.longitude);
                    console.log("Geolocation latitude: " + geolocPosition.coords.latitude);
                    console.log("Geolocation longitude: " + geolocPosition.coords.longitude);

                    // Store latitude and longitude from the geolocated data
                    configObj.source.latitude = geolocPosition.coords.latitude;
                    configObj.source.longitude = geolocPosition.coords.longitude;

                    console.log("Geolocation enabled");
                },
                geolocDenied = function (errorReport) {
                    console.log("Geolocation disabled");
                };

            // Initialise position using default location coordinates
            //DEBUG these coordinates are being used to set the url ! whatsoever.
            configObj.source.latitude = defaultPositionObj.lat;
            configObj.source.longitude = defaultPositionObj.lon;

            if (toggleBool) {

                if (navigator.geolocation) {
                    // TODO Fix Sync / this happens last!
                    navigator.geolocation.getCurrentPosition(geolocAllowed, geolocDenied); // geolocation prompt
                } else {
                    console.log("Browser Geolocation functionality unavailable.\n\rUsing default coordinates for the location.");
                }

            } else {
                console.log("passing configuration parameters unchanged.");
            }

            if (configObj) {
                console.log("Geolocation Set!");
                resolve(configObj);
            } else {
                reject(new Error("The position coordinates could not be assigned."));
            }

        }
    );

}

function setUrl(toggleBool, configObj) {
    "use strict";

    return new Promise(
        function (resolve, reject) {

            if (toggleBool) {
                configObj.source.url = configObj.source.sampleFile;
            } else {
                configObj.source.url = configObj.source.setApiCall();
            }

            if (configObj) {
                console.log("Url set!");
                resolve(configObj);
            } else {
                reject(new Error("The Url could not be assigned by the function setUrl"));
            }

        }
    );
}
