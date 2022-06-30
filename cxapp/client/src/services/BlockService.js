import http from "../http-common";

export async function blockrequest(data) {
    return http.post("/blocks/addblocked", data);
}

export async function blocks(data) {
    return http.post("/blocks/block/",data);
}

export async function isBlocked(data) {
    return http.post("/blocks/isBlock/",data);
}