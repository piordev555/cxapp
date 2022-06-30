const express = require("express");
const router = express.Router();
const chatService = require("./chat.service");

// routes
router.post("/request", request);
router.post("/accept", accept);
router.post("/reject", reject);
router.post("/isAccepted", isAccepted);
router.post("/getRequest", getRequests);
router.post("/getpartnerRequest", getPartnerReq);
router.post("/acceptParterChatRequest", acceptPartnerReq);


module.exports = router;

function request(req, res, next) {
  chatService
    .request(req.body)
    .then((result) => (result ? res.json(result) : res.json({})))
    .catch((err) => next(err));
}

function getRequests(req, res, next) {
  chatService
    .getRequests(req.body)
    .then((result) => (result ? res.json(result) : res.json({})))
    .catch((err) => next(err));
}

function getPartnerReq(req, res, next) {
  chatService
    .getPartnerRequest(req.body)
    .then((result) => (result ? res.json(result) : res.json({})))
    .catch((err) => next(err));
}

function acceptPartnerReq(req, res, next) {
  chatService
    .acceptChatReq(req.body)
    .then((result) => (result ? res.json(result) : res.json({})))
    .catch((err) => next(err));
}

function accept(req, res, next) {
  chatService
    .accept(req.body)
    .then((result) => (result ? res.json(result) : res.json({})))
    .catch((err) => next(err));
}

function reject(req, res, next) {
  chatService
    .reject(req.body)
    .then((result) => (result ? res.json(result) : res.json({})))
    .catch((err) => next(err));
}

function isAccepted(req, res, next) {
  chatService
    .isAccepted(req.body)
    .then((result) => (result ? res.json(result) : res.json({})))
    .catch((err) => next(err));
}
