const { assert } = require('chai');
const cheerio = require('cheerio');

describe('4. Выбор коммита. ', () => {
  it('В выбранном коммите отображается дерево файлов . ', async function () {
    await this.browser.click('.selenium-commites-item:first-child');
    const treeList = await this.browser.isExisting('.selenium-tree');
    assert.isOk(treeList, 'Список файлов есть. ');
    const treeListInner = await this.browser.getText('.selenium-tree');
    assert.isOk(treeListInner && treeListInner.length, 'Список файлов не пустой. ');
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
      const type = Boolean(JSON.parse(element('.selenium-tree-item').attr('data-selenium-is-tree'))) ? 'tree' : 'file';
      return nameTree && linkTree && linkTree === `/${type}/${dataBranch}/${dataCommit}/${dataTree}`;
    });
    assert.isOk(treeElementsArr.length === treeCommitesElements.length, 'У всех элементов дерева есть ссылки . ');
  });
})