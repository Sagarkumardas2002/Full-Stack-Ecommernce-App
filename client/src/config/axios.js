import axios from 'axios';

// In production this points to your Render backend URL
// In development it's empty so relative /api/... calls hit localhost via proxy
const instance = axios.create({
    baseURL: 'https://full-stack-ecommernce-app-backend.onrender.com',
});

export default instance;
