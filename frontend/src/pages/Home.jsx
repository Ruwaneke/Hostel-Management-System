import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext'; 

// --- CONFIGURATION ---
const API_URL = 'http://localhost:5025/api/rooms/available';

const features = [
  { icon: '🛏️', title: 'Room Management', desc: 'Efficiently allocate and track available, occupied, and reserved rooms in real time.', color: 'navy' },
  { icon: '💳', title: 'Payments', desc: 'View fee invoices, pay hostel fees, and download receipts instantly.', color: 'orange' },
  { icon: '👕', title: 'Laundry', desc: 'Submit pickup requests, track wash/dry/fold status, get notified when ready.', color: 'navy' },
  { icon: '🔧', title: 'Complaints', desc: 'Raise maintenance issues. Admins track, assign, and resolve tickets efficiently.', color: 'orange' },
  { icon: '🍽️', title: 'Meals', desc: 'View daily meal schedules, dietary options, and food service status.', color: 'navy' },
  { icon: '📊', title: 'Admin Analytics', desc: 'Full dashboard with insights on occupancy, payments, and pending requests.', color: 'orange' },
];

const colorMap = {
  navy:   { bg: 'bg-[#14213D]/10', text: 'text-[#14213D]', border: 'border-t-[#14213D]' },
  orange: { bg: 'bg-[#FCA311]/10', text: 'text-[#FCA311]', border: 'border-t-[#FCA311]' },
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
  const { user } = useAuth(); // Check if student is logged in

  // ── FETCH LIVE ROOM DATA ────────────────────────────────────────────
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axios.get(API_URL);
        setRooms(res.data.data);
      } catch (err) {
        console.error("Error fetching rooms:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  return (
    <div className="min-h-screen bg-[#E5E5E5] text-[#000000] font-sans">
      <Navbar />

      {/* ── HERO SECTION ──────────────────────────────────────────── */}
      <section className="bg-[#14213D] text-[#FFFFFF] relative overflow-hidden border-b border-white/5">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#FCA311]/10 rounded-full translate-x-1/3 -translate-y-1/4 blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 py-28 flex flex-col lg:flex-row items-center gap-12 relative z-10">
          <div className="flex-1 text-center lg:text-left">
            <span className="inline-block bg-white/10 backdrop-blur-md border border-white/10 text-[#FCA311] text-sm font-bold px-5 py-2 rounded-full mb-8 shadow-lg uppercase tracking-widest">
              ✨ Smart Hostel Management
            </span>
            <h1 className="text-5xl lg:text-7xl font-black leading-tight mb-8 tracking-tighter">
              The Future of <br />
              <span className="text-[#FCA311]">Campus Living</span>
            </h1>
            <p className="text-[#E5E5E5]/80 text-lg lg:text-xl mb-10 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
              Streamline room allocation, secure payments, and facility management — all from one beautifully crafted premium dashboard.
            </p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <Link to="/register" className="bg-[#FCA311] hover:bg-[#FFFFFF] text-[#14213D] font-black px-10 py-4 rounded-2xl transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1">
                Get Started Free
              </Link>
              <Link to="/login" className="bg-white/5 hover:bg-white/10 text-[#FFFFFF] font-bold px-10 py-4 rounded-2xl border border-white/20 transition-all backdrop-blur-sm">
                Sign In →
              </Link>
            </div>
          </div>

          <div className="flex-1 relative hidden lg:flex justify-center items-center min-h-[400px]">
             <div className="text-[200px] opacity-10 animate-pulse">🏢</div>
             <div className="absolute top-0 right-8 bg-white text-[#14213D] text-sm font-black px-6 py-3 rounded-2xl shadow-2xl animate-bounce border-l-4 border-[#FCA311]">
                🛏️ Room Allocation Active
             </div>
             <div className="absolute bottom-4 left-4 bg-[#FCA311] text-[#14213D] text-sm font-black px-6 py-3 rounded-2xl shadow-2xl shadow-[#FCA311]/20">
                💳 Secure Stripe Payments
             </div>
          </div>
        </div>
      </section>

      {/* ── STATS SECTION ─────────────────────────────────────────── */}
      <section className="bg-[#000000] text-[#FFFFFF] relative z-20 shadow-2xl">
        <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label} className="group">
              <div className="text-5xl font-black text-[#FCA311] mb-2 group-hover:scale-110 transition-transform duration-300">{s.value}</div>
              <div className="text-[#E5E5E5]/60 text-xs font-black uppercase tracking-[0.2em]">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── LIVE ROOM GALLERY ─────────────────────────────────────────── */}
      <section id="rooms" className="max-w-7xl mx-auto px-6 py-28">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <div>
            <h2 className="text-4xl font-black text-[#14213D] tracking-tight">Available Premium Spaces</h2>
            <p className="text-gray-500 mt-2 text-lg font-medium">Real-time availability for our high-end hostel blocks.</p>
          </div>
          {user ? (
            <Link to="/rooms" className="text-[#14213D] font-black hover:text-[#FCA311] transition-colors border-b-2 border-[#14213D] pb-1">View All Rooms →</Link>
          ) : (
            <div className="bg-[#14213D] text-[#FCA311] px-6 py-2 rounded-full text-sm font-black uppercase tracking-wider shadow-lg">Login to Book</div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-16 h-16 border-4 border-[#14213D]/10 border-t-[#FCA311] rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {rooms.length > 0 ? rooms.slice(0, 6).map((room) => {
               const availableSlots = room.capacity - (room.bookedStudents?.length || 0);

               return (
                <div key={room._id} className="bg-[#FFFFFF] rounded-[2.5rem] overflow-hidden border border-gray-200 shadow-sm hover:shadow-2xl transition-all duration-500 group">
                  
                  {/* Photo Section */}
                  <div className="relative h-72 bg-gray-200 overflow-hidden">
                    {room.photos && room.photos[0] ? (
                      <img src={room.photos[0]} alt="Room" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold">📷 No Image</div>
                    )}
                    
                    <div className="absolute top-5 left-5 flex gap-2">
                        <span className="bg-white/95 backdrop-blur px-4 py-1.5 rounded-full text-[10px] font-black text-[#14213D] shadow-md uppercase tracking-widest">Block {room.block}</span>
                        {room.isAC && <span className="bg-[#FCA311] px-4 py-1.5 rounded-full text-[10px] font-black text-[#14213D] shadow-md uppercase">❄️ AC</span>}
                    </div>
                    <div className="absolute bottom-5 right-5 bg-[#14213D] text-[#FCA311] px-5 py-2 rounded-2xl text-sm font-black shadow-xl">
                      Rs.{room.monthlyFee} /mo
                    </div>
                  </div>

                  {/* Details Section */}
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-2xl font-black text-[#14213D] mb-1">Room {room.roomNumber}</h3>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{room.roomType} Suite</p>
                      </div>
                      <span className={`text-[10px] uppercase font-black px-4 py-2 rounded-full shadow-inner ${availableSlots > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                        {availableSlots} Beds Left
                      </span>
                    </div>

                    {/* Furnishing Grid */}
                    <div className="grid grid-cols-3 gap-2 bg-[#E5E5E5]/30 p-4 rounded-3xl mb-8 border border-gray-100">
                      <div className="flex flex-col items-center"><span className="text-xl">🛏️</span><span className="text-[10px] font-black text-gray-500 mt-2">{room.beds} Beds</span></div>
                      <div className="flex flex-col items-center"><span className="text-xl">🪵</span><span className="text-[10px] font-black text-gray-500 mt-2">{room.tables} Tables</span></div>
                      <div className="flex flex-col items-center"><span className="text-xl">🪑</span><span className="text-[10px] font-black text-gray-500 mt-2">{room.chairs} Chairs</span></div>
                    </div>

                    {user ? (
                      <Link to={`/room-details/${room._id}`} className="block text-center bg-[#14213D] text-[#FCA311] font-black py-4 rounded-2xl transition-all hover:bg-[#FCA311] hover:text-[#14213D] shadow-lg hover:shadow-2xl transform group-hover:-translate-y-1">
                        View Details & Book
                      </Link>
                    ) : (
                      <Link to="/login" className="block text-center bg-white border-2 border-dashed border-gray-300 text-gray-400 font-bold py-4 rounded-2xl transition hover:bg-[#E5E5E5]/50">
                        Login to Access Booking
                      </Link>
                    )}
                  </div>
                </div>
              );
            }) : (
              <div className="col-span-full py-24 text-center bg-white rounded-[3rem] border-2 border-dashed border-gray-300 text-gray-400">
                <div className="text-6xl mb-6">🏘️</div>
                <h3 className="text-2xl font-black text-[#14213D]">All Rooms Currently Occupied</h3>
                <p className="font-medium">Check back soon for upcoming vacancies.</p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* ── FEATURES SECTION ──────────────────────────────────────── */}
      <section className="bg-white py-28 shadow-inner">
        <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-4xl font-black text-[#14213D] mb-4 tracking-tight">Everything You Need</h2>
              <p className="text-gray-500 text-lg max-w-xl mx-auto font-medium leading-relaxed">
                A complete ecosystem built for high-performance students and elite hostel administrators.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {features.map((f) => {
                const c = colorMap[f.color];
                return (
                  <div key={f.title} className={`bg-white rounded-[2.5rem] shadow-sm border-t-8 ${c.border} p-10 hover:shadow-2xl transition-all duration-300 group`}>
                    <div className={`${c.bg} ${c.text} w-16 h-16 rounded-3xl flex items-center justify-center text-4xl mb-8 group-hover:rotate-12 transition-transform`}>
                      {f.icon}
                    </div>
                    <h3 className={`font-black text-2xl ${c.text} mb-4 tracking-tight`}>{f.title}</h3>
                    <p className="text-gray-500 text-sm font-medium leading-loose">{f.desc}</p>
                  </div>
                );
              })}
            </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────── */}
      <section className="bg-[#E5E5E5]/50 py-28 border-y border-gray-200">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-[#14213D] mb-4 tracking-tight">Three Simple Steps</h2>
            <p className="text-gray-500 font-bold text-lg uppercase tracking-widest">Get your keys in record time.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-12 relative">
            <div className="hidden sm:block absolute top-1/2 left-10 right-10 h-1 bg-[#14213D]/5 -z-10 -translate-y-[60px]"></div>
            {steps.map((s) => (
              <div key={s.step} className="bg-white rounded-[2.5rem] p-10 shadow-xl text-center border border-gray-100 relative z-10 hover:-translate-y-2 transition-transform">
                <div className="w-20 h-20 bg-[#14213D] text-[#FCA311] rounded-3xl flex items-center justify-center font-black text-3xl mx-auto mb-8 shadow-2xl ring-8 ring-white">
                  {s.step}
                </div>
                <h3 className="font-black text-[#14213D] text-2xl mb-4 tracking-tight">{s.title}</h3>
                <p className="text-gray-500 text-sm font-medium leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ───────────────────────────────────────────── */}
      <section className="bg-[#14213D] text-white py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#FCA311]/5 blur-3xl rounded-full translate-y-1/2 scale-150 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-5xl font-black mb-8 tracking-tighter">Ready for a Better Experience?</h2>
          <p className="text-[#E5E5E5] text-xl font-medium mb-12 opacity-80 max-w-2xl mx-auto leading-relaxed">
            Join the community of students who are revolutionizing their campus lifestyle with Smart Hostel.
          </p>
          <div className="flex flex-wrap gap-6 justify-center">
            <Link to="/register" className="bg-[#FCA311] text-[#14213D] font-black px-12 py-5 rounded-2xl transition-all shadow-2xl hover:bg-white hover:-translate-y-1">
              Create My Account
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────── */}
      <footer className="bg-[#000000] text-[#E5E5E5] py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex items-center gap-3 text-[#FCA311] font-black text-3xl tracking-tighter">
            <span className="bg-[#14213D] p-2 rounded-xl">🏠</span>
            <span>HostelMS</span>
          </div>
          <div className="flex gap-10 text-xs font-black uppercase tracking-widest">
            <Link to="/contact" className="hover:text-[#FCA311] transition-colors">Support</Link>
            <Link to="/faq" className="hover:text-[#FCA311] transition-colors">FAQ</Link>
            <Link to="/privacy" className="hover:text-[#FCA311] transition-colors">Privacy</Link>
          </div>
          <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest">
            © {new Date().getFullYear()} Smart Hostel. Crafted with Passion.
          </p>
        </div>
      </footer>
    </div>
  );
}