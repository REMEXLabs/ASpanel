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

let LANGUAGE;

function setLanguage(pageLanguage) {
    LANGUAGE = pageLanguage;
}

function getPanelLanguage() {
    return LANGUAGE;
}


/**
 * Create a Compoent based on the templates.
 * @param {object} component    component from UIComponentList
 * @return {string}    contains the html code for a component
 */
function createComponent(component) {

    if(component.type === "slider") {
        console.log("create a slider component");

        const slider_component_source = $("#slider-AScomponent").html();
        const slider_component_template = Handlebars.compile(slider_component_source);
        // Giving the template the component from the UIComponentList.
        return slider_component_template(component);
    }
    else if (component.type === "dropdown") {
        console.log("create a dropdown component");

        const dropdown_component_source = $("#dropdown-AScomponent").html();
        const dropdown_component_template = Handlebars.compile(dropdown_component_source);
        // Giving the template the component from the UIComponentList.
        return dropdown_component_template(component);
    }
    else if (component.type === "dropdownWithButton") {
        console.log("create a dropdown with button component");

        const dropdownWithButton_component_source = $("#dropdownWithButton-AScomponent").html();
        const dropdownWithButton_component_template = Handlebars.compile(dropdownWithButton_component_source);
        // Giving the template the component from the UIComponentList.
        return dropdownWithButton_component_template(component);
    }
    else if (component.type === "checkbox") {
        console.log("create a checkbox component");

        const checkbox_component_source = $("#checkbox-AScomponent").html();
        const checkbox_component_template = Handlebars.compile(checkbox_component_source);
        // Giving the template the component from the UIComponentList.
        return checkbox_component_template(component);

    }else if (component.type === "colorPicker") {
        console.log("create a colorPicker component");

        const colorPicker_component_source = $("#colorPicker-AScomponent").html();
        const colorPicker_component_template = Handlebars.compile(colorPicker_component_source);
        // Giving the template the component from the UIComponentList.
        return colorPicker_component_template(component);

    }
}

function registerHandlebarHelper() {
     /**
     * The helper ApplicationLabel provides all labels for the application.
     */
    Handlebars.registerHelper('ApplicationLabel', function(uiLabel) {

        return uiLabel[getPanelLanguage()];
        // example call: {{ApplicationLabel tabs.category_1}}
    });

    /**
     * The helper UIComponentLabel provides all labels for the components.
     */
    Handlebars.registerHelper('UIComponentLabel', function(componentLabel) {

       // gets any labels depending on the language.
       return componentLabel[getPanelLanguage()];
       // example call: {{UIComponentLabel textSize_silder.minText}}
    });

     /**
     * The helper UIComponentID provides all unique ids for the component elements.
     */
    Handlebars.registerHelper('UIComponentID', function(componentLabel) {
       return componentLabel;
       // example call: {{UIComponentID ui_component_id}}
    });

}


/**
 * All ASpanel components with a default value that should be overwritten
 * by GPII Chrome Extension should be called here.
 */
function overwriteDefaultWithGpiiSettings() {
    console.log("Overwrite Default Values");

    textSizeSlider.overwriteDefault();
    linepacingSlider.overwriteDefault();
    textStyleDropdown.overwriteDefault();
    pageLanguageDropdown.overwriteDefault();
    picsupportDropdown.overwriteDefault();

}


////////////////////////////
//// DECLARE COMPONENTS ////
////////////////////////////

let textSizeSlider;
let linepacingSlider;
let textStyleDropdown;
let picsupportDropdown;
let pageLanguageDropdown;
let uiSwitchDropdown;

let signLanguageLanguageDropdown;
let signLanguageInterpreterNameDropdown;

let selfVoicing_speed;
let selfVoicing_pitch;
let selfVoicing_type;
let selfVoicing_marking;
let selfVoicing_zoom;
let selfVoicing_color;


//////////////////
////// MAIN //////
//////////////////


$(function() {

    ////////////////////////////////////////////
    //////// LOAD DATA | GPII SETTINGS /////////
    ////////////////////////////////////////////

    /*
     * If cookies or preference sets are available then overwrite UIComponentList
     * Else use defaultValues. The code below waits for a server response!
     */
    GPIIconnector.getPreferenceSet(null, function(){


        ////////////////////////////
        /////// GET LANGUAGE ///////
        ////////////////////////////


        ///////////////////////////////////////
        ////// REGISTER HANDLEBAR HELPER //////
        ///////////////////////////////////////

        registerHandlebarHelper();

        ////////////////////////////
        ////// INIT TEMPLATES //////
        ////////////////////////////

        /**
         * Create category tabs with templates.
         * Uses ApplicationLabel object for multilingual labels.
         * Uses PersonaList object for personas.
         */
        const categoryTabs_source = $("#category-tabs-template").html();
        const categoryTabs_template = Handlebars.compile(categoryTabs_source);
        const categoryTabs_html = categoryTabs_template({ApplicationLabels, PersonaList});
        $("#ASpanel-application").html(categoryTabs_html);

        // var category_1_components_source = $("#category-1-components").html();
        // var category_1_components_template = Handlebars.compile(category_1_components_source);
        // // Giving the template the UIComponentList.
        // var html = category_1_components_template(UIComponentList);

        // //console.log(html);
        // $("#category-1").html(html);

        // HTML string for tabs
        let html_cat1 = "";
        let html_cat2 = "";
        let html_cat3 = "";
        let html_cat4 = "";

        for (let component in UIComponentList) {
            /**
             * component contains a string with the component name.
             * Use the following syntax to call a component object from the UIComponentList by name:
             * UIComponentList[component]
             */

            //console.log(UIComponentList[component].category);

            switch(UIComponentList[component].category) {

                case "cat1":
                    html_cat1 += createComponent(UIComponentList[component]);
                    break;

                case "cat2":
                    html_cat2 += createComponent(UIComponentList[component]);
                    break;

                case "cat3":
                    html_cat3 += createComponent(UIComponentList[component]);
                    break;

                case "cat4":
                    html_cat4 += createComponent(UIComponentList[component]);
                    break;

                default:
                    break;
            }
        }


        // Append html code.
        $("#category-1-dynamic-components .componentlist").html(html_cat1);
        $("#category-2-dynamic-components .componentlist").html(html_cat2);
        $("#category-3-dynamic-components .componentlist").html(html_cat3);
        $("#category-4-dynamic-components .componentlist").html(html_cat4);



        ////////////////////////////
        //////// INIT TABS /////////
        ////////////////////////////

        // option object
        const myTabOptions = {
            active: 0, // Number of active tab starting by 0
            collapsible: true
        };

        $("#category-tabs").tabs(myTabOptions);

        /////////////////////////////
        ////// INIT COMPONENTS //////
        /////////////////////////////

        //#### Slider ####

        textSizeSlider = new AS_Slider();
        textSizeSlider.init("textSize_slider");
        UIComponentList['textSize_slider'].component = textSizeSlider;

        linepacingSlider = new AS_Slider();
        linepacingSlider.init("lineSpacing_slider");
        UIComponentList['lineSpacing_slider'].component = linepacingSlider;

        textStyleDropdown = new AS_DropDown();
        textStyleDropdown.init("textStyle_dropdown");
        UIComponentList['textStyle_dropdown'].component = textStyleDropdown;

        picsupportDropdown = new AS_DropDown();
        picsupportDropdown.init("picsupport_dropdown");
        UIComponentList['picsupport_dropdown'].component = picsupportDropdown;

        pageLanguageDropdown = new AS_DropDown();
        pageLanguageDropdown.init("pageLanguage_dropdown");
        UIComponentList['pageLanguage_dropdown'].component = pageLanguageDropdown;

        signLanguageLanguageDropdown = new AS_DropDown();
        signLanguageLanguageDropdown.init("signlanguageLanguage_dropdown");
        UIComponentList['signlanguageLanguage_dropdown'].component = signLanguageLanguageDropdown;

        signLanguageInterpreterNameDropdown = new AS_DropDown();
        signLanguageInterpreterNameDropdown.init("signlanguageInterpreterName_dropdown");
        UIComponentList['signlanguageInterpreterName_dropdown'].component = signLanguageInterpreterNameDropdown;

        uiSwitchDropdown = new AS_DropDownWithButton();
        uiSwitchDropdown.init("uiSwitch_dropdown");
        UIComponentList['uiSwitch_dropdown'].component = uiSwitchDropdown;


        /** Self Voicing **/
        selfVoicing_speed = new AS_DropDown();
        selfVoicing_speed.init("selfVoicing_speed");
        UIComponentList['selfVoicing_speed'].component = selfVoicing_speed;

        selfVoicing_pitch = new AS_DropDown();
        selfVoicing_pitch.init("selfVoicing_pitch");
        UIComponentList['selfVoicing_pitch'].component = selfVoicing_pitch;

        selfVoicing_type = new AS_DropDown();
        selfVoicing_type.init("selfVoicing_type");
        UIComponentList['selfVoicing_type'].component = selfVoicing_type;

        selfVoicing_marking = new AS_DropDown();
        selfVoicing_marking.init("selfVoicing_marking");
        UIComponentList['selfVoicing_marking'].component = selfVoicing_marking;

        selfVoicing_color = new AS_ColorPicker();
        selfVoicing_color.init("selfVoicing_color");
        UIComponentList['selfVoicing_color'].component = selfVoicing_color;

        selfVoicing_zoom = new AS_DropDown();
        selfVoicing_zoom.init("selfVoicing_zoom");
        UIComponentList['selfVoicing_zoom'].component = selfVoicing_zoom;
        /** END: Self Voicing **/

        ////////////////////////////
        ////// RESET FUNCTIONS /////
        ////////////////////////////

        /**
         * All ASpanel components that should be reset by a reset event should be called here.
         */
        function resetAll() {
            console.log("Reset all");

        for (let key in UIComponentList) {
            UIComponentList[key]['component'].reset();
        }
        }

        /////////////////////////////////
        ////// OVERWRITE FUNCTIONS //////
        /////////////////////////////////

        /**
         * All ASpanel components with a default value that should be overwritten
         * by cookies should by called here.
         */
        function overwriteDefaultWithCookieSettings() {
            console.log("Overwrite Default Values");

            for (let key in UIComponentList) {
                UIComponentList[key]['component'].overwriteDefault();
            }
        }


        ///////////////////////////////
        ////// INIT EVENTHANDLER //////
        ///////////////////////////////

        /**
         * All eventhandler for the ASpanel UI are initalized here.
         */

        // Add Listener to Reset Button.
        document.getElementById("myButton").addEventListener('click', function() {
            //overwriteDefault(); //@@todo: Pressing "Zurücksetzen" triggers an exception (Chrome console): Uncaught ReferenceError: overwriteDefault is not defined
            resetAll();
        }, false);

        // Add Listener to Persona Button.
        document.querySelector("#persona-tab > button").addEventListener('click', function() {
            const iframe = parent.document.querySelector("#myASPanel-iFrame");
            const personaSelection = document.getElementById("persona-selection");

            if (personaSelection.hidden) {
                // show the persona selection
                personaSelection.hidden = false;
                this.innerHTML = this.dataset.translationHide;
                iframe.style.height = iframe.clientHeight + personaSelection.clientHeight + "px";
            } else {
                // hide the persona selection
                this.innerHTML = this.dataset.translationShow;
                iframe.style.height = iframe.clientHeight - personaSelection.clientHeight + "px";
                personaSelection.hidden = true;
            }
        }, false);

        // adding tooltip to each persona
        const setTooltipHidden = function (el, hidden) {
            const tooltip = el.querySelector("span.tooltip");
            tooltip.setAttribute("aria-hidden", hidden);

            const tooltipRect = tooltip.getBoundingClientRect();
            const panelRect = document.body.getBoundingClientRect();
            const delta = tooltipRect.x + tooltipRect.width - panelRect.width;

            if (delta > 0) {
                tooltip.style.marginLeft = "-" + delta + "px";
            }
        };

        document.querySelectorAll("#persona-selection li").forEach(function(el) {
            el.addEventListener("mouseover", function(ev) {
                setTooltipHidden(this, false);
            });
            el.addEventListener("mouseleave", function(ev) {
                setTooltipHidden(this, true);
            });
            el.addEventListener("focus", function(ev) {
                setTooltipHidden(this, false);
            });
            el.addEventListener("blur", function(ev) {
                setTooltipHidden(this, true);
            });

            el.addEventListener("keydown", function(ev) {
                if (ev.which === 27) { // ESC
                    setTooltipHidden(this, true);
                }
            });
        });

        // Add Listener to Persona Selection elements.
        const handler = function (el) {
            // (un)setting active class
            (el.parentElement.getElementsByClassName('active')[0]).classList.toggle('active');
            el.classList.toggle('active');

            // finding persona id
            const persona = PersonaList.find(function (persona) {
                return el.dataset.personaId === persona.id;
            });

            dispatchEventToPanel("personaSelectionUpdate", persona);
        };

        document.querySelectorAll("#persona-selection > ul > li").forEach(function(el){
            el.addEventListener('click', function(evt){
                handler(el);
            });

            el.addEventListener('keypress', function(evt){
                // Enter or Space
                if (evt.keyCode === 13 || evt.keyCode === 32){
                    evt.preventDefault();
                    handler(el);
                }
            });
        });



    });  // end of GPIIConnector call

});

function dispatchEventToPanel(name, value) {
    const event = new CustomEvent(name, {detail: value});
    document.dispatchEvent(event);
}

function dispatchEventToParent(name, value) {
    const event = new CustomEvent(name, {detail: value});
    parent.document.dispatchEvent(event);
}


function init() {
    //console.log(textSizeSlider.title);

}

$(document).ready(function(){

    init();

});


