const db = require("_helpers/db");
const Blocks = db.Block;
const notificationService = require("../notifications/notification.service");

module.exports = {
  getById,
  isBlock,
  create,
};

async function getById(blockParam) {
  return await Blocks.find({
    $or: [
      {
        $and: [
          { user_id: blockParam.user_id },
          { blockrequest_id: blockParam.blockrequest_id },
          { status: true },
        ],
      },
      {
        $and: [
          { user_id: blockParam.blockrequest_id },
          { blockrequest_id: blockParam.user_id },
          { status: true },
        ],
      },
    ],
  });
}

async function isBlock(blockParam) {
  
  let block = await Blocks.find({
    user_id: blockParam.id,
    blockrequest_id: blockParam.block_id,
    status: true,
  });

  return { blocked: block.length > 0 };
}

async function create(blockParam) {
  const block = await Blocks.findOne({
    user_id: blockParam.user_id,
    blockrequest_id: blockParam.blockrequest_id,
  });
  if (block) {
    Object.assign(block, blockParam);
    await block.save();
  } else {
    const Block = new Blocks(blockParam);
    const result = await Block.save();
  }
}
