//const BASE_URL = "https://devconect-pcgp.onrender.com/api";
//const BASE_URL = "http://localhost:5000/ap
const BASE_URL = "https://devconect-1.onrender.com/api";
// Register
export const registerUser = async (userData) => {
  const res = await fetch(`${BASE_URL}/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  return res.json();
};

// Login
export const loginUser = async (userData) => {
  const res = await fetch(`${BASE_URL}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  return res.json();
};

// Get All Projects
export const getProjects = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/projects`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch projects");
  }

  const data = await res.json();

  return data;
};

// Create Project
export const createProject = async (projectData) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(projectData),
  });

  return res.json();
};

// ─── Profile APIs ────────────────────────────────────────

// Get current user profile
export const getProfile = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/users/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch profile");
  return res.json();
};

// Update current user profile
export const updateProfile = async (profileData) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/users/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });
  if (!res.ok) throw new Error("Failed to update profile");
  return res.json();
};

// ─── Chat APIs ───────────────────────────────────────────

// Get all users (for chat list)
export const getAllUsers = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
};

// Get messages between current user and another user
export const getMessages = async (userId) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/chats/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch messages");
  return res.json();
};

// Send message via HTTP (fallback)
export const sendMessageHTTP = async (receiverId, text) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/chats`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ receiverId, text }),
  });
  if (!res.ok) throw new Error("Failed to send message");
  return res.json();
};

// ─── Password & OAuth APIs ───────────────────────────────

export const forgotPassword = async (email) => {
  const res = await fetch(`${BASE_URL}/users/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to send reset email");
  return data;
};

export const resetPassword = async (token, password) => {
  const res = await fetch(`${BASE_URL}/users/reset-password/${token}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to reset password");
  return data;
};

export const googleLogin = async (googleToken) => {
  const res = await fetch(`${BASE_URL}/users/oauth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ googleToken }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to login with Google");
  return data;
};

export const githubLogin = async (code) => {
  const res = await fetch(`${BASE_URL}/users/oauth/github`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to login with GitHub");
  return data;
};