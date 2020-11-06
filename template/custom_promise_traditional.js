// TODO check scope difference between traditional function and arrow function! (expression and declaration)
// TODO investigate Executor(), Then() async processes to understand where to place the code
// TODO investigate the usage of array of promises to control the execution order

$(function () {

    "use strict";

    var configuration = {
        settings: { // [All false] sets API Calls for the default position
            useGeolocation: false, // Get Geolocation coordinates / use default coordinates
            useFile: true // Use a sample json file instead of calling the API

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

                apiCall = "https://api.openweathermap.org/data/2.5/onecall?lat=" + this.coordinates.latitude + "&lon=" + this.coordinates.longitude + units + exclude + "&appid=" + this.appId; // API call

                return apiCall;

            }, // Url to call

        }
    };

    getGeolocation(configuration)
        .catch(function (error) {
            console.log(error.message + "\n\rUsing the default coordinates.");
        })
        .then(function (obj1) {
            console.log(".then(obj1)"); //DEBUG
            console.log(obj1); //DEBUG
            return setCoordinates(configuration, obj1);
        })
        .then(function (obj2) {
            console.log(".then(obj2)"); //DEBUG
            console.log(obj2); //DEBUG
            return setUrl(obj2);
        })
        .then(function (obj3) {
            console.log(".then(obj3)"); //DEBUG
            console.log(obj3); //DEBUG
        })
        .catch(function (error) {
            console.error(error.message);
        });


});

//Declare functions with promise functionality ///////

// Get the Geolocation coordinates (promise functionality, based on: https://gist.github.com/varmais/74586ec1854fe288d393)
function getGeolocation(configObj) {

    console.log("getGeolocation()"); //DEBUG
    return new Promise(
        function (resolve, reject) {

            if (navigator.geolocation && configObj.settings.useGeolocation) {
                navigator.geolocation.getCurrentPosition(resolve, reject); // user permission prompt / using default options

            } else if (navigator.geolocation) {
                reject(new Error("Geolocation functionality disabled."));
            } else {
                reject(new Error("Browser Geolocation functionality unavailable."));
            }
        });
}

// Set the coordinates to use based on environement and settings (promise functionality)
function setCoordinates(configObj, coordinatesObj) {
    "use strict";

    console.log("setCoordinates()"); //DEBUG
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
                defaultCoordinates = presetCoordinates.debug; // <-  Set default coordinates HERE

            if (coordinatesObj) {
                console.log("setCoordinates(): assign geolocation coordinates"); //DEBUG
                configObj.source.coordinates = coordinatesObj.coords;
            } else {
                console.log("setCoordinates(): assign default coordinates"); //DEBUG
                configObj.source.coordinates = defaultCoordinates;
            }


            if (configObj) {
                console.log("setCoordinates() resolved"); //DEBUG
                resolve(configObj);
            } else {
                console.log("setCoordinates() rejected"); //DEBUG
                reject(new Error("Could not set the coordinates"));
            }

        });
}

// Set data source url (promise functionality)
function setUrl(configObj) {
    "use strict";

    console.log("setUrl()"); //DEBUG
    return new Promise(
        function (resolve, reject) {

            // Overwrite API call with sample file when enabled
            if (configObj.settings.useFile) {
                console.log("setUrl(): sample file -> url"); //DEBUG
                configObj.source.url = configObj.source.file;
            } else {
                console.log("setUrl(): API Call -> url"); //DEBUG
                configObj.source.url = configObj.source.setApiCall();
            }

            if (configObj) {
                console.log("setUrl(): resolved"); //DEBUG
                resolve(configObj);
            } else {
                console.log("setUrl(): rejected"); //DEBUG
                reject(new Error("The Url could not be set"));
            }

        }
    );
}
