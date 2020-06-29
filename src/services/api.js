import axios from 'axios';

const api = axios.create({ baseURL: 'https://api.clockify.me/api/v1' });

export const getWorkspaces = (key) => api.get('/workspaces', { headers: { 'X-Api-Key': key } }).then((res) => res.data);
