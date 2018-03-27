const { expect } = require('chai');

const { RepoState } = require('../../utils/repo-state');
const { parsers } = require('../../utils/parsers');

const branchStub = 'master';
const commitesStub = "'b9bf52c2e3b6c56ff9332b34e3a5f3b5334f4e24\t079c428\tJames Murphy\t2015-01-09T06:34:56+11:00\tInitial Commit for ember-truth-helpers' \n'079c4288bb0404b8f81cbe477f1130e175c1904e\t079c428\tTomster\t2015-01-09T06:34:56+11:00\tInitial Commit from Ember CLI v0.1.5'";


const repoState = new RepoState();

const getCommitesStub = () =>  Promise.resolve(commitesStub);

describe('Получение коммитов репозитория. ', () => {
  it('После выполнения метода getCommites(), в поле commites храниться массив. ', async function () {
    await repoState.getCommites(branchStub, getCommitesStub);
    expect(repoState.commites).to.be.an('array');
  });
  it('Каждый елемент массива это объект c полями fullHash hashBranch hash author date commit. ', async function () {
    await repoState.getCommites(branchStub, getCommitesStub);
    let isCurrentObjects = true;
    repoState.commites.forEach((item) => {
      if(!item.fullHash || !item.hashBranch || !item.hash || 
         !item.author || !item.date || !item.commit){
       isCurrentObjects = false;
       return;
     }
    })
    return isCurrentObjects ? Promise.resolve() : Promise.reject('Ошибка данных'); 
  });
});

describe('Парсинг данных для отображения коммитов. ', () => {
  it('После выполнения метода commites() парсера, получаем массив. ', async function () {
    const resultParser = parsers.commites(commitesStub, branchStub);
    expect(repoState.commites).to.be.an('array');
  });
  it('Каждый елемент массива это объект c полями fullHash hashBranch hash author date commit. ', async function () {
    const resultParser = parsers.commites(commitesStub, branchStub);
    let isCurrentObjects = true;
    resultParser.forEach((item) => {
      if(!item.fullHash || !item.hashBranch || !item.hash || 
         !item.author || !item.date || !item.commit){
        isCurrentObjects = false;
        return;
      }
    })
    return isCurrentObjects ? Promise.resolve() : Promise.reject('Ошибка данных'); 
  });
  it('Переданный идентификатор ветки равен возвращаемому ', async function () {
    const resultParser = parsers.commites(commitesStub, branchStub);
    expect(repoState.hashBranch).to.deep.equal(branchStub);
  });
  it('Полученая дата валидна ', async function () {
    const resultParser = parsers.commites(commitesStub, branchStub);
    let isCurrectDate = true;
    resultParser.forEach(item => {
      if(item.date === 'Invalid date'){
        isCurrectDate = false;
        return;
      }
    })
    return isCurrectDate ? Promise.resolve() : Promise.reject('Ошибка формата даты');
  });
});