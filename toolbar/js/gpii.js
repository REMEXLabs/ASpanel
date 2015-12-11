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


// Kim_Callahan hinzufügen!!!
var gpiiUser = {
    carla: 'http://localhost:8081/preferences/olb_Carla',
    lara: 'http://localhost:8081/preferences/olb_Lara',
    alicia: 'http://localhost:8081/preferences/olb_Alicia_app',
    kim: 'http://localhost:8081/preferences/olb_KimCallahan'
};

/*
 * Contains all Settings stored from requested GPII Preference Sets.
 * Not defined Settings are 'null'. 
 */
var gpiiUserSettings = {
   simplifiedUiEnabled: null,
   textSize: null,
   lineSpacing: null,
   textStyle: null,
   pictogramsEnabled: null,
   signLanguageEnabled: null,
   signLanguage: null,
   interpreterType: null,
   interpreterName: null,
   toc: null,
   links:null, 
   highContrastEnabled: null,
   contrastTheme: null,
   inputsLarger: null
};

/*
 * GPII Connection and methods to read the preferences and set the ASpanel settings to personalize the UI. 
 */
var GPIIconnector = (function() {

    var module = {};


    /**
     * Helper function to transform a textSize to a multiplier between min and max value of the slider.
     * @param {number} inputValue   textSize 
     */
    function textSize2Mulitplier(inputValue) {
        if (inputValue < 1.0) {
            inputValue = 1.0;
        }
        else if (inputValue == 3.0) {
            inputValue = 3.0;
        }
        else if (inputValue > 3.0) {
            if (inputValue < 12.0) {
                inputValue = 1;
            }
            else if (inputValue >= 36.0) {
                inputValue = 3;
            } else if (inputValue > 12.0 && inputValue < 36.0) {
                inputValue = 3.0 / 36.0 * inputValue;
            }
        }

        return inputValue;
    };

    /**
     * Helper function to transform a lineSpace to a multiplier between min and max value of the slider.
     * @param {number} inputValue   lineSpaceing 
     */
    function lineSpace2Mulitplier(inputValue) {
        if (inputValue < 1.0) {
            inputValue = 1.0;
        }
        else if (inputValue >= 3.0) {
            inputValue = 3.0;
        }

        return inputValue; 
    }

    /**
     * Print gpiiUserSettings to the console. 
     * Has to wait for the server response. Called before it will get only null in gpiiUserSettings.
     */
    function showGpiiUserSetting() {
        console.log("Saved settings in gpiiUserSettings: ");
         for (var key in gpiiUserSettings) {
            console.log(key + " : " + gpiiUserSettings[key]);
         }
    };


    /**
     * Getting a preference set from the GPII server.
     * @param {String} user     valid username for gpii settings 
     */
    module.getPreferenceSet = function(user,return2Main) {
        var xhr = ("XMLHttpRequest" in window) ? new XMLHttpRequest() : new ActiveXObject("Msxml3.XMLHTTP");
        xhr.open("GET", user, true);
        xhr.onreadystatechange = function() {

            if (xhr.readyState === 4) {
                //var serverResponse = xhr.responseText;
                //console.log(serverResponse);
                if (xhr.status == 200){
                    module.readPreferenceSet(xhr.responseText,return2Main);
                    //console.log("GPII Response:" + xhr.responseText);
                }
                else {
                    console.log("# GPII Connection failed: no server response!");

                    return2Main();
                    // Try to get Settings from Chrome Extension
                    overwriteDefaultWithGpiiSettings();
                }
            }
        };
        xhr.send(null);
    }; 


    /**
     * Parse Preference Set from LOCAL FLOW MANAGER:
     * Check first for application-specific terms. 
     * If there are no application-specific terms then try to get common terms. 
     * Note: Strictly speaking, only application-specific terms for the current app should be returned.
     */
    module.readPreferenceSet = function(GPIIresponse,return2Main) {
        var preferenceSetObject = JSON.parse(GPIIresponse);

        console.log(preferenceSetObject.contexts['gpii-default'].preferences);

        var preferenceSet = preferenceSetObject.contexts['gpii-default'].preferences;
        //setComponents()
        //textSizeSlider.setValue(preferenceSetObject.contexts['gpii-default'].preferences["http://registry.gpii.net/common/fontSize"]);
        //textSizeSlider.setValue(50);


        //## simplifiedUiEnabled ##//
        // !To load the new UI as soon as possible, loadUI() is called here already!
        if (preferenceSet["http://registry.gpii.net/applications/eu.gpii.olb"].simplifiedUiEnabled != undefined) {

                gpiiUserSettings.simplifiedUiEnabled = preferenceSet["http://registry.gpii.net/applications/eu.gpii.olb"].simplifiedUiEnabled;
                // Load simplified UI
                module.loadUI(preferenceSet["http://registry.gpii.net/applications/eu.gpii.olb"].simplifiedUiEnabled);

        } else {
                // Load default UI
                module.loadUI(false);
        }

        //## textSize ##//
        // 1. Try to read application-specific term
        if (preferenceSet["http://registry.gpii.net/applications/eu.gpii.olb"].textSize != undefined) {
            gpiiUserSettings.textSize = preferenceSet["http://registry.gpii.net/applications/eu.gpii.olb"].textSize;
        }
        // 2. If 1. fails try read common term
        else if (preferenceSet["http://registry.gpii.net/common/fontSize"] != undefined) {
            gpiiUserSettings.textSize = preferenceSet["http://registry.gpii.net/common/fontSize"];
        }

        //## lineSpacing ##//        
        if (preferenceSet["http://registry.gpii.net/applications/eu.gpii.olb"].lineSpacing != undefined) {
            gpiiUserSettings.lineSpacing = preferenceSet["http://registry.gpii.net/applications/eu.gpii.olb"].lineSpacing;
        }
        else if (preferenceSet["http://registry.gpii.net/common/lineSpacing"] != undefined) {
            gpiiUserSettings.lineSpacing = preferenceSet["http://registry.gpii.net/common/lineSpacing"];
        }

        //## textStyle ##//             
        if (preferenceSet["http://registry.gpii.net/applications/eu.gpii.olb"].textStyle != undefined) {
            gpiiUserSettings.textStyle = preferenceSet["http://registry.gpii.net/applications/eu.gpii.olb"].textStyle;
        }
        else if (preferenceSet["http://registry.gpii.net/common/textFont"] != undefined) {
            gpiiUserSettings.textStyle = preferenceSet["http://registry.gpii.net/common/textFont"];
        }

        //## pictogramsEnabled ##//        
        if (preferenceSet["http://registry.gpii.net/applications/eu.gpii.olb"].pictogramsEnabled != undefined) {
            gpiiUserSettings.pictogramsEnabled = preferenceSet["http://registry.gpii.net/applications/eu.gpii.olb"].pictogramsEnabled;
        }
        else if (preferenceSet["http://registry.gpii.net/common/picSupport"] != undefined) {
            gpiiUserSettings.pictogramsEnabled = preferenceSet["http://registry.gpii.net/common/picSupport"];
        }

        //## signLanguageEnabled ##//            
        if (preferenceSet["http://registry.gpii.net/applications/eu.gpii.olb"].signLanguage != undefined) {
            gpiiUserSettings.signLanguage = preferenceSet["http://registry.gpii.net/applications/eu.gpii.olb"].signLanguage;
        }
        else if (preferenceSet["http://registry.gpii.net/common/signLanguage"] != undefined) {
            gpiiUserSettings.signLanguage = preferenceSet["http://registry.gpii.net/common/signLanguage"];
        }

          //## signLanguage ##//            
        if (preferenceSet["http://registry.gpii.net/applications/eu.gpii.olb"].signLanguageEnabled != undefined) {
            gpiiUserSettings.signLanguageEnabled = preferenceSet["http://registry.gpii.net/applications/eu.gpii.olb"].signLanguageEnabled;
        }
        else if (preferenceSet["http://registry.gpii.net/common/signLanguageEnabled"] != undefined) {
            gpiiUserSettings.signLanguageEnabled = preferenceSet["http://registry.gpii.net/common/signLanguageEnabled"];
        }
        
        //## toc ##//            
        if (preferenceSet["http://registry.gpii.net/applications/eu.gpii.olb"].toc != undefined) {
            gpiiUserSettings.toc = preferenceSet["http://registry.gpii.net/applications/eu.gpii.olb"].toc;
        }
        else if (preferenceSet["http://registry.gpii.net/common/toc"] != undefined) {
            gpiiUserSettings.toc = preferenceSet["http://registry.gpii.net/common/toc"];
        }

        //## highContrastEnabled ##//            
        if (preferenceSet["http://registry.gpii.net/applications/eu.gpii.olb"].highContrastEnabled != undefined) {
            gpiiUserSettings.highContrastEnabled = preferenceSet["http://registry.gpii.net/applications/eu.gpii.olb"].highContrastEnabled;
        }
        else if (preferenceSet["http://registry.gpii.net/common/highContrastEnabled"] != undefined) {
            gpiiUserSettings.highContrastEnabled = preferenceSet["http://registry.gpii.net/common/highContrastEnabled"];
        }

        //## highContrast ##//            
        if (preferenceSet["http://registry.gpii.net/applications/eu.gpii.olb"].contrastTheme != undefined) {
            gpiiUserSettings.contrastTheme = preferenceSet["http://registry.gpii.net/applications/eu.gpii.olb"].contrastTheme;
        }
        else if (preferenceSet["http://registry.gpii.net/common/highContrastTheme"] != undefined) {
            gpiiUserSettings.contrastTheme = preferenceSet["http://registry.gpii.net/common/highContrastTheme"];
        }

        // Print GPII user Settings
        showGpiiUserSetting();
        module.overwriteASpanelUIComponentList(return2Main);  
    };


    /**
     * Overwrite default values in UIComponentList of the ASpanel. 
     */
    module.overwriteASpanelUIComponentList = function(return2Main) {
        for (var key in gpiiUserSettings) {

            // check for set parameter to avoid 'null' setting
            if (gpiiUserSettings[key] != null) {

                switch(key) {

                    case "textSize":              
                        UIComponentList.textSize_slider.defaultValue = textSize2Mulitplier(gpiiUserSettings[key]);
                        console.log("TextSize");
                        break;

                     case "lineSpacing":              
                        UIComponentList.lineSpacing_slider.defaultValue = lineSpace2Mulitplier(gpiiUserSettings[key]);
                        console.log("LineSpacing");
                        break;

                     case "textStyle":              
                        UIComponentList.textStyle_dropdown.defaultValue.option_id = gpiiUserSettings[key];
                        console.log("TextStyle");
                        break;

                     case "pictogramsEnabled":
                        if (gpiiUserSettings[key]) { 
                            UIComponentList.picsupport_dropdown.defaultValue.option_id = "picsupport-on";                    
                        } else {
                            UIComponentList.picsupport_dropdown.defaultValue.option_id = "picsupport-off";
                        }
                        console.log("Picsupport");
                        break;

                     case "toc":              
                        UIComponentList.table_of_content.defaultValue = gpiiUserSettings[key];
                        console.log("Table of Content");
                        break;

                     case "contrastTheme":              
                        //UIComponentList.textSize_slider.defaultValue = textSize2Mulitplier(gpiiUserSettings[key]);
                        console.log("ContrastTheme");
                        break;

                    default:
                        break;
                }
            }

            // Reset defaultValues to resetValue. 
            else {
                switch(key) {

                    case "textSize":              
                        UIComponentList.textSize_slider.defaultValue = UIComponentList.textSize_slider.resetValue;
                        console.log("TextSize reset");
                        break;

                     case "lineSpacing":              
                        UIComponentList.lineSpacing_slider.defaultValue = UIComponentList.lineSpacing_slider.resetValue;
                        console.log("LineSpacing reset");
                        break;

                     case "textStyle":              
                        UIComponentList.textStyle_dropdown.defaultValue.option_id = UIComponentList.textStyle_dropdown.resetValue.option_id;
                        console.log("TextStyle reset");
                        break;

                     case "pictogramsEnabled":         
                        UIComponentList.picsupport_dropdown.defaultValue.option_id = UIComponentList.picsupport_dropdown.resetValue.option_id;                    
                        console.log("Picsupport reset");
                        break;

                     case "toc":              
                        UIComponentList.table_of_content.defaultValue = UIComponentList.table_of_content.resetValue;
                        console.log("Table of Content");
                        break;

                     case "contrastTheme":              
                        //UIComponentList.textSize_slider.defaultValue = textSize2Mulitplier(gpiiUserSettings[key]);
                        console.log("ContrastTheme");
                        break;

                    default:
                        break;
                }
            }
        }

        if (return2Main != undefined) {
            return2Main();
        } else {
            console.log("Chrome Extension!");
            overwriteDefaultWithGpiiSettings();
        }
    };

    /**
     *  Parse Ppreference set from chromeExtension.
     *  The function is called from toolbar.html
     */
    module.readPreferenceSetFromChromeExtension = function(preferenceSet) {
        console.log("## Reading Preference Set from GPII Chrome Extension");

        if (preferenceSet != null || preferenceSet != undefined) {

            console.log("### Preference Set reseived from GPII Chrome Extension!"); 

            //## simplifiedUiEnabled ##//
            // !To load the new UI as soon as possible, loadUI() is called here already!
             if (preferenceSet.simplifiedUiEnabled != undefined) {

                    gpiiUserSettings.simplifiedUiEnabled = preferenceSet.simplifiedUiEnabled;
                    // Load simplified UI
                    module.loadUI(preferenceSet.simplifiedUiEnabled);

            } else {
                    // Load default UI
                    module.loadUI(false);
            }

            //## textSize ##//        
            if (preferenceSet.textSize != undefined) {
                gpiiUserSettings.textSize = preferenceSet.textSize;
            }

            //## lineSpacing ##//        
            if (preferenceSet.lineSpacing != undefined) {
                gpiiUserSettings.lineSpacing = preferenceSet.lineSpacing;
            }

            //## textStyle ##//             
            if (preferenceSet.textStyle != undefined) {
                gpiiUserSettings.textStyle = preferenceSet.textStyle;
            }

            //## pictogramsEnabled ##//        
            if (preferenceSet.pictogramsEnabled != undefined) {
                gpiiUserSettings.pictogramsEnabled = preferenceSet.pictogramsEnabled;
            }

            //## signLanguageEnabled ##//            
            if (preferenceSet.signLanguage != undefined) {
                gpiiUserSettings.signLanguage = preferenceSet.signLanguage;
            }

              //## signLanguage ##//            
            if (preferenceSet.signLanguageEnabled != undefined) {
                gpiiUserSettings.signLanguageEnabled = preferenceSet.signLanguageEnabled;
            }

            //## links ##//            
            if (preferenceSet.links != undefined) {
                gpiiUserSettings.links = preferenceSet.links;
            }

            //## highContrastEnabled ##//            
            if (preferenceSet.highContrastEnabled != undefined) {
                gpiiUserSettings.highContrastEnabled = preferenceSet.highContrastEnabled;
            }

            //## highContrast ##//            
            if (preferenceSet.contrastTheme != undefined) {
                gpiiUserSettings.contrastTheme = preferenceSet.contrastTheme;
            }

            //## inputsLager ##//            
            if (preferenceSet.inputsLarger != undefined) {
                gpiiUserSettings.inputsLarger = preferenceSet.inputsLarger;
            }
        } else {
            console.log("### No Preference Set reseived from GPII Chrome Extension!");
        }

        module.overwriteASpanelUIComponentList();


    };


    /**
     * Load UI: Switch between simplified UI or default UI.
     * @param  {boolean} simplified
     */
    module.loadUI = function(simplified) {

        //console.log(parent.document.URL);
        //console.log(parent.window.location.href);

        currentURL = parent.document.URL;

        if(simplified) {
            // If current website is NOT simplified UI then load it.

            // if (currentURL.indexOf("http://mario-ui.gpii.eu") == -1) {
                // parent.window.location.href = "http://mario-ui.gpii.eu";
            // }

            // Debugging & Testing
            if (currentURL.indexOf("file:///C:/xampp/htdocs/Aptana%20Studio%203%20Workspace/ASpanel/simplyfied_index.html") == -1) {
                parent.window.location.href = "file:///C:/xampp/htdocs/Aptana%20Studio%203%20Workspace/ASpanel/simplyfied_index.html";
            }
        } else {
            // If current website is NOT default ui then load it.

            // if (currentURL.indexOf("http://olb.gpii.eu") == -1){
                // parent.window.location.href = "http://olb.gpii.eu";
            // }

            // Debugging & Testing
            if (currentURL.indexOf("file:///C:/xampp/htdocs/Aptana%20Studio%203%20Workspace/ASpanel/index.html") == -1) {
                parent.window.location.href = "file:///C:/xampp/htdocs/Aptana%20Studio%203%20Workspace/ASpanel/index.html";
            }
        }
    };

    return module;

})();

