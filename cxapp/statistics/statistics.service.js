const db = require("_helpers/db");
const Friends = db.Friend;
const User = db.User;
const Subscriptions = db.Subscription;

module.exports = {
  getStatistics
};

async function getStatistics() {
  const reisteredCnt = await User.aggregate(
    [
      {
        $match: {
          status: 'Active'
        }
      },
      {
        $count: "registeredAccountsCount"
      }
    ]
  )
  const rolesCount = await User.aggregate(
    [
      {$unwind :"$role"},
      {$group : { _id : '$role', count : {$sum : 1}}}
    ]
  )

  const friendsCount = await Friends.find({
    friend_req_status: 'Accepted',
    friends: true,
  });

  const subscriberCount = await Subscriptions.find({
    status: true
  });
 
  return {
    ...reisteredCnt[0],
    rolesCount: rolesCount,
    totalFriendsConnection: friendsCount.length,
    totalSubscribers: subscriberCount.length
   };
}
