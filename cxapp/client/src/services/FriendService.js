import http from "../http-common";

export async function friendrequest(data) {
  return http.post("/friends/addfriend", data);
}

export async function unfriend(data) {
  console.log('---data', data)
  return http.post("/friends/removefriend", data);
}

export async function isFriendReqSent(data) {
  return http.post("/friends/isFriendReqSent", data);
}

export async function friends(data) {
  return http.post("/friends/friend/", data);
}

export async function getUserFriendReq(data) {
  return http.post("/friends/getUserFriendReq1", data);
}

export async function updateFriendReqStatus(data) {
  return http.post("/friends/updateFriendReqStatus", data);
}

export async function getUserFriend(id) {
  return http.get(`/friends/getFriends/${id}`);
}
