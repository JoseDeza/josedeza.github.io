$(function () {

    "use strict";

    var sampleFile = false, // "Dev Mode" toggle to prevent making API calls using sample json files instead
        Geolocation = true; // "Geo Mode" toggle to store browser geolocation coordinates




setDataSource(useSampleFile)
    .then()

});







// call our promise
function setDataSource(toggleBool,configurationObject) {

  var useSampleFile = new Promise(
    function (resolve, reject) {
        if (toggleBool) {
            configurationObject.source.url = configurationObject.source.sampleFile;
            resolve(configurationObject);
        } else {
            configurationObject.source.url = configurationObject.source.apiCall();
            reject(configurationObject);
        }

    }
);

    useSampleFile
        .then(function (fulfilled) {
            // yay, you got a new phone
            console.log(fulfilled);
        })
        .catch(function (error) {
            // ops, mom don't buy it
            console.log(error.message);
        });
}
