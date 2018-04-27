/*
 Copyright 2015–2018 Hochschule der Medien (HdM) / Stuttgart Media University
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

  https://github.com/REMEXLabs/ASpanel/blob/master/License.txt

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/


/**
 * @author Annabell Schmidt
 */

/**
 * creates or deletes the table of contents depending on the value of the parameter show
 * uses the jQuery plugin tableOfContents from https://github.com/dcneiner/TableOfContents/tree/master
 * @param {bool} show		switch for showing/deleting the toc
 */
function showTableOfContents(show) {
	if (show) {
		$('#toc-container ul').tableOfContents();
		$('#toc-container').removeClass('hidden');

	} else {
		$('#toc-container').addClass('hidden');
		$('#toc-container ul').text('');
	}
}

