const express = require("express");
const router = express.Router();
const friendService = require("./friend.service");
const notificationService = require("../notifications/notification.service");
const nodemailer = require("nodemailer");

router.get("/getFriends/:id", getFriends);
router.post("/addfriend", register);
router.post("/removefriend", remove);
router.post("/friend", getById);
router.post("/acceptReject", acceptReject);
router.post("/getAcceptReject", getAcceptReject);

router.post("/isFriendReqSent", isFriendReqSent);
router.post("/getUserFriendReq1", getFriendRequests);
router.post("/updateFriendReqStatus", updateFriendReqStatusController);
module.exports = router;

const user = "verify@chorusx.social";
const pass = "VerVer444$$";
const frontendURL = process.env.frontend || "https://chorusx.herokuapp.com/";

function sendAddFriendNotification(
  email,
  friends,
  userId,
  reqId,
  reqName,
  userName
) {
  const transport = nodemailer.createTransport({
    //host: "smtp.gmail.com",
    host: "mail.privateemail.com",
    port: 465,
    secure: true,
    auth: {
      user: user,
      pass: pass,
    },
  });
  if (friends == true) {
    transport
      .sendMail({
        from: user,
        to: email,
        subject: "Friend Request Confirmation",
        html: `<h1>Accept / Reject Friend Request</h1>
            <h2>Hello ${reqName}</h2>
                <p>${userName} send the friend request. Accept or reject the friend request by clicking on the following link</p>
              <a href=${frontendURL}/#/accept/reject/${userId}/${reqId}> Click here</a>
              </div>`,
      })
      .catch((err) => console.log(err));
  } else if (friends != true) {
    transport
      .sendMail({
        from: user,
        to: email,
        subject: "Friend Request Remove",
        html: `<h1>Friend Request Remove</h1>
            <h2>Hello ${reqName}<c/h2>
                <p>${userName} unfriend you.</p>
      </div>`,
      })
      .catch((err) => console.log(err));
  }
}

function register(req, res, next) {
  friendService
    .create(req.body)
    .then((user) => {
      sendAddFriendNotification(
        req.body.req_email,
        req.body.friends,
        req.body.user_id,
        req.body.friendrequest_id,
        req.body.friendrequest_name,
        req.body.user_name,
        req.body.email
      );
      notificationService
        .createNotification({ ...req.body, type: "Friend" })
        .then((data) => {
          io.emit("receiveNotification", data);
        });
      return res.status(200).send({ user });
    })
    .catch((err) => next(err));
}

function remove(req, res, next) {
  friendService
    .remove(req.body)
    .then((user) => {
      return res.status(200).send({ user });
    })
    .catch((err) => next(err));
}

function getFriends(req, res, next) {
  friendService
    .getFriends(req.params.id)
    .then((users) => {
      return res.status(200).send(users);
    })
    .catch((err) => next(err));
}

function getById(req, res, next) {
  friendService
    .getById(req.body)
    .then((user) => (user ? res.json(user) : res.json({})))
    .catch((err) => next(err));
}

function isFriendReqSent(req, res, next) {
  friendService
    .isFriendReqSent(req.body)
    .then((user) => (user ? res.json(user) : res.json({})))
    .catch((err) => next(err));
}

function acceptReject(req, res, next) {
  friendService
    .acceptReject(req.body)
    .then((user) => (user ? res.json(...user) : res.json({})))
    .catch((err) => next(err));
}

function updateFriendReqStatusController(req, res, next) {
  friendService
    .updateFriendReqStatus(req.body)
    .then((user) => (user ? res.json(...user) : res.json({})))
    .catch((err) => next(err));
}

function getAcceptReject(req, res, next) {
  friendService
    .getAcceptReject(req.body)
    .then((user) =>
      user ? res.status(200).json({ ...user }) : res.status(200).json({})
    )
    .catch((err) => next(err));
}

function getFriendRequests(req, res, next) {
  friendService
    .getUserFriendReq(req.body)
    .then((user) =>
      user ? res.status(200).json(user) : res.status(200).json({})
    )
    .catch((err) => next(err));
}
