import http from "../http-common";

export async function subscriberequest(data) {
    return http.post("/subscribes/addsubscribe", data);
}

export async function subrcibes(data) {
    return http.post("/subscribes/subscribe/",data);
}