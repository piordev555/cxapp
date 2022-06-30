import http from "../http-common";

export async function getNotifications(id) {
    return http.get(`/notifications/${id}`);
}

export async function updateNotifictions(data) {
  return http.post(`/notifications/update`, data);
}
