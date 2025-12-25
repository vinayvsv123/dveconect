import React from "react";
import { Link } from "react-router-dom";
function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-6xl font-bold mb-6">
            DevConnect
          </h1>

          <p className="text-gray-300 text-xl mb-10 max-w-3xl mx-auto">
            A platform where students and developers connect, collaborate, and grow
            together through projects and learning.
          </p>

          <div className="flex gap-4 justify-center">
            <Link
              to="/explore"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition"
            >
              Explore
            </Link>

            <Link
              to="/auth"
              className="bg-white hover:bg-gray-100 text-gray-900 px-8 py-3 rounded-lg text-lg font-medium transition"
            >
              Get Started
            </Link>
          </div>

        </div>
      </section>

      {/* Why Choose DevConnect */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            Why Choose DevConnect?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">

            {/* Network Card */}
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8 hover:border-blue-500 transition">
              <svg
                className="w-20 h-20 mx-auto mb-6 text-blue-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
              </svg>

              <h3 className="text-2xl font-bold text-center mb-4">
                Network & Connect
              </h3>

              <p className="text-gray-300 text-center">
                Meet like-minded developers and students to collaborate with.
              </p>
            </div>

            {/* Collaborate Card */}
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8 hover:border-blue-500 transition">
              <svg
                className="w-20 h-20 mx-auto mb-6 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M9 21c0 .5.4 1 1 1h4c.6 0 1-.5 1-1v-1H9v1zm3-19C8.1 2 5 5.1 5 9c0 2.4 1.2 4.5 3 5.7V17c0 .5.4 1 1 1h6c.6 0 1-.5 1-1v-2.3c1.8-1.3 3-3.4 3-5.7 0-3.9-3.1-7-7-7z" />
              </svg>

              <h3 className="text-2xl font-bold text-center mb-4">
                Collaborate on Projects
              </h3>

              <p className="text-gray-300 text-center">
                Work on real-world projects and build your portfolio.
              </p>
            </div>

            {/* Learn Card */}
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8 hover:border-blue-500 transition">
              <svg
                className="w-20 h-20 mx-auto mb-6 text-blue-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
              </svg>

              <h3 className="text-2xl font-bold text-center mb-4">
                Learn & Grow
              </h3>

              <p className="text-gray-300 text-center">
                Gain new skills and knowledge through shared experiences.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-10">
            Ready to join the community?
          </h2>

          <div className="flex gap-4 justify-center">
            <Link
              to="/explore"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition"
            >
              Explore DevConnect
            </Link>

            <Link
              to="/auth"
              className="bg-white hover:bg-gray-100 text-gray-900 px-8 py-3 rounded-lg text-lg font-medium transition"
            >
              Login to Get Started
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}

export default AboutPage;
