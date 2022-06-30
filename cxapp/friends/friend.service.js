const db = require("_helpers/db");
const ObjectId = require("mongodb").ObjectId;
const Friends = db.Friend;
const User = db.User;
const notificationService = require("../notifications/notification.service");

module.exports = {
  getById,
  isFriendReqSent,
  create,
  acceptReject,
  getAcceptReject,
  remove,
  getFriends,
  getUserFriendReq,
  updateFriendReqStatus,
};

async function getFriends(id) {
  let friend = await Friends.find({
    $or: [
      {
        $and: [
          {
            user_id: id.toString(),
          },
          {
            friend_req_status: "Accepted",
          },
        ],
      },
      {
        $and: [
          {
            friendrequest_id: id.toString(),
          },
          {
            friend_req_status: "Accepted",
          },
        ],
      },
    ],
  });

  let output = [];

  output = await Promise.all(
    friend.map(async (fr) => {
      let user = {};
      if (fr && fr.user_id !== id) user = await User.findById(fr.user_id);
      else if (fr && fr.friendrequest_id !== id)
        user = await User.findById(fr.friendrequest_id);
      return {
        ...fr.toObject(),
        firstname: user.firstname,
        lastname: user.lastname,
        role: user.role,
        profile: user.profile,
        friendId: user._id,
        username: user.username
      };
    })
  );
  return output;
}
async function getById(userParam) {
  return await Friends.find({
    $or: [
      {
        $and: [
          {
            user_id: userParam.user_id,
          },
          {
            friendrequest_id: userParam.friendrequest_id,
          },
          {
            friend_req_status: "Accepted",
          },
        ],
      },
      {
        $and: [
          {
            user_id: userParam.friendrequest_id,
          },
          {
            friendrequest_id: userParam.user_id,
          },
          {
            friend_req_status: "Accepted",
          },
        ],
      },
    ],
  });
}
async function getUserFriendReq(userParam) {
  let output = [];
  const data = await Friends.find({
    $and: [
      {
        friendrequest_id: userParam.id,
      },
      {
        friend_req_status: "Not Selected",
      },
    ],
  });
  output = await Promise.all(
    data.map(async (fr) => {
      const user = await User.findById(fr.user_id);
      return {
        ...fr.toObject(),
        firstname: user.firstname,
        lastname: user.lastname,
      };
    })
  );
  return output;
}
async function isFriendReqSent(userParam) {
  return await Friends.find({
    $and: [
      {
        user_id: userParam.user_id,
      },
      {
        friendrequest_id: userParam.friendrequest_id,
      },
      {
        friend_req_status: "Not Selected",
      },
    ],
  });
}
async function acceptReject(userParam) {
  console.log("userParam", userParam);
  let user = await Friends.find({
    $or: [
      {
        $and: [
          {
            user_id: userParam.user_id,
          },
          {
            friendrequest_id: userParam.friendrequest_id,
          },
        ],
      },
      {
        $and: [
          {
            user_id: userParam.friendrequest_id,
          },
          {
            friendrequest_id: userParam.user_id,
          },
        ],
      },
    ],
  });
  notificationService
    .createNotification({
      user_id: userParam.friendrequest_id,
      friendrequest_id: userParam.user_id,
      type: userParam.friend_req_status,
    })
    .then((data) => {
      console.log("here");
      io.emit("receiveNotification", data);
    });

  if (user && userParam.friend_req_status == "") {
    return user;
  }
  if (user && userParam.friend_req_status != "") {
    const Friend = new Friends(...user);
    Friend.friend_req_status = userParam.friend_req_status;
    // Friend.friends = userParam.friend_req_status === 'Accepted' ? true : false;
    // console.log('.......', Friend.friends, Friend.friend_req_status)

    const result = await Friend.save();
    let finalResult = [];
    finalResult.push(result);
    return finalResult;
  }
}

async function updateFriendReqStatus(userParam) {
  const friend = await Friends.findById(userParam._id);
  if (friend && userParam.friend_req_status == "") {
    return friend;
  }
  notificationService
    .createNotification({
      user_id: userParam.friendrequest_id,
      friendrequest_id: userParam.user_id,
      type: userParam.friend_req_status,
    })
    .then((data) => {
      io.emit("receiveNotification", data);
    });

  if (friend && userParam.friend_req_status != "") {
    userParam.friends = userParam.friend_req_status === 'Accepted' ? true : false
    console.log('===============', userParam)
    let result = await Friends.findOneAndUpdate(
      { _id: userParam._id },
      userParam,
      { upsert: true },
      function (err, doc) {
        if (err) return res.send(500, { error: err });
        else return doc;
      }
    );
    let finalResult = [];
    finalResult.push(result);
    return finalResult;
  }
}

async function getAcceptReject(userParam) {
  let user = await Friends.find({
    $or: [
      {
        $and: [
          {
            user_id: userParam.user_id,
          },
          {
            friendrequest_id: userParam.friendrequest_id,
          },
        ],
      },
      {
        $and: [
          {
            user_id: userParam.friendrequest_id,
          },
          {
            friendrequest_id: userParam.user_id,
          },
        ],
      },
    ],
  });

  if (user.length && userParam.friend_req_status == "") {
    return user;
  }
  if (user.length && userParam.friend_req_status != "") {
    const Friend = new Friends(...user);
    Friend.friend_req_status = userParam.friend_req_status;
    const result = await Friend.save();
    let finalResult = [];
    finalResult.push(result);
    return finalResult;
  }
}

async function create(userParam) {
  const user = await Friends.findOne({
    user_id: userParam.user_id,
    friendrequest_id: userParam.friendrequest_id,
  });
  // console.log("user", user);
  if (user) {
    // throw "already";
    Object.assign(user, userParam);
    await user.save();
    return user;
  } else {
    const Friend = new Friends(userParam);
    const result = await Friend.save();
    // console.log("result", result);
    return result;
  }
}

async function remove(userParam) {
  const user = await Friends.findOneAndDelete({
  $or: [
    {
      $and: [
        {
          user_id: userParam.user_id,
        },
        {
          friendrequest_id: userParam.friendrequest_id,
        },
      ],
    },
    {
      $and: [
        {
          user_id: userParam.friendrequest_id,
        },
        {
          friendrequest_id: userParam.user_id,
        },
      ],
    },
  ]});
  return user;
}
