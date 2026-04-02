import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authAPI } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validations
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      const errMsg = "Please enter a valid email address.";
      setError(errMsg);
      toast.error("Validation Error", errMsg);
      return;
    }
    if (formData.password.length < 6) {
      const errMsg = "Password must be at least 6 characters long.";
      setError(errMsg);
      toast.warning("Weak Password", errMsg);
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      const errMsg = "Passwords do not match.";
      setError(errMsg);
      toast.error("Password Mismatch", errMsg);
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      if (response.success) {
        // Success toast
        toast.success("Registration Successful", "Account created! Redirecting to login...");
        login(response.user, response.token);
        // Redirect to login after a brief delay so they see the toast
        setTimeout(() => navigate("/login"), 1500);
      } else {
        const errMsg = response.message || "Registration failed";
        setError(errMsg);
        toast.error("Registration Failed", errMsg);
      }
    } catch (err) {
      const errMsg = err.message && err.message.includes('already') 
        ? err.message 
        : err.message || "Cannot connect to server";
      setError(errMsg);
      toast.error("Registration Error", errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-navy flex items-center justify-center px-4 py-10 overflow-hidden relative selection:bg-brand-gold selection:text-brand-navy">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-brand-gold/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-brand-platinum/5 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-lg mt-6 mb-6">
        <div className="bg-brand-white rounded-3xl shadow-2xl px-6 sm:px-10 py-10 border border-brand-platinum/50">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-brand-gold rounded-2xl flex items-center justify-center text-3xl shadow-lg mb-4 ring-4 ring-brand-gold/30">
              🏠
            </div>
            <h1 className="text-3xl font-extrabold text-brand-black tracking-tight">Create Student Account</h1>
            <p className="text-slate-500 text-sm mt-2">Join HostelMS as a student</p>
          </div>

          {error && (
            <div className="bg-rose-50 border-l-4 border-rose-500 text-rose-700 px-4 py-3 rounded-r-xl mb-6 text-sm flex items-center gap-3 shadow-sm">
              <span className="text-lg">⚠️</span>
              <span className="font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full name"
                required
                className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min 6 characters"
                required
                className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                required
                className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 bg-slate-50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-gold hover:bg-[#e5920f] disabled:bg-brand-gold/50 text-brand-black font-extrabold py-3.5 rounded-xl transition-all duration-300 text-sm shadow-lg hover:shadow-xl mt-6 flex justify-center items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-brand-black/40 border-t-brand-black rounded-full animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Register</span>
                  <span>→</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-500">
            <div className="bg-brand-platinum/30 py-3 px-4 rounded-xl">
              Already have an account?{" "}
              <Link to="/login" className="text-brand-navy font-bold hover:text-brand-gold transition-colors ml-1">
                Sign in
              </Link>
            </div>
            <Link to="/" className="text-slate-400 hover:text-brand-navy block transition-colors mt-4">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
