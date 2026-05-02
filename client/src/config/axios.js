import axios from 'axios';

// In production this points to your Render backend URL
// In development it's empty so relative /api/... calls hit localhost via proxy
const instance = axios.create({
    baseURL: process.env.REACT_APP_API || '',
});

export default instance;
