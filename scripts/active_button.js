/// Edited: José Deza ///
/// Based on: https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_active_element ///
/// Library required: jQuery.js

/*global $*/

/***** $(document).ready(function(){}); *****/

// OPEN
$(function () {
    "use strict";

    // Add active class to the current button (highlight it)
    let buttons = $("li.button");

    for (let i = 0; i < buttons.length; i++) {
        buttons[i].onclick = function () {
            let current = $(".here");
            current[0].className = current[0].className.replace(" here", "");
            this.className += " here";
        };
    }
});
// CLOSE
