import React, { useState } from 'react';
import Navbar from '../components/Navbar';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app you'd POST to an API here
    setSent(true);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-[#e5e5e5]">
      <Navbar />

      {/* Header */}
      <section className="bg-[#14213d] text-white py-16 text-center">
        <h1 className="text-4xl font-extrabold mb-3">Contact Us</h1>
        <p className="text-gray-300 text-lg max-w-xl mx-auto">
          Have a question or need help? We're here for you.
        </p>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-16 grid lg:grid-cols-2 gap-12">

        {/* Info cards */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-black mb-6">Get in Touch</h2>

          {[
            { icon: '📧', title: 'Email Us', detail: 'support@hostelms.com', sub: 'We reply within 24 hours' },
            { icon: '📞', title: 'Call Us', detail: '+92 300 000 0000', sub: 'Mon–Fri, 9am–6pm' },
            { icon: '📍', title: 'Location', detail: 'Block A, University Campus', sub: 'Hostel Management Office' },
            { icon: '🕐', title: 'Office Hours', detail: 'Monday – Friday', sub: '9:00 AM – 6:00 PM' },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-[#fca311]/10 text-[#14213d] rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                {item.icon}
              </div>
              <div>
                <div className="font-semibold text-black">{item.title}</div>
                <div className="text-gray-700 text-sm mt-0.5">{item.detail}</div>
                <div className="text-gray-500 text-xs mt-0.5">{item.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact form */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Send a Message</h2>

          {sent && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6 text-sm">
              ✅ Message sent! We'll get back to you shortly.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text" name="name" value={form.name} onChange={handleChange} required
                  placeholder="Your name"
                  className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
                <input
                  type="email" name="email" value={form.email} onChange={handleChange} required
                  placeholder="you@example.com"
                  className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-1">Subject</label>
              <input
                type="text" name="subject" value={form.subject} onChange={handleChange} required
                placeholder="What is this about?"
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#14213d] transition text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-1">Message</label>
              <textarea
                name="message" value={form.message} onChange={handleChange} required rows={5}
                placeholder="Write your message here..."
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#14213d] transition text-sm resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#14213d] hover:bg-[#0f1824] text-white font-bold py-3 rounded-xl transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#14213d] text-gray-400 py-8 text-center text-sm">
        © {new Date().getFullYear()} HostelMS. All rights reserved.
      </footer>
    </div>
  );
}
