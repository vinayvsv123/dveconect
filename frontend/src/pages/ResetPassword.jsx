import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { resetPassword } from "../services/api";

function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            setLoading(true);
            const data = await resetPassword(token, password);
            setMessage(data.message || "Password updated successfully!");
            setIsSuccess(true);
            setTimeout(() => {
                navigate("/auth");
            }, 3000);
        } catch (error) {
            console.error("Reset Error:", error);
            setMessage(error.message || "Error resetting password.");
            setIsSuccess(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
            <div className="w-full max-w-md bg-slate-900/70 backdrop-blur border border-slate-700 rounded-2xl p-8 text-white">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">New Password</h1>
                    <p className="text-gray-400 text-sm">Create a new, strong password.</p>
                </div>

                {message && (
                    <div className={`mb-4 text-sm text-center ${isSuccess ? "text-green-400" : "text-red-400"}`}>
                        {message}
                    </div>
                )}

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="New Password"
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

                    <button
                        type="submit"
                        disabled={loading || isSuccess}
                        className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition disabled:opacity-50"
                    >
                        {loading ? "Updating..." : "Reset Password"}
                        <ArrowRight size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ResetPassword;
