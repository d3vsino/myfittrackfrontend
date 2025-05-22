import { authAxios } from "./auth"

// User profile
export const getUserProfile = async () => {
  try {
    const response = await authAxios.get("/profile/")
    return response.data
  } catch (error) {
    console.error("Failed to get user profile", error)
    throw error
  }
}

export const updateUserProfile = async (profileData) => {
  try {
    const response = await authAxios.patch("/profile/", profileData)
    return response.data
  } catch (error) {
    console.error("Failed to update profile", error)
    throw error
  }
}

// Calorie logs
export const getCalorieLogs = async () => {
  try {
    const response = await authAxios.get("/calorie-logs/")
    return response.data
  } catch (error) {
    console.error("Failed to get calorie logs", error)
    throw error
  }
}

export const createCalorieLog = async (logData) => {
  try {
    const response = await authAxios.post("/calorie-logs/", logData)
    return response.data
  } catch (error) {
    console.error("Failed to create calorie log", error)
    throw error
  }
}

export const updateCalorieLog = async (id, logData) => {
  try {
    const response = await authAxios.put(`/calorie-logs/${id}/`, logData)
    return response.data
  } catch (error) {
    console.error("Failed to update calorie log", error)
    throw error
  }
}

export const deleteCalorieLog = async (id) => {
  try {
    await authAxios.delete(`/calorie-logs/${id}/`)
    return true
  } catch (error) {
    console.error("Failed to delete calorie log", error)
    throw error
  }
}

// AI Nutritionist
export const getAiResponse = async (message, sessionId = null) => {
  try {
    console.log("Sending AI request:", { message, sessionId })

    const payload = {
      message,
    }

    if (sessionId) {
      // Make sure session_id is sent as a number if it's numeric
      payload.session_id = isNaN(sessionId) ? sessionId : Number(sessionId)
    }

    console.log("Request payload:", payload)

    const response = await authAxios.post("/ai/", payload)
    console.log("AI response:", response.data)
    return response.data
  } catch (error) {
    console.error("Failed to get AI response", error)

    // Log detailed error information
    if (error.response) {
      console.error("Error status:", error.response.status)
      console.error("Error data:", error.response.data)
      console.error("Error headers:", error.response.headers)
    } else if (error.request) {
      console.error("No response received:", error.request)
    } else {
      console.error("Error message:", error.message)
    }

    throw error
  }
}

// Chat Sessions
export const getChatSessions = async () => {
  try {
    const response = await authAxios.get("/ai/chat-history/")
    console.log("Chat sessions:", response.data)
    return response.data
  } catch (error) {
    console.error("Failed to get chat sessions", error)
    throw error
  }
}

// Food Search
export const searchFoods = async (query) => {
  try {
    const response = await authAxios.get(`/api/foods/?q=${encodeURIComponent(query)}`)
    return response.data
  } catch (error) {
    console.error("Failed to search foods", error)
    throw error
  }
}

// Food Image Analysis
export const analyzeFoodImage = async (imageFile) => {
  try {
    const formData = new FormData()
    formData.append("image", imageFile)

    const response = await authAxios.post("/analyze-meal/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    return response.data
  } catch (error) {
    console.error("Failed to analyze food image", error)
    if (error.response) {
      console.error("Error details:", error.response.data)
    }
    throw error
  }
}
