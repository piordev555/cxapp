const db = require("_helpers/db");
const ObjectId = require("mongodb").ObjectId;
const Chats = db.Chat;
const Friends = db.Friend;

module.exports = {
  accept,
  reject,
  isAccepted,
  getRequests,
  getPartnerRequest,
  acceptChatReq,
  request,
};

async function accept(chatParam) {
  const chat = await Chats.findById(chatParam.id);
  Object.assign(chat, { status: 1 });
  let result = chat.save();
  return result;
}

async function reject(chatParam) {
  const chat = await Chats.findById(chatParam.id);
  Object.assign(chat, { status: -1 });
  let result = chat.save();
  return result;
}

async function getRequests(chatParam) {
  return await Chats.find({
    chatrequest_id: chatParam.chatrequest_id,
    status: 2,
  }).populate("chatrequest_id");
}

async function getPartnerRequest(chatParam) {
  return await Chats.find({
    chatrequest_id: chatParam.chatrequest_id,
    user_id: chatParam.user_id,
    status: 2,
  })
}

async function acceptChatReq(chatParam) {
  const chat = await Chats.find({
   });
    console.log('.......', chat)
    let result = await Chats.update({ chatrequest_id: ObjectId(chatParam.chatrequest_id),
      user_id: chatParam.user_id}, { $set: { status: 1 } });
      return result;
}

async function isAccepted(chatParam) {
  let friend = await Friends.find({
    $or: [
      {
        $and: [
          { user_id: chatParam.id },
          { friendrequest_id: chatParam.user_id },
          { friends: true },
        ],
      },
      {
        $and: [
          { user_id: chatParam.user_id },
          { friendrequest_id: chatParam.id },
          { friends: true },
        ],
      },
    ],
  });
  if (friend.length > 0) {
    return { status: 1 };
  }
  let chat = await Chats.find({
    $or: [
      {
        $and: [
          { user_id: chatParam.id },
          { chatrequest_id: chatParam.user_id },
          { status: 1 },
        ],
      },
      {
        $and: [
          { user_id: chatParam.user_id },
          { chatrequest_id: chatParam.id },
          { status: 1 },
        ],
      },
    ],
  });
  if (chat.length) {
    return {status: 1};
  } else {
    return { status: 0 };
  }
}

async function request(chatParam) {
  const chat = await Chats.findOne({
    user_id: chatParam.user_id,
    chatrequest_id: chatParam.id,
  });
  if (chat) {
    Object.assign(chat, { status: 2 });
    let result = chat.save();
    return result;
  } else {
    const Block = new Chats({
      user_id: chatParam.user_id,
      chatrequest_id: chatParam.id,
      status: 2,
    });
    const result = await Block.save();
    return result;
  }
}
