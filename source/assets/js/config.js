/*
* Copyright 2015 Hochschule der Medien (HdM) / Stuttgart Media University
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
 * @author Patrick Münster
 */

//constant data
TYPE_SLIDER = 'slider';
TYPE_DROPDOWN = 'dropdown';
TYPE_DROPDOWN_WITH_BUTTON = 'dropdownWithButton';
TYPE_CHECKBOX = 'checkbox';
TYPE_COLOR_PICKER = 'colorPicker';
LANGUAGE = 'de';
NEW_INIT = true;


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
            en: "Language Settings",
            de: "Spracheinstellungen"
        },
        category_4 : {
            en: "Self Voicing",
            de: "Self Voicing"
        }
    },
    personas : {
        show : {
            de: "Personas zeigen",
            en: "Show personas"
        },
        hide : {
            de: "Personas verbergen",
            en: "Hide personas"
        }
    },
    buttons : {
        resetButton: {
            en: "Reset",
            de: "Zurücksetzen"
        }
    }
};

/**
 * This list contains all labels for the audio control.
 */
var AudioControlLabels = {
    sound : {
        de: "Audio starten",
        en: "Start audio"
    },
    play : {
        de: "Audio abspielen",
        en: "Play audio"
    },
    pause: {
        de: "Audio pausieren",
        end: "Pause audio"
    },
    stop: {
        de: "Audio stoppen",
        en: "Stop audio"
    },
    jumpBack: {
        de: "Im Audio zurückspringen",
        en: "Jump backwards in the audio"
    },
    jumpForward: {
        de: "Im Audio vorspringen",
        en: "Jump forwards in the audio"
    }
};


/********************/
/* PERSONALIST */
/* id: unique string or number. */
/* image: relative to 'toolbar/img' path. */
/* preferenceSet: relative to 'toolbar/preferenceSets' path. */
/********************/
var PersonaList = [
    {
        id: 0,
        name: "Default",
        details: {
            de: "Standardeinstellung",
            en: "Default settings"
        },
        image: "personas/default.png",
        preferenceSet: "5aa797f338f55351f2aaa003"
    },
    {
        id: 1,
        name: "Carole",
        details: {
            de: "Blind",
            en: "Blind"
        },
        image: "personas/carole.png",
        preferenceSet: "5aa7979e38f55351f2aaa002"
    },
    {
        id: 2,
        name: "Maria",
        details: {
            de: "Sehbehindert",
            en: "Partially sighted"
        },
        image: "personas/maria.png",
        preferenceSet: "5aa7981038f55351f2aaa005"
    },
    {
        id: 3,
        name: "Alexander",
        details: {
            de: "Farbsehschwäche",
            en: "Colour vision deficiency"
        },
        image: "personas/alexander.png",
        preferenceSet: "5aa7932038f55351f2aa9ffc"
    },
    {
        id: 4,
        name: "Lars",
        details: {
            de: "Gehörlos",
            en: "Deaf"
        },
        image: "personas/lars.png",
        preferenceSet: "5aa7980638f55351f2aaa004"
    },
    {
        id: 5,
        name: "Susan",
        details: {
            de: "Schwerhörig",
            en: "Hard of hearing"
        },
        image: "personas/susan.png",
        preferenceSet: "5aa7982338f55351f2aaa008"
    },
    {
        id: 6,
        name: "Mary",
        details: {
            de: "Bewegung",
            en: "Mobility"
        },
        image: "personas/mary.png",
        preferenceSet: "5aa7981638f55351f2aaa006"
    },
    {
        id: 7,
        name: "Tom",
        details: {
            de: "Bewegung und Sprechen",
            en: "Mobility and speech"
        },
        image: "personas/tom.png",
        preferenceSet: "5aa7982938f55351f2aaa009"
    },
    {
        id: 8,
        name: "Anna",
        details: {
            de: "Lese-Rechtschreibschwäche",
            en: "Dyslexia"
        },
        image: "personas/anna.png",
        preferenceSet: "5aa7973138f55351f2aaa001"
    },
    {
        id: 9,
        name: "Monika",
        details: {
            de: "Betagt",
            en: "Elderly"
        },
        image: "personas/monika.png",
        preferenceSet: "5aa7a28f38f55351f2aaa019"
    }
];


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
        resetValue : 1.0,
        category : "cat1",
        type : TYPE_SLIDER,
        minValue : 1,
        maxValue : 3, // by changing this value the AS_textSize function must be changed too
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

                // if (multiplier < 1.0) {
                    // multiplier = 1.0;
                // }
                // if (multiplier > 2.0) {
//
                    // multiplier = 2.0;
                // }

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
        resetValue : 1.2,
        category : "cat1",
        type : TYPE_SLIDER,
        changeEvent : function(value) {
            if (parent.AS_lineSpacing != undefined) {
                parent.AS_lineSpacing.set(value);
            }
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
            option_id : "default"
        },
        resetValue : {
            option_id : "default"
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
            if (parent.AS_textStyle != undefined) {
                parent.AS_textStyle.change(value);
            }
        }
    },

    //#### PICTOGRAM SUPPORT ####//

    picsupport_dropdown : {

        ui_component_id : 'picsupport_dropdown',
        title : {
            en : 'Pictograms',
            de : 'Piktogramme'
        },
        defaultValue : {
            option_id : "picsupport-off"
        },
        resetValue : {
            option_id : "picsupport-off"
        },
        category : "cat1",
        type : TYPE_DROPDOWN,
        options : [{
            option_id : "picsupport-off", // used as value-attribute in option-tag
            name : "Off" // used as text in option-tag
        }, {
            option_id : "picsupport-en",
            name : "English"
        }, {
            option_id : "picsupport-de",
            name : "Deutsch"
        }],
        changeEvent : function(value) {
                     // TODO check, causes error
        //    parent.AS_picsupport.activate(value);
        }
    },

    pageLanguage_dropdown : {

       ui_component_id : "pageLanguage_dropdown",
       title : {
            en : 'Language',
            de : 'Sprache'
        },
        defaultValue : {
            option_id : "de"
        },
        resetValue : {
            option_id : "de"
        },
        category : "cat3",
        type : TYPE_DROPDOWN,
        options : [{
            option_id : "de",
            name : "Deutsch"
        }, {
            option_id : "en",
            name : "English"
        }],
        changeEvent : function(value) {
            dispatchEventToPanel("languageUpdate", value);
            dispatchEventToParent("languageUpdate", value);
        }
    },

    signlanguageLanguage_dropdown : {

       ui_component_id : "signlanguageLanguage_dropdown",
       title : {
            en : 'Sign Language',
            de : 'Gebärdensprache'
        },
        defaultValue : {
            option_id : "gsg"
        },
        resetValue : {
            option_id : "gsg"
        },
        category : "cat3",
        type : TYPE_DROPDOWN,
        options : [{
            option_id : "gsg",
            name : "Deutsche Gebärdensprache (GSG)"
        }, {
            option_id : "asl",
            name : "American Sign Language (ASL)"
        }],
        changeEvent : function(value) {
            // TODO check, causes error
            // parent.slSettings.Language = value;
            // parent.myURCLightController.lockSLVOptions(value);
        }
    },

    signlanguageInterpreterName_dropdown : {

       ui_component_id : "signlanguageInterpreterName_dropdown",
       title : {
            en : 'Interpreter Name',
            de : 'Interpreter Name'
        },
        defaultValue : {
            option_id : "Feldmann"
        },
        resetValue : {
            option_id : "Feldmann"
        },
        category : "cat3",
        type : TYPE_DROPDOWN,
        options : [{
            option_id : "Maria",
            name : "Maria"
        }, {
            option_id : "Tony",
            name : "Tony"
        }, {
            option_id : "Feldmann",
            name : "Feldmann"
        }],
        changeEvent : function(value) {
            // TODO check, causes error
            // parent.slSettings.InterpreterName = value;
        }
    },

    uiSwitch_dropdown : {

       ui_component_id : "uiSwitch_dropdown",
       title : {
            en : 'Change user interface',
            de : 'Benutzeroberfläche wechseln'
        },
        defaultValue : {
            option_id : "OLB"
        },
        resetValue : {
            option_id : "OLB"
        },
        category : "cat2",
        type : TYPE_DROPDOWN_WITH_BUTTON,
        options : [{
            option_id : "OLB",
            name : "Default"
        }, {
            option_id : "SIMPLIFIED",
            name : "Simplified"
        }, {
            option_id : "GRID",
            name : "Grid"
        }],
        button: {
            en : "Confirm change of user interface",
            de : "Wechsel der Benutzeroberfläche bestätigen",
        },
        showButton: false,
        changeEvent : function(value) {

        },
        clickEvent: function(value) {
            dispatchEventToParent("shouldSwitchUI", value);
        }
    },

    /** Self Voicing **/
    selfVoicing_speed : {
        ui_component_id : "selfVoicing_speed",
        title : {
            de: 'Geschwindigkeit',
            en: 'Speed'
        },
        defaultValue : {
            option_id : 'normal'
        },
        resetValue : {
            option_id : 'normal'
        },
        category : 'cat4',
        type : TYPE_DROPDOWN,
        options : [{
            option_id : 'slow',
            name : 'langsam'
        }, {
            option_id : 'normal',
            name : 'normal'
        }, {
            option_id :  'fast',
            name : 'schnell'
        }],
        changeEvent : function(value) {
            dispatchEventToPanel("selfVoicingSpeedUpdate", value);
        }
    },
    selfVoicing_pitch : {
        ui_component_id : "selfVoicing_pitch",
        title : {
            de: 'Tonhöhe',
            en: 'Pitch'
        },
        defaultValue : {
            option_id : 'normal'
        },
        resetValue : {
            option_id : 'normal'
        },
        category : 'cat4',
        type : TYPE_DROPDOWN,
        options : [{
            option_id : 'low',
            name : 'tief'
        }, {
            option_id : 'normal',
            name : 'normal'
        }, {
            option_id :  'high',
            name : 'hoch'
        }],
        changeEvent : function(value) {
            dispatchEventToPanel("selfVoicingPitchUpdate", value);
        }
    },
    selfVoicing_type : {
        ui_component_id : "selfVoicing_type",
        title : {
            de: 'Stimmtyp',
            en: 'Type of voice'
        },
        defaultValue : {
            option_id : 'synthetic'
        },
        resetValue : {
            option_id : 'synthetic'
        },
        category : 'cat4',
        type : TYPE_DROPDOWN,
        options : [{
            option_id : 'natural',
            name : 'Natürliche Stimme'
        }, {
            option_id :  'synthetic',
            name : 'Synthetische Stimme'
        }],
        changeEvent : function(value) {
            dispatchEventToPanel("selfVoicingTypeUpdate", value);
        }
    },
    selfVoicing_marking : {
        ui_component_id : "selfVoicing_marking",
        title : {
            de: 'Markierung',
            en: 'Marking'
        },
        defaultValue : {
            option_id : 'sentences'
        },
        resetValue : {
            option_id : 'sentences'
        },
        category : 'cat4',
        type : TYPE_DROPDOWN,
        options : [{
            option_id : 'off',
            name : 'Aus'
        }, {
            option_id :  'words',
            name : 'Wörter'
        }, {
            option_id : 'sentences',
            name : 'Sätze'
        }, {
            option_id :  'paragraphs',
            name : 'Absätze'
        }],
        changeEvent : function(value) {
            dispatchEventToPanel("selfVoicingMarkingUpdate", value);
        }
    },
    selfVoicing_color : {
        ui_component_id : "selfVoicing_color",
        title : {
            de: 'Markierungsfarbe',
            en: 'Color of marking'
        },
        defaultValue : "#ffff80",
        resetValue : "#ffff80",
        category : 'cat4',
        type : TYPE_COLOR_PICKER,
        changeEvent : function(value) {
            dispatchEventToPanel("selfVoicingColorUpdate", value);
        }
    },
    selfVoicing_zoom : {
        ui_component_id : "selfVoicing_zoom",
        title : {
            de: 'Vergrößerter Text',
            en: 'Bigger text'
        },
        defaultValue : {
            option_id : 'off'
        },
        resetValue : {
            option_id : 'off'
        },
        category : 'cat4',
        type : TYPE_DROPDOWN,
        options : [{
            option_id : 'off',
            name : 'Aus'
        }, {
            option_id : 'on',
            name : 'An'
        }],
        changeEvent : function(value) {
            dispatchEventToPanel("selfVoicingZoomUpdate", value);
        }
    }

   /** END: Self Voicing **/
};

