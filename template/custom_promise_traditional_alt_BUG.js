$(function () {

    "use strict";

    var sampleFile = true, // "Dev Mode" toggle to prevent making API calls using sample json files instead
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
                        unitsParameter = "", // unit system // metric,imperial
                        excludeParameter = "",
                        apiCall = "";

                    if (this.units) { // Add parameter call only if needed
                        unitsParameter = "&units=" + this.units;
                    }
                    if (this.exclude) { // Add parameter call only if needed
                        excludeParameter = "&exclude=" + this.exclude;
                    }

                    apiCall = "https://api.openweathermap.org/data/2.5/onecall?lat=" + this.latitude + "&lon=" + this.longitude + unitsParameter + excludeParameter + "&appid=" + this.appId; // API call

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

    setCoordinates(geolocation, defaultLocation, configurationParameters)
        .then(function (obj1) {
            return setSourceUrl(sampleFile, obj1);
        })
        .then(function (obj2) {
            console.log(obj2);
        }).catch(function (error) {
            console.log("TODO Handle 'error.message'");
        });


});

//Declare functions with promise functionality ///////

function setCoordinates(toggleBool, defaultPositionObj, configObj) {
    "use strict";

    return new Promise(
        function (resolve, reject) {

            // Wrap geolocation into nested promise
            // Not passing geolocation options parameter / using default options
            var setGeolocation = function () {
                return new Promise(
                    function (geolocResolve, geolocReject) {
                        // Adding condition HERE so that the code waits for the user permission
                        //                        if (true === false)
                        if (navigator.geolocation) { // geolocation prompt
                            navigator.geolocation.getCurrentPosition(geolocResolve, geolocReject);
                        } else {
                            geolocReject(new Error("Browser Geolocation functionality unavailable."));
                        }
                    });
            }

            if (toggleBool) {

                setGeolocation()
                    .then(function (position) {
                        // Store latitude and longitude from the geolocated data
                        configObj.source.latitude = position.coords.latitude;
                        configObj.source.longitude = position.coords.longitude;

                        // Set the url using geolocation information
                        configObj.source.url = configObj.source.setApiCall();
                        console.log("API call passed to url!")

                    })
                    .catch(function (error) {
                        // Initialise position using default location coordinates
                        configObj.source.latitude = defaultPositionObj.lat;
                        configObj.source.longitude = defaultPositionObj.lon;

                        // Set the url using geolocation information
                        configObj.source.url = configObj.source.setApiCall();
                        console.log("API call passed to url!")

                        // TODO Handle navigator.geolocation.getCurrentPosition() error.code properly
                        console.log(error.message);
                        console.log("Using default coordinates for the location.");
                    });
            } else {
                console.log("passing configuration parameters unchanged.");
            }

            if (configObj) {
                resolve(configObj);
                console.log("setCoordinates() fulfilled!");
            } else {
                reject(new Error("The position coordinates could not be assigned."));
            }
        }
    );
}

function setSourceUrl(toggleBool, configObj) {
    "use strict";

    return new Promise(
        function (resolve, reject) {

            // Overwrite API call with sample file when enabled
            if (toggleBool) {
                configObj.source.url = configObj.source.sampleFile;
                console.log("Using sample file!")
            }

            if (configObj) {
                resolve(configObj);
                console.log("setSourceUrl() fulfilled!");
            } else {
                reject(new Error("The sample file path could not be assigned to the Url"));
            }

        }
    );
}