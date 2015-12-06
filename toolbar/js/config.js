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

/**
 * @author Patrick Münster, Annabell Schmidt
 */
//constant data
TYPE_SLIDER = 'slider';
TYPE_DROPDOWN = 'dropdown';
TYPE_CHECKBOX = 'checkbox';
LANGUAGE = 'en';
NEW_INIT = true;

// config data
CategoryList = [{
    category_id : "cat1", // id is used as an attribute in html-tags, needs to be application-wide unique
    name : {
        en : "Text and Display",
        de : "Text und Anzeige"
    }
}, {
    category_id : "cat2",
    name : {
        en : "Layout and Navigation",
        de : "Layout und Navigation"
    }
}];


/**********************/
/* APPLICATION LABELS */
/**********************/

/**
 * This list contains all labels of the ASpanel. 
 */
var ApplicationLabels = {
    tabs : {
        category_1 : {
            en : "Text and Display",
            de : "Text und Anzeige"
        },
        category_2 : {
            en : "Layout and Navigation",
            de : "Layout und Navigation"
        },
        category_3 : {
            en: "Links and Buttons",
            de: "Links und Buttons"
        },
        category_4 : {
            en: "Language Settings",
            de: "Spracheinstellungen"
        },
        category_5 : {
            en: "GPII",
            de: "GPII"  
        }
    },
    buttons : {
        resetButton: {
            en: "Reset",
            de: "Zurücksetzen"
        }
    }
}; 


/********************/
/* UI-COMPONENTLIST */
/********************/

/**
 * This list contains all components of the ASpanel. Do not change the order of components!
 * Add new components at the end of the list.
 */
var UIComponentList = {

    //#### TEXTSIZE ####//

    textSize_slider : {

        ui_component_id : "textSize_slider", // used as id in html-tags, needs to be application-wide unique
        ui_input_id : "textSize", // used as id in html-tags, needs to be application-wide unique
        title : {
            en : "Text Size",
            de : "Textgröße"
        },
        defaultValue : 1.0,
        category : "cat1",
        type : TYPE_SLIDER,
        minValue : 1,
        maxValue : 2,
        stepSize : 0.1,
        minText : {
            en : "small",
            de : "klein"
        },
        maxText : {
            en : "big",
            de : "groß"
        },
        inputLabel : {
            en : "times",
            de : "mal"
        },
        changeEvent : function(value) {

            if (parent.AS_textSize != undefined) {

                //input validation
                var multiplier = parseFloat(value);
                if (multiplier < 1.0) {
                    multiplier = 1.0;
                }
                if (multiplier > 2.0) {
                    multiplier = 2.0;
                }

                parent.AS_textSize.set(multiplier);
            }
        }
    },

    //#### LINESPACING ####//

    lineSpacing_slider : {
        ui_component_id : 'lineSpacing_slider',
        ui_input_id : 'lineSpacing',
        title : {
            en : 'Line Spacing',
            de : 'Zeilenabstand'
        },
        defaultValue : 1.2,
        category : "cat1",
        type : TYPE_SLIDER,
        changeEvent : function(value) {
            parent.AS_lineSpacing.set(value);
        },
        minValue : 1,
        maxValue : 3,
        stepSize : 0.1,
        minText : {
            en : "small",
            de : "klein"
        },
        maxText : {
            en : "big",
            de : "groß"
        },
        inputLabel : {
            en : "times",
            de : "mal"
        }
    },

    //#### TEXTSTYLE ####//

    textStyle_dropdown : {

        ui_component_id : "textStyle_dropdown",
        title : {
            en : "Text Style",
            de : "Textstil"
        },
        defaultValue : {
            option_id : "default",
            name : "Default"
        },
        category : "cat1",
        type : TYPE_DROPDOWN,
        options : [{
            option_id : "default", // used as value-attribute in option-tag
            name : "Default" // used as text in option-tag
        }, {
            option_id : "times",
            name : "Times New Roman"
        }, {
            option_id : "arial",
            name : "Arial"
        }, {
            option_id : "verdana",
            name : "Verdana"
        }, {
            option_id : "comic sans ms",
            name : "Comic Sans MS"
        }],
        changeEvent : function(value) {
            parent.AS_textStyle.change(value);
        }
    },

    //#### PICTOGRAM SUPPORT ####//

    picsupport_dropdown : {

        ui_component_id : 'picsupport_dropdown',
        title : {
            en : 'Picsupport',
            de : 'Picsupport'
        },
        defaultValue : {
            option_id : "picsupport-off",
            name : "Off"
        },
        category : "cat1",
        type : TYPE_DROPDOWN,
        options : [{
            option_id : "picsupport-off", // used as value-attribute in option-tag
            name : "Off" // used as text in option-tag
        }, {
            option_id : "picsupport-on",
            name : "On"
        }],
        changeEvent : function(value) {
            parent.AS_picsupport.activate(value);
        }
    },

    //#### TABLE OF CONTENT ####//

    "table_of_content" : {

        ui_component_id : "table_of_content",
        title : {
            en : "Show Table of Contents",
            de : "Inhaltsverzeichnis anzeigen"
        },
        defaultValue : false,
        category : "cat1",
        type : TYPE_CHECKBOX,
        explanation : {
            en : "Adds a table of contents to the top of the page.",
            de : "Fügt am Anfang der Seite ein Inhaltsverzeichnis ein."
        },
        changeEvent : function(value) {
            parent.AS_showTableOfContents(value);
        }
    },
   
};

