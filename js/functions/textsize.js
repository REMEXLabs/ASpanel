/*
 * Copyright 2015 Hochschule der Medien (HdM) / Stuttgart Media University (Annabell Schmidt, Patrick Muenster)
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
 * @author Annabell Schmidt
 */

/**
 * changes the text size according to the parameter multiplier
 * @param {number} multiplier	multiplier between 1 and 2 with which the text size is multiplied
 */
function changeTextSize(multiplier) {
	var newTextSize = parseFloat(1 * multiplier) + 'em';
	$('body').css('font-size', newTextSize);
}

function resetTextSize(multiplier) {
	var newTextSize = parseFloat(1 * multiplier) + 'em';
	$('body').css('font-size', newTextSize);
}

