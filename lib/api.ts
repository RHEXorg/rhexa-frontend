import axios from "axios";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://127.0.0.1:8000";

const api = axios.create({
    baseURL: API_URL,
    timeout: 60000,
    headers: {
        "Content-Type": "application/json",
    },
});

if (typeof window !== "undefined") {
    console.log("📍 Site Origin:", window.location.origin);
    console.log("🔗 API BaseURL:", API_URL);
}

// Add a request interceptor to include the JWT token
api.interceptors.request.use((config) => {
    const token = Cookies.get("rhexa_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Add a response interceptor for debugging
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.message !== 'Network Error' && error.code !== 'ECONNABORTED') {
            console.group("🌐 RheXa API Error");
            console.error("Message:", error.message);
            console.error("Status:", error.response?.status || "N/A");
            console.error("Endpoint:", error.config?.url || "N/A");
            if (error.response?.data) console.error("Data:", error.response.data);
            console.groupEnd();
        }

        return Promise.reject(error);
    }
);

export const databaseApi = {
    connect: (data: any) => api.post("/api/data-sources/database", data),
    list: () => api.get("/api/data-sources/database"),
    test: (data: any) => api.post("/api/data-sources/database/test", data),
    getSchema: (id: number) => api.get(`/api/data-sources/database/${id}/schema`),
    delete: (id: number) => api.delete(`/api/data-sources/database/${id}`),
    chat: (id: number, question: string) => api.post("/api/data-sources/database/chat", { connection_id: id, question }),
};

export const widgetApi = {
    list: () => api.get("/api/widget/list"),
    create: (data: any) => api.post("/api/widget/create", data),
    update: (id: number, data: any) => api.patch(`/api/widget/${id}`, data),
    delete: (id: number) => api.delete(`/api/widget/${id}`),
    rotateKey: (id: number) => api.post(`/api/widget/${id}/rotate-key`),
};

export const documentsApi = {
    list: () => api.get("/api/documents/"),
};

export const analysisApi = {
    generateDashboard: (database_ids: number[], document_ids: number[]) =>
        api.post("/api/analysis/dashboard", { database_ids, document_ids }),
};

export const billingApi = {
    getStatus: () => api.get("/api/billing"),
    upgrade: (plan: string) => api.post(`/api/billing/upgrade?plan=${plan}`)
};

export default api;
