const { assert } = require('chai');
const cheerio = require('cheerio');
const { URL } = require('url');

describe('5. Выбор папки. ', () => {
  it('В выбранном коммите отображается дерево файлов . ', async function () {
    await this.browser.click('.selenium-fold:first-child');
    const treeList = await this.browser.isExisting('.selenium-tree');
    const backTree = await this.browser.isExisting('.selenium-back');
    assert.isOk(treeList, 'Список файлов есть. ');
    const treeListInner = await this.browser.getText('.selenium-tree');
    assert.isOk((treeListInner && treeListInner.length) || backTree, 'Список файлов не пустой или есть возможность вернуться на уровень выше');
  });
  it('Каждый элемент дерева содержит ссылку. ', async function () {
    const treeElements = await this.browser.getHTML('.selenium-tree-item');
    const treeElementsArr = [].concat(treeElements);
    const treeCommitesElements = Array.prototype.filter.call(treeElementsArr, item => {
      const element = cheerio.load(item);
      const nameTree =  element('.selenium-tree-name').text();
      const linkTree = element('.selenium-tree-item').attr('href');
      const dataBranch = element('.selenium-tree-item').attr('data-selenium-branch');
      const dataCommit = element('.selenium-tree-item').attr('data-selenium-commit');
      const dataTree = element('.selenium-tree-item').attr('data-selenium-hash');
      const typeData = (element('.selenium-tree-item').attr('data-selenium-is-tree'));
      const type =  Boolean(JSON.parse(typeData)) ? 'tree' : 'file';
      return nameTree && linkTree && linkTree === `/${type}/${dataBranch}/${dataCommit}/${dataTree}`;
    });
    assert.isOk(treeElementsArr.length === treeCommitesElements.length, 'У всех элементов дерева есть ссылки . ');
  });
  it('Вернуться на уровень выше. ', async function(){
    const backHTML = await this.browser.getHTML('.selenium-back');
    const backElement = cheerio.load(backHTML);
    const linkBack = backElement('.selenium-back').attr('href'); 
    await this.browser.click('.selenium-back');
    const urlString = await this.browser.getUrl();
    const successBack = new URL(urlString).pathname === linkBack;
    assert.isOk(successBack, 'Успешно вернулись на уровень выше');
  })
})