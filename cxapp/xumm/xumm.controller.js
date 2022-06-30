const express = require('express');
const router = express.Router();
const xummService = require('./xumm.service');

router.get('/account/:id', getAccount);
router.post('/delete/:id', deleteAccount);
router.post('/connect/:id', connectAccount);
router.post('/webhook', webhook);

module.exports = router;

function getAccount(req, res, next){
    xummService.getAccount(req.params.id)
        .then((account) => {
            return res.status(200).send(account);
        })
        .catch(err => next(err));
}

function deleteAccount(req, res, next){
    xummService.deleteAccount(req.params.id)
        .then((account) => {
            return res.status(200).send(account);
        })
        .catch(err => next(err));
}

function connectAccount(req, res, next){
    xummService.connectAccount(req.params.id)
        .then((account) => {
            return res.status(200).send(account);
        })
        .catch(err => next(err));
}

function webhook(req, res, next){
    xummService.webhook(req.body)
        .then((account) => {
            return res.status(200).send(account);
        })
        .catch(err => next(err));
}
