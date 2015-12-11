/*
* Copyright 2015 Patrick Muenster
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


function setLanguage(pageLanguage) {
    var context = {};
    
    context.title = UIComponentList;
    
    return context;
    
}

function getPanelLanguage() {
    return "de";
}


/**
 * Create a Compoent based on the templates.
 * @param {object} component    component from UIComponentList
 * @return {string}    contains the html code for a component
 */
function createComponent(component) {
    
    if(component.type === "slider") {
        console.log("create a slider component");
        
        var slider_component_source = $("#slider-AScomponent").html();
        var slider_component_template = Handlebars.compile(slider_component_source);
         // Giving the template the component from the UIComponentList. 
        return slider_component_template(component);
    }
    else if (component.type === "dropdown") {
        console.log("create a dropdown component");
        
        var dropdown_component_source = $("#dropdown-AScomponent").html();
        var dropdown_component_template = Handlebars.compile(dropdown_component_source);
         // Giving the template the component from the UIComponentList. 
        return dropdown_component_template(component);      
    } 
    else if (component.type === "checkbox") {
        console.log("create a checkbox component");
        
        var checkbox_component_source = $("#checkbox-AScomponent").html();
        var checkbox_component_template = Handlebars.compile(checkbox_component_source);
         // Giving the template the component from the UIComponentList. 
        return checkbox_component_template(component);

    }
}

/**
 * All ASpanel components with a default value that should be overwritten 
 * by GPII Chome Extension should be called here. 
 */ 
function overwriteDefaultWithGpiiSettings() {
    console.log("Overwirte Default Values");
    
    textSizeSlider.overwriteDefault();
    linepacingSlider.overwriteDefault();
    textStyleDropdown.overwriteDefault();
    tableOfContent_ckb.overwriteDefault();
    picsupportDropdown.overwriteDefault();
    
}
 

////////////////////////////
//// DECLARE COMPONENTS ////
////////////////////////////

var textSizeSlider;
var linepacingSlider;   
var textStyleDropdown;              
var picsupportDropdown;               
var tableOfContent_ckb;


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
        
        
        ////////////////////////////
        ////// INIT TEMPLATES //////
        ////////////////////////////
        
        
        /**
         * Create category tabs with category-tabs-template.
         * Uses ApplicationLabel object for multilingual labels. 
         */     
        var application_source = $("#category-tabs-template").html();
        var application_template = Handlebars.compile(application_source);
        // Giving the template the ApplicationLabels.
        var application_html = application_template(ApplicationLabels);
        $("#ASpanel-application").html(application_html);
        
           
        // var category_1_components_source = $("#category-1-components").html();
        // var category_1_components_template = Handlebars.compile(category_1_components_source);
        // // Giving the template the UIComponentList.
        // var html = category_1_components_template(UIComponentList);
         
        // //console.log(html);
        // $("#category-1").html(html);
        
        var html_cat1 = "";
        
        for (var component in UIComponentList) {
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
            }
        }    
        
        //console.log(html_cat1);
        
        // Append html code.
        $("#category-1-dynamic-components .componentlist").html(html_cat1);
        
        
        //var category_1_components_source = $("#category-1-components").html();
        //var category_1_components_template = Handlebars.compile(category_1_components_source);
        // Giving the template the UIComponentList.
        //var html = category_1_components_template(UIComponentList.textSize_slider);
        //console.log(html);
        //html = html + category_1_components_template(UIComponentList);
        //console.log(html);
        //console.log(html);
        //$("#category-1-dynamic-components .componentlist").html(html);
        
    
        ////////////////////////////
        //////// INIT TABS /////////
        ////////////////////////////
    
        // option object
        var myTabOptions = {
            active : 0, // Number of active tab starting by 0
            collapsible : true
        };
    
        $("#category-tabs").tabs(myTabOptions);
        
        // modify dropdown elements with jquery 
        //$("#picsupport_dropdown").selectmenu();
        
     
        ////////////////////////////
        ////// INIT COMPONETS //////
        ////////////////////////////
    
        //#### Slider ####
    
        textSizeSlider = new AS_Slider();
        textSizeSlider.init("textSize_slider");
        
        linepacingSlider = new AS_Slider();
        linepacingSlider.init("lineSpacing_slider");
        
        textStyleDropdown = new AS_DropDown();
        textStyleDropdown.init("textStyle_dropdown");
        
        picsupportDropdown = new AS_DropDown();
        picsupportDropdown.init("picsupport_dropdown");
        
        tableOfContent_ckb = new AS_CheckBox();
        tableOfContent_ckb.init("table_of_content");
        //console.log(tableOfContent_ckb.getValue());
         
        
        
        ////////////////////////////
        ////// RESET FUNCTIONS /////
        ////////////////////////////
    
        /**
         * All ASpanel components that should be reseted by a reset event should be called here.
         */
        function resetAll() {
            console.log("Reset all");
    
             textSizeSlider.reset();
             tableOfContent_ckb.reset();
             textStyleDropdown.reset();
        }
        
        /////////////////////////////////
        ////// OVERWRITE FUNCTIONS //////
        /////////////////////////////////
        
        /**
         * All ASpanel components with a default value that should be overwritten 
         * by cookies shoul by called here. 
         */
        function overwriteDefaultWithCookieSettings() {
            console.log("Overwirte Default Values");
            
            textSizeSlider.overwriteDefault();
            linepacingSlider.overwriteDefault();
            textStyleDropdown.overwriteDefault();
            tableOfContent_ckb.overwriteDefault();
            picsupportDropdown.overwriteDefault();
            
        }
    
        // Sow all components in UIComponentList
        //console.log("Components in UIComponentList: ");
        for (var key in UIComponentList) {
            // console.log(key);    
        }
        
        
        ///////////////////////////////
        ////// INIT EVENTHANDLER //////
        ///////////////////////////////
        
        /**
         * All eventhandler for the ASpanel UI are initalized here. 
         */
        
        // Add Listener to Reset Button.
        document.getElementById("myButton").addEventListener('click', function() {
            overwriteDefault();
            resetAll();
        }, false);
    
        // $("#textSize-slider").slider({
        // range : "min",
        // min : 1,
        // max : 2,
        // value : 1,
        // step : 0.1,
        // slide : function(event, ui) {
        // $("#textSize").val(ui.value);
        // }
        // });
        // $("#textSize").val($("#textSize-slider").slider("value"));
        
        // end of GPIIConnector call
    });

});

 function init() {
    //console.log(textSizeSlider.title);
    

 //
}

$(document).ready(function(){
    
    init();
    
});


