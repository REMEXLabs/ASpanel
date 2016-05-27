/**
 * video.js
 * Handle videos
 * it does:
 * - check anchors for video links
 * - open a popup window for playing the video (licence: jquery ui)
 * - match uri of videos to handler
 * - error handling
 *
 * @author Simone Mack
 *
 */





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
 * defines jquery ui widget for pop up video
 */
$(function () {
    
    $('#signLanguageVideoBox').dialog({ 
       autoOpen : false,
       modal : true,
       resizeable : false,
       draggable : false,
       width: 'auto',
       maxWidth: 600,
       fluid: true,
       close : function(event, ui) {           
          
       },
       open: function(event, ui) {
           
       }
    });
    // $("#dialog").dialog({
        // autoOpen:false,
        // width:380,
        // position:{my:"right top", at:"right button"},
        // show:{
            // effect:"blind",
            // duration:500
        // },
        // hide:{
            // effect:"explode",
            // duration:1000
        // }
    // });
});


/**
 * handles event
 * @param e
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
        $("a.urclSignLanguageVideo").click(function () {
	    
	    });
	        $("#dialog").dialog("open");
	        
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

    $('#dialog').dialog({title:currentVideo});
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