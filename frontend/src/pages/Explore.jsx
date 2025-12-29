import React from 'react';
import { Link } from 'react-router-dom';

const projects=[
   {
      id:1,
      title:"Project One",
      description:"This is the first project",
      skills:["React","Node.js","MongoDB"],
      postedBy:"vinay",
   },
   {
      id:2,
      title:"Project Two",
      description:"This is the second project",
      skills:["Python","Django"],
      postedBy:"ashish",
   },
   {
      id:3,
      title:"Project Three",
      description:"This is the third project",
      skills:["Java","Spring Boot"],
      postedBy:"rahul",
   }
]

function ExplorePage(){
return (
 <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 text-white pt-28 px-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto flex items-center justify-between mb-10">
        <h1 className="text-3xl font-bold">Explore Projects</h1>

        {/* Add Project Button */}
        <Link
          to="/add-project"
          className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg transition"
        >
          + Add Project
        </Link>
      </div>

      {/* Projects List */}
      <div className="max-w-7xl mx-auto grid gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-slate-900/70 backdrop-blur-md border border-slate-800 rounded-xl p-6 hover:border-blue-600 transition"
          >
           {/* Title */}
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
               <span className="text-gray-400 font-medium">Project Title:</span>
               <span className="text-white">{project.title}</span>
            </h2>


            {/* Description */}
            <p className="text-gray-300 mb-4">
               <span className="text-gray-400 font-medium">Description:</span>{" "}
               <span className="text-white">{project.description}</span>
            </p>


            {/* Skills */}
            <div className="mb-4">
              <p className="text-sm text-gray-400 mb-2">
                Skills Required:
              </p>
              <div className="flex flex-wrap gap-2">
                {project.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-slate-800 text-sm px-3 py-1 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-gray-400">
                Posted By:{" "}
                <span className="text-white font-medium">
                  {project.postedBy}
                </span>
              </p>

              <button className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg transition">
                Connect
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
 );
}
export default ExplorePage