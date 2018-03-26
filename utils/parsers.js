const express = require('express');
const moment = require('moment');

const app = express();
const config = require('../config/').getConfig(app.get('env'));

function parserBranches(data) {
  if (!data || !data.length) {
    return [];
  }
  const dataFormater = data.toString().split(/\n/).filter(item => !!item);
  const result = dataFormater && dataFormater.length ? dataFormater.map((item) => {
    const itemParts = item.split(/\s+/);
    return {
      name: itemParts[1],
      hash: itemParts[2],
      commit: itemParts.slice(3).join(' '),
    };
  }) : [];
  return result;
}

function parserCommites(data, hashBranch, hashCommit) {
  if (!data || !data.length) {
    return [];
  }
  const dataFormater = data.toString().split(/\n/).filter(item => !!item);
  const result = dataFormater && dataFormater.length ? dataFormater.map((item) => {
    const itemParts = item.split(/\t/);
    return {
      fullHash: itemParts[0].replace(/^"/, ''),
      hashBranch,
      hashCommit,
      hash: itemParts[1],
      author: itemParts[2],
      date: moment.utc(itemParts[3]).format(config.dateFormat),
      commit: itemParts.slice(4).join(' '),
    };
  }) : [];
  return result;
}

function parserTree(data) {
  if (!data || !data.length) {
    return [];
  }
  const dataFormater = data.toString().split(/\n/).filter(item => !!item);
  const result = dataFormater && dataFormater.length ? dataFormater.map((item) => {
    const itemParts = item.split(/\s+/);
    return {
      isTree: itemParts[1] === 'tree',
      type: itemParts[1],
      hash: itemParts[2],
      name: itemParts[3],
    };
  }) : [];
  return result;
}

function parserFile(data) {
  return {
    type: '',
    content: data,
  };
}

exports.parsers = {
  branches: parserBranches,
  commites: parserCommites,
  tree: parserTree,
  file: parserFile,
};
