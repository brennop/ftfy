import axios from "axios";
import dayjs from "dayjs";

const api = axios.create({
  baseURL: "https://api.clockify.me/api/v1",
  headers: { "X-Api-Key": localStorage.getItem("key") },
});

const workspace = localStorage.getItem("workspace");
const user = localStorage.getItem("user");

export const getWorkspaces = (key) =>
  api
    .get("/workspaces", { headers: { "X-Api-Key": key } })
    .then((res) => res.data);

export const getUser = (key) =>
  api.get("/user", { headers: { "X-Api-Key": key } }).then((res) => res.data);

export const getEntries = () =>
  api
    .get(`/workspaces/${workspace}/user/${user}/time-entries?page-size=20`)
    .then((res) => res.data);

export const startTimer = (entry) =>
  api
    .post(`/workspaces/${workspace}/time-entries`, entry)
    .then((res) => res.data);

export const deleteEntry = (id) =>
  api.delete(`workspaces/${workspace}/time-entries/${id}`);

export const stopTimer = () =>
  api
    .patch(`/workspaces/${workspace}/user/${user}/time-entries`, {
      end: dayjs().toISOString(),
    })
    .then((res) => res.data);
