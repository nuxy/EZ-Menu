/**
 *  EZ Menu
 *  An easy way to create a navigation menu from JSON
 *
 *  Copyright 2012-2015, Marc S. Brooks (http://mbrooks.info)
 *  Licensed under the MIT license:
 *  http://www.opensource.org/licenses/mit-license.php
 *
 *  Dependencies:
 *    jquery.js
 */

if (!window.jQuery || (window.jQuery && window.jQuery.fn.jquery < '1.8.3')) {
	throw new Error('EZ-Menu requires jQuery 1.8.3 or greater.');
}

(function($) {

	/**
	 * @namespace EZMenu
	 */
	var methods = {

		/**
		 * Create new instance of EZ-Menu
		 * @memberof EZMenu
		 * @method init
		 * @param {Object} settings
		 * @param {Object} config
		 * @returns {Object} jQuery object
		 */
		"init": function(settings, config) {
			var $this = $(this),
				data  = $this.data();

			// default settings
			var defaults = {
				showEasing: 'linear',
				hideEasing: 'linear',
				showSpeed:  'fast',
				hideSpeed:  'fast',
				click2open: false
			};

			if (arguments.length > 1) {
				$.extend(defaults, settings);
			}
			else {
				config = settings;
			}

			if ( $.isEmptyObject(data) ) {
				$this.data({
					settings: defaults,
					config:   config
				});
			}

			$this.append(
				$this.EZMenu('_createNavMenu')
			);
		},

		/**
		 * Perform cleanup
		 * @memberof EZMenu
		 * @method destroy
		 */
		"destroy": function() {
			$(this).removeData();
		},

		/**
		 * Create the navigation menu elements
		 * @memberof EZMenu
		 * @method _createNavMenu
		 * @returns {Object} jQuery object
		 * @private
		 */
		"_createNavMenu": function() {
			var $this = $(this),
				data  = $this.data();

			// generate as unordered list
			var list = $('<ul></ul>')
				.addClass('ez_menu');

			for (var i = 0; i < data.config.length; i++) {
				var menu = data.config[i],
					item = $('<li></li>'),
					link = $('<a></a>')
						.append(menu.name);

				var href = window.location,
					curr = href.protocol + '//' + href.host + href.pathname;

				// highlight the selected option
				if (href.pathname == menu.url || curr == menu.url) {
					item.addClass('menu_hover_on')
						.attr('target', true);
				}
				else {
					item.addClass('menu_hover_off');
				}

				// bind hover events
				item.on('mouseover', function() {
					var $this = $(this);

					if (!$this.prop('visible') && !$this.attr('target')) {
						$this.removeClass('menu_hover_off').addClass('menu_hover_on');
					}
				});

				list.on('mouseout',function() {
					var $this = $(this).children('li');

					$this.removeClass('menu_hover_on').addClass('menu_hover_off');
				});

				// bind anchor link event
				if (menu.url) {
					link.attr({
						target: (menu.target) ? menu.target : '_self',
						href:   menu.url
					});
				}

				// add custom classes
				if (menu.classname) {
					link.addClass(menu.classname);
				}

				// create the sub-menu
				if (menu.options) {
					var submenu = $this.EZMenu('_createMenuOpts', menu.options);
					item.append(submenu);

					$this.EZMenu('_bindMenuEvents', item, submenu);
				}

				item.append(link);
				list.append(item);
			}

			return list;
		},

		/**
		 * Create the menu option elements
		 * @memberof EZMenu
		 * @method _createMenuOpts
		 * @param {Object} config
		 * @returns {Object} jQuery object
		 * @private
		 */
		"_createMenuOpts": function(config) {
			var $this = $(this);

			// generate as unordered list
			var list = $('<ul></ul>')
				.addClass('menu_list');

			for (var i = 0; i < config.length; i++) {
				var menu = config[i],
					item = $('<li></li>'),
					link = $('<a></a>')
						.append(menu.name);

				// bind anchor link event
				if (menu.url) {
					link.attr({
						target: (menu.target) ? menu.target : '_self',
						href:   menu.url
					});
				}

				// add custom classes
				if (menu.classname) {
					link.addClass(menu.classname);
				}

				// create the sub-menu
				if (menu.options) {
					var submenu = $this.EZMenu('_createMenuOpts', menu.options);

					item.addClass('submenu').append(submenu);

					$this.EZMenu('_bindMenuEvents', item, submenu);
				}

				item.append(link);
				list.append(item);
			}

			return list;
		},

		/**
		 * Attach hide/unhide events
		 * @memberof EZMenu
		 * @method _bindMenuEvents
		 * @param {Object} item
		 * @param {Object} submenu
		 * @private
		 */
		"_bindMenuEvents": function(item, submenu) {
			var $this = $(this),
				data  = $this.data();

			var action = (data.settings.click2open) ? 'click' : 'mouseenter',
				active = null,
				opened = null;

			item.on(action, submenu, function(event) {
				event.stopPropagation();

				var elm = $(this),
					obj = event.data;

				// hide menu sub-menus
				if (elm.prop('visible')) {
					if (!active || !opened) return;

					obj.hide(data.settings.hideSpeed, data.settings.hideEasing, function() {

						elm.removeClass('submenu_hover_on').addClass('submenu_hover_off')
							.removeProp('visible');

						active = null;
						opened = null;
					});
				}

				// show select menu items
				else {
					if (active || opened) return;

					elm.removeClass('submenu_hover_off').addClass('submenu_hover_on')
						.prop('visible', true);

					obj.show(data.settings.showSpeed, data.settings.showEasing, function() {
						opened = true;
					});

					active = true;
				}
			});

			if (action != 'mouseenter') return;

			item.on('mouseleave', data.settings, function() {
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
			$.error('Method ' +  method + ' does not exist in jQuery.EZMenu');
		}
	};
})(jQuery);
