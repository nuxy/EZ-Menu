test('Open Menu 1', function() {
	var menu1 = $(menu).find('li:nth-child(1)');

	ok(menu1[0], "Menu option 'Menu Link 2'");

	equal(menu1.children('a').attr('href'), 'http://menu1.domain.com', "Target URL 'http://menu1.domain.com' is expected");

	ok(menu1.hasClass('menu_hover_off'), "<li> contains required class 'menu_hover_off' by default");

	ok(menu1.trigger('mouseover'), "Mouse event 'over'");

	ok(menu1.hasClass('menu_hover_on'), "<li> contains required class 'menu_hover_on'");

	var submenu = menu1.children('ul');

	ok(!submenu[0], 'Submenu elements are not expected');

	ok(menu1.trigger('mouseout'), "Mouse event 'out'");

	ok(menu1.hasClass('menu_hover_off'), "<li> contains required class 'menu_hover_off'");
});

test('Open Menu 2', function() {
	var menu2 = $(menu).find('li:nth-child(2)');

	ok(menu2[0], "Menu option 'Menu Link 2'");

	equal(menu2.children('a').attr('href'), 'http://menu2.domain.com', "Target URL 'http://menu2.domain.com' is expected");

	ok(menu2.hasClass('menu_hover_off'), "<li> contains required class 'menu_hover_off' by default");

	ok(menu2.trigger('mouseover'), "Mouse event 'over'");

	ok(menu2.hasClass('menu_hover_on'), "<li> contains required class 'menu_hover_on'");

	var submenu = menu2.children('ul');

	ok(!submenu[0], 'Submenu elements are not expected');

	ok(menu2.trigger('mouseout'), "Mouse event 'out'");

	ok(menu2.hasClass('menu_hover_off'), "<li> contains required class 'menu_hover_off'");
});


test('Open Menu 3', function() {
	var menu3 = $(menu).find('li:nth-child(3)');

	ok(menu3[0], "Menu option 'Menu List A'");

	ok(!menu3.children('a').attr('href'), "Target URL is not expected");

	ok(menu3.hasClass('menu_hover_off'), "<li> contains required class 'menu_hover_off' by default");

	ok(menu3.trigger('mouseover'), "Mouse event 'over'");

	stop();

	setTimeout(function() {
		ok(menu3.hasClass('menu_hover_on'),    "<li> contains required class 'menu_hover_on'");
		ok(menu3.hasClass('submenu_hover_on'), "<li> contains required class 'submenu_hover_on'");

		var submenuA = menu3.children('ul');

		ok(submenuA[0], 'Submenu elements are expected');

		ok(menu3.attr('visible'), "'Menu List A' options are visible");

		ok(submenuA.hasClass('menu_list'), "<ul> contains required class 'menu_list'");

		var menuA_sub1 = submenuA.find('li:nth-child(1)'),
			menuA_sub2 = submenuA.find('li:nth-child(2)'),
			menuA_sub3 = submenuA.find('li:nth-child(3)');

		ok(menuA_sub1[0], "Menu option 'Item 1A'");

		ok(menuA_sub1.trigger('mouseover'), "Mouse event 'mouseover'");

		equal(menuA_sub1.children('a').attr('href'), 'http://item1A.domain.com', "Target URL 'http://item1A.domain.com' is expected");

		ok(menuA_sub2[0], "Menu option 'Item 2A'");

		ok(menuA_sub2.trigger('mouseover'), "Mouse event 'mouseover'");

		equal(menuA_sub2.children('a').attr('href'), 'http://item2A.domain.com', "Target URL 'http://item2A.domain.com' is expected");

		ok(menuA_sub3[0], "Menu option 'Menu List B'");

		start();

		ok(menuA_sub3.trigger('mouseover'), "Mouse event 'over'");

		stop();

		setTimeout(function() {
			ok(menuA_sub3.hasClass('submenu'),          "<li> contains required class 'submenu'");
			ok(menuA_sub3.hasClass('submenu_hover_on'), "<li> contains required class 'submenu_hover_on'");

			var submenuB = menuA_sub3.children('ul');

			ok(submenuB[0], 'Submenu elements are expected');

			ok(menu3.attr('visible'), "Options are visible");

			ok(submenuB.hasClass('menu_list'), "<ul> contains required class 'menu_list'");

			var menuB_sub1 = submenuB.find('li:nth-child(1)'),
				menuB_sub2 = submenuB.find('li:nth-child(2)');

			ok(menuB_sub1[0], "Menu option 'Item 1B'");

			ok(menuB_sub1.trigger('mouseover'), "Mouse event 'over'");

			equal(menuB_sub1.children('a').attr('href'), 'http://item1B.domain.com', "Target URL 'http://item1B.domain.com' is expected");

			ok(menuB_sub2[0], "Menu option 'Item 2B'");

			ok(menuB_sub2.trigger('mouseover'), "Mouse event 'mouseover'");

			equal(menuB_sub2.children('a').attr('href'), 'http://item2B.domain.com', "Target URL 'http://item2B.domain.com.com' is expected");

			start();

			ok(menuA_sub3[0], "Menu option 'Menu List B'");

			ok(menuA_sub3.trigger('mouseout'), "Mouse event 'out'");

			stop();

			setTimeout(function() {
				ok(menuA_sub3.hasClass('submenu_hover_off'), "<li> contains required class 'submenu_hover_off'");

				ok(!submenuB.attr('visible'), 'Submenu B options are not visible');

				start();

				ok(menu3[0], "Menu option 'Menu List A'");

				ok(menu3.trigger('mouseout'), "Mouse event 'out'");

				stop();

				setTimeout(function() {
					ok(menu3.hasClass('menu_hover_off'), "<li> contains required class 'menu_hover_off'");

					start();
				}, 500);
			}, 500);
		}, 100);
	}, 100);
});
