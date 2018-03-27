const { spawn } = require('child_process');
const express = require('express');
const config = require('../config/').getConfig(express().get('env'));

function gitSpawn(comandText) {
  const comandsArr = comandText.split(' ');
  const [command, ...keys] = comandsArr;
  const resultSpawn = spawn(command, keys, { cwd: config.repoPath });
  return new Promise((resolve) => {
    let result = [];
    resultSpawn.stdout.on('data', (data) => {
      result += data;
    });
    resultSpawn.on('close', () => {
      resolve(result);
    });
  });
}
exports.gitSpawn = gitSpawn;
