/**
Version: 2.0
Author: Sebastian Koch
*/
var ASPanelAssociator = new function() {
     const CONSTANTS = {
          "fontSize": 14 // 1em = 14px
     }

	var ComponentTypes = {
		ignored: 0, // this component is just ignored
		value: 1, // this component just uses the given value
		enabled: 2 // this component has one preference term ending with -Enabled and optionally the selected value as another
	}

	// this variable contains associations between preference terms and the component IDs
	var associations = {
		// value type components
		"textSize_slider" : {
			type: ComponentTypes.value,
			preferenceTermName: "http://registry.gpii.eu/common/fontSize",
               normalizationFrom: function (value) {
                    return value * CONSTANTS.fontSize;
               },
               normalizationTo: function (value) {
                    if (value < CONSTANTS.fontSize) {
                         return 1;
                    }

                    if (value > 3*CONSTANTS.fontSize) {
                         return 3*CONSTANTS.fontSize;
                    }

                    return (value * (1/CONSTANTS.fontSize)).toFixed(1);
               }
		},
		"lineSpacing_slider" : {
			type: ComponentTypes.value,
			preferenceTermName: "http://registry.gpii.eu/common/lineHeight",
               normalizationFrom: function (value) {
                    return value + "em";
               },
               normalizationTo: function (value) {
                    return value.replace("em", "");
               }
		},
		"table_of_content" : {
			type: ComponentTypes.value,
			preferenceTermName: "http://registry.gpii.eu/common/tocEnabled"
		},
          "pageLanguage_dropdown" : {
               type: ComponentTypes.value,
               preferenceTermName: "http://registry.gpii.eu/common/language",
               normalizationTo: function (value) {
                    if (value.startsWith("de")) {
                         return "de";
                    } else if (value.startsWith("en")) {
                         return "en";
                    } else {
                         console.log("Unsupported language. Defaulting to German.")
                         return "de";
                    }
               }
          },
		"signlanguageLanguage_dropdown" : {
			type: ComponentTypes.value,
			preferenceTermName: "http://registry.gpii.eu/common/signLanguage",
               normalizationTo: function (value) {
                    if (value.startsWith("de")) {
                         return "de";
                    } else if (value.startsWith("en")) {
                         return "en";
                    } else {
                         console.log("Unsupported language. Defaulting to German.")
                         return "de";
                    }
               }
		},
		"signlanguageInterpreterName_dropdown" : {
			type: ComponentTypes.value,
			preferenceTermName: "http://registry.gpii.eu/common/signLanguageInterpreterName"
		},
		"selfVoicing_speed" : {
			type: ComponentTypes.value,
			preferenceTermName: "http://terms.gpii.eu/deschner/speechRate"
		},
		"selfVoicing_pitch" : {
			type: ComponentTypes.value,
			preferenceTermName: "http://terms.gpii.eu/deschner/speechPitch"
		},
		"selfVoicing_type" : {
			type: ComponentTypes.value,
			preferenceTermName: "http://terms.gpii.eu/deschner/voiceMode"
		},
		"selfVoicing_color" : {
			type: ComponentTypes.value,
			preferenceTermName: "http://terms.gpii.eu/deschner/textReadingHighlightColour"
		},
		"textStyle_dropdown" : {
			type: ComponentTypes.value,
			preferenceTermName: "http://registry.gpii.eu/common/fontStyle"
		},

		// enabled type component
		"selfVoicing_zoom" : {
			type: ComponentTypes.enabled,
			isDisabledForValue: "off",
			useValueAsAdditionalTerm: false,
			preferenceTermName: "http://terms.gpii.eu/deschner/magnifiedTextBox"
		},
		"selfVoicing_marking" : {
			type: ComponentTypes.enabled,
			isDisabledForValue: "off",
			useValueAsAdditionalTerm: true,
			preferenceTermName: "http://terms.gpii.eu/deschner/textReadingHighlight"
		},
		"picsupport_dropdown" : {
			type: ComponentTypes.enabled,
			isDisabledForValue: "picsupport-off",
			useValueAsAdditionalTerm: true,
			preferenceTermName: "http://registry.gpii.eu/common/picSupport"
		}
	};


	/**
     * This method gets the current preference settings of the panel.
     *
     * @return {Object} the preference settings
     */
     this.getPanelSettings = function() {
     	// getting list of components in the panel
     	var components = parent.document.querySelector("#myASPanel-iFrame").contentWindow.UIComponentList;

     	var preferences = {};

     	for (var componentName in components) {
     		var uiComponent = components[componentName];

               var uiComponentValue = uiComponent.component.getValue();

     		// getting associated preference term configuration
     		var configuration = associations[uiComponent["ui_component_id"]];

     		// skipping components with no configuration defined
     		if (configuration === undefined) {
     			console.warn("Component with id", uiComponent["ui_component_id"], "not handled!")
     			continue;
     		}

               // normalizing if needed
               if (configuration.normalizationFrom !== undefined) {
                    uiComponentValue = configuration.normalizationFrom(uiComponentValue);
               }


     		// handling each type as needed
     		switch (configuration.type) {
     			case ComponentTypes.value:
     				preferences[configuration.preferenceTermName] = uiComponentValue;
     				break;

     			case ComponentTypes.enabled:
     				// checking if preference term is defined as enabled for current value
     				var isDisabled = configuration.isDisabledForValue === uiComponentValue;

     				// setting -Enabled term
     				preferences[configuration.preferenceTermName + "Enabled"] = !isDisabled;

     				// setting additional term if needed
     				if (!isDisabled && configuration.useValueAsAdditionalTerm) {
     					preferences[configuration.preferenceTermName] = uiComponentValue;
     				}

     				break;
     		}
     	}

     	return preferences;
     };

     /**
     * This method sets the preference settings of the panel.
     *
     * @param {Object} preferenceTerms - the preference settings
     */
     this.setPanelSettings = function(preferenceTerms) {
     	// getting list of components in the panel
     	var components = parent.document.querySelector("#myASPanel-iFrame").contentWindow.UIComponentList;

     	// resetting all to their default
     	for (var component in components) {
               console.log(component);
     		components[component].component.reset();
     	}

     	for (var preferenceTerm in preferenceTerms) {
     		var preferenceTermValue = preferenceTerms[preferenceTerm];


     		for (var component in components) {
     			var uiComponent = components[component];

     			var configuration = associations[component];

	     		// skipping components with no configuration defined
	     		if (configuration === undefined) {
	     			continue;
	     		}


     			// handling each type as needed
     			switch (configuration.type) {
     				case ComponentTypes.value:
     					if (configuration.preferenceTermName === preferenceTerm) {
                                   // normalizing if needed
                                   if (configuration.normalizationTo !== undefined) {
                                        preferenceTermValue = configuration.normalizationTo(preferenceTermValue);
                                   }
     						uiComponent.component.setValue(preferenceTermValue);
     					}
     					break;

     				case ComponentTypes.enabled:
     					// TODO handle case when enabled is false and a value is provided
     					if (configuration.preferenceTermName === preferenceTerm) {
                                   // normalizing if needed
                                   if (configuration.normalizationTo !== undefined) {
                                        preferenceTermValue = configuration.normalizationTo(preferenceTermValue);
                                   }
     						uiComponent.component.setValue(preferenceTermValue);
     					} else if (configuration.preferenceTermName + "Enabled" === preferenceTerm) {
     						uiComponent.component.setValue(configuration.isDisabledForValue);
     					}
     			}
     		}
     	}
     }
};

/**
Version: 1.0
Author: Sebastian Koch
*/
var ParsingHelper = new function() {
	this.evaluateCondition = function (condition, currentEnvironment) {
		// If the conditions object is missing or is an empty Array,
		// the context is generic, i.e. it applies without restriction.
		if (condition === undefined || condition.length == 0) {
			return true;
		}

		// handling all other conditions
	    switch (condition.type) {
            case "eq":
                return this.evaluateEquals(condition, currentEnvironment);
            break;

            case "ne":
            	return this.evaluateNotEquals(condition, currentEnvironment);

            case "lt":
            	return this.evaluateLessThan(condition, currentEnvironment);

            case "le":
            	return this.evaluateLessThanOrEqual(condition, currentEnvironment);

            case "gt":
            	return this.evaluateGreaterThan(condition, currentEnvironment);

            case "ge":
            	return this.evaluateGreaterThanOrEqual(condition, currentEnvironment);

            case "not":
            	return this.evaluateNot(condition, currentEnvironment);

            case "and":
            	return this.evaluateAnd(condition, currentEnvironment);

            case "or":
            	return this.evaluateOr(condition, currentEnvironment);

            case "ap":
            	return this.evaluateApproximate(condition, currentEnvironment);

            default:
                console.assert(false, 'Condition type "' + condition.type + '" not supported!');
                return false;
            break;
        }
	};

	this.evaluateEquals = function (condition, currentEnvironment) {
        console.assert(condition.operands.length == 2, 'Condition "eq" requires two operands!');
        return currentEnvironment[condition.operands[0]] == condition.operands[1];
	};

	this.evaluateNotEquals = function (condition, currentEnvironment) {
        console.assert(condition.operands.length == 2, 'Condition "ne" requires two operands!');
        return currentEnvironment[condition.operands[0]] != condition.operands[1];
	};

	this.evaluateLessThan = function (condition, currentEnvironment) {
        console.assert(condition.operands.length == 2, 'Condition "lt" requires two operands!');
        return currentEnvironment[condition.operands[0]] < condition.operands[1];
	};

	this.evaluateLessThanOrEqual = function (condition, currentEnvironment) {
        console.assert(condition.operands.length == 2, 'Condition "le" requires two operands!');
        return currentEnvironment[condition.operands[0]] <= condition.operands[1];
	};

	this.evaluateGreaterThan = function (condition, currentEnvironment) {
        console.assert(condition.operands.length == 2, 'Condition "gt" requires two operands!');
        return currentEnvironment[condition.operands[0]] > condition.operands[1];
	};

	this.evaluateGreaterThanOrEqual = function (condition, currentEnvironment) {
        console.assert(condition.operands.length == 2, 'Condition "ge" requires two operands!');
        return currentEnvironment[condition.operands[0]] >= condition.operands[1];
	};


	this.evaluateApproximate = function (condition, currentEnvironment) {
        console.assert(condition.operands.length == 2, 'Condition "ap" requires two operands!');

     //    if (typeof condition.operands[1] === 'number') {
     //    	return currentEnvironment[condition.operands[0]]
    	// } else {
        	console.assert(false, 'Condition "ap" is not implemented for this type of operand!');
    	// }
	};


	this.evaluateNot = function (condition, currentEnvironment) {
        console.assert(condition.operands.length == 1, 'Condition "not" requires one operand!');
        return !this.evaluateCondition(condition.operands[0], currentEnvironment);
	};

	this.evaluateAnd = function (condition, currentEnvironment) {
		console.assert(condition.operands.length >= 2, 'Condition "and" requires at least two operands!');

		for (var i = 0; i < condition.operands.length; ++i) {
			var matches = this.evaluateCondition(condition.operands[i], currentEnvironment);

			if (!matches) {
				return false;
			}
		}

		return true;
	};

	this.evaluateOr = function (condition, currentEnvironment) {
		console.assert(condition.operands.length >= 2, 'Condition "or" requires at least two operands!');

		for (var i = 0; i < condition.operands.length; ++i) {
			var matches = this.evaluateCondition(condition.operands[i], currentEnvironment);

			if (matches) {
				return true;
			}
		}

		return false;
	};
};

/**
Version: 1.2
Author: Sebastian Koch
*/
var StorageHelper = new function() {
    // these are the special encodings/decodings used on top of Base64,
    // since it the string would contain symbols potentially not welcome in cookies.
    this.encodings = {
        '+': '!',
        '/': '?',
        '=': '-'
    };
    this.decodings = {
        '!': '+',
        '?': '/',
        '-': '='
    };

    // this is the limit for a cookie size. 4096 bytes minus overhead of expiry and a small extra buffer.
    this.cookieByteLimit = 3500;

    /**
     * This method stores a given value with a given key.
     *
     * It either uses WebStorage or Cookie depending on availability. For long strings cookie storage may fail!
     *
     * @param {String} key - The key to use.
     * @param {Object} value - The value to save. Might also be a string or number etc.
     * @param {Boolean} - Whether storage succeeded or not.
     */
    this.store = function(key, value) {
        if (typeof value === 'object') {
            value = JSON.stringify(value);
        }

        var encoded = this.__encode(value);

        if (this.__storageAvailable()) {
            this.__storeInStorage(key, encoded);
        } else {
            var size = this.__byteCount(key + encoded);

            if (size > this.cookieByteLimit) {
                console.log('Cookie exceeds maximum size!');
                return false;
            }

            this.__storeInCookies(key, encoded);
        }

        return true;
    };

    /**
     * This method reads a given value via its key.
     *
     * @param {String} key - The key to use.
     * @return {String} - The value that was found. Might be null for invalid keys.
     */
    this.read = function(key) {
        var value = this.__storageAvailable() ? this.__readInStorage(key) : this.__readInCookies(key);

        if (!value) {
            return null;
        }

        value = this.__decode(value);

        try {
            return JSON.parse(value);
        } catch (e) {
            return value;
        }
    };

    /**
     * This method deletes a given value via its key.
     *
     * @param {String} key - The key to use.
     */
    this.delete = function(key) {
        if (this.__storageAvailable()) {
            this.__deleteInStorage(key);
        } else {
            this.__deleteInCookies(key);
        }
    };

    /**
     * This method stores a given value in WebStorage
     *
     * @param {String} key - The key to use.
     * @param {String} value - The value to save. Needs to be an encoded string.
     */
    this.__storeInStorage = function(key, value) {
        localStorage.setItem(key, value);
    };

    /**
     * This method reads a given value in WebStorage via its key.
     *
     * @param {String} key - The key to use.
     * @return {String} - The value that was found. Might be null for invalid keys.
     */
    this.__readInStorage = function(key) {
        return localStorage.getItem(key);
    };

    /**
     * This method deletes a given value in WebStorage via its key.
     *
     * @param {String} key - The key to use.
     */
    this.__deleteInStorage = function(key) {
        localStorage.removeItem(key);
    };

    /**
     * This method stores a given value in cookies
     *
     * @param {String} key - The key to use.
     * @param {String} value - The value to save. Needs to be an encoded string.
     * @param {Number} days - How long the cookie should be valid. Defaults to one year.
     */
    this.__storeInCookies = function(key, value, days) {
        days = days || 365;

        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();

        document.cookie = key + "=" + value + expires + "; path=/";
    };

    /**
     * This method reads a given value in cookies via its key.
     *
     * @param {String} key - The key to use.
     * @return {String} - The value that was found. Might be null for invalid keys.
     */
    this.__readInCookies = function(key) {
        key += '=';

        var cookies = document.cookie.split(';');

        for (var i = 0; i < cookies.length; ++i) {
            var cookie = cookies[i];

            while (cookie.charAt(0) == ' ') {
                cookie = cookie.substring(1, cookie.length);
            }

            if (cookie.indexOf(key) == 0) {
                return cookie.substring(key.length, cookie.length);
            }
        }

        return null;
    };

    /**
     * This method deletes a given value in cookies via its key.
     *
     * @param {String} key - The key to use.
     */
    this.__deleteInCookies = function(key) {
        this.__storeInCookies(key, "", -1);
    };

    /**
     * This method encodes a given string using Base64 with special encodings.
     *
     * @param {String} string - The key to encode.
     * @return {String} - The encoded string.
     */
    this.__encode = function(string) {
        var self = this;

        return btoa(encodeURIComponent(string).replace(/%([0-9A-F]{2})/g, function(match, p1) {
            return String.fromCharCode('0x' + p1);
        })).replace(/\+|\/|=/gi, function(matched) {
            return self.encodings[matched];
        });
    };

    /**
     * This method decodes a given string using Base64 with special encodings.
     *
     * @param {String} string - The key to decode.
     * @return {String} - The decoded string.
     */
    this.__decode = function(string) {
        var self = this;

        return decodeURIComponent(Array.prototype.map.call(atob(string.replace(/!|\?|-/gi, function(matched) {
            return self.decodings[matched];
        })), function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    };

    /**
     * This method checks whether WebStorage is available.
     *
     * See: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
     *
     * @param {String} type - The type of storage to check. Defaults to 'localStorage'.
     * @return {Boolean} - Whether storage is available or not.
     */
    this.__storageAvailable = function(type) {
        type = type || 'localStorage';

        try {
            var storage = window[type],
                x = '__storage_test__';
            storage.setItem(x, x);
            storage.removeItem(x);
            return true;
        } catch (e) {
            return e instanceof DOMException && (
                    // everything except Firefox
                    e.code === 22 ||
                    // Firefox
                    e.code === 1014 ||
                    // test name field too, because code might not be present
                    // everything except Firefox
                    e.name === 'QuotaExceededError' ||
                    // Firefox
                    e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
                // acknowledge QuotaExceededError only if there's something already stored
                storage.length !== 0;
        }
    }

    /**
     * This method returns the number of bytes in a string.
     *
     * @param {String} string - The string to check.
     * @return {Number} - The number of bytes in the string.
     */
    this.__byteCount = function(string) {
        return encodeURI(string).split(/%..|./).length - 1;
    }
};

// requires: StorageHelper.js ParsingHelper.js
/**
Version: 2.0
Author: Sebastian Koch
*/
var UserPreferenceHelper = new function() {
    const credentials = {
        "user": "olb",
        "password": "xN992n7tq%o/@L(ZfACTKuBaY7Hp]YK+onZEB7mxN39Ac?eV9pgUy.Nxu(n(EVs7",
        "server": "https://dev.openape.gpii.eu"
    };

    const client = window.openape;

    /**
     * This method gets the preference set from the given local path.
     *
     * @param {String} path - The path where the preference set is found.
     * @param {Function} onCompletion - The callback when the preference set was loaded..
     */
    this.getLocalPreferenceSet = function (path, onCompletion) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', path);
        xhr.onreadystatechange = function() {
          if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            var preferenceSet = JSON.parse(xhr.responseText);
            onCompletion(preferenceSet);
          }
        }
        xhr.send();
    }

    this.getServerPreferenceSet = function (preferenceSetId, onCompletion) {
        client.initializeLibrary(credentials.user, credentials.password, credentials.server);
        const result = client.getUserContext(preferenceSetId, "JSON");

        return JSON.parse(result["responseText"]);
    }


   /**
     * This method returns the correct preferences for the current conditions.
     *
     * @param {Object} currentEnvironment - The current environment of the user. This is used to decide on the conditions.
     * @param {Object} preferenceSet - The preference set to be parsed.
     *
     * @return {Object} - The correct context.
     */
    this.selectFromContexts = function (currentEnvironment, preferenceSet) {
        var preferences;

        // finding current preferences based on conditions
        for (var context in preferenceSet.contexts) {
            var conditions = preferenceSet.contexts[context].conditions;
            var wasMatched = ParsingHelper.evaluateCondition(conditions);

            // as per the standard the first matched condition is used
            return preferenceSet.contexts[context];
        }

        console.warn("No conditions matched!");

        return null; // TODO check behavior against standard
    };

};
