
const { parsers } = require('./parsers');
const { gitSpawn } = require('./git-commands');

class RepoState {
  constructor() {
    this.hashDefault = 'master';
    this.hashCurrent = this.hashDefault;
    this.hashBranch = '';
    this.hashCommit = '';
    this.hashParents = [];
    this.branches = [];
    this.commites = [];
    this.tree = [];
  }
  async getBranches(spawn = gitSpawn) {
    const command = 'git branch -v';
    const resultSpawn = await spawn(command);
    return new Promise((resolve) => {
      this.branches = parsers.branches(resultSpawn, this.hashCurrent);
      this.commites = [];
      this.tree = [];
      resolve();
    });
  }
  async getCommites(hashBranch, spawn = gitSpawn) {
    this.hashCurrent = hashBranch;
    this.hashBranch = hashBranch;
    this.hashCommit = '';
    const command = `git log --date=raw --pretty=format:'%H\t%p\t%an\t%aI\t%s' ${this.hashCurrent}`;
    const resultSpawn = await spawn(command);
    return new Promise((resolve) => {
      this.commites = parsers.commites(resultSpawn, hashBranch);
      this.branches.sort((a) => {
        const result = a.name.toString() === hashBranch.toString() ? -1 : 1;
        return result;
      });
      resolve();
    });
  }
  async getTree(hashCommit, saveHistory, spawn = gitSpawn) {
    if (saveHistory) this.hashParents.push(this.hashCurrent);
    this.hashCurrent = hashCommit;
    this.hashCommit = hashCommit;
    const command = `git ls-tree --full-name ${this.hashCurrent}`;
    const resultSpawn = await spawn(command);
    return new Promise((resolve) => {
      this.tree = parsers.tree(resultSpawn);
      this.tree.sort((a) => {
        const result = a.isTree ? -1 : 1;
        return result;
      });
      resolve();
    });
  }
  async getFile(hasFile, spawn = gitSpawn) {
    this.hashCurrent = hasFile;
    const command = `git show ${this.hashCurrent}`;
    const resultSpawn = await spawn(command);
    return new Promise((resolve) => {
      this.file = parsers.file(resultSpawn);
      resolve();
    });
  }
}

exports.RepoState = RepoState;
