import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Github } from "lucide-react";
import { loginUser, registerUser, forgotPassword, googleLogin, githubLogin } from "../services/api";
import { useGoogleLogin } from '@react-oauth/google';

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
          }
        })
        .catch(err => {
          console.error("GitHub Login Error", err);
          alert("GitHub login failed.");
        })
        .finally(() => {
          setLoading(false);
          // clear code from url
          navigate("/auth", { replace: true });
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

  const handleGoogleLoginBtn = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);
        // We pass the access_token received from useGoogleLogin to backend
        // Wait, @react-oauth/google useGoogleLogin returns an access_token? No, it could be either. 
        // We'll pass tokenResponse.access_token if flow is implicit, or id_token if configured.
        // Actually Google OAuth endpoint in backend is written for id_token. Let's send access_token to a slightly modified backend or just send what we got and verify.
        // Let's pass the token to googleLogin API.
        const token = tokenResponse.access_token || tokenResponse.credential;
        const data = await googleLogin(token);
        if (data && data.token) {
          localStorage.setItem("token", data.token);
          navigate("/explore");
        }
      } catch (error) {
        console.error(error);
        alert("Google login failed.");
      } finally {
        setLoading(false);
      }
    },
    onError: errorResponse => console.log(errorResponse),
  });

  const handleGithubLoginBtn = () => {
    // Navigate to github oauth page
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
        const data = await registerUser({
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
      <div className="w-full max-w-md bg-slate-900/70 backdrop-blur border border-slate-700 rounded-2xl p-8 text-white">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {view === "login" && "Welcome Back"}
            {view === "register" && "Create Account"}
            {view === "forgotPassword" && "Reset Password"}
          </h1>
          <p className="text-gray-400 text-sm">
            {view === "login" && "Login to continue to DevConnect"}
            {view === "register" && "Join the DevConnect community"}
            {view === "forgotPassword" && "Enter your email to reset your password"}
          </p>
        </div>

        {message && <div className="mb-4 text-red-400 text-sm text-center">{message}</div>}

        <form className="space-y-5" onSubmit={handleSubmit}>

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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            {loading ? "Please wait..." : view === "login" ? "Login" : view === "register" ? "Sign Up" : "Send Reset Link"}
            <ArrowRight size={18} />
          </button>
        </form>

        {(view === "login" || view === "register") && (
          <div className="mt-6">
            <div className="relative flex items-center py-5">
              <div className="flex-grow border-t border-slate-700"></div>
              <span className="flex-shrink-0 mx-4 text-slate-500 text-sm">Or continue with</span>
              <div className="flex-grow border-t border-slate-700"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleGoogleLoginBtn()}
                type="button"
                className="flex items-center justify-center gap-2 py-2 px-4 border border-slate-700 rounded-lg hover:bg-slate-800 transition"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </button>
              <button
                onClick={handleGithubLoginBtn}
                type="button"
                className="flex items-center justify-center gap-2 py-2 px-4 border border-slate-700 rounded-lg hover:bg-slate-800 transition"
              >
                <Github className="w-5 h-5" />
                GitHub
              </button>
            </div>
          </div>
        )}

        <p className="mt-6 text-center text-sm text-gray-400">
          {view === "login" && (
            <>
              Don’t have an account?
              <button onClick={() => setView("register")} className="ml-2 text-blue-400 hover:text-blue-300 font-medium">Sign Up</button>
            </>
          )}
          {view === "register" && (
            <>
              Already have an account?
              <button onClick={() => setView("login")} className="ml-2 text-blue-400 hover:text-blue-300 font-medium">Login</button>
            </>
          )}
          {view === "forgotPassword" && (
            <>
              Remember your password?
              <button onClick={() => setView("login")} className="ml-2 text-blue-400 hover:text-blue-300 font-medium">Back to Login</button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

export default AuthPages;