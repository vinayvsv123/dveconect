import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Github } from "lucide-react";
import { loginUser, registerUser, forgotPassword, googleLogin, githubLogin } from "../services/api";
import { GoogleLogin } from '@react-oauth/google';

function AuthPages() {
  const navigate = useNavigate();
  const location = useLocation();

  const [view, setView] = useState("login"); // "login", "register", "forgotPassword"
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  // Handle GitHub OAuth redirect
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("code");

    if (code) {
      setLoading(true);
      githubLogin(code)
        .then((data) => {
          if (data && data.token) {
            localStorage.setItem("token", data.token);
            navigate("/explore");
          } else {
            navigate("/auth", { replace: true });
          }
        })
        .catch(err => {
          console.error("GitHub Login Error", err);
          alert("GitHub login failed.");
          navigate("/auth", { replace: true });
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      const token = localStorage.getItem("token");
      if (token && token !== "undefined") {
        navigate("/explore");
      }
    }
  }, [location, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGithubLoginBtn = () => {
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID || "YOUR_GITHUB_CLIENT_ID";
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=user:email`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      setLoading(true);

      if (view === "login") {
        const data = await loginUser({
          email: formData.email,
          password: formData.password,
        });

        if (data && data.token) {
          localStorage.setItem("token", data.token);
          navigate("/explore");
        } else {
          setMessage(data.message || "Login failed. Please check your credentials.");
        }

      } else if (view === "register") {
        await registerUser({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        });

        alert("Registration successful. Please login.");
        setView("login");

      } else if (view === "forgotPassword") {
        const data = await forgotPassword(formData.email);
        alert(data.message || "Reset link sent to email (check console or email if configured).");
        setView("login");
      }

    } catch (error) {
      console.error("Auth error:", error);
      setMessage(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur border border-slate-700 rounded-2xl p-8 text-white">

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white">
            {view === "forgotPassword" ? "Reset Password" : "Welcome to DevConnect"}
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {view === "forgotPassword"
              ? "Enter your email to receive a reset link"
              : "Discover projects, connect with developers."}
          </p>
        </div>

        {message && <div className="mb-4 text-red-400 text-sm text-center">{message}</div>}

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {view === "register" && (
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Username"
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:border-blue-500"
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Email"
              className="w-full pl-12 pr-4 py-3 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:border-blue-500"
            />
          </div>

          {(view === "login" || view === "register") && (
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Password"
                className="w-full pl-12 pr-12 py-3 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          )}

          {/* 
          {view === "login" && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setView("forgotPassword")}
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                Forgot Password?
              </button>
            </div>
          )}
          */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            {loading
              ? "Please wait..."
              : view === "login"
                ? "Sign In"
                : view === "register"
                  ? "Sign Up"
                  : "Send Reset Link"}
            <ArrowRight size={18} />
          </button>
        </form>

        {/* OAuth Buttons */}
        {(view === "login" || view === "register") && (
          <div className="mt-6">
            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-slate-700"></div>
              <span className="flex-shrink-0 mx-3 text-slate-500 text-sm">Or continue with</span>
              <div className="flex-grow border-t border-slate-700"></div>
            </div>

            <div className="flex gap-4 justify-center">
              <div className="flex-1">
                <GoogleLogin
                  onSuccess={(credentialResponse) => {
                    setLoading(true);
                    googleLogin(credentialResponse.credential)
                      .then(data => {
                        if (data && data.token) {
                          localStorage.setItem("token", data.token);
                          navigate("/explore");
                        }
                      })
                      .catch(err => {
                        console.error("Google login failed", err);
                        alert("Google login failed");
                      })
                      .finally(() => setLoading(false));
                  }}
                  onError={() => {
                    console.log("Google Login Failed");
                  }}
                  theme="filled_black"
                  shape="rectangular"
                  width="100%"
                />
              </div>

              <button
                onClick={handleGithubLoginBtn}
                type="button"
                className="flex-1 flex items-center justify-center gap-2 py-2 px-4 border border-slate-700 bg-slate-800 rounded-lg hover:bg-slate-700 transition"
              >
                <Github className="w-5 h-5" />
                GitHub
              </button>
            </div>
          </div>
        )}

        {/* Toggle Sign In / Sign Up */}
        {view !== "forgotPassword" && (
          <p className="mt-6 text-center text-sm text-gray-400">
            {view === "login"
              ? "Don't have an account?"
              : "Already have an account?"}
            <button
              onClick={() => setView(view === "login" ? "register" : "login")}
              className="ml-2 text-blue-400 hover:text-blue-300 font-medium"
            >
              {view === "login" ? "Sign Up" : "Sign In"}
            </button>
          </p>
        )}

        {view === "forgotPassword" && (
          <p className="mt-6 text-center text-sm text-gray-400">
            Remember your password?
            <button onClick={() => setView("login")} className="ml-2 text-blue-400 hover:text-blue-300 font-medium">
              Back to Sign In
            </button>
          </p>
        )}

      </div>
    </div>
  );
}

export default AuthPages;