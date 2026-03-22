import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authAPI } from "../services/authService";

export default function Register() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "user" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await authAPI.register(formData);
      if (response.success) {
        setSuccess("Account created! Redirecting to login...");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setError(response.message || "Registration failed");
      }
    } catch (err) {
      setError(err.message || "Cannot connect to server. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-500 flex items-center justify-center px-4 py-10">
      <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/20 rounded-full -translate-x-1/3 translate-y-1/3 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl px-8 py-10">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg mb-4">
              
            </div>
            <h1 className="text-2xl font-extrabold text-slate-800">Create Account</h1>
            <p className="text-slate-400 text-sm mt-1">Join the Hostel Management System</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-5 text-sm flex items-center gap-2">
              <span></span> {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-5 text-sm flex items-center gap-2">
              <span></span> {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
              <input
                type="text" name="name" value={formData.name} onChange={handleChange}
                placeholder="Enter your full name" required
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 transition bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
              <input
                type="email" name="email" value={formData.email} onChange={handleChange}
                placeholder="you@example.com" required
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 transition bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"} name="password"
                  value={formData.password} onChange={handleChange}
                  placeholder="Minimum 6 characters" required
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 transition bg-slate-50 pr-12"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-lg">
                  {showPass ? "" : ""}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Account Type</label>
              <div className="grid grid-cols-2 gap-3">
                {[["user","","Student"],["admin","","Admin"]].map(([val, icon, label]) => (
                  <label key={val}
                    className={"flex items-center gap-2 px-4 py-3 border-2 rounded-xl cursor-pointer transition text-sm font-medium " +
                      (formData.role === val
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                        : "border-slate-200 bg-slate-50 text-slate-600 hover:border-indigo-300")}>
                    <input type="radio" name="role" value={val} checked={formData.role === val}
                      onChange={handleChange} className="sr-only" />
                    <span>{icon}</span> {label}
                  </label>
                ))}
              </div>
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold py-3 rounded-xl transition duration-200 text-sm shadow-lg shadow-indigo-200 mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : "Create Account"}
            </button>
          </form>

          <div className="mt-6 space-y-2 text-center text-sm text-slate-500">
            <p>Already have an account?{" "}
              <Link to="/login" className="text-indigo-600 font-semibold hover:underline">Sign in here</Link>
            </p>
            <Link to="/" className="text-slate-400 hover:text-slate-600 block">Back to Home</Link>
          </div>
        </div>

        <div className="mt-4 bg-white/20 backdrop-blur text-white text-xs text-center px-4 py-3 rounded-2xl">
          Choose Student to access your personal dashboard
        </div>
      </div>
    </div>
  );
}
