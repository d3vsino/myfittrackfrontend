import axios from "axios"

const API_URL = "http://localhost:8000/api"

// Create axios instance with auth header
export const authAxios = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add auth token to requests
authAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token")
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Handle token refresh on 401 errors
authAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshed = await refreshToken()
        if (refreshed) {
          return authAxios(originalRequest)
        }
      } catch (error) {
        console.error("Token refresh failed", error)
      }
    }

    return Promise.reject(error)
  },
)

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/token/obtain/`, {
      email,
      password,
    })

    localStorage.setItem("access_token", response.data.access)
    localStorage.setItem("refresh_token", response.data.refresh)

    return true
  } catch (error) {
    console.error("Login failed", error)
    return false
  }
}

export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register/`, userData)
    return response.data
  } catch (error) {
    console.error("Registration failed", error)
    throw error
  }
}

export const logout = () => {
  localStorage.removeItem("access_token")
  localStorage.removeItem("refresh_token")
}

export const refreshToken = async () => {
  const refreshToken = localStorage.getItem("refresh_token")

  if (!refreshToken) {
    return false
  }

  try {
    const response = await axios.post(`${API_URL}/token/refresh/`, {
      refresh: refreshToken,
    })

    localStorage.setItem("access_token", response.data.access)
    return true
  } catch (error) {
    console.error("Token refresh failed", error)
    logout()
    return false
  }
}

export const checkAuth = async () => {
  const token = localStorage.getItem("access_token")

  if (!token) {
    return false
  }

  try {
    await authAxios.get("/profile/")
    return true
  } catch (error) {
    if (error.response && error.response.status === 401) {
      // Try to refresh the token
      return await refreshToken()
    }
    return false
  }
}
