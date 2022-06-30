const express = require('express');
const router = express.Router();
const notificationService = require('./notification.service');

// routes
router.get('/:id', getNotifications);
router.post('/notificationCount', getById);
router.post('/addNotification', register);
router.post('/update', update);

module.exports = router;

function register(req, res, next) {
    notificationService.create(req.body)
        .then((user) => {
            //console.log('Notification_Service', user)
            return res.status(200).send({user});
        })
        .catch(err => next(err));
}


function getById(req, res, next) {
    notificationService.getById(req.body)
        .then(user => {
            // console.log('data',user)
        })
        .catch(err => next(err));
}


function getNotifications(req, res, next) {
    notificationService.getNotifications(req.params.id)
        .then(notifications => {
            return res.status(200).send(notifications);
        })
        .catch(err => next(err));
}

function update(req, res, next) {
    notificationService.updateNotifictions(req.body)
        .then(notifications => {
            return res.status(200).send(notifications);
        })
        .catch(err => next(err));
}