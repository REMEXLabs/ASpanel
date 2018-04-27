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
/*
  URCLightController class

  This class defines the sign-language and URC controller.
  It does:
  - check if a UIPanel exists
  - if so, get the settings
  - check if there exist markers for sign-language content
  - query the urc-light servers to receive appropriate content
  - insert the content and set the javascript handlers to display the content

  Author: Florian Roeser
  Created: 2 June 2013
*/



/*
 * TODO: beinhaltet alle todos
 *
 * 1. laden von language, interpreterType und interpreterName im Fluid Panel
 * 2. "markers" (class attribute "urcl-label" und dazugehoerige id's) auch im fluid panel (UIPanelConnector.js) verfuegbar machen 
 * 
 *
 *
 * - von Panel Settings abfragen
 * - Ev, bei zu wenig Ergebnissen, die Anfrage erneut stellen, diesmal unspezifischer
 */

var isUIPanel = 		false;
var settings = 			{};

// ist es moeglich diese variable als globale variable zugaenglich zu machen??
// - also cookie setzen? das dann aus dem anderen js ausgelesen werden kann.
var markers = 			new Array();  
var videos = 			new Array();
var interpreters = 		{};
var fluidCookie;
var markerCookie;
var walkThroughCounter	= 0;

// test data //debug
var zahl =				1;
var typenr = 			1;

var cookie_function_filepath = '../../../../js/jquery-cookie-master/jquery.cookie.js';


var URCLightController = {

	/*
	 * trigger the UCLightController.
	 * - search for urcl-label tags
	 * - search for UIPanel options
	 * - query URCLight server for content
	 * - insert sign-language content into the site
	 */
	run : function() {
		
		// COMMENT: 
		// restructure, so that the search can be done in a loop
		// - check the more specific, and if no results, than less specific settings
		// 		
		
		// get UI-Panel Settings
		// 
		if(existsUIPanel()) 
		{
			settings = getUserSettings();
		}
		// if no UI-Panel, define default settings
		else  
		{
			settings = setDefaultSettings();
		}
		
		// query for sign-language markers and collect corresponding ID's
		// search for the class-attribute: "urcl-label" which defines sign-language content
		//
		if(markers.length == 0) {getMarkers();}

		// if there are still no markers,
		// return immediately
		if(markers.length == 0) {return;}
		
		
		// COMMENT: needs to be more generic ?!
		// for each marker define the settings and search for URCLight results
		for(var i=0; i<markers.length; i++) {
			URCLight.setSettings(settings, markers[i]);
			URCLight.createQuery();
			URCLight.search();
		}
	},


	// TODO:
	// update function
	// this function can be called by the UI-Panel if settings have changed.
	update : function () {
		// delete existing markers
		// 
		//location.reload();
		this.run();
	}
};




// internal functions
function existsUIPanel() {
	// console.log("existsUIPanel()");
	// UIPanelConnector.setUIPanelSettings();
    // should read settings from UI-Panel.
	// since there is a conflict, read settings manually from the cookie
	//
	//fluidCookie = $.parseJSON($.cookie('fluid-ui-settings'));
	fluidCookie = null;
	// console.log("fluid Cookie:");
	// console.log(fluidCookie);
	
	settings = setDefaultSettings();
	var tmp;
	if(fluidCookie != null && 
			fluidCookie.signlanguageLanguage != undefined) {
		tmp = fluidCookie.signlanguageLanguage;
		//console.log("Temp");
		//console.log(tmp);
		 // check for language settings
		
		// if (tmp.toLowerCase().indexOf("asl") >= 0) {
			// settings.language = 'asl';
		// } else if(tmp.toLowerCase().indexOf("gsg") >= 0) {
			// settings.language = 'gsg';
		// } else if(tmp.toLowerCase().indexOf("ils") >= 0) {
			// settings.language = 'ils';
		// } else {
			// settings.language = null;
		// }
 		
		// check for language settings
		//
		if (tmp.toLowerCase().indexOf("american sign language (asl)") >= 0) {
			settings.language = 'ase';
		} else if(tmp.toLowerCase().indexOf("deutsche gebärdensprache (dgs)") >= 0) {
			settings.language = 'gsg';
		} else if(tmp.toLowerCase().indexOf("international sign (is)") >= 0) {
			settings.language = 'ils';
		} else {
			settings.language = null;
		}
		
		
		// check for interpreterType
		//
		tmp = '';
		tmp = fluidCookie.interpreterType;
		
		if (tmp != undefined && tmp.toLowerCase() != 'default' && tmp != ' ') {
			settings.characterType = tmp;
		} else {
			settings.characterType = null;
		}
		
		
		tmp = '';
		tmp = fluidCookie.interpreterName;
		if (tmp != undefined && tmp.toLowerCase() != 'default') {
			settings.characterName = tmp;
		} else {
			settings.characterName = null;
		}


		// set isUIPanel to true
		// isUIPanel = true;


	} else {
		settings.characterName = null;
		settings.language = null;
		settings.characterType = null;

		// isUIPanel = false;
	}
	


	// TODO:
	// muss entfernt werden, wenn das Cookie korrekt im UIPanel gesetzt wird!!
	// traegt vorlauefig default Werte ein, falls die Werte null sind
	//
	if(settings.language == null) {
		settings.language = 'ase';
	} 
	
	// check for browser settings
	//
	// mimeType
	if($.browser.webkit ||
			$.browser.opera ||
			$.browser.msie) {
		settings.mimeType = 'video/mp4';
	} else if($.browser.mozilla) {
		settings.mimeType = 'video/webm';
	}
	
	// resolution
	// 
	var w,h;
	w = $(window).width();
	h = $(window).height();
	
	if(w > 1700 && h > 720) {
		settings.resolution = 'high';
	} else if(w < 700 || h < 420) {
		settings.resolution = 'low';
	} else {
		settings.resolution = 'medium';
	}
	
	console.log("settings");
	console.log(settings);
	
	return false;
};


// if panel is not available, then return a set of default settings
//
function setDefaultSettings() {
	return UIPanelSettings;
};


// check the ui-panel for user-specified settings
// 
function getUserSettings() {
	return setUIPanelSettings();
};


// dynamically load javascript file
function loadJS(src, callback) {
    var s = document.createElement('script');
    s.setAttribute("type","text/javascript");
    s.src = src;
    s.async = true;
    s.onreadystatechange = s.onload = function() {
        var state = s.readyState;
        if (!callback.done && (!state || /loaded|complete/.test(state))) {
            callback.done = true;
            callback();
        }
    };
    document.getElementsByTagName('head')[0].appendChild(s);
};


// get the absolute site path
function getAbsolutePath() {
    var loc = window.location;
    var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
    return loc.href.substring(0, loc.href.length - ((loc.pathname + loc.search + loc.hash).length - pathName.length));
}


// go through the site and find elements with the "urcl-label" class

function getMarkers() {

	// check if markers array is already filled
	//
	if(markers.length > 0) {return;}

	var counter = 0;
	$(".urcl-label").each(function() {
		markers[counter] = $(this).attr('id');
		counter++;
		// console.log(markers[counter]);
	});
	// console.log("markers");
	// console.log(markers);

	if(markers.length <= 0) {
		// console.log('no markers found!');
		markers = [];
	}

	// don't need to read the cookie here, 
	// since it has to be overwritten at any page!
	var markerObject = {};
	markerObject["markers"] = markers;
	var c = JSON.stringify(markerObject);
	$.cookie('sign-language-markers', c, {path:'/'});
};


// provide available languages, names and character-types for the ui-panel
//

//Rename later on
function getAvailableCharacterNamesneu(settings, callback){
	// reset counter, otherwise the loader will stop immediately
	resetWalkthroughCounter();
	// load names
	getAvailableValues(settings, callback, 'name');
};


/* 
function getAvailableCharacterNames(settings, callback){
	getAvailableValues(settings, callback, 'name');
};*/

//Test data; Delete later on
function getAvailableCharacterNames(){
	
	if(zahl==1){
		//init
		var names = new Array();
		names[0] = "Maria";
		names[1] = "Mona";
		names[2] = "Tony";
		
		zahl++;
		return names;
	}
	else{
		//changes
		var names = new Array();
		names[0] = "Feldmann";
		zahl++;
		return names;
	}
	
};


function getAvailableCharacterTypes(){
	
	if(typenr==1){
		//init
		var names = new Array();
		names[0] = "avatar";
		names[1] = "test_type";
			
		typenr++;
		return names;
	}
	else{
		//changes
		var names = new Array();
		names[0] = "human";
		typenr++;
		return names;
	}
	
};



function getAvailableCharacterTypesneu(settings, callbackCharTypesNeu){
	// reset counter, otherwise the loader will stop immediately
	resetWalkthroughCounter();
	// load types
	getAvailableValues(settings, callbackCharTypesNeu, 'type');
};


function getAvailableLanguagesneu(settings, callback){

	// check if cookie-function exists
	if(typeof $.cookie != 'function') {
		console.log('cookie-function does not exist! Load jQuery cookie master');

		// define callback
		//
		callbackLangNeu = function() {
			getAvailableValues(settings, callback, 'lang');
		}

		// first load cookie-funciton, then call the callback method
		//
  		loadJS(cookie_function_filepath, callbackLangNeu);

	} else {
		getAvailableValues(settings, callback, 'lang');
	}
};


//test data; delete later on
function getAvailableLanguages(){
	var signlanguage = new Array();

	// TODO: Get dynamically
	//
	signlanguage[0] = "american sign language";
	signlanguage[1] = "german sign language";
	signlanguage[2] = "international sign language";
	return signlanguage;
};


function getAvailableValues(settings, callback, value) {
	
	// console.log("getAvailableCharacterNamesneu(settings, callback)");
	// console.log("Settings: ");
	// console.log(settings);
	// console.log("callback:");
	// console.log(typeof callback);
	// console.log("value:");
	// console.log(value);
	// console.log(walkThroughCounter);

	if(walkThroughCounter > 2) {
		// console.log("walkThroughCounter > 2: return");
		return false;
	}
	walkThroughCounter++;


	// can't access the rest of the site, because it's loaded inside a separate html-file
	var markerObject = $.parseJSON($.cookie('sign-language-markers')); 

	console.log(markerObject);
	if(markerObject == null) {
	  	// console.log("Empty marker cookie.");
	  	return;
	} 

    var markers = markerObject.markers;
	
	// if empty
	if (!markers[0]) return;

	//var label = marker[0];
	var label =  markers[0];
	
	if(label !=  null) {
		// console.log("search for values: ");
		// console.log(value);
		URCLight.setSettings(settings, label);
		URCLight.createQuery();
		URCLight.searchInterpreters(callback, value);
	} else {
		console.log("found no markers!");
	}
};

// default settings
//
var UIPanelSettings = {
		
		// the set values are the default values
		// required settings
		resolution		: "medium", 	// low, medium, high
		characterType	: null,		// human, avatar
		characterName	: null,
		language		: "ase",		// dsl, ase...
		mimeType		: "video/mp4",	// video/mp4, video/webm, ...
};

// reset counter
//
function resetWalkthroughCounter() {
	walkThroughCounter = 0;
}












//*********************************************************************************
// URCLight Handler

var URCLight = {
		
	// variable-declaration
	serveruri : "",
	urclClass : "",
	urclMode : "",
	urclEltRef : "",
	type : "",
	subtype : "",
	mimeType : "",
	slanguage : "",
	resolution : "",
	includesAudio : "",
	interpreterName : "",
	interpreterType : "",
	results : "",
	playAudio : false,  // currently not used
	
	get : "",
	searchResults : new Array(),
	
	/*
	 * initialize and set the required settings to create a query and perform a search
	 * at the URCLight server.
	 * 
	 */
	setSettings : function(settings, elementId) {
		
//		console.log("Settings: ");
//		console.log(settings);
		
		this.serveruri			= "res.openurc.org:8080/";
		
		// fixed values, specific for sign-language videos
		//
		this.urclClass 			= new Array();
		this.urclClass[0]		= 'http://openurc.org/ns/res#urclClass';
		this.urclClass[1]		= "urcl-label";
		
		this.urclMode			= new Array();
		this.urclMode[0]		= 'http://openurc.org/ns/res#urclMode';
		this.urclMode[1]		= "extend";
		
		this.type				= new Array();
		this.type[0]			= 'http://openurc.org/ns/res#type';
		this.type[1]			= "http://openurc.org/restypes#video";

		this.subtype			= new Array();
		this.subtype[0]			= 'http://openurc.org/ns/res#subtype';
		this.subtype[1]			= "http://openurc.org/restypes#signLanguageVideo";

		// dynamic values
		// 
		this.urclEltRef			= new Array();
		this.urclEltRef[0]		= 'http://openurc.org/ns/res#urclEltRef';
		this.urclEltRef[1]		= "http://hdm-stuttgart.de/cloud4all/banking/transition.html#" + elementId;
	
		this.mimeType			= new Array();
		this.mimeType[0]		= 'http://openurc.org/ns/res#mimeType';
		this.mimeType[1]		= settings.mimeType;
	
		this.slanguage			= new Array();
		this.slanguage[0]		= "http://purl.org/dc/elements/1.1/language";
		this.slanguage[1]		= settings.language;
		
		this.resolution			= new Array();
		this.resolution[0]		= "http://openurc.org/ns/res#resolution";
		this.resolution[1]		= settings.resolution;
	
//		this.includesAudio		= new Array();
//		this.includesAudio[0]	= "http://openurc.org/ns/res#includesAudio";
//		this.includesAudio[1]	= settings.playAudio;
	
		this.interpreterName	= new Array();
		this.interpreterName[0]	= "http://openurc.org/ns/res#interpreterName";
		this.interpreterName[1]	= settings.characterName;
		
		this.interpreterType	= new Array();
		this.interpreterType[0]	= "http://openurc.org/ns/res#interpreterType";
		this.interpreterType[1]	= settings.characterType;
		
		// *************************
		// for future versions
		// add playAudio option
		// *************************
	},
	
	/*
	 * Create the actual URCLight search query
	 */
	createQuery : function() {
		
		this.get = "";
		this.get += this.urclClass[0] + "=" + this.urclClass[1]
			+ "&" + this.urclMode[0] + "=" + this.urclMode[1]
		 	+ "&" + this.urclEltRef[0] + "=" + this.urclEltRef[1]
			+ "&" + this.type[0] + "=" + this.type[1] + 
			"&" + this.subtype[0] + "=" + this.subtype[1]
			;
		
		if(this.mimeType[1] != null && 
				this.mimeType[1] != '' &&
				this.mimeType[1] != ' ') {
			this.get += "&" + this.mimeType[0] + "=" + this.mimeType[1];
		}
		
		if(this.resolution[1] != null &&
				this.resolution[1] != '' &&
				this.resolution[1] != ' ') {
			this.get += "&" + this.resolution[0] + "=" + this.resolution[1];
		}
		
		if(this.slanguage[1] != null &&
				this.slanguage[1] != '' &&
				this.slanguage[1] != ' ') {
			this.get += "&" + this.slanguage[0] + "=" + this.slanguage[1];
		}
		
		if(this.interpreterType[1] != null &&
				this.interpreterType[1] != '' &&
				this.interpreterType[1] != ' ') {
			this.get += "&" + this.interpreterType[0] + "=" + this.interpreterType[1];
		}
			
		if(this.interpreterName[1] != null &&
				this.interpreterName[1] != '' &&
				this.interpreterName[1] != ' ') {
			this.get += "&" + this.interpreterName[0] + "=" + this.interpreterName[1];
		}
	},
	
	
	/*
	 * perfrom a URCLight server request and trigger the complete-response
	 */
	search : function() {
		
		// using the proxy
		var uri = "http://" + this.serveruri + "query?" + this.get;
		console.log(uri);
		// Comment: $.ajax() already urlencodes the url!
		//
		$.ajax({
			// TODO: 
			//remove /Workspace_Innovationproject_online_banking
			//
            url   : "/URCLightProxy.php/",
			data		: {mode: "native",
						   url : uri},
			dataType	: "xml",
			// beforeSend	: function(jqXHR, settings) {
			// 	console.log("<li>Starting request at " + settings.url + "</li>");
			// },
			success		: function(data) {
				URCLight.parseURCXMLResponse(data);
			},
			error		: function(err) {
				console.log("Error retreiving Data from URCLight Server");
			},
		});
	},
	
	
	// response to panel
	// search with given UI-Panel Settings for available interpretertype and names
	//
	searchInterpreters : function(callback, searchFor) {

		console.log("search for values: ");
		console.log(searchFor);
		// make request for first urcl-label declared element
		//
		// remove language settings
		// 
		if(searchFor == 'lang') {
			this.slanguage[1] = null;
			this.interpreterName[1] = null;
			this.interpreterType[1] = null;
		} else if(searchFor == 'type') {
			this.interpreterName[1] = null;
			this.interpreterType[1] = null;
		} else if(searchFor == 'name') {
			this.interpreterName[1] = null;
		}
		this.createQuery();
		
//		console.log("Query:");
//		console.log(this.get);

		/*
		to compare:
		failed = 
		http://res.openurc.org/query?http://openurc.org/ns/res#urclClass=urcl-label&http://openurc.org/ns/res#urclMode=extend&http://openurc.org/ns/res#urclEltRef=http://hdm-stuttgart.de/cloud4all/banking/transition.html#receiver&http://openurc.org/ns/res#type=http://openurc.org/restypes#video&http://openurc.org/ns/res#subtype=http://openurc.org/restypes#signLanguageVideo&http://openurc.org/ns/res#mimeType=video/webm&http://openurc.org/ns/res#resolution=high
		OK =
		http://res.openurc.org/query?http://openurc.org/ns/res#urclClass=urcl-label&http://openurc.org/ns/res#urclMode=extend&http://openurc.org/ns/res#urclEltRef=http://hdm-stuttgart.de/cloud4all/banking/transition.html#receiver&http://openurc.org/ns/res#type=http://openurc.org/restypes#video&http://openurc.org/ns/res#subtype=http://openurc.org/restypes#signLanguageVideo&http://openurc.org/ns/res#mimeType=video/mp4&http://openurc.org/ns/res#resolution=medium&http://purl.org/dc/elements/1.1/language=ase
		*/
		
		// using the proxy
		var uri = "http://" + this.serveruri + "query?" + this.get;

		switch(searchFor) {
			case 'lang':
				$.ajax({
					url 	: "/URCLightProxy.php",
					data 	: {mode: "native",
							   url: uri},
					dataType: "xml",
					success	: function(data) {
						URCLight.parseURCXMLForLanguages(data, callback);
					},
					error 	: function(err) {
						console.log("Error retreiving language-data from URCLight Server");
						// console.log(err);
						var arr = new Array();
						callback(arr);
					},
				});
				break;
			case 'type':
				$.ajax({
					url 	: "/URCLightProxy.php",
					data 	: {mode: "native",
							   url: uri},
					dataType: "xml",
					success	: function(data) {
						URCLight.parseURCXMLForInterpreterTypes(data, callback);
					},
					error 	: function(err) {
						console.log("Error retreiving interpreter-type data from URCLight Server");
						// console.log(err);
						var arr = new Array();
						callback(arr);
					},
				});
				break;
			case 'name':
				$.ajax({
					url 	: "/URCLightProxy.php",
					data 	: {mode: "native",
							   url: uri},
					dataType: "xml",
					success	: function(data) {
						URCLight.parseURCXMLForInterpreterNames(data, callback);
					},
					error 	: function(err) {
						console.log("Error retreiving interpreter-names from URCLight Server");
						// console.log(err);
						var arr = new Array();
						callback(arr);
					},
				});
				break;

		}

		// $.ajax({
		// 	// TODO: 
		// 	//remove /Workspace_Innovationproject_online_banking
		// 	//
  //           url   : "/URCLightProxy.php/",
		// 	data		: {mode: "native",
		// 				   url : uri},
		// 	dataType	: "xml",
		// 	success		: function(data) {
		// 		switch (searchFor) {
		// 		case 'lang':
		// 			URCLight.parseURCXMLForLanguages(data, callback);
		// 			break;
				
		// 		case 'type':
		// 			URCLight.parseURCXMLForInterpreterTypes(data, callback);
		// 			break;
				
		// 		case 'name':
		// 			console.log('    searchInterpreterNames() -> got results!!! start parsing.');
		// 			URCLight.parseURCXMLForInterpreterNames(data, callback);
		// 			break;
					
		// 		default:
		// 			break;
		// 		}
		// 		//URCLight.parseURCXMLForInterpreter(data);
		// 	},
		// 	beforeSend	: function(jqXHR, settings) {
		// 		console.log("<li>Starting request at " + uri + "</li>");
		// 		console.log('setting:');
		// 		console.log(settings);
		// 		console.log('jqXHR');
		// 		console.log(jqXHR);
		// 	},
		// 	error		: function(err) {
		// 		console.log("Error retreiving Data from URCLight Server");
		// 		console.log(err);
		// 		var arr = new Array();
		// 		callback(arr);
		// 	},
		// });
	},
	
	
	parseURCXMLForLanguages : function(xml, cb_) {
		
		console.log("got results for language-search");

		var lang = new Array();
	
		// find element-reference-id (eltRefId)
		// 
		if(!$(xml).find("resource:first").length) {
			console.log("No resource found!");
			return;
		} 
		
		// console.log(xml);
		
		// parse for interpreters
		$(xml).find("resource").each(
			function() 
			{	
				// search for languages from rescource and asign it to lang[]
				var l = $(this).find("prop[name='http://purl.org/dc/elements/1.1/language']").attr("val");
				
				// check if language already exists
				// 
				var exists = false;
				if(lang.length != 0) {
					for(var i=0; i<lang.length; i++) {
						if(lang[i] == l) exists = true;
					}
					if(!exists) {
						lang[lang.length] = l;
					}
				} 
				else 
				{
					lang[lang.length] = l;
				}
			}
		);

		console.log('found languages:');
		console.log(lang);
		
		
		// // #### SET SIGNLANGUAGE LABELS IN TOOLBAR ####//
// 		
		// lang[0] = "American Sign Language";
		// lang[1] = "German Sign Language";
		// lang[2] = "International Sign";
		
		// return
		
		if(cb_ != undefined && typeof cb_ == 'function') {
			cb_(lang);
		} else {
			console.log("ERROR: callback undefined or not a function!");
		}
	},
	
	parseURCXMLForInterpreterTypes : function(xml, cb_) {
		var types = new Array();
		
		// check for results
		if(!$(xml).find("resource:first").length) {
			console.log("No resource found!");
			return;
		} 
		
		// parse for interpretertypes
		$(xml).find("resource").each(
			function() 
			{
				var t = $(this).find("prop[name='http://openurc.org/ns/res#interpreterType']").attr("val");
				
				// check if language already exists
				// 
				var exists = false;
				if(types.length != 0) {
					for(var i=0; i<types.length; i++) {
						if(types[i] == t) exists = true;
					}
					if(!exists) {
						types[types.length] = t;}
				} else {
					types[types.length] = t;}
			}
		);
		
		if(cb_ != undefined && typeof cb_ == 'function') {
			cb_(types);
		} else {console.log("ERROR: callback() undefined or not a function!");}
	},
	
	parseURCXMLForInterpreterNames : function(xml, cb_) {
		
		console.log("parse response for interpreter names.");
		
		var names = new Array;
		
		// check for results
		if(!$(xml).find("resource:first").length) {
			console.log("No resource found!");
			cb_(names);
			return;
		} 
		
		// parse for interpreternames
		$(xml).find("resource").each(
			function() 
			{
				var t = $(this).find("prop[name='http://openurc.org/ns/res#interpreterName']").attr("val");
				
				// check if language already exists
				// 
				var exists = false;
				if(names.length != 0) {
					for(var i=0; i<names.length; i++) {
						if(names[i] == t) exists = true;
					}
					if(!exists) {
						names[names.length] = t;}
				} else {
					names[names.length] = t;}
			}
		);
		
		if(cb_ != undefined && typeof cb_ == 'function') {
			cb_(names);
		} else {console.log("ERROR: callback() undefined or not a function!");}
	},
	
	
	// parse the response and store as json-object
	// 
	parseURCXMLResponse	: function(xml) {
		
		// find element-reference-id (eltRefId)
		// 
		console.log(xml);
		console.log("parse XML response");
		if(!$(xml).find("resource:first").length) {
			console.log("No resource found!:");
			return;
		}
		
		// check if characterType is set
		// 
		
		eltRef = $(xml).find("resource:first")
							.find("prop[name='http://openurc.org/ns/res#urclEltRef']")
							.attr("val");
		eltRef = eltRef.split('#', 2);
		if(eltRef == undefined || eltRef.length <= 1) return;
		var elementId = eltRef[1];
		
		// TODO:
		// check how many results are there,
		// if there are more than one, then try to choose according to
		// interpreterName and interpreterType
		//
		
		// insert into videos-variable
		//
		var vName = $(xml).find("resource:first")
						.find("prop[name='http://openurc.org/ns/res#filename']")
						.attr("val");
		vName = vName.split(".");
		vName = vName[0];
		
		var elUrl = $(xml).find("resource:first")
						.find("globalAt")
						.text();


		// ATTENTION:
		// small fix for wrong "HTTPS" and/or ":9443" urls
		elUrl = elUrl.replace(/^https:\/\//i, 'http://').replace(/:9443\//, ':8080/');


		var l = videos.length;
		videos[l] = { id : vName, uri : elUrl};


		
		// insert anchor element into the site
		//
		console.log("Sign-language videos initialized");
		console.log(videos);
		
		var a = $('<a />').attr({
			class 	: 'videoSelection urclSignLanguageVideo',
			id		: vName,
		});
		console.log("add button: ");
		console.log(elementId);
		$('#'+elementId).find('input').after(a);
		
		// trigger video.js functions
		handleSignLanguageButtons();
	},
	
	
	// insert the signLanguageLink and Button after the <insert ... /> tag.
	insertSignLanguageButton : function(eltRef, videoId) {
		
	},
	
	
	// for Development
	// return mock data if the URCLight Server is not available
	mockURCLData	:	function() {
		return '<response><resource about="http://res.openurc.org/retrieve?name=http%3A%2F%2Fhdm-stuttgart.de%2Fcloud4all%2FBanking%2FReceiver_Mona_pro_medium.mp4&amp;modified=2013-06-14T11:33:10.0Z"><globalAt>http://res.openurc.org/retrieve?name=http%3A%2F%2Fhdm-stuttgart.de%2Fcloud4all%2FBanking%2FReceiver_Mona_pro_medium.mp4&amp;modified=2013-06-14T11:33:10.0Z</globalAt><prop name="http://openurc.org/ns/res#name" val="http://hdm-stuttgart.de/cloud4all/Banking/Receiver_Mona_pro_medium.mp4"></prop><prop name="http://purl.org/dc/elements/1.1/publisher" val="http://hdm-stuttgart.de/sm136"></prop><prop name="http://purl.org/dc/terms/modified" val="2013-06-14T11:33:10.0Z"></prop><prop name="http://openurc.org/ns/res#type" val="http://openurc.org/restypes#video"></prop><prop name="http://openurc.org/ns/res#interpreterName" val="Mona-Pro"></prop><prop name="http://openurc.org/ns/res#includesAudio" val="false"></prop><prop name="http://openurc.org/ns/res#interpreterType" val="avatar"></prop><prop name="http://openurc.org/ns/res#subtype" val="http://openurc.org/restypes#signLanguageVideo"></prop><prop name="http://openurc.org/ns/res#filename" val="Receiver_Mona_pro_medium.mp4"></prop><prop name="http://purl.org/dc/elements/1.1/language" val="ase"></prop><prop name="http://openurc.org/ns/res#resolution" val="medium"></prop><prop name="http://openurc.org/ns/res#urclEltRef" val="http://hdm-stuttgart.de/cloud4all/banking/transition.html#receiver"></prop><prop name="http://openurc.org/ns/res#mimeType" val="video/mp4"></prop><prop name="http://openurc.org/ns/res#width" val="320"></prop><prop name="http://openurc.org/ns/res#height" val="240"></prop><prop name="http://openurc.org/ns/res#urclMode" val="extend"></prop><prop name="http://openurc.org/ns/res#urclClass" val="urcl-label"></prop><prop name="http://openurc.org/ns/res#publisherUri" val="http://hdm-stuttgart.de/sm136"></prop><prop name="http://purl.org/dc/elements/1.1/title" val="ASL video explaining the receiver input field (avatar Mona-Pro)"></prop></resource><resource about="http://res.openurc.org/retrieve?name=http%3A%2F%2Fhdm-stuttgart.de%2Fcloud4all%2FBanking%2FReceiver_Mona_pro_medium_Audio.mp4&amp;modified=2013-06-14T09:41:53.0Z"><globalAt>http://res.openurc.org/retrieve?name=http%3A%2F%2Fhdm-stuttgart.de%2Fcloud4all%2FBanking%2FReceiver_Mona_pro_medium_Audio.mp4&amp;modified=2013-06-14T09:41:53.0Z</globalAt><prop name="http://openurc.org/ns/res#name" val="http://hdm-stuttgart.de/cloud4all/Banking/Receiver_Mona_pro_medium_Audio.mp4"></prop><prop name="http://purl.org/dc/elements/1.1/publisher" val="http://hdm-stuttgart.de/sm136"></prop><prop name="http://purl.org/dc/terms/modified" val="2013-06-14T09:41:53.0Z"></prop><prop name="http://openurc.org/ns/res#type" val="http://openurc.org/restypes#video"></prop><prop name="http://openurc.org/ns/res#interpreterName" val="Mona-Pro"></prop><prop name="http://openurc.org/ns/res#includesAudio" val="true"></prop><prop name="http://openurc.org/ns/res#interpreterType" val="avatar"></prop><prop name="http://openurc.org/ns/res#subtype" val="http://openurc.org/restypes#signLanguageVideo"></prop><prop name="http://openurc.org/ns/res#filename" val="Receiver_Mona_pro_medium_Audio.mp4"></prop><prop name="http://purl.org/dc/elements/1.1/language" val="ase"></prop><prop name="http://openurc.org/ns/res#resolution" val="medium"></prop><prop name="http://openurc.org/ns/res#urclEltRef" val="http://hdm-stuttgart.de/cloud4all/banking/transition.html#receiver"></prop><prop name="http://openurc.org/ns/res#mimeType" val="video/mp4"></prop><prop name="http://openurc.org/ns/res#width" val="320"></prop><prop name="http://openurc.org/ns/res#height" val="240"></prop><prop name="http://purl.org/dc/elements/1.1/title" val="ASL video explaining the receiver input field (avatar Mona-Pro)"></prop><prop name="http://openurc.org/ns/res#urclMode" val="extend"></prop><prop name="http://openurc.org/ns/res#urclClass" val="urcl-label"></prop><prop name="http://openurc.org/ns/res#publisherUri" val="http://hdm-stuttgart.de/sm136"></prop></resource></response>';
	}
	
}; 


//
////Limit scope pollution from any deprecated API
//(function() {
//
//    var matched, browser;
//
//// Use of jQuery.browser is frowned upon.
//// More details: http://api.jquery.com/jQuery.browser
//// jQuery.uaMatch maintained for back-compat
//    jQuery.uaMatch = function( ua ) {
//        ua = ua.toLowerCase();
//
//        var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
//            /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
//            /(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
//            /(msie) ([\w.]+)/.exec( ua ) ||
//            ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
//            [];
//
//        return {
//            browser: match[ 1 ] || "",
//            version: match[ 2 ] || "0"
//        };
//    };
//
//    matched = jQuery.uaMatch( navigator.userAgent );
//    browser = {};
//
//    if ( matched.browser ) {
//        browser[ matched.browser ] = true;
//        browser.version = matched.version;
//    }
//
//// Chrome is Webkit, but Webkit is also Safari.
//    if ( browser.chrome ) {
//        browser.webkit = true;
//    } else if ( browser.webkit ) {
//        browser.safari = true;
//    }
//
//    jQuery.browser = browser;
//
//    jQuery.sub = function() {
//        function jQuerySub( selector, context ) {
//            return new jQuerySub.fn.init( selector, context );
//        }
//        jQuery.extend( true, jQuerySub, this );
//        jQuerySub.superclass = this;
//        jQuerySub.fn = jQuerySub.prototype = this();
//        jQuerySub.fn.constructor = jQuerySub;
//        jQuerySub.sub = this.sub;
//        jQuerySub.fn.init = function init( selector, context ) {
//            if ( context && context instanceof jQuery && !(context instanceof jQuerySub) ) {
//                context = jQuerySub( context );
//            }
//
//            return jQuery.fn.init.call( this, selector, context, rootjQuerySub );
//        };
//        jQuerySub.fn.init.prototype = jQuerySub.fn;
//        var rootjQuerySub = jQuerySub(document);
//        return jQuerySub;
//    };
//
//})();

