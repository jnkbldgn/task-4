const { spawn } = require('child_process');
const { parsers } = require('./parsers');

class RepoState {
  constructor(repoPath) {
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
  getBranches() {
    return new Promise((resolve) => {
      const resultSpawn = spawn('git', ['branch', '-v'], { cwd: this.repoPath });
      let dataSpawn = '';
      resultSpawn.stdout.on('data', (data) => {
        dataSpawn += data;
      });
      resultSpawn.on('close', () => {
        this.branches = parsers.branches(dataSpawn, this.hashCurrent);
        this.commites = [];
        this.tree = [];
        resolve();
      });
    });
  }
  getCommites(hashBranch) {
    return new Promise((resolve) => {
      this.hashCurrent = hashBranch;
      this.hashBranch = hashBranch;
      this.hashCommit = '';
      const commitesSpawn = spawn('git', ['log', '--date=raw', '--pretty=format:"%H\t%p\t%an\t%aI\t%s', this.hashCurrent], { cwd: this.repoPath });
      let commitesData = '';
      commitesSpawn.stdout.on('data', (data) => {
        commitesData += data;
      });
      commitesSpawn.on('close', () => {
        this.commites = parsers.commites(commitesData, hashBranch);
        this.branches.sort((a) => {
          const result = a.name.toString() === hashBranch.toString() ? -1 : 1;
          return result;
        });
        resolve();
      });
    });
  }
  async getTree(hashCommit, saveHistory) {
    return new Promise((resolve) => {
      if (!hashCommit) return;
      if (saveHistory) this.hashParents.push(this.hashCurrent);
      this.hashCurrent = hashCommit;
      this.hashCommit = hashCommit;
      const resultSpawn = spawn('git', ['ls-tree', '--full-name', this.hashCurrent], { cwd: this.repoPath });
      let dataSpawn = '';
      resultSpawn.stdout.on('data', (data) => {
        dataSpawn += data;
      });
      resultSpawn.on('close', () => {
        this.tree = parsers.tree(dataSpawn);
        this.tree.sort((a) => {
          const result = a.isTree ? -1 : 1;
          return result;
        });
        resolve();
      });
    });
  }
  getFile(hasFile) {
    return new Promise((resolve) => {
      if (!hasFile) return;
      this.hashCurrent = hasFile;
      const resultSpawn = spawn('git', ['show', this.hashCurrent], { cwd: this.repoPath });
      let dataSpawn = '';
      resultSpawn.stdout.on('data', (data) => {
        dataSpawn += data;
      });
      resultSpawn.on('close', () => {
        this.file = parsers.file(dataSpawn, this.hasParent);
        resolve();
      });
    });
  }
}

exports.RepoState = RepoState;
