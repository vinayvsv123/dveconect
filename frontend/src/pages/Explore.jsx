import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProjects } from "../services/api";

function ExplorePage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsArray = await getProjects();
        setProjects(projectsArray);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 text-white pt-28 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between mb-10">
        <h1 className="text-3xl font-bold">Explore Projects</h1>
        <Link
          to="/add-project"
          className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg transition"
        >
          + Add Project
        </Link>
      </div>

      {loading ? (
        <p className="text-center text-gray-400">Loading projects...</p>
      ) : projects.length === 0 ? (
        <p className="text-center text-gray-400">No projects available.</p>
      ) : (
        <div className="max-w-7xl mx-auto grid gap-6">
          {projects.map((project) => (
            <div
              key={project._id}
              className="bg-slate-900/70 backdrop-blur-md border border-slate-800 rounded-xl p-6 hover:border-blue-600 transition"
            >
              <h2 className="text-xl font-semibold mb-2">{project.title}</h2>
              <p className="text-gray-300 mb-4">{project.description}</p>

              <div className="mb-4">
                <p className="text-sm text-gray-400 mb-2">Skills Required:</p>
                <div className="flex flex-wrap gap-2">
                  {project.skills?.map((skill, idx) => (
                    <span
                      key={idx}
                      className="bg-slate-800 text-sm px-3 py-1 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-gray-400">
                  Posted By:{" "}
                  <span className="text-white font-medium">
                    {project.postedBy?.name || "Unknown"}
                  </span>
                </p>

                <button className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg transition">
                  Connect
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ExplorePage;