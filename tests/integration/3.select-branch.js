const { assert } = require('chai');
const cheerio = require('cheerio');

describe('3. Выбор ветки. ', () => {
  it('В выбранной ветке отображаются коммиты. ', async function () {
    await this.browser.click('.selenium-branch-item:first-child');
    const commitesList = await this.browser.isExisting('.selenium-commites');
    assert.isOk(commitesList, 'Список коммитов есть. ');
    const commitesListInner = await this.browser.getText('.selenium-commites');
    assert.isOk(commitesListInner && commitesListInner.length, 'Список коммитов не пустой. ');
  });
  it('В выбранной ветке отображается дерево файлов. ', async function () {
    const treeList = await this.browser.isExisting('.selenium-tree');
    assert.isOk(treeList, 'Список файлов есть. ');
    const treeListInner = await this.browser.getText('.selenium-tree');
    assert.isOk(treeListInner && treeListInner.length, 'Список файлов не пустой. ');
  });
  it('Каждый коммит содержит ссылку на список дерево файлов. ', async function () {
    const commitesElements = await this.browser.getHTML('.selenium-commites-item');
    const commitesElementsArr = [].concat(commitesElements); 
    const currentCommitesElements = Array.prototype.filter.call(commitesElementsArr, item => {
      const element = cheerio.load(item);
      const nameCommit =  element('.selenium-commites-author').text();
      const linkCommit = element('.selenium-commites-item').attr('href');
      const dataBranch = element('.selenium-commites-item').attr('data-selenium-branch');
      const dataCommit = element('.selenium-commites-item').attr('data-selenium-commit');
      return nameCommit && linkCommit && linkCommit === `/commit/${dataBranch}/${dataCommit}`;
    });
    assert.isOk(commitesElementsArr.length === currentCommitesElements.length, 'У всех коммитов есть ссылки на дерево файлов. ');
  });
  it('Каждый элемент дерева содержит ссылку. ', async function () {
    const treeElements = await this.browser.getHTML('.selenium-tree-item');
    const treeElementsArr = [].concat(treeElements); 
    const treeCommitesElements = Array.prototype.filter.call(treeElements, item => {
      const element = cheerio.load(item);
      const nameTree =  element('.selenium-tree-name').text();
      const linkTree = element('.selenium-tree-item').attr('href');
      const dataBranch = element('.selenium-tree-item').attr('data-selenium-branch');
      const dataTree = element('.selenium-tree-item').attr('data-selenium-hash');
      const type = Boolean(JSON.parse(element('.selenium-tree-item').attr('data-selenium-is-tree'))) ? 'tree' : 'file';
      return nameTree && linkTree && linkTree === `/${type}/${dataBranch}/${dataTree}`;
    });
    assert.isOk(treeElementsArr.length === treeCommitesElements.length, 'У всех элементов дерева есть ссылки . ');
  });
})