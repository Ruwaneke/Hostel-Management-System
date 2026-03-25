import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authAPI } from "../services/authService";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await authAPI.login(formData);
      if (response.success) {
        login(response.user);
        navigate(response.user.role === "admin" ? "/admin-dashboard" : "/user-dashboard");
      } else {
        setError(response.message || "Login failed");
      }
    } catch (err) {
      setError(err.message || "Cannot connect to server. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#14213d] flex items-center justify-center px-4 py-10">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#fca311]/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl px-8 py-10">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-[#14213d] rounded-2xl flex items-center justify-center text-4xl shadow-lg mb-4">
              👤
            </div>
            <h1 className="text-2xl font-extrabold text-black">Welcome Back</h1>
            <p className="text-gray-500 text-sm mt-1">Sign in to HostelMS</p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-5 text-sm flex items-center gap-2">
              <span></span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-black mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#14213d] transition bg-[#f5f5f5]"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-black mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#14213d] transition bg-[#f5f5f5] pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 text-lg"
                >
                  {showPass ? "" : ""}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#14213d] hover:bg-[#0f1824] disabled:bg-gray-400 text-white font-bold py-3 rounded-xl transition duration-200 text-sm shadow-lg mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 space-y-2 text-center text-sm text-gray-600">
            <p>
              Do not have an account?{" "}
              <Link to="/register" className="text-[#14213d] font-semibold hover:underline">
                Register here
              </Link>
            </p>
            <Link to="/" className="text-gray-500 hover:text-gray-700 block">
              Back to Home
            </Link>
          </div>
        </div>

        {/* Demo hint */}
        <div className="mt-4 bg-white/20 backdrop-blur text-white text-xs text-center px-4 py-3 rounded-2xl">
          Demo: register an account first, then sign in
        </div>
      </div>
    </div>
  );
}
