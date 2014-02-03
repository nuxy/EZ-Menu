/*
 *  EZ-Menu
 *  An easy way to create a navigation menu from JSON
 *
 *  Copyright 2012-2014, Marc S. Brooks (http://mbrooks.info)
 *  Licensed under the MIT license:
 *  http://www.opensource.org/licenses/mit-license.php
 *
 *  Dependencies:
 */

(function($) {
	var methods = {
		"init" : function(options, config) {

			// default options
			var settings = {
				showEasing : 'linear',
				hideEasing : 'linear',
				showSpeed  : 'slow',
				hideSpeed  : 'slow',
				click2open : false
			};

			if (arguments.length > 1) {
				$.extend(settings, options);
			}
			else {
				config = options;
			}

			return this.each(function() {
				var $this = $(this),
					data  = $this.data();

				if ( $.isEmptyObject(data) ) {
					$this.data({
						options : settings
					});
				}

				$this.append( createNavMenu(data, config) );
			});
		},

		"destroy" : function() {
			return this.each(function() {
				$(this).removeData();
			});
		}
	};

	$.fn.EZMenu = function(method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		}
		else
		if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		}
		else {
			$.error('Method ' +  method + ' does not exist on jQuery.EZMenu');
		}
	};

	/*
	 * Create the navigation menu elements
	 */
	function createNavMenu(data, config) {
		var list = $('<ul></ul>')
			.addClass('ez_menu');

		for (var i = 0; i < config.length; i++) {
			var menu = config[i];

			var item = $('<li></li>');
			var link = $('<a></a>')
				.append(menu.name);

			var href = window.location,
				curr = href.protocol + '//' + href.host + href.pathname;

			// highlight the selected option
			if (href.pathname == menu.url || curr == menu.url) {
				item.addClass('menu_hover_on')
					.attr('target', true);
			}

			// attach highlight events
			item.mouseover(function() {
				var $this = $(this);

				if (!$this.attr('visible') && !$this.attr('target')) {
					$this.removeClass('menu_hover_off').addClass('menu_hover_on');
				}
			});

			item.mouseout(function() {
				var $this = $(this);

				if (!$this.attr('visible') && !$this.attr('target')) {
					$this.removeClass('menu_hover_on');
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

			// create the sub-menu
			if (menu.options) {
				var opts = createMenuOpts(data, menu.options);
				item.append(opts);

				bindMenuEvents(data, item, opts);
			}

			item.append(link);
			list.append(item);
		}

		return list;
	}

	/*
	 * Create the menu option elements
	 */
	function createMenuOpts(data, config) {
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

			// create the sub-menu
			if (menu.options) {
				var opts = createMenuOpts(data, menu.options);
				item
					.addClass('submenu')
					.append(opts);

				bindMenuEvents(data, item, opts);
			}

			item.append(link);
			list.append(item);
		}

		return list;
	}

	/*
	 * Attach hide/unhide events
	 */
	function bindMenuEvents(data, item, opts) {
		var action = (data.options.click2open) ? 'click' : 'mouseenter',
			active = null,
			opened = null;

		item.bind(action, opts, function(event) {
			event.stopPropagation();

			var $this = $(this);

			// hide menu sub-menus
			if ($this.attr('visible')) {
				if (!active || !opened) return;

				event.data.hide(data.options.hideSpeed, data.options.hideEasing, function() {
					$this
						.removeClass('menu_hover_on submenu_hover_on')
						.removeAttr('visible');

					active = null;
					opened = null;
				});
			}

			// show select menu items
			else {
				if (active || opened) return;

				$this
					.removeClass('submenu_hover_off').addClass('submenu_hover_on')
					.attr('visible', true);

				event.data.show(data.options.showSpeed, data.options.showEasing, function() {
					opened = true;
				});

				active = true;
			}
		});

		if (action != 'mouseenter') return;

		item.bind('mouseleave', opts, function() {
			if (!active && !opened) return;

			// close all submenus
			item.each(function() {
				var elm = $(this);

				var events = $._data(elm[0], 'events');
				if (events) {
					opened = true;

					elm.trigger('mouseenter');
				}
			});
		});
	}
})(jQuery);
