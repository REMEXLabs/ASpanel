/**
Version: 2.1
Author: Sebastian Koch
*/

var SelfVoicingHelper = new function() {
    // variables will be set when the ASPanel sets its default values via the event captured in the init function.
    this.speed;
    this.pitch;
    this.marking;
    this.zoom;
    this.color;
    this.lastClickedElement;


    /**
     * This method initializes the self voicing helper.
     *
     * @return {SelfVoicingHelper} the initialized helper.
     */
    this.init = function() {
        var self = this;

        // adding all listeners for self voicing setting updates
        document.addEventListener("selfVoicingSpeedUpdate", function(event) {
            self.speed = event.detail;
        });

        document.addEventListener("selfVoicingPitchUpdate", function(event) {
            self.pitch = event.detail;
        });

        document.addEventListener("selfVoicingMarkingUpdate", function (event) {
            self.marking = event.detail;
        });


        document.addEventListener("selfVoicingZoomUpdate", function (event) {
            self.zoom = event.detail;
        });

        document.addEventListener("selfVoicingColorUpdate", function (event) {
            self.color = event.detail;
        });

        // adds events to play from document
        parent.document.addEventListener("selfVoicingButtonPress", function (event) {
            self.lastClickedElement = event.detail.element;

            switch (event.detail.name) {
                case "play":
                document.getElementById('play-audio').click();
                break;

                case "pause":
                document.getElementById('pause-audio').click();
                break;

                default: 
                console.warn("Unknown event command: ", event.detail.name);
                break;
            }
        });

        return self;
    };

    /**
     * This method returns the normalized pitch.
     *
     * @return {float} the current pitch value: 0.5, 1.0, 2.0
     */
    this.getSpeedNormalized = function() {
        switch (this.speed) {
            case "slow":
                return 0.5;

            case "normal":
                return 1.0;

            case "fast":
                return 2.0;

            default:
                console.assert("Unknown speed value: ", this.pitch);
        }
    };

    /**
     * This method returns the normalized pitch.
     *
     * @return {float} the current pitch value: 0.1, 1.0, 2.0
     */
    this.getPitchNormalized = function() {
        switch (this.pitch) {
            case "low":
                return 0.1;

            case "normal":
                return 1.0;

            case "high":
                return 2.0;

            default:
                console.assert("Unknown pitch value: ", this.pitch);
        }
    };

    /**
     * This method returns the marking type used.
     *
     * @return {String} the current marking type value: off, words, sentences, paragraphs.
     */
    this.getMarking = function() {
       return this.marking;
    };

    /**
     * This method returns whether the text should be zoomed.
     *
     * @return {String} the current zoom value: off, on
     */
    this.getZoom = function() {
        return this.zoom;
    };

    /**
     * This method returns whether the the highlight color.
     *
     * @return {String} the curreny highlight color as a hex string.
     */
    this.getColor = function() {
        return this.color;
    };

    /**
     * This method returns the element on which the playbutton was last pressed.
     *
     * @return {Element} the element.
     */
    this.getLastClickedElement = function() {
        return this.lastClickedElement;
    };

    /**
     * This method resets the element on which the playbutton was last pressed.
     */
    this.resetLastClickedElement = function() {
        this.lastClickedElement = null;
    };
};
