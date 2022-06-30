const db = require("_helpers/db");
const Notifications = db.Notification;

module.exports = {
  getById,
  getNotifications,
  createNotification,
  create,
  updateNotifictions,
};

async function getById(userParam) {
  let user = await Notifications.find({
    $or: [
      {
        $and: [
          {
            user_id: userParam.id,
          },
        ],
      },
      {
        $and: [
          {
            request_id: userParam.id,
          },
        ],
      },
    ],
  });
}

async function getNotifications(id) {
  //   let notifications = await Notifications.find();
  let notifications = await Notifications.find({
    request_id: id,
    notification_status: "Unread",
  }).populate("user_id");
  let result = {
    friendRequestNotifications: [],
    subscribeNotifications: [],
  };
  // console.log("====", notifications);
  notifications.forEach((notification) => {
    if (
      notification.notification_type == "Subscribe" ||
      notification.notification_type == "UnSubscribe"
    ) {
      result.subscribeNotifications.push(notification);
    } else {
      result.friendRequestNotifications.push(notification);
    }
  });

  return result;
}

async function create(userParam) {
  const user_notification = await Notifications.findOne({
    user_id: userParam.user_id,
  });
  if (user_notification) {
    // console.log("user_notification_if", user_notification);
    const Notification = new Notifications(userParam);
    const result = await Notification.save();
    return result;
  } else {
    // console.log("else_notification", user_notification);
    const Notification = new Notifications(userParam);
    const result = await Notification.save();
    return result;
  }
}

async function createNotification(params) {
  if (params.type != "") {
    let newNotification = new Notifications({
      user_id: params.user_id,
      request_id: params.friendrequest_id,
      notification_type: params.type,
      notification_status: "Unread",
    });
    let notification = await newNotification.save();
    let result = await Notifications.findById(notification.id).populate(
      "user_id"
    );
    return result;
  }
}

async function updateNotifictions(userParam) {
  let result = await Notifications.updateMany(
    {
      request_id: userParam.id,
      notification_type: { $in: ["Friend", "Accepted", "Rejected", 'Subscribe', 'UnSubscribe'] },
    },
    { notification_status: "Read" },
    { upsert: true },
    function (err, doc) {
      if (err) return res.send(500, { error: err });
      else return doc;
    }
  );
  // console.log("====", result);
  return result;
}
