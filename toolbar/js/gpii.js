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



//http://localhost:8081/preferences/olb_Alicia_app
//http://localhost:8081/preferences/olb_Lara
//http://localhost:8081/preferences/olb_Carla

var gpiiUser = {
    carla: 'http://localhost:8081/preferences/olb_Carla',
    lara: 'http://localhost:8081/preferences/olb_Lara',
    alicia: 'http://localhost:8081/preferences/olb_Alicia_app'
};


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
function readPreferenceSet(preferenceSet) {
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
 * Load UI: Simplified UI or default UI. 
 */
function loadUI(simplified) {
    
    //console.log(parent.document.URL);
    //console.log(parent.window.location.href);
    if(simplified) {
        // if current website is NOT simplified ui then load it
        if (parent.document.URL != "http://mario-ui.gpii.eu") {
            parent.window.location.href = "http://mario-ui.gpii.eu";
        }
    } else {
        // if current website is NOT default ui then load it
        if (parent.document.URL != "file:///C:/xampp/htdocs/Aptana%20Studio%203%20Workspace/ASpanel2/index.html") {
            parent.window.location.href = "file:///C:/xampp/htdocs/Aptana%20Studio%203%20Workspace/ASpanel2/index.html";
        }
    }
    
}





