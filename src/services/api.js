import axios from 'axios';

const api = axios.create({ baseURL: 'https://api.clockify.me/api/v1', headers: {'X-Api-Key': localStorage.getItem('key')}});

const workspace = localStorage.getItem('workspace');
const user = localStorage.getItem('user');

export const getWorkspaces = (key) => api.get('/workspaces', { headers: { 'X-Api-Key': key } }).then((res) => res.data);

export const getUser = (key) => api.get('/user', { headers: { 'X-Api-Key': key } }).then((res) => res.data);

export const getEntries = () => api.get(`/workspaces/${workspace}/user/${user}/time-entries`).then(res => res.data);

export const startTimer = (entry) => api.post(`/workspaces/${workspace}/time-entries`, entry).then(res => res.data);
