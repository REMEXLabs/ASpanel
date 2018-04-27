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
 * Create a dialog box for signlanguage videos and sets the path by getting the ASpanel settings
 *
 * @author Patrick Münster
 */

/**
 * Set markers for the sign language videos
 * NOT USED !!!
 */

$("body").append(
    "<div id='dbx_signLanguageVideo'>" +
    "   <video id='signLanguageVideoContainter' poster='https://cnt3.otobet.com/graphics/layout/loading.gif' width='420' height='340'>" +
    "       <source id='signLanguageVideo_source'>" +
    "       Your browser does not support the video tag. " +
    "   </video>" +
    "</div>"
);

function setSignLanguageMarker() {

    console.log("set marker");
    if (document.getElementById("edit-field-empf-nger") !== null) {
        var d = document.getElementById("edit-field-empf-nger");
        d.className = d.className + " urcl-label";
        d.id = "receiver";

        d = document.getElementById("edit-field-kontonummer");
        d.className = d.className + " urcl-label";
        d.id = "accountNumber";

        d = document.getElementById("edit-field-bankleitzahl");
        d.className = d.className + " urcl-label";
        d.id = "bankCode";

        d = document.getElementById("edit-field-betrag");
        d.className = d.className + " urcl-label";
        d.id = "transferAmount";

        d = document.getElementById("edit-field-tan");
        d.className = d.className + " urcl-label";
        d.id = "tan";
    }
}

var slSettings = {
    Language: "",
    InterpreterType: "human",
    InterpreterName: "",
    Content: ""
};


/**
 * defines jquery ui widget for pop up video
 */
$(document).ready(function () {

    /////////////////////
    //// INIT DIALOG ////
    /////////////////////

    // Init dialog for signlanguage videos
    $('#dbx_signLanguageVideo').dialog({
        closeOnEscape: true,
        autoOpen: false,
        modal: true,
        position: { my: "center", at: "center", of: window },
        resizeable: false,
        draggable: false,
        width: 'auto',
        maxWidth: 600,
        fluid: false,
        close: function (event, ui) {

        },
        open: function (event, ui) {
            // close on click outside 
            $('.ui-widget-overlay').bind('click', function () {
                $("#dbx_signLanguageVideo").dialog('close');
            });
        }
    });

    ////////////////////////
    //// EVENT LISTENER ////
    ////////////////////////

    $("body").on("click", "a.urclSignLanguageVideo", function (event) {

        // Get the topic of the signlanguage video from data attribute of the link.
        var slContent = $(event.target).attr('data-sl_content');
        // Get Video container.
        var video = document.getElementById("signLanguageVideoContainter");
        // Settings from toolbar are sored in slSettings.
        // Set sign language video Content
        slSettings.Content = slContent;

        // Create request string for video
        //var requestURL = createSLVRequestURL(slSettings);
        var requestURL = myURCLightController.createSLVRequest(slSettings);
        //console.log(requestURL);
        //requestURL = "http://res.openurc.org/retrieve?name=http%3A%2F%2Fhdm-stuttgart.de%2Fcloud4all%2FBanking%2FTan_Tony_medium.webm";
        $("#signLanguageVideo_source").attr('src', requestURL);

        video.load();
        video.play();
        $("#dbx_signLanguageVideo").dialog("open");
    });

});


/////////
// OLD //
/////////


/**
 * key values: id[0].uri
 * id: name of video
 * uri: source of video, comes from resource server (http://res.openurc.org/)
 * @type {Array}
 */
var videos = new Array();


/**
 * check anchors for videoLinks
 * handles buttons for sing language videos
 */
function handleSignLanguageButtons() {
    var video = document.getElementById("signLanguageVideoContainter");

    var videoLinks = document.querySelectorAll("a.urclSignLanguageVideo");
    for (var i = 0; i < videoLinks.length; i++) {
        videoLinks[i].onclick = setVideo;
    }
    video.addEventListener("error", errorHandler, false);
}


/**
 * Creates eventlistener to signlanguage buttons
 *
 * open popup for video
 * sets title in header of widget for the current video
 * loads current video
 * plays current video
 */
function setVideo(e) {
    //find div for video
    var video = document.getElementById("signLanguageVideoContainter");

    //open popup for video
    $(function ($) {
        $("a.urclSignLanguageVideo").on("click", function () {

        });
        $("#dbx_signLanguageVideo").dialog("open");

        //$('#dialog').dialog('option', 'position', [$("a.urclSignLanguageVideo").postion().left, 500]);
        //console.log("open videopopup");
        //  $("#dialog").dialog({
        // width: 390,
        // position:{my:"right top", at:"right button"},
        // show:{
        // effect:"blind",
        // duration:500
        // },
        // hide:{
        // effect:"explode",
        // duration:500
        // }
        // });
        //document.getElementsByClassName("ui-dialog")[0].style.display="block";
        //document.getElementById("dialog").style.display="block";

    });

    //find id of pressed video link
    var id = e.target.getAttribute("id");

    for (i = 0; i < videos.length; i++) {
        if (id == videos[i].id) {
            video.src = videos[i].uri;
            currentVideo = videos[i].id;
        }
    }
    //error message if video is not found
    if (video.src == null) {
        // alert("No video found");
        console.log("Video not found. Check if server is down or url is valid.");
    }

    console.log(video);

    $('#dialog').dialog({title: currentVideo});
    video.load();
    video.play();
// 	var vid = $('#signLanguageVideoContainter').get(0);
// 	vid.load();
// 	vid.play();
};

/**
 * sets an image as poster in video element if error occurs
 */
function errorHandler() {
    //  var video = document.getElementById("signLanguageVideoContainter");
//     if (video.error) {
//         video.poster = "../img/errorPoster.jpg"
//         //alert(video.error.code);
//     }
};

// example video link
//http://res.openurc.org/retrieve?name=http%3A%2F%2Fhdm-stuttgart.de%2Fcloud4all%2FBanking%2FTan_Tony_high.mp4&modified=2013-07-05T22:04:02.0Z