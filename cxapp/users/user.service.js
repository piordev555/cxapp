const config = require("config.json");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("_helpers/db");
const ObjectId = require("mongodb").ObjectId;
const User = db.User;
const Friend = db.Friend;
const Subscription = db.Subscription;

module.exports = {
  authenticate,
  getAll,
  getById,
  getByUsername,
  getusers,
  create,
  update,
  delete: _delete,
  getRole,
  confirmPassword,
  resetPassword,
  frndRequest,
  updateAddFriend,
  checkUsername,
};

async function authenticate({ email, password, confirmationCode }) {
  const user = await User.findOne({
    email,
  });
  if (user && bcrypt.compareSync(password, user.hash)) {
    if (confirmationCode != undefined) {
      const status = await User.findOne({
        confirmationCode,
      });
      if (status) {
        user.status = "Active";
        const statusUser = new User(user);
        const result = await statusUser.save();
      }
    }
    const token = jwt.sign(
      {
        sub: user.id,
      },
      config.secret,
      {
        expiresIn: "7d",
      }
    );
    return {
      ...user.toJSON(),
      token,
    };
  }
}

async function getAll() {
  return await User.find();
}

async function getById(id) {
  // console.log('-----user', id)
  const user = await User.findById(id);
  // console.log('---dfd', user);
  const frndCount = await getFriendsCount(user);
  const subscribeCount = await getSubscibeCount(user);
  const finaloutput = {
    ...user.toObject(),
    friendsCount: frndCount,
    subscribeCount: subscribeCount,
  };
  return finaloutput;
}
async function getByUsername(username) {
  const user = await User.find({username: username});
  const frndCount = await getFriendsCount(user[0]);
  const subscribeCount = await getSubscibeCount(user[0]);
  const finaloutput = {
    ...user[0].toObject(),
    friendsCount: frndCount,
    subscribeCount: subscribeCount,
  };
  return finaloutput;
}
async function updateAddFriend(userParam) {
  let user = await User.findById(userParam.id);
  if (user) {
    const update_user = new User(user);
    update_user.friends = userParam.friends;
    const result = await update_user.save();
    return result;
  }
}
async function getusers(userParam) {
  const lat = userParam.lat;
  const lng = userParam.lng;
  const distanceInKilometer = 6000;
  const radius = distanceInKilometer / 6378.1;
  var val = userParam.hobbies;
  return await User.find({
    role: {
      $in: val,
    },
    loc: {
      $nearSphere: [lng, lat],
      $maxDistance: radius,
    },
  });
}
async function getRole(userParam) {
  const lat = userParam.lat;
  const lng = userParam.lng;
  const distanceInKilometer = 6000;
  const radius = distanceInKilometer / 6378.1;
  var val = userParam.hobbies;
  // console.log("....", val);
  let users = await User.find({
    role: {
      $in: val,
    },
  });
  // console.log("....", users);
  const usersWithFriendReq = await Promise.all(
    (users || []).map(async (u, i) => {
      const frndCount = await getFriendsCount(u);
      const subscribeCount = await getSubscibeCount(u);
      return {
        ...u.toObject(),
        friendsCount: frndCount,
        subscribeCount: subscribeCount,
      };
    })
  );
  return usersWithFriendReq;
}
const getFriendsCount = async (user) => {
  let frnd = await Friend.find(
    {
      $or: [
        {
          $and: [
            {
              user_id: user._id,
            },
            {
              friend_req_status: "Accepted",
            },
          ],
        },
        {
          $and: [
            {
              friendrequest_id: user._id,
            },
            {
              friend_req_status: "Accepted",
            },
         ]
        }
     ]
    },
  );
  return frnd.length;
};

const getSubscibeCount = async (user) => {
  let subscribe = await Subscription.aggregate([
    {
      $match: {
        $and: [{ subrequest_id: user._id.toString() }, { status: true }],
      },
    },
  ]);
  return subscribe.length;
};

async function create(userParam) {
  if (
    await User.findOne({
      email: userParam.email,
    })
  ) {
    throw 'Email "' + userParam.email + '" is already taken';
  }
  if (
    await User.findOne({
      username: userParam.username,
    })
  ) {
    throw 'Username "' + userParam.username + '" is already taken';
  }
  if (userParam.password != userParam.passwordConf) {
    throw "Passowrd's are not matched";
  }
  userParam.role = JSON.parse(userParam.role);
  const token = jwt.sign(
    {
      email: userParam.email,
    },
    config.secret
  );
  userParam.confirmationCode = token;
  const user = new User(userParam);
  if (userParam.lat && userParam.lng) {
    user.loc = {
      type: "Point",
      coordinates: [userParam.lat, userParam.lng],
    };
  }
  if (userParam.password) {
    user.hash = bcrypt.hashSync(userParam.password, 10);
    user.chash = userParam.passwordConf;
  }
  const result = await user.save();
  return result;
}

async function checkUsername(userParam) {
  let res = await User.aggregate([
    {
      $match: {
        $and: [{ username: userParam.username, _id: {$ne: ObjectId(userParam.id)} }],
      },
    },
  ]);
  if (res.length) {
    throw 'Username is not available';
  }
  return true;
}

async function resetPassword(userParam) {
  const user = await User.findOne({
    email: userParam.email,
  });
  if (!user) throw "Please register the email first!!";
  if (user) return user;
}
async function frndRequest(userParam) {
  let id = userParam.user.id;
  const user = await User.findById(id);
  if (!user) throw "User not found";
  if (user) {
    const update_user = new User(user);
    update_user.friend_req_status = userParam.value;
    const result = await update_user.save();
    return result;
  }
}
async function confirmPassword(userParam) {
  const user = await User.findOne({
    email: userParam.email,
  });
  if (user) {
    if (userParam.password == "" && userParam.passwordConf == "") {
      throw "Please fill the password!!";
    } else if (userParam.password != "" && userParam.passwordConf != "") {
      if (userParam.password != userParam.passwordConf) {
        throw "Passowrd's are not matched";
      } else if (userParam.password == userParam.passwordConf) {
        const update_user = new User(user);
        if (userParam.password) {
          update_user.hash = bcrypt.hashSync(userParam.password, 10);
          update_user.chash = userParam.passwordConf;
        }
        const result = await update_user.save();
        return result;
      }
    }
  }
}
async function update(id, userParam) {
  const user = await User.findById(id);
  if (!user) throw "User not found";
  Object.assign(user, userParam);
  await user.save();
}

async function _delete(id) {
  await User.findByIdAndRemove(id);
}

// return await User.aggregate([
//     { "$lookup": {
//       "from": "friends",
//       "localfield": { "id": id },
//       "foreignField ":  { "user_id": id },
//       "as": "table2_values"
//     }},
//   ])
// return await User.find();
