/*
* Copyright 2015 Annabell Schmidt, Patrick Muenster
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at

* http://www.apache.org/licenses/LICENSE-2.0

* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

/****************************/
/***** TEXT AND DISPLAY *****/
/****************************/

/*
 * Set textsize properties.
 *
 * @author Patrick Münster
 */
var AS_textSize = (function() {
    var module = {};

    // Get default value from config.js
    function getDefaultValue() {
        return document.getElementById('myASpanel-iFrame').contentWindow.Toolbar.UIComponentList[0].defaultValue;
    };

    /**
     * Changes the text size according to the parameter multiplier.
     * @param {number} multiplier   multiplier between 1 and 2 with which the text size is multiplied
     */
    module.set = function(multiplier) {
        var newTextSize = parseFloat(1 * multiplier) + 'em';
        $('body').css('font-size', newTextSize);
    };

    /**
     * Reset textsize to default value. Not in use.
     */
    module.reset = function() {
        var newTextSize = parseFloat(1 * getDefaultValue()) + 'em';
        $('body').css('font-size', newTextSize);
    };

    return module;

})();

/*
 * Set text sytle properties.
 *
 * @author Patrick Münster
 */
var AS_textStyle = (function() {
    var module = {};

    var defaultTextStyle = "";

    /**
     * Get the default text style.
     * @return {string}    current setting for font-family
     */
    function getDefaultValue() {
        return defaultTextStyle;
    }

    /**
     * Read the used default font-family.
     */
    function readDefaultValue() {
        defaultTextStyle = $('body').css('font-family');
    }

    /**
     * Sets the font-family to the given value.
     * @param {string} value
     */
    module.change = function(value) {
        if (value == 'default') {
            console.log("Get default textstyle: " + getDefaultValue());
            $('body').css('font-family', '"' + getDefaultValue() + '"');
        } else {
            $('body').css('font-family', '"' + value + '"');
        }
    };

    /**
     * Reset to default value.
     */
    module.reset = function() {
        $('body').css('font-family', '"' + getDefaultValue() + '"');
    };
    
    // read default textstyle from CSS.
    readDefaultValue();

    return module;

})();

/**
 * @author Annabell Schmidt
 *
 * get the default text style
 * @return {string}     current setting for font-family
 */
function getDefaultTextStyle() {
    return $('body').css('font-family');
}


/*
 * @author Patrick Münster
 *
 * Sets the line spacing .
 */
var AS_lineSpacing = (function() {
    var module = {};

    // Get default value from config.js
    function getDefaultValue() {
        return document.getElementById('myASpanel-iFrame').contentWindow.Toolbar.UIComponentList[1].defaultValue;
    }

    /**
     * Changes the line spacing according to the parameter.
     * @param {float} value in em for line-height
     */
    module.set = function(value) {
        var newLineSpacing = value + 'em';
        $('body').css('line-height', newLineSpacing);
    };

    /**
     * Reset to default value.
     */
    module.reset = function() {
        var newLineSpacing = getDefaultValue() + 'em';
        $('body').css('line-height', newLineSpacing);
    };

    return module;

})();


/*
 * @author Patrick Münster
 *
 * Picsupport settings
 */
var AS_picsupport = (function() {

    var module = {};

    function activatePicsupport() {
        console.log("Picsupport activated");
    }

    function deactivatePicsupport() {
        console.log("Picsupport deaktivated");
    }

    /**
     * Activates or deactivates the Picsupport according to the parameter.
     * @param {string} value "on" or "off"
     */
    module.activate = function(value) {
        if (value == "On") {
            activatePicsupport();
        } else if (value == "Off") {
            deactivatePicsupport();
        }
    };
    
    /**
     * Choose the used Language for the Picsupport according to the parameter.
     * @param {string} value UNFINISHED
     */
    module.setLanguage = function(value) {
        
    };

    return module;

})();

/*********************************/
/***** LAYOUT AND NAVIGATION *****/
/*********************************/

/**
 * @author Annabell Schmidt
 *
 * creates or deletes the table of contents depending on the value of the parameter show
 * uses the jQuery plugin tableOfContents from https://github.com/dcneiner/TableOfContents/tree/master
 * @param {bool} show       switch for showing/deleting the toc
 */
function AS_showTableOfContents(show) {
    if (show) {
        $('#toc-container ul').tableOfContents();
        $('#toc-container').removeClass('hidden');

    } else {
        $('#toc-container').addClass('hidden');
        $('#toc-container ul').text('');
    }
}
