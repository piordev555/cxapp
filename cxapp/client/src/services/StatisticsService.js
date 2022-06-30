import http from "../http-common";

export async function getStatisticsData() {
    return http.get("/statistics/getStatistics");
}
