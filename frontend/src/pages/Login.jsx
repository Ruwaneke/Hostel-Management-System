import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authAPI } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    // Basic validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      const errMsg = "Please enter a valid email address.";
      setError(errMsg);
      toast.error("Validation Error", errMsg);
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.login(formData);
      if (response.success) {
        // Success toast
        toast.success("Login Successful", `Welcome back, ${response.user.name}!`);
        // Pass both user data and token to login function
        login(response.user, response.token);
        navigate(response.user.role === "admin" ? "/admin-dashboard" : "/user-dashboard");
      } else {
        const errMsg = response.message || "Login failed";
        setError(errMsg);
        toast.error("Login Failed", errMsg);
      }
    } catch (err) {
      const errMsg = err.message || "Cannot connect to server. Make sure the backend is running.";
      setError(errMsg);
      toast.error("Connection Error", errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-navy flex items-center justify-center px-4 py-10 overflow-hidden relative selection:bg-brand-gold selection:text-brand-navy">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-brand-gold/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-brand-platinum/5 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-brand-white rounded-3xl shadow-2xl px-8 py-10 border border-brand-platinum/50">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-brand-gold rounded-2xl flex items-center justify-center text-3xl shadow-lg mb-4 ring-4 ring-brand-gold/30">
              🏠
            </div>
            <h1 className="text-3xl font-extrabold text-brand-black tracking-tight">Welcome Back</h1>
            <p className="text-slate-500 text-sm mt-2">Sign in to HostelMS</p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-rose-50 border-l-4 border-rose-500 text-rose-700 px-4 py-3 rounded-r-xl mb-5 text-sm flex items-center gap-3 shadow-sm">
              <span className="text-lg">⚠️</span> 
              <span className="font-medium">{error}</span>
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
                  {showPass ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-gold hover:bg-[#e5920f] disabled:bg-brand-gold/50 text-brand-black font-extrabold py-3.5 rounded-xl transition-all duration-300 text-sm shadow-lg hover:shadow-xl mt-2 flex justify-center items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-brand-black/40 border-t-brand-black rounded-full animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <span>→</span>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 space-y-3 text-center text-sm text-slate-500">
            <p className="bg-brand-platinum/30 py-2 px-4 rounded-xl inline-block w-full">
              Do not have an account?{" "}
              <Link to="/register" className="text-brand-navy font-bold hover:text-brand-gold transition-colors">
                Register here
              </Link>
            </p>
            <Link to="/" className="text-slate-400 hover:text-brand-navy block transition-colors mt-2">
              ← Back to Home
            </Link>
          </div>
        </div>

        {/* Demo hint */}
        <div className="mt-6 bg-brand-navy/50 backdrop-blur-md border border-brand-white/10 text-brand-platinum text-xs text-center px-4 py-3 rounded-2xl shadow-xl font-medium">
          Demo: register an account first, then sign in
        </div>
      </div>
    </div>
  );
}
