import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddProjectPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    skills: "",
    postedBy: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newProject = {
      ...formData,
      skills: formData.skills.split(",").map((s) => s.trim()),
    };

    console.log("New Project:", newProject);

    // later → send to backend
    // for now → just redirect
    navigate("/explore");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 text-white pt-28 px-6">
      <div className="max-w-3xl mx-auto bg-slate-900/70 backdrop-blur border border-slate-800 rounded-xl p-8">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Add New Project
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Title */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Project Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
              placeholder="Enter project title"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Project Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
              placeholder="Describe your project"
            />
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Skills Required
            </label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
              placeholder="React, Node, MongoDB"
            />
          </div>

          {/* Posted By */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Posted By
            </label>
            <input
              type="text"
              name="postedBy"
              value={formData.postedBy}
              onChange={handleChange}
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
              placeholder="Your name"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 justify-end">
            <button
              type="button"
              onClick={() => navigate("/explore")}
              className="px-6 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition"
            >
              Add Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProjectPage;
