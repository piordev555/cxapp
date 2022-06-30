import http from "../http-common";

export async function getRequests(data) {
  return http.post("/chats/getRequest", data);
}
export async function getpartnerReq(data) {
  return http.post("/chats/getpartnerRequest", data);
}

export async function acceptPartnerChatReq(data) {
  return http.post("/chats/acceptParterChatRequest", data);
}

export async function sendRequest(data) {
  return http.post("/chats/request", data);
}

export async function acceptChat(data) {
  return http.post("/chats/accept/", data);
}

export async function rejectChat(data) {
  return http.post("/chats/reject/", data);
}

export async function isAccepted(data) {
  return http.post("/chats/isAccepted", data);
}
