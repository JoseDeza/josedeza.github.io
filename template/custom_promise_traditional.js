// TODO check scope difference between traditional function and arrow function! (expression and declaration)
// TODO investigate Executor(), Then() async processes to understand where to place the code
// TODO investigate the usage of array of promises to control the execution order

$(function () {

    "use strict";

    var configuration = {
        settings: {
            sampleFile: true, // Enables Use of sample json files instead of API call
            geolocation: true, // Enables Geolocation coordinates for latitude and longitude
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
            // Get wheater data using the following REST API service: api.openweathermap.org
            // Open Weather Map API Documentation @ https://openweathermap.org/api/one-call-api
            setApiCall: function () {
                "use strict";

                var i = 0,
                    unitsParameter = "", // unit system // metric,imperial
                    excludeParameter = "",
                    apiCall = "";

                if (this.units) { // Add parameter call only if needed
                    unitsParameter = "&units=" + this.units;
                }
                if (this.exclude) { // Add parameter call only if needed
                    excludeParameter = "&exclude=" + this.exclude;
                }

                apiCall = "https://api.openweathermap.org/data/2.5/onecall?lat=" + this.position.latitude + "&lon=" + this.position.longitude + unitsParameter + excludeParameter + "&appid=" + this.appId; // API call

                return apiCall;

            }, // Url to call
            clientFile: "", // User browser local storage
            serverFile: "",
            sampleFile: "/sample_data/openweathermap_brisbane.json"
        }
    };

    getGeolocation()
        .then(function (obj1) {
            console.log(".then(obj1)");
            console.log(obj1);
            return setCoordinates(configuration, obj1);
        })
        //        .catch(function (error) { //TODO set catch throw to go on with chain
        // return setSourceUrl(sampleFile, configuration);
        //            console.log(error.message);
        //        })
        .then(function (obj2) {
            console.log(".then(obj2)");
            console.log(obj2);
        })
        .catch(function (error) {
            console.log(error.message);
        });


});

//Declare functions with promise functionality ///////

// Wrap in to Promise, based on: https://gist.github.com/varmais/74586ec1854fe288d393
function getGeolocation() {

    console.log("getGeolocation()");
    return new Promise(
        function (resolve, reject) {

            // Adding condition HERE so that the code waits for the user permission
            /*if (true === false)*/ // mimicking geolocation unavailabilty
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(resolve, reject); // user permission prompt / using default options

            } else {

                reject(new Error("Browser Geolocation functionality unavailable."));

            }
        });
}

function setCoordinates(configObj, coordinatesObj) {
    "use strict";

    console.log("setCoordinates");
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
                console.log("setCoordinates(): assign geolocation coordinates");
                configObj.source.coordinates = coordinatesObj.coords;
            } else {
                console.log("setCoordinates(): assign default coordinates");
                configObj.source.coordinates = defaultCoordinates;
            }


            if (configObj) {
                console.log("setCoordinates() resolved");
//                console.log(configObj);
                resolve(configObj);
            } else {
                console.log("setCoordinates() rejected");
                reject(new Error("Could not set the coordinates"));
            }

        });
}

/////////////////TEMP ///////////////////////////
function setParameters(configObj, locationObj) {
    "use strict";

    console.log("setCoordinates()");
    return new Promise(
        function (resolve, reject) {

            if (toggleBool) {

                setGeolocation()
                    .then(function (position) {
                        console.log("setCoordinates().setGeolocation(): resolved");
                        // Store latitude and longitude from the geolocated data
                        configObj.source.latitude = position.coords.latitude;
                        configObj.source.longitude = position.coords.longitude;

                        // Set the url using geolocation information
                        configObj.source.url = configObj.source.setApiCall();
                        console.log("setCoordinates().setGeolocation(): Geolocated position -> url")
                    })
                    .catch(function (error) {
                        console.log("setCoordinates().setGeolocation(): rejected");
                        // Initialise position using default location coordinates
                        configObj.source.latitude = defaultPositionObj.lat;
                        configObj.source.longitude = defaultPositionObj.lon;

                        // Set the url using geolocation information
                        configObj.source.url = configObj.source.setApiCall();
                        console.log("setCoordinates().setGeolocation(): default position -> url")

                        console.log(error.message + "\n\rthe default position will be used.");
                    });
            } else {
                console.log("setCoordinates(): passing configuration parameters unchanged.");
            }

            if (configObj) {
                console.log("setCoordinates(): resolved");
                resolve(configObj);
            } else {
                console.log("setCoordinates(): rejected");
                reject(new Error("The position coordinates could not be assigned."));
            }
        }
    );
}

function setSourceUrl(toggleBool, configObj) {
    "use strict";

    console.log("setSourceUrl()");
    return new Promise(
        function (resolve, reject) {

            // Overwrite API call with sample file when enabled
            if (toggleBool) {
                configObj.source.url = configObj.source.sampleFile;
                console.log("setSourceUrl(): sample file -> url")
            }

            if (configObj) {
                console.log("setSourceUrl(): resolved");
                resolve(configObj);
            } else {
                console.log("setSourceUrl(): rejected");
                reject(new Error("The sample file path could not be assigned to the Url"));
            }

        }
    );
}
