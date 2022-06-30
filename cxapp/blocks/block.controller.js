const express = require('express');
const router = express.Router();
const blockService = require('./block.service');

// routes
router.post('/addblocked', register);
router.post('/block', getById);
router.post('/isBlock', isBlock);
module.exports = router;


function register(req, res, next) {
    blockService.create(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getById(req, res, next) {
    blockService.getById(req.body)
        .then(user => user ? res.json(user) : res.json({}))
        .catch(err => next(err));
}

function isBlock(req, res, next) {
    blockService.isBlock(req.body)
        .then(result => result ? res.json(result) : res.json({}))
        .catch(err => next(err));
}
