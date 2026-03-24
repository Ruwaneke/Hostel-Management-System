import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

// Configuration
const API_URL = 'http://localhost:5025/api/rooms';

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
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Live Room Data
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axios.get(API_URL);
        // Only show rooms that admin has set to "display: true"
        const visibleRooms = res.data.data.filter(r => r.display === true);
        setRooms(visibleRooms);
      } catch (err) {
        console.error("Error fetching rooms:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 scroll-smooth">
      <Navbar />

      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-500 text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 py-24 flex flex-col lg:flex-row items-center gap-12 relative z-10">
          <div className="flex-1 text-center lg:text-left">
            <span className="inline-block bg-white/20 backdrop-blur text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
              🏠 Modern Hostel Management
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              Smart Hostel<br />
              <span className="text-yellow-300">All in One Platform</span>
            </h1>
            <p className="text-indigo-100 text-lg mb-8 max-w-xl mx-auto lg:mx-0">
              Streamline room allocation, payments, laundry, complaints, and meals — all from a single easy-to-use dashboard.
            </p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <Link to="/register" className="bg-yellow-400 hover:bg-yellow-300 text-indigo-900 font-bold px-8 py-3 rounded-xl transition shadow-lg transform hover:scale-105">
                Get Started Free
              </Link>
              <Link to="/login" className="bg-white/20 hover:bg-white/30 text-white font-semibold px-8 py-3 rounded-xl border border-white/30 transition backdrop-blur-sm">
                Sign In →
              </Link>
            </div>
          </div>

          <div className="flex-1 relative hidden lg:flex justify-center items-center min-h-[320px]">
             <div className="text-[160px] opacity-20 animate-pulse">🏨</div>
             <div className="absolute top-0 right-8 bg-white text-slate-700 text-sm font-bold px-4 py-2 rounded-xl shadow-2xl animate-bounce">
                🛏️ Room 204 — Available
             </div>
             <div className="absolute bottom-4 left-4 bg-green-500 text-white text-sm font-bold px-4 py-2 rounded-xl shadow-2xl shadow-green-200">
                ✅ Payment Confirmed
             </div>
             <div className="absolute top-24 left-0 bg-white text-slate-700 text-sm font-bold px-4 py-2 rounded-xl shadow-2xl">
                🔧 Ticket #12 Resolved
             </div>
          </div>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────── */}
      <section className="bg-indigo-600 text-white">
        <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-extrabold text-yellow-300">{s.value}</div>
              <div className="text-indigo-200 text-sm mt-1 uppercase tracking-wider font-semibold">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── LIVE ROOM GALLERY (NEW PART) ───────────────────── */}
      <section id="rooms" className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-800">Explore Available Rooms</h2>
            <p className="text-slate-500 mt-2 text-lg">Real-time availability for our premium hostel spaces.</p>
          </div>
          <Link to="/register" className="text-indigo-600 font-bold hover:underline mt-4 md:mt-0">View All Rooms →</Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.length > 0 ? rooms.slice(0, 6).map((room) => (
              <div key={room._id} className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-2xl transition-all duration-300 group">
                <div className="relative h-56 bg-slate-200">
                  {room.images?.[0] ? (
                    <img src={`/roomImage/${room.images[0]}`} alt="Room" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">📷 No Image</div>
                  )}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-black text-indigo-600 shadow-sm">
                    ${room.monthlyRent}/mo
                  </div>
                  <div className="absolute bottom-4 left-4 bg-indigo-600 text-white px-3 py-1 rounded-lg text-xs font-bold shadow-lg">
                    {room.roomType}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-slate-800">Room {room.roomNumber}</h3>
                    <span className={`text-[10px] uppercase font-black px-2 py-1 rounded-md ${room.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {room.status}
                    </span>
                  </div>
                  <div className="flex gap-4 text-sm text-slate-500 mb-6">
                    <span className="flex items-center gap-1">🛏️ {room.bedCount}</span>
                    <span className="flex items-center gap-1">🪑 {room.chairCount}</span>
                    <span className="flex items-center gap-1">🚿 {room.bathroomType}</span>
                  </div>
                  <Link to="/register" className="block text-center bg-slate-50 hover:bg-indigo-600 hover:text-white text-indigo-600 font-bold py-3 rounded-xl transition border border-indigo-100 hover:border-indigo-600">
                    Book Now
                  </Link>
                </div>
              </div>
            )) : (
              <div className="col-span-full py-12 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200 text-slate-400">
                No rooms are currently listed for public view.
              </div>
            )}
          </div>
        )}
      </section>

      {/* ── FEATURES ──────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 mb-4">Everything You Need</h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">A complete solution built for both students and hostel administrators.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f) => {
            const c = colorMap[f.color];
            return (
              <div key={f.title} className={`bg-white rounded-3xl shadow-sm border-t-4 ${c.border} p-8 hover:shadow-xl transition-all duration-300 group`}>
                <div className={`${c.bg} ${c.text} w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform`}>
                  {f.icon}
                </div>
                <h3 className={`font-bold text-xl ${c.text} mb-3`}>{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────── */}
      <section className="bg-indigo-50/50 py-24 mt-10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-800 mb-4">Getting Started is Easy</h2>
            <p className="text-slate-500 italic">Follow these 3 simple steps to join our community.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-12">
            {steps.map((s) => (
              <div key={s.step} className="relative text-center">
                <div className="w-16 h-16 bg-white text-indigo-600 rounded-2xl shadow-lg flex items-center justify-center font-black text-2xl mx-auto mb-6 transform rotate-3 hover:rotate-0 transition-transform">
                  {s.step}
                </div>
                <h3 className="font-bold text-slate-800 text-xl mb-3">{s.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIAL ───────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h2 className="text-3xl font-black text-slate-800 mb-12 uppercase tracking-tighter">Student Feedback</h2>
        <div className="grid sm:grid-cols-2 gap-8">
          {[
            { name: 'Ahmed R.', role: 'Computer Science Student', text: 'HostelMS made paying my fees and tracking laundry so much easier. Love the clean interface!' },
            { name: 'Sara K.', role: 'Hostel Warden', text: 'Managing 120 rooms used to be a nightmare. Now everything is just one click away. Incredible tool.' },
          ].map((t) => (
            <div key={t.name} className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 text-slate-100 text-6xl font-serif">“</div>
              <p className="text-slate-600 italic mb-6 relative z-10 font-medium">"{t.text}"</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-black shadow-lg shadow-indigo-200">
                  {t.name[0]}
                </div>
                <div>
                  <div className="font-bold text-slate-800">{t.name}</div>
                  <div className="text-xs text-indigo-500 font-bold uppercase">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <div className="bg-indigo-900 rounded-[40px] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-6 relative z-10">Ready to Get Started?</h2>
          <p className="text-indigo-200 text-lg mb-10 max-w-xl mx-auto">Join hundreds of students and admins already using HostelMS for a better living experience.</p>
          <div className="flex flex-wrap gap-4 justify-center relative z-10">
            <Link to="/register" className="bg-yellow-400 hover:bg-yellow-300 text-indigo-900 font-black px-10 py-4 rounded-2xl transition shadow-xl transform hover:scale-105">
              Create My Account
            </Link>
            <Link to="/login" className="bg-white/10 hover:bg-white/20 text-white font-bold px-10 py-4 rounded-2xl border border-white/20 transition backdrop-blur-md">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────── */}
      <footer className="bg-slate-900 text-slate-400 py-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8 border-b border-slate-800 pb-12 mb-12">
          <div className="flex items-center gap-2 text-white font-black text-2xl tracking-tighter">
            <span className="bg-indigo-600 p-2 rounded-lg">🏠</span><span>HostelMS</span>
          </div>
          <div className="flex gap-8 text-sm font-bold uppercase tracking-widest">
            <Link to="/" className="hover:text-white transition">Home</Link>
            <Link to="/register" className="hover:text-white transition">Rooms</Link>
            <Link to="/contact" className="hover:text-white transition">Contact</Link>
            <Link to="/login" className="hover:text-white transition">Admin</Link>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-medium">
          <p>© {new Date().getFullYear()} HostelMS. Design for students with ❤️</p>
          <div className="flex gap-4">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
}