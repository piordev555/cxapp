const express = require('express');
const router = express.Router();
const subscribe = require('./subscribe.service');

// routes
router.post('/addsubscribe', register);
router.post('/subscribe', getById);
module.exports = router;


function register(req, res, next) {
    subscribe.create(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}


function getById(req, res, next) {
    subscribe.getById(req.body)
        .then(user => user ? res.json(user) : res.json({}))
        .catch(err => next(err));
}
