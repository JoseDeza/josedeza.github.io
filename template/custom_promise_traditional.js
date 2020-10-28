$(function () {

    "use strict";

    var sampleFile = true, // "Dev Mode" toggle to prevent making API calls using sample json files instead
        Geolocation = true, // "Geo Mode" toggle to store browser geolocation coordinates
        configObj = {
            source: {
                url: "",
                appId: "393d283150e7d7ced1c524ff318a8870",
                latitude: 0,
                longitude: 0,
                units: "metric", // unit system // metric,imperial
                exclude: "", // forecast data to exclude // current,minutely,hourly,daily,alert

                // Get wheater data using the following REST API service: api.openweathermap.org
                // Open Weather Map API Documentation @ https://openweathermap.org/api/one-call-api
                apiCall: function () {
                    "use strict";

                    var i = 0,
                        unitsParameter = "", // unit system // metric,imperial
                        excludeParameter = "",
                        url = "";

                    if (this.units) { // Add parameter call only if needed
                        unitsParameter = "&units=" + this.units;
                    }
                    if (this.exclude) { // Add parameter call only if needed
                        excludeParameter = "&exclude=" + this.exclude;
                    }

                    url = "https://api.openweathermap.org/data/2.5/onecall?lat=" + this.latitude + "&lon=" + this.longitude + unitsParameter + excludeParameter + "&appid=" + this.appId; // API call
                    //console.log(url); //DEBUG

                    return url;

                }, // Url to call
                clientFile: "", // User browser local storage
                serverFile: "",
                sampleFile: "/sample_data/openweathermap_brisbane.json",
            }
        };


    console.log(configObj);
    console.log("The url is: " + configObj.source.url);

    setSourceUrl(sampleFile, configObj).then(function (obj) {
        console.log(obj);
        console.log("The url is now: " + obj.source.url);
    }).catch(function (error) {
        console.log(error.message);
    });



});

//Declare function with promise functionality
function setSourceUrl(toggleBool, configurationObject) {
    return new Promise(
        function (resolve, reject) {

            if (toggleBool) {
                configurationObject.source.url = configurationObject.source.sampleFile;
            } else {
                configurationObject.source.url = configurationObject.source.apiCall();
            }

            if (configurationObject.source.url) {
                console.log("fulfilled!");
                resolve(configurationObject);
            } else {
                reject(new Error("The Url could not be assigned by the function setSourceUrl"));
            }

        }
    );
}
