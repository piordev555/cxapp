const db = require("_helpers/db");
const Subscriptions = db.Subscription;
const notificationService = require("../notifications/notification.service");

module.exports = {
  getById,
  create,
};

async function getById(userParam) {
  return await Subscriptions.find({
    $or: [
      {
        $and: [
          { user_id: userParam.user_id },
          { subrequest_id: userParam.subrequest_id },
          { status: true },
        ],
      },
      {
        $and: [
          { user_id: userParam.subrequest_id },
          { subrequest_id: userParam.user_id },
          { status: true },
        ],
      },
    ],
  });
}

async function create(userParam) {
  notificationService
    .createNotification({
      user_id: userParam.user_id,
      friendrequest_id: userParam.subrequest_id,
      type: userParam.status ? "Subscribe" : 'UnSubscribe',
    })
    .then((data) => {
      io.emit("receiveNotification", data);
    });
  const user = await Subscriptions.findOne({
    user_id: userParam.user_id,
    subrequest_id: userParam.subrequest_id,
  });
  if (user) {
    Object.assign(user, userParam);
    await user.save();
  } else {
    const Subscription = new Subscriptions(userParam);
    const result = await Subscription.save();
  }
}
