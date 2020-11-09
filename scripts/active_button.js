/// Edited: José Deza ///
/// Based on: https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_active_element ///
/// Library required: jQuery.js

/*global $*/

/***** $(document).ready(function(){}); *****/

// OPEN
$(function () {
    "use strict";

    // To make sure that the "events" section is visible on first visit
    // Jumps to the "#events" anchor on load
    window.onload = window.location.href = "#events";


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
