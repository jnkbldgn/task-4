const { expect } = require('chai');

const { RepoState } = require('../../utils/repo-state');
const { parsers } = require('../../utils/parsers');

const fileStub = "Тестируем файл";
const fileHashStub = 'b9bf52c2e3b6c56ff9332b34e3a5f3b5334f4e24';
const repoState = new RepoState();

const getFileStub = () =>  Promise.resolve(fileStub);

describe('Получение файла. ', () => {
  it('После выполнения метода getFile(), в поле file храниться обект. ', async function () {
    await repoState.getFile(fileHashStub, getFileStub);
    expect(repoState.file).to.be.an('object');
  });
  it('Возвращаемый элемент содержит поля type content. ', async function () {
    await repoState.getFile(fileHashStub, getFileStub);
    expect(repoState.file).to.be.an('object').that.has.all.keys('type', 'content');
  });
});

describe('Парсинг данных файла для отображения. ', () => {
  it('После выполнения метода file() парсера, получаем объект. ', async function () {
    const resultParser = parsers.file(fileStub);
    expect(resultParser).to.be.an('object');
  });
  it('Возвращаемый элемент содержит поля type content. ', async function () {
    const resultParser = parsers.file(fileStub);
    expect(resultParser).to.be.an('object').that.has.all.keys('type', 'content'); 
  });
});