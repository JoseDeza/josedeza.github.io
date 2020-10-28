// Article:         https://www.digitalocean.com/community/tutorials/javascript-promises-for-dummies
// Original Code:   https://jsbin.com/nifocu/1/edit?js,console
// Modified by:     José Deza
// Comments by:     José Deza

$(function () {

    askMum(false).then(function (success) {
        console.log("And there you get");
        console.log(success);
    }).catch(function (error) {
        console.log(error.message);
    });

});


//Declare function with promise functionality
function askMum(condition) {

    // Promise
    var willIGetNewPhone = new Promise(
        function (resolve, reject) {
            if (condition) {
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

    // Without return: all the promise chain is contained in this scope with no ability to chain it outside
    /*
            willIGetNewPhone
                .then(function (fulfilled) {
                    // yay, you got a new phone
                    console.log(fulfilled);
                })
                .catch(function (error) {
                    // ops, mom don't buy it
                    console.log(error.message);
                });
    */

    //Now you can chain the function outside
    return willIGetNewPhone;

}
