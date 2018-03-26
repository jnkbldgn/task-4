const { spawn } = require('child_process');
const { parsers } = require('./parsers');

function RepoState(repoPath) {
  this.hashDefault = 'master';
  this.hashCurrent = this.hashDefault;
  this.hashBranch = '';
  this.hashCommit = '';
  this.hashParents = [];
  this.repoPath = repoPath;
  this.branches = [];
  this.commites = [];
  this.tree = [];
}

RepoState.prototype = {
  getBranches: async function getBranches() {
    try {
      const resultSpawn = spawn('git', ['branch', '-v'], { cwd: this.repoPath });
      let dataSpawn = '';
      resultSpawn.stdout.on('data', (data) => {
        dataSpawn += data;
      });
      await new Promise((resolve) => {
        resultSpawn.on('close', () => {
          this.branches = parsers.branches(dataSpawn, this.hashCurrent);
          this.commites = [];
          this.tree = [];
          resolve();
        });
      });
    } catch (e) {
      throw (e);
    }
  },
  getCommites: async function getCommites(hashBranch) {
    try {
      if (!hashBranch) return;
      this.hashCurrent = hashBranch;
      this.hashBranch = hashBranch;
      this.hashCommit = '';
      const commitesSpawn = spawn('git', ['log', '--date=raw', '--pretty=format:"%H\t%p\t%an\t%aI\t%s', this.hashCurrent], { cwd: this.repoPath });
      let commitesData = '';
      commitesSpawn.stdout.on('data', (data) => {
        commitesData += data;
      });
      await new Promise((resolve) => {
        commitesSpawn.on('close', () => {
          this.commites = parsers.commites(commitesData, hashBranch);
          this.branches.sort((a) => {
            const result = a.name.toString() === hashBranch.toString() ? -1 : 1;
            return result;
          });
          resolve();
        });
      });
    } catch (e) {
      throw (e);
    }
  },
  getTree: async function getTree(hashCommit, saveHistory) {
    try {
      if (!hashCommit) return;
      if (saveHistory) this.hashParents.push(this.hashCurrent);
      this.hashCurrent = hashCommit;
      this.hashCommit = hashCommit;
      const resultSpawn = spawn('git', ['ls-tree', '--full-name', this.hashCurrent], { cwd: this.repoPath });
      let dataSpawn = '';
      resultSpawn.stdout.on('data', (data) => {
        dataSpawn += data;
      });
      await new Promise((resolve) => {
        resultSpawn.on('close', () => {
          this.tree = parsers.tree(dataSpawn);
          this.tree.sort((a) => {
            const result = a.isTree ? -1 : 1;
            return result;
          });
          resolve();
        });
      });
    } catch (e) {
      throw (e);
    }
  },
  getFile: async function getFile(hasFile) {
    try {
      if (!hasFile) return;
      this.hashCurrent = hasFile;
      const resultSpawn = spawn('git', ['show', this.hashCurrent], { cwd: this.repoPath });
      let dataSpawn = '';
      resultSpawn.stdout.on('data', (data) => {
        dataSpawn += data;
      });
      await new Promise((resolve) => {
        resultSpawn.on('close', () => {
          this.file = parsers.file(dataSpawn, this.hasParent);
          resolve();
        });
      });
    } catch (e) {
      throw (e);
    }
  },
};

exports.RepoState = RepoState;
