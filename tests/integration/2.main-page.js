const { assert } = require('chai');
const cheerio = require('cheerio');

describe('2.Проверка получения списка веток. ', () => {
  it('На главной странице отображается список веток. ', async function () {
    //this.browser.url('/');
    const branchesList = await this.browser.isExisting('.selenium-branches');
    assert.isOk(branchesList, 'Список веток есть');
    const branchesListInner = await this.browser.getText('.selenium-branches');
    assert.isOk(branchesListInner && branchesListInner.length, 'Список веток не пустой. ');
  });
  it('Каждая ветка содержит ссылку на список коммитов и дерево файлов. ', async function () {
    const branchesElements = await this.browser.getHTML('.selenium-branch-item');
    const branchesElementsArr = [].concat(branchesElements);
    const currentBranchElements = Array.prototype.filter.call(branchesElementsArr, item => {
      const element = cheerio.load(item);
      const nameBranch =  element('.selenium-branch-name').text();
      const linkBranch = element('.selenium-branch-item').attr('href');
      return nameBranch && linkBranch && linkBranch === `/branch/${nameBranch}`;
    });
    assert.isOk(branchesElementsArr.length === currentBranchElements.length, 'У всех веток есть ссылки на коммит. ');
  });
});