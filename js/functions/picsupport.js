/*
 * Copyright 2015 Hochschule der Medien (HdM) / Stuttgart Media Universit (Annabell Schmidt, Patrick Muenster)
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

/**
 * activates or deactivates the pictogram support
 * @param {string} value 
 */

function activatePicsupport(value) {
	if (value == "on") {
		console.log("Picsupport activated");
	} else if (value == "off") {
		console.log("Picsupport deactivated");

	}
}

function setPicsupport(value){
	if (value == true) {
		console.log("Picsupport activated");
	} else  {
		console.log("Picsupport deactivated");

	}
}

