const { assert } = require('chai');
const cheerio = require('cheerio');

describe('6. Выбор файла. ', () => {
  it('Открывается просмотр выбранного файла . ', async function () {
    await this.browser.click('.selenium-file:last-child');
    const showFileHtml = await this.browser.getHTML('.selenium-show-file');
    const isSuccess = !!showFileHtml.length;
    assert.isOk(isSuccess, 'Окно с содержимым файла есть');
  });
})