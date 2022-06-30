import http from "../http-common";

export async function createUser(data) {
  return http.post("/users/register", data);
}

export async function checkUsername(data) {
  return http.post("/users/checkUserName", data);
}

export async function login(data) {
  return http.post("/users/authenticate", data);
}

export async function userDetail(id) {
  return http.get(`/users/${id}`);
}
export async function userDetailByUsername(username) {
  return http.get(`/users/getByUsername/${username}`);
}

export async function editprofile(id, data) {
  return http.put(`/users/edit/${id}`, data);
}

export async function getAllUsers() {
  return http.get(`/users`);
}

export async function getusers(data) {
  return http.post("/users/user", data);
}

export async function getRole(data) {
  return http.post("/users/role", data);
}

export async function getResetPassword(data) {
  return http.post("/users/resetPassword", data);
}
export async function getConfirmPassword(data) {
  return http.post("/users/confirmPassword", data);
}
export async function getFrndRequest(data) {
  return http.post("/users/frndRequest", data);
}

export async function getNotifications(data) {
  return http.post("/notifications/notificationCount", data);
}
export async function addNotification(data) {
  return http.post("/notifications/addNotification", data);
}

export async function updateAddFriend(data) {
  return http.post("/users/updateAddFriend", data);
}

export async function acceptReject(data) {
  return http.post("/friends/acceptReject", data);
}

export async function getAcceptRejectStatus(data) {
  return http.post("/friends/getAcceptReject", data);
}
