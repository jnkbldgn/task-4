const { expect } = require('chai');

const { RepoState } = require('../../utils/repo-state');
const { parsers } = require('../../utils/parsers');

const treeStub = "100644 blob 959e1696e7b2c970005c35ec8a0f94aea5df36ac	.bowerrc\n 100644 blob 2fe4874a0e8a5ff0a9290409de063d666b766e28	.editorconfig\n 100644 blob ee64cfed2a8905dc23506af1060ec80cf887582d	.ember-cli"
const commitStub = 'b9bf52c2e3b6c56ff9332b34e3a5f3b5334f4e24';
const repoState = new RepoState();

const getTreeStub = () =>  Promise.resolve(treeStub);

describe('Получение дерева файлов репозитория. ', () => {
  it('После выполнения метода getTree(), в поле tree храниться массив. ', async function () {
    await repoState.getTree(commitStub, false, getTreeStub);
    expect(repoState.tree).to.be.an('array');
  });
  it('Каждый елемент массива это объект c полями name hash commit. ', async function () {
    await repoState.getTree(commitStub, false, getTreeStub);
    let isCurrentObjects = true;
    repoState.tree.forEach((item) => {
      if(!item.type || !item.hash || !item.name || item.isTree === undefined){
        isCurrentObjects = false;
        return;
      }
    })
    return isCurrentObjects ? Promise.resolve() : Promise.reject('Ошибка данных'); 
  });
});

describe('Парсинг данных для отображения дерева файлов. ', () => {
  it('После выполнения метода tree() парсера, получаем массив. ', async function () {
    const resultParser = parsers.tree(treeStub);
    expect(repoState.tree).to.be.an('array');
  });
  it('Каждый елемент массива это объект c полями name hash type isTree. ', async function () {
    const resultParser = parsers.tree(treeStub);
    let isCurrentObjects = true;
    resultParser.forEach((item) => {
      if(!item.type || !item.hash || !item.name || item.isTree === undefined){
        isCurrentObjects = false;
        return;
      }
    })
    return isCurrentObjects ? Promise.resolve() : Promise.reject('Ошибка данных'); 
  });
});