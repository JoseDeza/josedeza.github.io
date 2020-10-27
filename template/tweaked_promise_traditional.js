$(function () {

    "use strict";

    var devMode = false, // "Dev Mode" toggle to prevent making API calls using sample json files instead
        geoMode = true; // "Geo Mode" toggle to store browser geolocation coordinates




setDataSource(devMode)
    .then()

});







// call our promise
function setDataSource(devMode,) {

  var devModeEnabled = new Promise(
    function (resolve, reject) {
        if (devMode) {
            var phone = {
                brand: 'Samsung',
                color: 'black'
            };
            resolve(phone);
        } else {
            var reason = new Error('mom is not happy');
            reject(reason);
        }

    }
);

    devModeEnabled
        .then(function (fulfilled) {
            // yay, you got a new phone
            console.log(fulfilled);
        })
        .catch(function (error) {
            // ops, mom don't buy it
            console.log(error.message);
        });
}
