import axios from "axios";

const options = {
    baseURL: "http://localhost:3000/api/v1",
    headers: {
        "Content-Type": "application/json"
    }
}

const API = axios.create(options);

export const generateText = (data) => API.post(`/generate`, data, {
    responseType: "blob"
});