/// Edited: José Deza ///
/// Based on: https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_active_element ///
/// Library required: jQuery.js

/*global $*/

/***** $(document).ready(function(){}); *****/

// OPEN
$(function () {
    "use strict";

    // Display the "events" section on page load to overwrite stylesheet
    window.onload = $("#events").css("display","block");

    let buttons = $("li.button");


    // Add active class to the current button (highlight it)
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].onclick = function () {
            let current = $(".here");
            current[0].className = current[0].className.replace(" here", "");
            this.className += " here";
        };
    }
});
// CLOSE
