const { assert } = require('chai');

describe('1.Открытие главной страницы. ', () => {
  it('Title страницы верный. ', function () {
    return this.browser.url('/').getTitle().then(text => assert.equal(text, 'EmberJS'));
  });
});
