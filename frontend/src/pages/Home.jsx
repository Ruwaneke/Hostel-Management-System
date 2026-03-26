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
      <section className="bg-brand-navy text-brand-platinum relative overflow-hidden border-b border-brand-white/5">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-gold/5 rounded-full translate-x-1/3 -translate-y-1/4 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-platinum/5 rounded-full -translate-x-1/3 translate-y-1/3 blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 py-28 flex flex-col lg:flex-row items-center gap-12 relative z-10">
          {/* Text */}
          <div className="flex-1 text-center lg:text-left">
            <span className="inline-block bg-brand-white/10 backdrop-blur-md border border-brand-white/10 text-brand-gold text-sm font-bold px-5 py-2 rounded-full mb-8 shadow-lg">
              ✨ Modern Hostel Management
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-tight mb-8 text-brand-white tracking-tight">
              Smart Hostel<br />
              <span className="text-brand-gold drop-shadow-sm">All in One Platform</span>
            </h1>
            <p className="text-brand-platinum/80 text-lg lg:text-xl mb-10 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
              Streamline room allocation, payments, laundry, complaints, and meals — all from a beautifully crafted dashboard.
            </p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <Link to="/register" className="bg-brand-gold hover:bg-[#e5920f] text-brand-black font-extrabold px-8 py-3.5 rounded-xl transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5">
                Get Started Free
              </Link>
              <Link to="/login" className="bg-brand-white/5 hover:bg-brand-white/10 text-brand-white font-bold px-8 py-3.5 rounded-xl border border-brand-white/20 transition-all backdrop-blur-sm shadow-lg">
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
      <section className="bg-brand-black text-brand-white border-b border-brand-white/5 relative z-20">
        <div className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center">
              <div className="text-4xl font-black text-brand-gold mb-2">{s.value}</div>
              <div className="text-brand-platinum/70 text-sm font-bold uppercase tracking-wider">{s.label}</div>
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
      <section className="bg-brand-platinum/20 py-24 border-y border-brand-platinum/50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-brand-navy mb-4 tracking-tight">How It Works</h2>
            <p className="text-slate-500 font-medium text-lg">Get up and running in 3 simple steps.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8 relative">
            {/* Connecting Line */}
            <div className="hidden sm:block absolute top-1/2 left-10 right-10 h-0.5 bg-brand-platinum -z-10 -translate-y-[45px]"></div>
            
            {steps.map((s) => (
              <div key={s.step} className="bg-brand-white rounded-3xl p-8 shadow-xl text-center border border-brand-platinum/30 relative z-10 transition-transform hover:-translate-y-1">
                <div className="w-16 h-16 bg-brand-navy text-brand-gold rounded-full flex items-center justify-center font-black text-2xl mx-auto mb-6 shadow-lg ring-4 ring-brand-white">
                  {s.step}
                </div>
                <h3 className="font-bold text-brand-navy text-xl mb-3">{s.title}</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIAL ───────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-24 text-center">
        <h2 className="text-3xl sm:text-4xl font-black text-brand-navy mb-14 tracking-tight">What Our Users Say</h2>
        <div className="grid sm:grid-cols-2 gap-8">
          {[
            { name: 'Ahmed R.', role: 'Student', text: 'HostelMS made paying my fees and tracking laundry so much easier. Love the premium interface, it feels incredibly modern.' },
            { name: 'Sara K.', role: 'Admin', text: 'Managing 120 rooms used to be a nightmare. Now everything is just one click away. Absolutely incredible tool.' },
          ].map((t) => (
            <div key={t.name} className="bg-brand-white border border-brand-platinum/50 rounded-3xl p-8 shadow-lg text-left relative">
              <div className="absolute top-8 right-8 text-6xl text-brand-platinum/40 font-serif leading-none">"</div>
              <p className="text-slate-600 font-medium italic mb-8 relative z-10 leading-relaxed text-lg text-pretty">
                {t.text}
              </p>
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 bg-brand-navy text-brand-gold rounded-full flex items-center justify-center font-bold text-xl shadow-md">
                  {t.name[0]}
                </div>
                <div>
                  <div className="font-extrabold text-brand-navy">{t.name}</div>
                  <div className="text-sm font-semibold text-brand-gold uppercase tracking-wider">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="bg-brand-navy text-brand-white py-24 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 w-full h-full bg-brand-gold/5 -translate-x-1/2 blur-3xl pointer-events-none rounded-[100%]" />
        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">Ready to Upgrade?</h2>
          <p className="text-brand-platinum text-lg md:text-xl font-medium mb-10 text-balance opacity-90">
            Join hundreds of visionary students and admins revolutionizing campus living with HostelMS.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/register" className="bg-brand-gold hover:bg-[#e5920f] text-brand-black font-extrabold px-8 py-4 rounded-xl transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1">
              Create Free Account
            </Link>
            <Link to="/contact" className="bg-brand-white/5 hover:bg-brand-white/10 text-brand-white font-bold px-8 py-4 rounded-xl border border-brand-white/20 transition-all backdrop-blur-sm">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────── */}
      <footer className="bg-brand-black text-brand-platinum py-12 border-t border-brand-white/10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-brand-gold font-black text-2xl tracking-tight">
            <span>🏠</span><span>HostelMS</span>
          </div>
          <div className="flex gap-8 text-sm font-semibold">
            <Link to="/contact" className="hover:text-brand-gold transition-colors">Contact</Link>
            <Link to="/faq" className="hover:text-brand-gold transition-colors">FAQ</Link>
            <Link to="/register" className="hover:text-brand-gold transition-colors">Register</Link>
            <Link to="/login" className="hover:text-brand-gold transition-colors">Login</Link>
          </div>
          <p className="text-sm text-brand-platinum/50 font-medium">© {new Date().getFullYear()} HostelMS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
