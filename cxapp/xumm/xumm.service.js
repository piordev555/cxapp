const {XummSdk} = require('xumm-sdk')
const config = require('config.json');

const Xumms = require('./xumm.model');
const Sdk = new XummSdk(config.XummPublicKey, config.XummSecretKey)


module.exports = {
    getAccount,
    deleteAccount,
    webhook,
    connectAccount
}

async function getAccount(id){
    let account = await Xumms.findOne({
        user_id: id
    })
    if (!account || !account.token_id){
        return {}
    }
    return account
}

async function deleteAccount(id){
    await Xumms.deleteOne({user_id: id})
    return {}
}

async function webhook(body){
    uuid = body.payloadResponse.payload_uuidv4
    if(!body.payloadResponse.signed){
        await Xumms.deleteOne({uuid})
    }else{
        let result = await Sdk.payload.get(uuid, true)
        
        await Xumms.findOneAndUpdate({uuid}, {
            token_id: body.userToken.user_token,
            createdDate: body.userToken.token_issued,
            expiryDate: body.userToken.token_expiration,
            wallet_id: result.response.account
        })
    }
    console.log(body)
    return {}
}

async function connectAccount(id){
    let account = await Xumms.findOne({
        user_id: id
    })
    if (!account || !account.token_id){
        await Xumms.deleteOne({user_id: id})
        const payload = {
            TransactionType: "SignIn" 
        }
        let result = await Sdk.payload.create(payload, true)
        if(result.uuid){
            await Xumms.create({
                user_id: id,
                uuid: result.uuid
            })
            return result
        }
    }
    return {}
}
