var selfVoicingHelper = SelfVoicingHelper.init();
isInitialized = false;
addButtons();
changeButtonsTo("play");

//global variables for the synthetic voice
var markers = [];

//global variables for synchronized text marking
var oriBackCol = [];
var oriBackColInn = [];
var oriBackColPar = [];

//variables for selected text, which should be read out loud and variables to save the changed nodes
var oriNodes = []; 
var spanNodes = [];
var spanText = [];
var changedNodes = [];

var oriSpanNodes = [];
var changedSpanNodes = [];
var innerSpanText = [];
var innerSpanNodes = [];


//variables to save the actual position of the speech output
var speechPos;
var speechTime;
var lastPos;
var wordCount = 0;
var actualPosition;
var actualNode;

//variables to save the actual satus of the speech output
var soundPauses = false;

//variables to add the highlighting to the natural voice
var subsPar = [];
var subsWord = [];
var subsSent = [];
var subs = []

/*********************FUNCTIONS TO CONTROL THE AUDIO************************/

/*********************START, HIGHLIGHT, STOP, PAUSE, RESUME, SKIP FORWARD, SKIP BACKWARD*********************/

/** playSound
 *
 *  Function to start the sound and choose the text for the speech output and
 *    to show the audio controls
 */

function playSound() {
    if (!isInitialized) {
        //get Text for speech output, set spans-tags for sentence and word marking.
        addSpanSent();
        getText();
        addSpanWord();
        getSpanText();
        getBackgroundColours();
        isInitialized = true;
    }

    changeButtonsTo("pause");

    startSyncSpeech(0);

    //show audio controls
    document.getElementById('audio-controls').style.visibility = 'visible';
    document.getElementById('play-audio').style.display = 'none';
    document.getElementById('resume-audio').style.display = 'none';
    document.getElementById('pause-audio').style.display = 'initial';
    document.getElementById('pause-audio').focus();
}


/*	startSyncSpeech
 *
 *	Function to start the synthetic voice speech output
 *
 *	@param position
 *		position from which the speech synthesis shall start
 */
function startSyncSpeech(position) {
    //reset values in case some are still set from earlier speech output
    markers.length = 0;
    var speakOffset = 0;

    //Check if there was a last position to start from, then use it and set the word count to this position (neccessary for synchronized word highlighting).
    //Otherwise use the given start position.
    if (lastPos != null) {
        pos = lastPos;
        for (i = 0; i < subsSent.length; i++) {
            if (i == pos) {
                break;
            }
            else {
                speakOffset = speakOffset + subsSent[i].text.toString().trim().split(' ').length;
            }
        }
        wordCount = speakOffset;
    } else {
        pos = position;
    }
    lastPos = null;


    const lastClickedElement = SelfVoicingHelper.getLastClickedElement();
    let indexOfLastClickedElement = 0;

    for (pos; pos < spanText.length; pos++) {
        for (var i = 0; i < spanNodes.length; ++i) {
            const parent = spanNodes[i].parentElement;
            if (!parent.classList.contains("sv-block")) {
                continue;
            }

            if (spanNodes[i].textContent.replaceAll(" ", "") === spanText[pos].replaceAll(" ", "")) {
                indexOfLastClickedElement = pos;
                SelfVoicingHelper.resetLastClickedElement();
                break;
            }
        }
    }

    lastPos = indexOfLastClickedElement;
    pos = indexOfLastClickedElement;

    var myText = [];
    //create speech synthesis utterances for each sentence of the text and store them in the markers array for later use. Set paramerters of the speech synthesis.
    for (pos; pos < spanText.length; pos++) {
        markers[pos] = new SpeechSynthesisUtterance(spanText[pos]);
        markers[pos].lang = 'de-DE';
        markers[pos].pitch = selfVoicingHelper.getPitchNormalized();
        markers[pos].rate = selfVoicingHelper.getSpeedNormalized();

        //add listener for the actual utterance to be able to use synchronized text highlighting
        markers[pos].onstart = function (event) {

            syncWords(event.utterance, event.name);
            syncSent(event.utterance);
            syncParagraph(event.utterance);
            speechPos = this.text;
            actualPosition = event.utterance;
        }

        markers[pos].onend = function (event) {
            if (spanNodes.length != 0) {
                unSyncText(event.utterance);
            }

        }

        markers[pos].onboundary = function (event) {
            if (event.name == 'word') {
                syncWords(event.utterance, event.name);
                wordCount = wordCount + 1;
            }
        }

        //start the speech output. If the pause button is in use, set audio to pause.
        if (soundPauses) {
            pauseSound();
        }

        window.speechSynthesis.speak(markers[pos]);
    }
}


/** syncWords
 *
 *    Function to add synchronized word highlighting to synthetic voice speech output
 *
 *    @param utt
 *        The actual spoken utterance
 *
 *    @param name
 *        The name of the onboundary event
 */
function syncWords(utt, name) {
    //do only something when the option for synchronized word highlighting is choosen and a word boundary is reached
    if (selfVoicingHelper.getMarking() === "words") {
        if (name == 'word') {

            //get the count of the actual spoken utteracne. Important to be able to choose the matching span on the webpage.
            for (i = 0; i < markers.length; i++) {
                if (markers[i] == utt) {

                    if (selfVoicingHelper.getZoom() === "off") {
                        //highlight the matching span in the by the user selected color. The prevoious highlighted span will be no set back to original color.
                        innerSpanNodes[wordCount].style.backgroundColor = selfVoicingHelper.getColor();
                        if (wordCount > 0) {
                            innerSpanNodes[wordCount - 1].style.backgroundColor = oriBackCol[i];
                        }

                    } else if (selfVoicingHelper.getZoom() === "on") {
                        //get the matching sentence of the actual word and add a span for the actual word. Highlight this span and reset the previous highlighted span in the main text.
                        var box = parent.document.getElementById('boxText');
                        var tx = spanText[i];
                        var name = 'readWord' + wordCount;
                        var myText;

                        if (tx.search(innerSpanText[wordCount - 1] + ' ' + innerSpanText[wordCount]) != -1) {
                            myText = innerSpanText[wordCount - 1] + ' ' + '<span class="' + name + '">' + innerSpanText[wordCount] + '</span>';
                            box.innerHTML = tx.trim().replace(innerSpanText[wordCount - 1] + ' ' + innerSpanText[wordCount].toString().trim(), myText.toString().trim());

                        } else if (tx.search(innerSpanText[wordCount] + ' ' + innerSpanText[wordCount + 1]) != -1) {
                            myText = '<span class="' + name + '">' + innerSpanText[wordCount] + '</span>' + ' ' + innerSpanText[wordCount + 1];
                            box.innerHTML = tx.trim().replace(innerSpanText[wordCount].toString().trim() + ' ' + innerSpanText[wordCount + 1], myText.toString().trim());
                        }

                        var tempSpan = parent.document.getElementsByClassName(name);
                        tempSpan[0].style.backgroundColor = selfVoicingHelper.getColor();

                        if (wordCount > 0) {
                            innerSpanNodes[wordCount - 1].style.backgroundColor = oriBackColInn[i - 1];
                        }
                    }
                }
            }
        }
    }
}


/** syncSent
 *
 *    Function to add synchronized sentence highlighting to synthetic voice speech output
 *
 *    @param utt
 *        The actual spoken utterance
 */

function syncSent(utt) {
    //get the count of the actual spoken utteracne. Important to be able to choose the matching span on the webpage.
    for (i = 0; i < markers.length; i++) {
        if (markers[i] == utt) {
            if (selfVoicingHelper.getZoom() === "off") {
                //highlight the matching span on the webpage
                if (selfVoicingHelper.getMarking() === "sentences") {
                    spanNodes[i].style.backgroundColor = selfVoicingHelper.getColor();
                }
            } else if (selfVoicingHelper.getZoom() === "on") {

                //Get the actual sentence and show it in the large text box.
                var box = parent.document.getElementById('boxText');
                if (selfVoicingHelper.getMarking() === "sentences") {
                    //Highlight this span and reset the previous highlighted span in the main text.
                    var tempSpan;
                    box.innerHTML = '<span id="readNow"+> ' + spanText[i] + '</span>';
                    tempSpan = parent.document.getElementById('readNow');
                    tempSpan.style.backgroundColor = selfVoicingHelper.getColor();
                    ;
                    spanNodes[i].style.backgroundColor = oriBackCol[i];

                } else if (selfVoicingHelper.getMarking() === "off") {
                    box.innerHTML = spanText[i];
                }
            }
        }
    }
}


/** syncSent
 *
 *    Function to add synchronized paragraph highlighting to synthetic voice speech output
 *
 *    @param utt
 *        The actual spoken utterance
 */
function syncParagraph(utt) {
    //get the count of the actual spoken utteracne. Important to be able to choose the matching span on the webpage.
    if (selfVoicingHelper.getMarking() === "paragraphs") {
        for (i = 0; i < markers.length; i++) {
            if (markers[i] == utt) {
                if (selfVoicingHelper.getZoom() === "off") {
                    //highlight the matching paragraph on the webpage
                    actualNode = spanNodes[i].parentNode;
                    spanNodes[i].parentNode.style.backgroundColor = selfVoicingHelper.getColor();
                }
                else if (selfVoicingHelper.getZoom() === "on") {
                    //Get the actual sentence and show it in the large text box. Highlight this span and reset the previous highlighted paragraph in the main text.
                    var box = parent.document.getElementById('boxText');
                    var tempSpan;
                    box.innerHTML = '<span id="readNow"+> ' + spanText[i] + '</span>';
                    tempSpan = parent.document.getElementById('readNow');
                    tempSpan.style.backgroundColor = selfVoicingHelper.getColor();
                    spanNodes[i].parentNode.style.backgroundColor = oriBackCol[i];
                }
            }
        }
    }
}


/** unsyncText
 *
 *    Function to reset previous highlighted spans.
 *
 *    @param utt
 *        The actual spoken utterance
 */

function unSyncText(utt) {
    var tempPos = 0;
    //get the count of the actual spoken utteracne. Important to be able to choose the matching span on the webpage.
    for (i = 0; i < markers.length; i++) {
        if (markers[i] == utt) {
            tempPos = i;
            if (selfVoicingHelper.getMarking() === "sentences") {
                //reset the previous highlighted span
                if (spanNodes[i] != null) {
                    spanNodes[i].style.backgroundColor = oriBackCol[i];
                }
            } else if (selfVoicingHelper.getMarking() === "paragraphs") {
                //reset the previous highlighted paragraph when needed.
                if (i < markers.length - 1) {
                    if (actualNode != spanNodes[i + 1].parentNode) {
                        if (spanNodes[i] != null) {
                            spanNodes[i].parentNode.style.backgroundColor = oriBackCol[i];
                        }
                    }
                }
            }
        }
    }

    //When no more speech utterances are pending and the actual utterance is ended, call the stop function.
    if (window.speechSynthesis.pending == false && tempPos == (markers.length - 1)) {
        stopSound();
    }
}


/** pauseSound
 *
 *    Function to pause the actual spoken speech output.
 *
 */

function pauseSound() {
    window.speechSynthesis.pause();
    soundPauses = true;
    document.getElementById('pause-audio').style.display = 'none';
    document.getElementById('resume-audio').style.display = 'initial';
}

/** resumeSound
 *
 *    Function to resume the actual spoken speech output.
 *
 */

function resumeSound() {
    window.speechSynthesis.resume();
    soundPauses = false;
    document.getElementById('pause-audio').style.display = 'initial';
    document.getElementById('resume-audio').style.display = 'none';
}


/** stopSound
 *
 *    Function to stop the actual spoken audio and to set the position to the beginning of the audio. It also cleans the code from added spans.
 *
 */

function stopSound() {
    cleanCode();
    window.speechSynthesis.cancel();

    document.getElementById('audio-controls').style.visibility = 'hidden';
    document.getElementById('play-audio').style.display = 'initial';
    soundPauses = false;
}


/** spuVo
 *
 *    Function to skip forward in the actual spoken speech output
 *
 */

function spuVo() {
    //Count the spoken words. Important for the synchronized word highlighting.
    //get actual position (utterance), cancel the actual spoken speech output and start the speech output again from one position forward.
    var words = 0;
    for (i = 0; i < spanText.length; i++) {
        words = words + spanText[i].toString().trim().split(' ').length;
        if (speechPos == spanText[i]) {
            if (i < spanText.length - 1) {
                wordCount = words;
                window.speechSynthesis.cancel();
                startSyncSpeech(i + 1);
            }
            break;
        }
    }

    //Reset the color of the last spoken span to the original color.
    for (i = 0; i < innerSpanNodes.length; i++) {
        innerSpanNodes[i].style.backgroundColor = oriBackColInn[i];
    }
    for (i = 0; i < spanNodes.length; i++) {
        spanNodes[i].style.backgroundColor = oriBackCol[i];
    }
    for (i = 0; i < parent.spanNodes.length; i++) {
        spanNodes[i].parentNode.style.backgroundColor = oriBackColPar[i];
    }
}


/** spuRue
 *
 *    Function to skip backward in the actual spoken speech output
 *
 */
function spuRue() {
    //Count the spoken words. Important for the synchronized word highlighting.
    //Get actual position (utterance), cancel the actual spoken speech output and start the speech output again from one position backward.
    var words = 0;
    for (i = 0; i < markers.length; i++) {
        words = words + spanText[i].toString().trim().split(' ').length;
        if (actualPosition == markers[i]) {
            window.speechSynthesis.cancel();
            if (i > 0) {
                wordCount = words - spanText[i].toString().trim().split(' ').length - spanText[i - 1].toString().trim().split(' ').length - 1;
                if (wordCount < 0) {
                    wordCount = 0;
                }
                startSyncSpeech(i - 1);
            } else if (i == 0) {
                wordCount = 0;
                startSyncSpeech(0);
            }
        }
    }
    //Reset the color of the last spoken span to the original color.
    for (i = 0; i < innerSpanNodes.length; i++) {
        innerSpanNodes[i].style.backgroundColor = oriBackColInn[i];
    }
    for (i = 0; i < spanNodes.length; i++) {
        spanNodes[i].style.backgroundColor = oriBackCol[i];
    }
    for (i = 0; i < parent.spanNodes.length; i++) {
        spanNodes[i].parentNode.style.backgroundColor = oriBackColPar[i];
    }
}


/******************CHANGE FUNCTIONS*******************************/

/******************Functions called when settings in ASpanel change*******************************/


/** changeSpeed
 *
 *    @param mySpeed
 *        The decimal number the speed is set to. Can be 0.5, 1.0 and 2.0.
 *
 *    Function to set the reading speed to half speed or double speed.
 */

function changeSpeed(mySpeed) {
    for (i = 0; i < parent.markers.length; i++) {
        parent.markers[i].rate = mySpeed;
    }
}


/** changePitch
 *
 *    @param myPitch
 *        The decimal number the pitch is set to. Can be 0.1, 1.0 and 2.0.
 *
 *    Function to set the pitch of the voice to the input value.
 */
function changePitch(myPitch) {
    //Change pitch for synthetic voice speech output.
    for (i = 0; i < parent.markers.length; i++) {
        parent.markers[i].pitch = myPitch;
    }
}



/** changeTextBox
 *
 *    @param isOn
 *        Srting 'yes' or 'no'.
 *
 *    Function to show or hide the box for large text.
 */
function changeTextBox(isOn) {
    var boxOn;
    if (isOn == 'yes') {
        parent.document.getElementById('boxGroText').style.display = 'initial';
        boxOn = 'true';
    } else if (isOn == 'no') {
        parent.document.getElementById('boxGroText').style.display = 'none';
        boxOn = 'false';
    }
}

/** changeMarks
 *
 *    @param markType
 *        Srting 'no', 'word', 'sentc' or 'par'.
 *
 *    Function to unmark all spans when new mark type is chosen.
 */
function changeMarks(markType) {
    if (parent.innerSpanNodes.length > 0) {
        for (i = 0; i < parent.innerSpanNodes.length; i++) {
            parent.innerSpanNodes[i].style.backgroundColor = parent.oriBackColInn[i];
        }
        for (i = 0; i < parent.spanNodes.length; i++) {
            parent.spanNodes[i].style.backgroundColor = parent.oriBackCol[i];
        }
        for (i = 0; i < parent.spanNodes.length; i++) {
            parent.spanNodes[i].parentNode.style.backgroundColor = parent.oriBackColPar[i];
        }
    }
}


/***************************HELPER FUNCTIONS*****************************************/

/******************Functions used in the methods above*******************************/
/** addSpanSent
 *
 *    Function used to select the text that shall be spoken. It also adds span-tags around all sentences to set the possibility to highlight them.
 */

function addSpanSent() {
    //Get all elements with a tree walker.
    var walker = parent.document.createTreeWalker(
        parent.document.body,
        NodeFilter.SHOW_ELEMENT,
        null,
        false
    );

    //All nodetypes that shall be used
    var node;
    var myNodes = [];
    var text = [];
    var take = {
        "P": 0,
        "H1": 0,
        "H2": 0,
        "H3": 0,
        "H4": 0,
        "LI": 0,
        "TD": 0,
        "TH": 0
    };

    //selected notes that shall not be used.
    var takeNot = {};

    //store all selected nodes in an temporary array.
    while (node = walker.nextNode()) {
        if (!node.classList.contains("sv-ignore")) {
            if (node.nodeName in take) {
                if (!(node.id in takeNot)) {
                    myNodes.push(node);
                }
            }
        }
    }
    //Go through node array. Take inner HTML and set span around each sentence. Save original nodes.
    for (i = 0; i < myNodes.length; i++) {
        if (myNodes[i].nodeName == "P") {
            if (myNodes[i].innerHTML != '' && myNodes[i].innerHTML != ' ') {
                var oriHTML = myNodes[i].innerHTML;
                oriNodes.push(oriHTML);
                changedNodes.push(myNodes[i]);
                var tmp = myNodes[i].innerHTML.toString().trim();
                tmp = tmp.replace(/(\b)|(\f)|(\t)|(\v)|(\r)|(\n)|(\r\n)/g, "");
                tmp = tmp.trim();

                // --- ugly workaround
                var isUrl = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g;
                tmp = tmp.replace(isUrl, function(match) {
                    return match.replace(/\./g, "└(=^‥^=)┐");
                });
                // ugly workaround ---

                var text = tmp.split('.');
                var myText;

                var out = [];
                for (j = 0; j < text.length; j++) {
                    if (text[j] != '') {
                        if (j == text.length - 1) {
                            out.push('<span class="textHighlight">' + text[j] + '</span>');
                        } else {
                            out.push('<span class="textHighlight">' + text[j] + '.' + '</span>');
                        }
                    }
                }
                myText = out.join(' ');

                // --- ugly workaround
                myText = myText.replace(/└\(=\^‥\^=\)┐/g, ".");
                // ugly workaround ---

                var tx = myNodes[i].innerHTML;
                var htmlText = tx.replace(myNodes[i].innerHTML.toString().trim(), myText);
                myNodes[i].innerHTML = htmlText;
            }
        } else {
            if (myNodes[i].textContent != '') {
                var oriHTML = myNodes[i].innerHTML;
                var tx = myNodes[i].innerHTML;
                var out = '<span class="textHighlight">' + tx + '</span>';
                myNodes[i].innerHTML = out;
                oriNodes.push(oriHTML);
                changedNodes.push(myNodes[i]);
            }
        }
    }
}


/** getText
 *
 *    Function used to store all span-Tags that were set before around the sentences in the public spanNodes array. It also stores each sentence as an array entry in the public spanText array.
 */
function getText() {
    spanNodes = parent.document.getElementsByClassName('textHighlight');
    for (i = 0; i < spanNodes.length; i++) {
        var s = spanNodes[i].innerHTML;
        s = s.replace(/<{1}[^<>]{1,}>{1}/g, " ");
        spanText.push(s.toString().trim());
    }
}


/** addSpanWord
 *
 *    Function used to add span-tags around all words to enable to highlight them.
 */

function addSpanWord() {
    var count = 0;
    for (i = 0; i < spanNodes.length; i++) {
        if (spanNodes[i].innerHTML != '' && spanNodes[i].innerHTML != ' ') {
            var oriSpanHTML = spanNodes[i].innerHTML;
            oriSpanNodes.push(oriSpanHTML);
            changedSpanNodes.push(spanNodes[i]);
            var tmp = spanNodes[i].innerHTML.toString().trim();
            tmp = tmp.replace(/(\b)|(\f)|(\t)|(\v)|(\r)|(\n)|(\r\n)/g, "");
            tmp = tmp.trim();

            // --- ugly workaround
            var isTag = /<[^>]*>/g;
            tmp = tmp.replace(isTag, function(match) {
                return match.replace(/\s/g, "└(=^‥^=)┐");
            });
            // ugly workaround ---

            var text = tmp.split(' ');
            var myText;
            var out = [];
            for (j = 0; j < text.length; j++) {
                if (text[j] != '' && text[j] != ' ') {
                    out.push('<span class="wordHighlight">' + text[j] + ' ' + '</span>');
                    count = count + 1;
                }
            }

            myText = out.join(' ');

            // --- ugly workaround
            myText = myText.replace(/└\(=\^‥\^=\)┐/g, " ");
            // ugly workaround ---

            var tx = spanNodes[i].innerHTML;
            var htmlText = tx.replace(spanNodes[i].innerHTML.toString().trim(), myText);
            spanNodes[i].innerHTML = htmlText;
        }
    }
}



/** getText
 *
 *    Function used to store all span-Tags that were set before around the words in the public innerSpanNodes array. It also stores each word as an array entry in the public innerSpanText array.
 */
function getSpanText() {
    innerSpanNodes = parent.document.getElementsByClassName('wordHighlight');
    for (i = 0; i < innerSpanNodes.length; i++) {
        var s = innerSpanNodes[i].innerHTML;
        s = s.replace(/<{1}[^<>]{1,}>{1}/g, " ");
        if (s != " " || s != "") {
            innerSpanText.push(s.toString().trim());
        }
    }
}

function addButtons() {
    // getting all block elements and adding play button
    const blockElements = parent.document.querySelectorAll("p, h1, h2, h3, h4, h5, h6");
    
    const button = parent.document.createElement("input");
    button.classList.add("controlElement");
    button.classList.add("sv-clean");
    button.classList.add("sv-ignore");
    button.type = "image";
    button.alt = "";
     
    blockElements.forEach((el) => {
        el.appendChild(button.cloneNode());
    });

    // adding style infos for button
    const parentHeader = parent.document.querySelector("head");

    const styleElement = parent.document.createElement("style");
    styleElement.classList.add("sv-clean");
    styleElement.classList.add("sv-ignore");
    styleElement.innerText = ".controlElement {height: 30px; width: 30px;}";

    parentHeader.appendChild(styleElement);
}

function removeButtons() {
    const inserted = parent.document.querySelectorAll(".controlElement.sv-clean");
    inserted.forEach((el) => {
        el.parentElement.removeChild(el);
    });
}

function changeButtonsTo(name) {
    const inserted = parent.document.querySelectorAll(".controlElement.sv-clean");
    inserted.forEach((el) => {
        el.src = window.location.origin + "/toolbar/assets/images/" + name + ".svg";
        


        el.addEventListener("click", (e) => {
            el.parentElement.classList.add("sv-block");
            const event = new CustomEvent("selfVoicingButtonPress", {detail: {name: name, element: el.parentElement}});
            parent.document.dispatchEvent(event);
        });
    });
}


/** cleanCode
 *
 *    Function used to clear the code of all added spans (word and sentence) and set HTML back to original state. All variables used for speech output and text highlighting are set back to original state.
 */
function cleanCode() {
    // parent.document.getElementById('boxText').innerHTML = '';
    for (i = 0; i < changedSpanNodes.length; i++) {
        changedSpanNodes[i].innerHTML = oriNodes[i];
        changedSpanNodes[i].style.backgroundColor = oriBackCol[i];
    }
    for (i = 0; i < changedNodes.length; i++) {
        changedNodes[i].innerHTML = oriNodes[i];
        changedNodes[i].style.backgroundColor = oriBackCol[i];
        changedNodes[i].parentNode.style.backgroundColor = oriBackCol[i];
    }

    oriNodes.length = 0;
    changedNodes.length = 0;
    spanNodes.length = 0;
    spanText.length = 0;
    oriSpanNodes.length = 0;
    changedSpanNodes.length = 0;
    innerSpanText.length = 0;
    innerSpanNodes.length = 0;
    actualPosition = null;
    wordCount = 0;
    speechTime = 0;
    isInitialized = 0;
}

/** getPosWithTime
 *
 *    Function used to get the start position for synthetic voice speech output out of timestamp from natural voice speech output.
 *
 *    @param myTime
 *        The timestamp from HTML audio file.
 *
 *    @return
 *        The startposition in sentence array for the synthetic voice speech output.
 */
function getPosWithTime(myTime) {
    for (i = 0; i < subsSent.length; i++) {
        if (myTime >= subsSent[i].start && myTime <= subsSent[i].end) {
            return i;
        }
    }
}


/** getPosWithChar
 *
 *    Function used to get the start position for natural voice speech output out of wordcount from synthetic voice speech output.
 *
 *    @param myCount
 *        The word count from synthetic voice speech output.
 *
 *    @return
 *        The startposition in sentence array for the natural voice speech output.
 */
function getPosWithChar(myCount) {
    var count = 0;
    var cAlt = 0;
    for (i = 0; i < subs.length; i++) {
        cAlt = count;
        count = count + subs[i].text.toString().trim().split(' ').length;
        if (myCount >= cAlt && myCount < count) {
            return i;
        }
    }
}


/** getBackgroundColours
 *
 *    Function used to store the background colors of words, sentences and paragraphs.
 *
 */
function getBackgroundColours() {
    for (i = 0; i < spanNodes.length; i++) {
        oriBackCol.push(spanNodes[i].style.backgroundColor);
    }
    for (i = 0; i < innerSpanNodes.length; i++) {
        oriBackColInn.push(innerSpanNodes[i].style.backgroundColor);
    }
    for (i = 0; i < spanNodes.length; i++) {
        oriBackColPar.push(spanNodes[i].parentNode.style.backgroundColor);
    }
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};