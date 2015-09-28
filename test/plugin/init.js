module('EZ-Menu', {
  setup: function() {
    $('#qunit-fixture')
      .EZMenu([
        { "name": "Menu Link 1", "url": "http://menu1.domain.com" },
        { "name": "Menu Link 2", "url": "http://menu2.domain.com" },
        { "name": "Menu List A", "options": [
          { "name": "Item 1A", "url": "http://item1A.domain.com" },
          { "name": "Item 2A", "url": "http://item2A.domain.com" },
          { "name": "Menu List B", "options": [
            { "name": "Item 1B", "url": "http://item1B.domain.com" },
            { "name": "Item 2B", "url": "http://item2B.domain.com" }
          ]}
        ]}
      ]);
  },
  teardown: function() {
    // Do nothing - preserve element structure
  }
});

test('Generate HTML', function() {
  ok($('#qunit-fixture').find(menu), 'Menu elements created');
});
