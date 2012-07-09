/*
 *  EZ-Menu
 *  An easy way to create a navigation menu from JSON
 *
 *  Copyright 2012, Marc S. Brooks (http://mbrooks.info)
 *  Licensed under the MIT license:
 *  http://www.opensource.org/licenses/mit-license.php
 *
 *  Dependencies:
 *    jquery.js
 */

(function($) {
	var methods = {
		init : function(options, config) {

			// default options
			var settings = $.extend({}, options);

			return this.each(function() {
				var $this = $(this),
					data  = $this.data();

				if ( $.isEmptyObject(data) ) {
					$this.data({
						options : settings
					});
				}

				$this.EZMenu('generate', config);
			});
		},

		destroy : function() {
			return this.each(function() {
				$(this).removeData();
			});
		},

		generate : function(config) {
			return this.each(function() {
				var $this = $(this),
					data  = $this.data();

				var list = $('<ul></ul>')
					.addClass('ez_menu');

				for (var i = 0; i < config.length; i++) {
					var menu = config[i];

					var item = $('<li></li>');
					var link = $('<a></a>')
						.append(menu.name);

					var href = window.location;
					var curr = href.protocol + '//' + href.host + href.pathname;

					// highlight the selected option
					if (href.pathname == menu.url || curr == menu.url) {
						item.addClass('menu_hover_on')
							.attr('target', true);
					}

					// attach highlight events
					item.mouseover(function() {
						if (!$(this).attr('active') && !$(this).attr('target')) {
							$(this).removeClass('menu_hover_off').addClass('menu_hover_on');
						}
					});

					item.mouseout(function() {
						if (!$(this).attr('active') && !$(this).attr('target')) {
							$(this).removeClass('menu_hover_on');
						}
					});

					// attach redirect event
					if (menu.url) {
						item.bind('click', menu.url, function(event) {
							window.location.href = event.data;
						});

						link.attr('href', menu.url);
					}
					else

					// create the submenu
					if (menu.options) {
						var opts = createMenuOpts(menu.options);
						item.append(opts);

						bindMenuEvents(item, opts);
					}

					item.append(link);
					list.append(item);
				}

				$(this).append(list);
			});
		}
	};

	$.fn.EZMenu = function(method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1) );
		}
		else
		if (typeof method === 'object' || ! method) {
			return methods.init.apply(this, arguments);
		}
		else {
			$.error('Method ' +  method + ' does not exist on jQuery.EZMenu');
		}
	};

	/*
	 * Create the menu option elements
	 */
	function createMenuOpts(config) {
		var list = $('<ul></ul>')
			.addClass('menu_list');

		for (var i = 0; i < config.length; i++) {
			var menu = config[i];

			var item = $('<li></li>');
			var link = $('<a></a>')
				.append(menu.name);

			if (menu.url) {

				// attach highlight events
				item.bind('mouseover', link, function(event) {
					event.data.removeClass('opt_hover_off').addClass('opt_hover_on');
				});

				item.bind('mouseout', link, function(event) {
					event.data.removeClass('opt_hover_on').addClass('opt_hover_off');
				});

				link.attr('href', menu.url);
			}

			// create the submenu
			if (menu.options) {
				var opts = createMenuOpts(menu.options);
				item
					.addClass('submenu')
					.append(opts);

				bindMenuEvents(item, opts);
			}

			item.append(link);
			list.append(item);
		}

		return list;
	}

	/*
	 * Attach hide/unhide events
	 */
	function bindMenuEvents(item, opts) {
		item.bind('click', opts, function(event) {
			event.stopPropagation();

			if (!$(this).attr('active')) {
				event.data.css({ display : 'block' });

				$(this)
					.removeClass('submenu_hover_off').addClass('submenu_hover_on')
					.attr('active', true);
			}
			else {
				event.data.css({ display : 'none' });

				$(this)
					.removeClass('submenu_hover_on')
					.attr('active', null);
			}
		});
	}
})(jQuery);
