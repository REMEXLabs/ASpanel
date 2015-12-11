/*
* Copyright 2015 Hochschule der Medien (HdM) / Stuttgart Media Universit (Patrick Muenster)
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


///////////////////////////////////
//////  AS SLIDER COMPONENT  //////
///////////////////////////////////

/*
 * AS_Slider component creates a slider in the ASpanel.
 */
var AS_Slider= function() {
    this.range = "min";
    this.minValue = 1;
    this.maxValue = 2;
    this.stepSize = 0.1;
    this.value;
    this.defaultValue = 0.0;
    this.slider_ID = "";
    this.ui_component_id = "";
    this.ui_input_id = "";


    this.reset = function() {
        console.log("Reset " + this.slider_ID);
        this.value = this.defaultValue;       
        $("#" + this.slider_ID).slider("value", this.value);
        $("#" + this.ui_input_id).val(this.value);
        UIComponentList[this.slider_ID].changeEvent(this.value);
        console.log("Value of " + this.slider_ID + " is set to " + parseFloat(this.getValue()));

    };

    /**
     * Initialize component. Sets object parameter and applies eventhandler.
     * @param {string} slider_ID ID of the HTML container used for the component.
     */
    this.init = function(slider_ID) {
        // Get values from UIComponentList.
        this.defaultValue = UIComponentList[slider_ID].defaultValue;
        this.value = this.defaultValue;
        this.slider_ID = slider_ID;
        this.ui_component_id = UIComponentList[slider_ID].ui_component_id;
        this.ui_input_id = UIComponentList[slider_ID].ui_input_id;
        this.minValue = UIComponentList[slider_ID].minValue;
        this.maxValue = UIComponentList[slider_ID].maxValue;

        // Init slider
        $("#" + slider_ID).slider({
            range : this.range,
            min : this.minValue,
            max : this.maxValue,
            value : this.defaultValue,
            step : this.stepSize,
            slide : function(event, ui) {
                $("#" + UIComponentList[slider_ID].ui_input_id).val(ui.value);
                // Change function
                UIComponentList[slider_ID].changeEvent(ui.value);
            }
        });
        // Set ui-component input element value.
        $("#" + this.ui_input_id).val($("#" + slider_ID).slider("value"));

        // Run change function one time for initialisation.
        UIComponentList[slider_ID].changeEvent(this.value);
    };

    /**
     * Set the slider to value. 
     */
    this.setValue = function(value) {
        this.value = value;
        $("#" + this.slider_ID).slider("value", value);
        $("#" + this.ui_input_id).val(value);
        UIComponentList[this.slider_ID].changeEvent(value);
        console.log("Value of " + this.slider_ID + " is set to " + parseFloat(this.getValue()));
    };

    this.getValue = function() {     
        return $("#" + this.slider_ID).slider("value");
    };

    /**
     * Overwirtes the default value after getting Settings from GPII or Cookie. 
     */
    this.overwriteDefault = function () {
        //console.log("Overwrite default value of " + this.slider_ID);
        //this.defaultValue = UIComponentList[this.slider_ID].defaultValue;
        this.value = UIComponentList[this.slider_ID].defaultValue;   
        $("#" + this.slider_ID).slider("value", this.value);
        $("#" + this.ui_input_id).val(this.value);
        UIComponentList[this.slider_ID].changeEvent(this.value);
    };
    
};


///////////////////////////////////
////// AS DROPDOWN COMPONENT //////
///////////////////////////////////

/**
 * AS_DropDown component creates a dropdown menu in the ASpanel.
 */
var AS_DropDown = function() {
    this.value = "";
    this.defaultValue = "";
    this.dropdown_ID = "";
    this.ui_component_id = "";

    this.reset = function() {
        console.log("Reset " + this.dropdown_ID);
        this.value = this.defaultValue;   
        $("#" + this.dropdown_ID).val(this.value);
        UIComponentList[this.dropdown_ID].changeEvent(this.value);
        console.log("Value of " + this.dropdown_ID + " is set to " + this.getValue());
    };

    this.getDefaultValue = function() {

    };

    /**
     * Initialize component. Sets object parameter and applies eventhandler.
     * @param {string} dropdown_ID ID of the HTML container used for the component.
     */
    this.init = function(dropdown_ID) {
        // Get values from UIComponentList.
        this.defaultValue = UIComponentList[dropdown_ID].defaultValue.option_id;
        this.value = this.defaultValue;
        this.dropdown_ID = dropdown_ID;
        this.ui_component_id = UIComponentList[dropdown_ID].ui_component_id;


        // Init dropdown 
        $("#" + dropdown_ID).change( function() {
            console.log("Dropdown List " + dropdown_ID + " changed");
            this.value = $("#" + dropdown_ID).val();
            UIComponentList[dropdown_ID].changeEvent(this.value);          
        });

        $("#" + this.dropdown_ID).val(this.value);

        // Run change function one time for initialisation.
        UIComponentList[dropdown_ID].changeEvent(this.value);

    };

     /**
     * Set the checkbox to value. 
     */
    this.setValue = function(value) {   
        this.value = value;
        $("#" + this.dropdown_ID).val(value);
        UIComponentList[this.dropdown_ID].changeEvent(value);
        console.log("Value of " + this.dropdown_ID + " is set to " + this.getValue());
    };

    this.getValue = function() {  
        return $("#" + this.dropdown_ID).val();
    };

    this.overwriteDefault = function () {
        //console.log("Overwrite default value of " + this.dropdown_ID);
        //this.defaultValue = UIComponentList[this.dropdown_ID].defaultValue.option_id;
        this.value = UIComponentList[this.dropdown_ID].defaultValue.option_id;
        $("#" + this.dropdown_ID).val(this.value);
        UIComponentList[this.dropdown_ID].changeEvent(this.value);   
    };

};


///////////////////////////////////
////// AS CHECKBOX COMPONENT //////
///////////////////////////////////

/**
 * AS_CheckBox component creates a checkbox in the ASpanel.
 */
var AS_CheckBox = function() {
    this.value;
    this.defaultValue = false;
    this.checkbox_ID = "";
    this.ui_component_id = "";


    this.reset = function() {
        console.log("Reset " + this.checkbox_ID);
        this.value = this.defaultValue;
        $("#" + this.checkbox_ID).prop('checked', this.value);
        UIComponentList[this.checkbox_ID].changeEvent(this.value);
        console.log("Value of " + this.checkbox_ID + " is set to " + this.getValue());
    };

    /**
     * Initialize component. Sets object parameter and applies eventhandler.
     * @param {string} checkbox_ID ID of the HTML container used for the component.
     */
    this.init = function(checkbox_ID) {
        // Get values from UIComponentList.
        this.defaultValue = UIComponentList[checkbox_ID].defaultValue;
        this.value = this.defaultValue;
        this.checkbox_ID = checkbox_ID;
        this.ui_component_id = UIComponentList[checkbox_ID].ui_component_id;

        // Init checkbox               
        $("#" + checkbox_ID).change(function() {
            console.log("Checkbox " + checkbox_ID + " clicked");

            UIComponentList[checkbox_ID].changeEvent($(this).is(":checked"));
            this.value = $(this).is(":checked");

        }); 

        $("#" + checkbox_ID).prop('checked', this.value);

        // Run change function one time for initialisation.
        UIComponentList[checkbox_ID].changeEvent(this.value);
    };

     /**
     * Set the checkbox to value. 
     */
    this.setValue = function(value) {
        this.value = value;
        $("#" + this.checkbox_ID).prop('checked', value);
        UIComponentList[this.checkbox_ID].changeEvent(value);
        console.log("Value of " + this.checkbox_ID + " is set to " + this.getValue());
    };

    this.getValue = function() {
        return $("#" + this.checkbox_ID).is(":checked");
    };

    this.overwriteDefault = function () {
        //console.log("Overwrite default value of " + this.checkbox_ID);
        //this.defaultValue = UIComponentList[this.checkbox_ID].defaultValue;
        this.value = UIComponentList[this.checkbox_ID].defaultValue;
        $("#" + this.checkbox_ID).prop('checked', this.value);
        UIComponentList[this.checkbox_ID].changeEvent(this.value);
    };
};

