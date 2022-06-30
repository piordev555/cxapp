import axios from "axios";

const token = localStorage.getItem('token');

export default axios.create({
    baseURL: process.env.VUE_APP_ROOT_API || 'http://localhost:4000',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Access-Control-Allow-Origin': '*'
    }
});
