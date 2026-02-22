const BASE_URL = "https://devconect-pcgp.onrender.com/api";

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

  return data; // ✅ return directly
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