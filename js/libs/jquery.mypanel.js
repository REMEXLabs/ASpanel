/*
 * Copyright 2015 Annabell Schmidt, Patrick Muenster
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

;(function($) {
	$.fn.mypanel = function(options) {
		var params, bindHover;

		$.mypanel = {
			defaults : {
				speed : 300,
				hideTriggerClass : 'slidingpanel_hide_trigger',
				wrapperClass : 'slidingpanel_wrapper',
				slidingElementClass : 'slidingpanel_element',
				tabClass : 'slidingpanel_tab',
				wrapperTemplate : '<div></div>',
				tabTemplate : '<div></div>',
				tabText : 'E<br/>X<br/>A<br/>M<br/>P<br/>L<br/>E',
				openByDefault : true
			},
			show : function(slidingElement) {
				$(slidingElement).show(params.speed);

				$(slidingElement).closest('.' + params.wrapperClass).one('click', function() {
					$.mypanel.hide(slidingElement);
				});
			},
			hide : function(slidingElement) {
				$(slidingElement).hide(params.speed);

				$(slidingElement).closest('.' + params.wrapperClass).one('click', function() {
					$.mypanel.show(slidingElement);
				});
			}
		};

		bindHover = function(slidingElement) {
			$(slidingElement).closest('.' + params.wrapperClass).one('click', function() {
				$.mypanel.show(slidingElement);
			});
		};

		params = $.extend($.mypanel.defaults, options || {});

		return this.each(function() {
			var slidingElement = this;

			$(slidingElement).addClass(params.slidingElementClass)
							 .wrap($(params.wrapperTemplate)
							 .clone()
							 .addClass(params.wrapperClass))
							 .closest('.slidingpanel_wrapper')
							 .append($(params.tabTemplate)
							 .clone()
							 .addClass(params.tabClass)
							 .append(params.tabText));

			if (params.openByDefault) {
				// If there is no trigger to hide the panel, then the tab is going to assume that role
				if ($('.' + params.hideTriggerClass).length == 0) {
					$('.' + params.tabClass).addClass(params.hideTriggerClass);
				}

				$('.' + params.hideTriggerClass).one('click', function() {
					$(slidingElement).hide(params.speed, function() {
						bindHover(slidingElement);
					});
				});
			} else {
				$(slidingElement).hide();
				bindHover(slidingElement);
			}

		});
	};

})(jQuery);
