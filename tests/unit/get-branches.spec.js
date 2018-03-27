const { expect } = require('chai');

const { RepoState } = require('../../utils/repo-state');
const { parsers } = require('../../utils/parsers');

const branchesStub = '* master hash commit \n develop hash commit \n task-4 hash commit ';


const repoState = new RepoState();

const getBranchesStub = () =>  Promise.resolve(branchesStub);

describe('Получение веток репозитория. ', () => {
  it('После выполнения метода getBranches(), в поле branches храниться массив. ', async function () {
    await repoState.getBranches(getBranchesStub);
    expect(repoState.branches).to.be.an('array');
  });
  it('Каждый елемент массива это объект c полями name hash commit. ', async function () {
    await repoState.getBranches(getBranchesStub);
    let isCurrentObjects = true;
    repoState.branches.forEach((item) => {
      if(!item.name || !item.hash || !item.commit){
        isCurrentObjects = false;
        return;
      }
    })
    return isCurrentObjects ? Promise.resolve() : Promise.reject('Ошибка данных'); 
  });
});

describe('Парсинг данных для отображения. ', () => {
  it('После выполнения метода branches() парсера, получаем массив. ', async function () {
    const resultParser = parsers.branches(branchesStub);
    expect(repoState.branches).to.be.an('array');
  });
  it('Каждый елемент массива это объект c полями name hash commit. ', async function () {
    const resultParser = parsers.branches(branchesStub);
    let isCurrentObjects = true;
    resultParser.forEach((item) => {
      if(!item.name || !item.hash || !item.commit){
        isCurrentObjects = false;
        return;
      }
    })
    return isCurrentObjects ? Promise.resolve() : Promise.reject('Ошибка данных'); 
  });
});