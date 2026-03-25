import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const features = [
  { icon: '🛏️', title: 'Room Management', desc: 'Efficiently allocate and track available, occupied, and reserved rooms in real time.', color: 'indigo' },
  { icon: '💳', title: 'Payments', desc: 'View fee invoices, pay hostel fees, and download receipts instantly.', color: 'cyan' },
  { icon: '👕', title: 'Laundry', desc: 'Submit pickup requests, track wash/dry/fold status, get notified when ready.', color: 'violet' },
  { icon: '🔧', title: 'Complaints', desc: 'Raise maintenance issues. Admins track, assign, and resolve tickets efficiently.', color: 'red' },
  { icon: '🍽️', title: 'Meals', desc: 'View daily meal schedules, dietary options, and food service status.', color: 'green' },
  { icon: '📊', title: 'Admin Analytics', desc: 'Full dashboard with insights on occupancy, payments, and pending requests.', color: 'orange' },
];

const colorMap = {
  indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600', border: 'border-t-indigo-500' },
  cyan:   { bg: 'bg-cyan-100',   text: 'text-cyan-600',   border: 'border-t-cyan-500'   },
  violet: { bg: 'bg-violet-100', text: 'text-violet-600', border: 'border-t-violet-500' },
  red:    { bg: 'bg-red-100',    text: 'text-red-600',    border: 'border-t-red-500'    },
  green:  { bg: 'bg-green-100',  text: 'text-green-600',  border: 'border-t-green-500'  },
  orange: { bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-t-orange-500' },
};

const stats = [
  { value: '500+', label: 'Students Managed' },
  { value: '120',  label: 'Rooms Available'   },
  { value: '98%',  label: 'Satisfaction Rate' },
  { value: '24/7', label: 'Support Available' },
];

const steps = [
  { step: '01', title: 'Create an Account', desc: 'Register as a student or admin in under a minute.' },
  { step: '02', title: 'Set Up Your Hostel', desc: 'Add rooms, assign students, configure meal plans.' },
  { step: '03', title: 'Manage Everything', desc: 'Handle payments, laundry, complaints from one dashboard.' },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#e5e5e5] text-black">
      <Navbar />

      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="bg-[#14213d] text-white">
        <div className="max-w-7xl mx-auto px-6 py-24 flex flex-col lg:flex-row items-center gap-12">
          {/* Text */}
          <div className="flex-1 text-center lg:text-left">
            <span className="inline-block bg-white/20 backdrop-blur text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
              🏠 Modern Hostel Management
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              Smart Hostel<br />
              <span className="text-[#fca311]">All in One Platform</span>
            </h1>
            <p className="text-gray-200 text-lg mb-8 max-w-xl mx-auto lg:mx-0">
              Streamline room allocation, payments, laundry, complaints, and meals — all from a single easy-to-use dashboard.
            </p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <Link to="/register" className="bg-[#fca311] hover:bg-[#f2941d] text-white font-bold px-8 py-3 rounded-xl transition shadow-lg">
                Get Started Free
              </Link>
              <Link to="/login" className="bg-white/20 hover:bg-white/30 text-white font-semibold px-8 py-3 rounded-xl border border-white/30 transition">
                Sign In →
              </Link>
            </div>
          </div>

          {/* Floating cards */}
          <div className="flex-1 relative hidden lg:flex justify-center items-center min-h-[320px]">
            <div className="text-8xl select-none">🏨</div>
            <div className="absolute top-0 right-8 bg-white text-slate-700 text-sm font-semibold px-4 py-2 rounded-xl shadow-xl animate-bounce">
              🛏️ Room 204 — Available
            </div>
            <div className="absolute bottom-4 left-4 bg-green-500 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-xl">
              ✅ Payment Confirmed
            </div>
            <div className="absolute top-16 left-0 bg-white text-slate-700 text-sm font-semibold px-4 py-2 rounded-xl shadow-xl">
              🔧 Ticket #12 Resolved
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────── */}
      <section className="bg-[#14213d] text-white">
        <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-extrabold text-[#fca311]">{s.value}</div>
              <div className="text-gray-300 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-black mb-3">
            Everything You Need
          </h2>
          <p className="text-gray-600 text-lg max-w-xl mx-auto">
            A complete solution built for both students and hostel administrators.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => {
            const c = colorMap[f.color];
            return (
              <div key={f.title} className={`bg-white rounded-2xl shadow-sm border-t-4 ${c.border} p-6 hover:shadow-md transition`}>
                <div className={`${c.bg} ${c.text} w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4`}>
                  {f.icon}
                </div>
                <h3 className={`font-bold text-lg ${c.text} mb-2`}>{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────── */}
      <section className="bg-[#f5f5f5] py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-black mb-3">How It Works</h2>
            <p className="text-gray-600">Get up and running in 3 simple steps.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {steps.map((s) => (
              <div key={s.step} className="bg-white rounded-2xl p-8 shadow-sm text-center">
                <div className="w-12 h-12 bg-[#14213d] text-white rounded-full flex items-center justify-center font-extrabold text-lg mx-auto mb-4">
                  {s.step}
                </div>
                <h3 className="font-bold text-black text-lg mb-2">{s.title}</h3>
                <p className="text-gray-600 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIAL ───────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-extrabold text-slate-800 mb-10">What Students Say</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {[
            { name: 'Ahmed R.', role: 'Student', text: 'HostelMS made paying my fees and tracking laundry so much easier. Love the clean interface!' },
            { name: 'Sara K.', role: 'Admin', text: 'Managing 120 rooms used to be a nightmare. Now everything is just one click away. Incredible tool.' },
          ].map((t) => (
            <div key={t.name} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-left">
              <p className="text-slate-600 italic mb-4">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                  {t.name[0]}
                </div>
                <div>
                  <div className="font-semibold text-slate-800">{t.name}</div>
                  <div className="text-xs text-slate-400">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="bg-[#14213d] text-white py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Ready to Get Started?</h2>
          <p className="text-gray-300 text-lg mb-8">Join hundreds of students and admins already using HostelMS.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/register" className="bg-[#fca311] hover:bg-[#f2941d] text-white font-bold px-8 py-3 rounded-xl transition shadow-lg">
              Create Account
            </Link>
            <Link to="/contact" className="bg-white/20 hover:bg-white/30 text-white font-semibold px-8 py-3 rounded-xl border border-white/30 transition">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────── */}
      <footer className="bg-[#14213d] text-gray-400 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <span>🏠</span><span>HostelMS</span>
          </div>
          <div className="flex gap-6 text-sm">
            <Link to="/contact" className="hover:text-white transition">Contact</Link>
            <Link to="/faq" className="hover:text-white transition">FAQ</Link>
            <Link to="/register" className="hover:text-white transition">Register</Link>
            <Link to="/login" className="hover:text-white transition">Login</Link>
          </div>
          <p className="text-sm">© {new Date().getFullYear()} HostelMS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
