const express = require('express');
const { RepoState } = require('../utils/repo-state');
const config = require('../config/').getConfig(express().get('env'));

const router = express.Router();
const repoState = new RepoState(config.repoPath);

async function index(req, res) {
  await repoState.getBranches();
  res.render('index', {
    selectBranch: '',
    selectCommit: '',
    branches: repoState.branches,
    commites: repoState.commites,
    tree: repoState.tree,
  });
}

async function branch(req, res) {
  if (!repoState.branches || !repoState.branches.length) {
    await repoState.getBranches();
  }
  await repoState.getCommites(req.params.branch);
  await repoState.getTree(req.params.branch, false);
  res.render('index', {
    notTop: repoState.hashCurrent !== repoState.hashParent,
    selectBranch: req.params.branch.toString(),
    selectCommit: '',
    branches: repoState.branches,
    commites: repoState.commites,
    tree: repoState.tree,
  });
}

async function commit(req, res) {
  if (!repoState.branches || !repoState.branches.length) {
    await repoState.getBranches();
  }
  if (!repoState.commites || !repoState.commites.length) {
    await repoState.getCommites(req.params.branch);
  }
  await repoState.getTree(req.params.commit, false);
  res.render('index', {
    selectBranch: req.params.branch,
    selectCommit: req.params.commit,
    branches: repoState.branches,
    commites: repoState.commites,
    tree: repoState.tree,
  });
}

async function tree(req, res) {
  if (!repoState.branches || !repoState.branches.length) {
    await repoState.getBranches();
  }
  if (!repoState.commites || !repoState.commites.length) {
    await repoState.getCommites(req.params.branch);
  }
  await repoState.getTree(req.params.tree, true);
  const hashParent = repoState.hashParents[repoState.hashParents.length - 1];
  res.render('index', {
    hashParent,
    isTop: (repoState.hashCommit === hashParent) ||
              (repoState.hashBranch === hashParent),
    selectBranch: req.params.branch,
    selectCommit: req.params.commit,
    branches: repoState.branches,
    commites: repoState.commites,
    tree: repoState.tree,
  });
}

async function file(req, res) {
  if (!repoState.branches || !repoState.branches.length) {
    await repoState.getBranches();
  }
  if (!repoState.commites || !repoState.commites.length) {
    await repoState.getCommites(req.params.branch);
  }
  if (!repoState.tree || !repoState.tree.length) {
    await repoState.getTree(repoState.hashCurrent, false);
  }
  await repoState.getFile(req.params.file);
  const hashParent = repoState.hashParents[repoState.hashParents.length - 1];
  res.render('index', {
    hashParent,
    isTop: (repoState.hashCommit === hashParent) ||
                (repoState.hashBranch === hashParent),
    selectBranch: req.params.branch,
    selectCommit: req.params.commit,
    branches: repoState.branches,
    commites: repoState.commites,
    tree: repoState.tree,
    file: repoState.file,
  });
}

async function parent(req, res) {
  if (!repoState.branches || !repoState.branches.length) {
    await repoState.getBranches();
  }
  if (!repoState.commites || !repoState.commites.length) {
    await repoState.getCommites(req.params.branch);
  }
  await repoState.getTree(req.params.parent, false);
  repoState.hashParents.splice(repoState.hashParents.length - 1, 1);
  const hashParent = repoState.hashParents[repoState.hashParents.length - 1];
  res.render('index', {
    hashParent,
    isTop: (repoState.hashCommit === hashParent) ||
                (repoState.hashBranch === hashParent),
    selectBranch: req.params.branch,
    selectCommit: req.params.commit,
    branches: repoState.branches,
    commites: repoState.commites,
    tree: repoState.tree,
  });
}

router.get('/', index);
router.get('/branch/:branch', branch);
router.get('/commit/:branch/:commit', commit);
router.get('/tree/:branch/:commit?/:tree', tree);
router.get('/file/:branch/:commit?/:file', file);
router.get('/parent/:branch/:commit?/:parent', parent);

exports.router = router;
