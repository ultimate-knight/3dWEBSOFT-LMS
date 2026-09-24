import axios from "axios";

function getApiBaseURL() {
    if (process.env.NEXT_PUBLIC_API_URL) {
        return process.env.NEXT_PUBLIC_API_URL
    }
    if (typeof window !== "undefined") {
        return `http://${window.location.hostname}:9400`
    }
    return process.env.NEXT_PUBLIC_API_URL
}

let api = axios.create({
    baseURL: getApiBaseURL(),
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")
    const path = config.url || ""
    const isAuthRoute =
        path.includes("/login") ||
        path.includes("/register") ||
        path.includes("/adminlogin") ||
        path.includes("/adminregister")

    if (token && !isAuthRoute) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})

export default api;



// simpler one



// import axios from "axios";

// const api = axios.create({
//     baseURL: "http://localhost:9400",
// });

// api.interceptors.request.use((config) => {
//     const token = localStorage.getItem("token");

//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
// });

// export default api;