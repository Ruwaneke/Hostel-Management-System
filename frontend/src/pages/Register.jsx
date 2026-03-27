import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authAPI } from "../services/authService";
import { useToast } from "../components/Toast";
import Navbar from "../components/Navbar"; // ✅ Navbar added

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
  const { toast } = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      const errMsg = "Please enter a valid email address.";
      setError(errMsg);
      toast.error("Validation Error", errMsg);
      return;
    }

    if (formData.password.length < 6) {
      const errMsg = "Password must be at least 6 characters.";
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
        toast.success("Registration Successful", "Please login now.");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        const errMsg = response.message || "Registration failed";
        setError(errMsg);
        toast.error("Registration Failed", errMsg);
      }
    } catch (err) {
      const errMsg = err.message || "Cannot connect to server";
      setError(errMsg);
      toast.error("Registration Error", errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-brand-navy flex items-center justify-center px-4 py-10 relative overflow-hidden selection:bg-brand-gold selection:text-brand-navy">
        {/* Background blobs */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-brand-gold/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-brand-platinum/5 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl pointer-events-none" />

        <div className="relative w-full max-w-md">
          {/* Card */}
          <div className="bg-brand-white rounded-3xl shadow-2xl px-8 py-10 border border-brand-platinum/50">

            {/* Heading */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 bg-brand-gold rounded-2xl flex items-center justify-center text-3xl shadow-lg mb-4 ring-4 ring-brand-gold/30">
                🏠
              </div>
              <h1 className="text-3xl font-extrabold text-brand-black tracking-tight">Create Account</h1>
              <p className="text-slate-500 text-sm mt-2">Join HostelMS as a student</p>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-rose-50 border-l-4 border-rose-500 text-rose-700 px-4 py-3 rounded-r-xl mb-6 text-sm flex items-center gap-3 shadow-sm">
                <span className="text-lg">⚠️</span>
                <span className="font-medium">{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#14213d] transition bg-[#f5f5f5]"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#14213d] transition bg-[#f5f5f5]"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#14213d] transition bg-[#f5f5f5]"
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#14213d] transition bg-[#f5f5f5]"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-gold hover:bg-[#e5920f] disabled:bg-brand-gold/50 text-brand-black font-extrabold py-3.5 rounded-xl transition-all duration-300 text-sm shadow-lg hover:shadow-xl flex justify-center items-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-brand-black/40 border-t-brand-black rounded-full animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Register</span>
                    <span>→</span>
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center text-sm text-slate-500">
              <p className="bg-brand-platinum/30 py-2 px-4 rounded-xl inline-block w-full">
                Already have an account?{" "}
                <Link to="/login" className="text-brand-navy font-bold hover:text-brand-gold transition-colors">
                  Login here
                </Link>
              </p>
              <Link to="/" className="text-slate-400 hover:text-brand-navy block transition-colors mt-2">
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}