module('EZ-Menu', {
	setup : function() {
		$('#qunit-fixture')
			.EZMenu([
				{ "name" : "Menu Link 1", "url" : "http://domain1.com" },
				{ "name" : "Menu Link 2", "url" : "http://domain2.com" },
				{ "name" : "Menu List A", "options" : [
					{ "name" : "Item 1", "url" : "http://domain3.com" },
					{ "name" : "Item 2", "url" : "http://domain4.com" },
					{ "name" : "Menu List 2", "options" : [
						{ "name" : "Item 3", "url" : "http://domain3.com" },
						{ "name" : "Item 4", "url" : "http://domain4.com" }
					]}
				]}
			]);
	},
	teardown : function() {
		// do nothing - preserve element structure
	}
});

test('Generate HTML', function() {
	ok($('#qunit-fixture').find(menu), 'Menu elements created');
});
