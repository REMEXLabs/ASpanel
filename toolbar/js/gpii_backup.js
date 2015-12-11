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

var gpiiUser = {
    carla: 'http://localhost:8081/preferences/olb_Carla',
    lara: 'http://localhost:8081/preferences/olb_Lara',
    alicia: 'http://localhost:8081/preferences/olb_Alicia_app'
};

/**
 * Contains all Settings stored from requested GPII Preference Sets.
 * Not defined Settings are 'null'. 
 */
var gpiiUserSettings = {
   simplifiedUiEnabled: null,
   fontSize: null,
   lineSpacing: null,
   textFont: null,
   picsupport: null,
   signLanguageEnabled: null,
   signLanguage: null,
   toc: null, 
   highContrastEnabled: null,
   highContrastTheme: null
};

/*
 * GPII Connection and methodes to read the preferences and set the ASpanel settings to personalize the UI. 
 */
var GPIIconnector = (function() {
    
    var module = {};
    
    
    /**
     * Helper function to transform a textSize to a multiplier between min and max value of the slider.
     * @param {number} inputValue   fontSize 
     */
    function fontSize2Mulitplier(inputValue) {
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
                module.readPreferenceSet(xhr.responseText,return2Main);
                //console.log("GPII Response:" + xhr.responseText);
            }
        };
        xhr.send(null);
    }; 
    
    
    /**
     * Parse Preference Set:
     * Check first for for application-specific terms. 
     * If there are no application-specific terms then try to get common terms. 
     */
    module.readPreferenceSet = function(preferenceSet,return2Main) {
        var prefrenceSetObject = JSON.parse(preferenceSet);

        console.log(prefrenceSetObject.contexts['gpii-default'].preferences);
        //setComponents()
        //textSizeSlider.setValue(prefrenceSetObject.contexts['gpii-default'].preferences["http://registry.gpii.net/common/fontSize"]);
        //textSizeSlider.setValue(50);
        
        
        //## simplifiedUiEnabled ##//
        // !To load the new UI as soon as possible, loadUI() is called here already!
        if (prefrenceSetObject.contexts['gpii-default'].preferences["http://registry.gpii.net/applications/eu.gpii.olb"].simplifiedUiEnabled == true) {
            gpiiUserSettings.simplifiedUiEnabled = prefrenceSetObject.contexts['gpii-default'].preferences["http://registry.gpii.net/applications/eu.gpii.olb"].simplifiedUiEnabled;
            // Load simplified UI
            module.loadUI(true);
        } else {
            gpiiUserSettings.simplifiedUiEnabled = prefrenceSetObject.contexts['gpii-default'].preferences["http://registry.gpii.net/applications/eu.gpii.olb"].simplifiedUiEnabled;
            // Load default UI
            module.loadUI(false);
        }
           
        //## fontSize ##//        
        // 1. Try to read application-specific term
        if (prefrenceSetObject.contexts['gpii-default'].preferences["http://registry.gpii.net/applications/eu.gpii.olb"].fontSize != undefined) {
            gpiiUserSettings.fontSize = prefrenceSetObject.contexts['gpii-default'].preferences["http://registry.gpii.net/applications/eu.gpii.olb"].fontSize;
        }
        // 2. If 1. fails try read common term
        else if (prefrenceSetObject.contexts['gpii-default'].preferences["http://registry.gpii.net/common/fontSize"] != undefined) {
            gpiiUserSettings.fontSize = prefrenceSetObject.contexts['gpii-default'].preferences["http://registry.gpii.net/common/fontSize"];
        }
        
        //## lineSpacing ##//        
        if (prefrenceSetObject.contexts['gpii-default'].preferences["http://registry.gpii.net/applications/eu.gpii.olb"].lineSpacing != undefined) {
            gpiiUserSettings.lineSpacing = prefrenceSetObject.contexts['gpii-default'].preferences["http://registry.gpii.net/applications/eu.gpii.olb"].lineSpacing;
        } 
        else if (prefrenceSetObject.contexts['gpii-default'].preferences["http://registry.gpii.net/common/lineSpacing"] != undefined) {
            gpiiUserSettings.lineSpacing = prefrenceSetObject.contexts['gpii-default'].preferences["http://registry.gpii.net/common/lineSpacing"];
        }
        
        //## textFont ##//             
        if (prefrenceSetObject.contexts['gpii-default'].preferences["http://registry.gpii.net/applications/eu.gpii.olb"].textFont != undefined) {
            gpiiUserSettings.textFont = prefrenceSetObject.contexts['gpii-default'].preferences["http://registry.gpii.net/applications/eu.gpii.olb"].textFont;
        } 
        else if (prefrenceSetObject.contexts['gpii-default'].preferences["http://registry.gpii.net/common/textFont"] != undefined) {
            gpiiUserSettings.textFont = prefrenceSetObject.contexts['gpii-default'].preferences["http://registry.gpii.net/common/textFont"];
        }
        
        //## picSupport ##//        
        if (prefrenceSetObject.contexts['gpii-default'].preferences["http://registry.gpii.net/applications/eu.gpii.olb"].picSupport != undefined) {
            gpiiUserSettings.picSupport = prefrenceSetObject.contexts['gpii-default'].preferences["http://registry.gpii.net/applications/eu.gpii.olb"].picSupport;
        } 
        else if (prefrenceSetObject.contexts['gpii-default'].preferences["http://registry.gpii.net/common/picSupport"] != undefined) {
            gpiiUserSettings.picSupport = prefrenceSetObject.contexts['gpii-default'].preferences["http://registry.gpii.net/common/picSupport"];
        }
        
        //## signLanguageEnabled ##//            
        if (prefrenceSetObject.contexts['gpii-default'].preferences["http://registry.gpii.net/applications/eu.gpii.olb"].signLanguage != undefined) {
            gpiiUserSettings.signLanguage = prefrenceSetObject.contexts['gpii-default'].preferences["http://registry.gpii.net/applications/eu.gpii.olb"].signLanguage;
        } 
        else if (prefrenceSetObject.contexts['gpii-default'].preferences["http://registry.gpii.net/common/signLanguage"] != undefined) {
            gpiiUserSettings.signLanguage = prefrenceSetObject.contexts['gpii-default'].preferences["http://registry.gpii.net/common/signLanguage"];
        }
        
          //## signLanguage ##//            
        if (prefrenceSetObject.contexts['gpii-default'].preferences["http://registry.gpii.net/applications/eu.gpii.olb"].signLanguageEnabled != undefined) {
            gpiiUserSettings.signLanguageEnabled = prefrenceSetObject.contexts['gpii-default'].preferences["http://registry.gpii.net/applications/eu.gpii.olb"].signLanguageEnabled;
        } 
        else if (prefrenceSetObject.contexts['gpii-default'].preferences["http://registry.gpii.net/common/signLanguageEnabled"] != undefined) {
            gpiiUserSettings.signLanguageEnabled = prefrenceSetObject.contexts['gpii-default'].preferences["http://registry.gpii.net/common/signLanguageEnabled"];
        }
        
        //## toc ##//            
        if (prefrenceSetObject.contexts['gpii-default'].preferences["http://registry.gpii.net/applications/eu.gpii.olb"].toc != undefined) {
            gpiiUserSettings.toc = prefrenceSetObject.contexts['gpii-default'].preferences["http://registry.gpii.net/applications/eu.gpii.olb"].toc;
        } 
        else if (prefrenceSetObject.contexts['gpii-default'].preferences["http://registry.gpii.net/common/toc"] != undefined) {
            gpiiUserSettings.toc = prefrenceSetObject.contexts['gpii-default'].preferences["http://registry.gpii.net/common/toc"];
        }      
        
        //## highContrastEnabled ##//            
        if (prefrenceSetObject.contexts['gpii-default'].preferences["http://registry.gpii.net/applications/eu.gpii.olb"].highContrastEnabled != undefined) {
            gpiiUserSettings.highContrastEnabled = prefrenceSetObject.contexts['gpii-default'].preferences["http://registry.gpii.net/applications/eu.gpii.olb"].highContrastEnabled;
        } 
        else if (prefrenceSetObject.contexts['gpii-default'].preferences["http://registry.gpii.net/common/highContrastEnabled"] != undefined) {
            gpiiUserSettings.highContrastEnabled = prefrenceSetObject.contexts['gpii-default'].preferences["http://registry.gpii.net/common/highContrastEnabled"];
        }  
        
        //## highContrast ##//            
        if (prefrenceSetObject.contexts['gpii-default'].preferences["http://registry.gpii.net/applications/eu.gpii.olb"].contrastTheme != undefined) {
            gpiiUserSettings.highContrastTheme = prefrenceSetObject.contexts['gpii-default'].preferences["http://registry.gpii.net/applications/eu.gpii.olb"].contrastTheme;
        } 
        else if (prefrenceSetObject.contexts['gpii-default'].preferences["http://registry.gpii.net/common/highContrastTheme"] != undefined) {
            gpiiUserSettings.highContrastTheme = prefrenceSetObject.contexts['gpii-default'].preferences["http://registry.gpii.net/common/highContrastTheme"];
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
                                   
                    case "fontSize":              
                        UIComponentList.textSize_slider.defaultValue = fontSize2Mulitplier(gpiiUserSettings[key]);
                        console.log("Fontsize");
                        break;
                    
                     case "lineSpacing":              
                        UIComponentList.lineSpacing_slider.defaultValue = lineSpace2Mulitplier(gpiiUserSettings[key]);
                        console.log("LineSpacing");
                        break;
                     
                     case "textFont":              
                        UIComponentList.textStyle_dropdown.defaultValue.option_id = gpiiUserSettings[key];
                        console.log("Fontsize");
                        break;
                     
                     case "picsupport":
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
                        
                     case "highContrastTheme":              
                        //UIComponentList.textSize_slider.defaultValue = fontSize2Mulitplier(gpiiUserSettings[key]);
                        console.log("HighContrastTheme");
                        break;
                    
                }
            }
            //console.log(key + " : " + gpiiUserSettings[key]);    
        }
        if (return2Main != undefined) {
            return2Main();
        }
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
            // If current website is NOT simplified ui then load it.
            
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






















///////////////
// OLD STUFF //
///////////////


/**
 * Getting a preference set from the GPII server 
 */
function getGpiiPreferenceSet(user) {
    var xhr = ("XMLHttpRequest" in window) ? new XMLHttpRequest() : new ActiveXObject("Msxml3.XMLHTTP");
    xhr.open("GET", user, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            //var serverResponse = xhr.responseText;
            //console.log(serverResponse);
             readPreferenceSet(xhr.responseText);
             console.log("My Response:" + xhr.responseText);
        }
    };
    xhr.send(null);
   
}

/**
 * Parse Preference Set 
 */
function readPreferenceSets(preferenceSet) {
    var prefrenceSetObject = JSON.parse(preferenceSet);
    
    console.log(prefrenceSetObject.contexts['gpii-default'].preferences);
    //setComponents()
    //textSizeSlider.setValue(prefrenceSetObject.contexts['gpii-default'].preferences["http://registry.gpii.net/common/fontSize"]);
    //textSizeSlider.setValue(50);
    console.log(prefrenceSetObject.contexts['gpii-default'].preferences["http://registry.gpii.net/applications/eu.gpii.olb"].simplifiedUiEnabled);
    
    if (prefrenceSetObject.contexts['gpii-default'].preferences["http://registry.gpii.net/applications/eu.gpii.olb"].simplifiedUiEnabled == true) {
        loadUI(true);
    } else {
        loadUI(false);
    }
}

/**
 * Load UI: Switch between simplified UI or default UI. 
 */
function loadUIs(simplified) {
    console.log("Load new UI");
    //console.log(parent.document.URL);
    //console.log(parent.window.location.href);
    if(simplified) {
        // if current website is NOT simplified ui then load it
        // if (parent.document.URL != "http://mario-ui.gpii.eu") {
            // parent.window.location.href = "http://mario-ui.gpii.eu";
        // }
        if (parent.document.URL != "file:///C:/xampp/htdocs/Aptana%20Studio%203%20Workspace/ASpanel/simplyfied_index.html") {
            parent.window.location.href = "file:///C:/xampp/htdocs/Aptana%20Studio%203%20Workspace/ASpanel/simplyfied_index.html";
        }
    } else {
        // if current website is NOT default ui then load it
        if (parent.document.URL != "file:///C:/xampp/htdocs/Aptana%20Studio%203%20Workspace/ASpanel/index.html") {
            parent.window.location.href = "file:///C:/xampp/htdocs/Aptana%20Studio%203%20Workspace/ASpanel/index.html";
        }
    }
    
}






