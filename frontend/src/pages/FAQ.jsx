import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

const faqs = [
  {
    category: "Account & Registration",
    items: [
      {
        q: "How do I create an account?",
        a: "Click Register in the navbar, fill in your name, email, password, and choose your role (Student or Admin), then submit. You will be redirected to the login page.",
      },
      {
        q: "What is the difference between Student and Admin roles?",
        a: "Students can view their room, submit laundry requests, complaints, and view meal schedules. Admins have full control over rooms, users, payments, and all requests.",
      },
      {
        q: "I forgot my password. What should I do?",
        a: "Please contact your hostel admin to reset your password. A self-service password reset feature is coming soon.",
      },
    ],
  },
  {
    category: "Room Management",
    items: [
      {
        q: "How are rooms assigned?",
        a: "Rooms are assigned by the admin from the Admin Dashboard. Students can see their assigned room in their User Dashboard.",
      },
      {
        q: "Can a student request a specific room?",
        a: "Students can raise a complaint through the Complaints section to request a room change.",
      },
    ],
  },
  {
    category: "Payments",
    items: [
      {
        q: "How do I pay my hostel fees?",
        a: "Go to your User Dashboard, then Payments. You can view pending invoices and due dates. Payment is processed by the admin once confirmed.",
      },
      {
        q: "Can I see my payment history?",
        a: "Yes. The Payments section shows all past and pending payments with status: Paid, Pending, or Overdue.",
      },
    ],
  },
  {
    category: "Laundry",
    items: [
      {
        q: "How do I submit a laundry request?",
        a: "In your User Dashboard, go to the Laundry tab, fill in the number of bags and items, then submit a pickup request.",
      },
      {
        q: "How do I know when my laundry is ready?",
        a: "The admin updates the status of your request from Picked Up to Washing to Ready to Delivered. Check your Laundry tab for real-time status.",
      },
    ],
  },
  {
    category: "Complaints",
    items: [
      {
        q: "How do I report a maintenance issue?",
        a: "Go to User Dashboard, then Complaints, click New Complaint, describe the issue, set its priority, and submit. The admin will respond and update the status.",
      },
      {
        q: "How long does it take to resolve a complaint?",
        a: "You can track the status from Open to In Progress to Resolved in the Complaints section.",
      },
    ],
  },
  {
    category: "Meals",
    items: [
      {
        q: "Where can I see the meal schedule?",
        a: "In your User Dashboard, click the Meals tab to see the full weekly schedule with breakfast, lunch, and dinner times.",
      },
      {
        q: "Can I request a special diet?",
        a: "Raise a complaint or contact your admin directly to discuss dietary requirements.",
      },
    ],
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (key) => setOpenIndex(openIndex === key ? null : key);

  return (
    <div className="min-h-screen bg-[#e5e5e5]">
      <Navbar />

      <section className="bg-[#14213d] text-white py-16 text-center">
        <h1 className="text-4xl font-extrabold mb-3">Frequently Asked Questions</h1>
        <p className="text-gray-300 text-lg max-w-xl mx-auto">
          Find answers to the most common questions about HostelMS.
        </p>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-16 space-y-10">
        {faqs.map((section) => (
          <div key={section.category}>
            <h2 className="text-xl font-bold text-[#14213d] mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-[#fca311] rounded-full inline-block"></span>
              {section.category}
            </h2>
            <div className="space-y-3">
              {section.items.map((item, idx) => {
                const key = section.category + idx;
                const isOpen = openIndex === key;
                return (
                  <div key={key} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <button
                      className="w-full text-left px-6 py-4 flex items-center justify-between font-semibold text-black hover:bg-gray-50 transition"
                      onClick={() => toggle(key)}
                    >
                      <span>{item.q}</span>
                      <span className={"text-[#fca311] transition-transform duration-300 text-xl " + (isOpen ? "rotate-45" : "")}>+</span>
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-5 text-gray-700 text-sm leading-relaxed border-t border-gray-100 pt-3">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <div className="bg-[#14213d] text-white rounded-2xl p-8 text-center mt-12">
          <h3 className="text-xl font-bold mb-2">Still have questions?</h3>
          <p className="text-gray-300 mb-5">Our support team is happy to help.</p>
          <Link
            to="/contact"
            className="inline-block bg-[#fca311] text-white font-bold px-8 py-3 rounded-xl hover:bg-[#f2941d] transition"
          >
            Contact Us
          </Link>
        </div>
      </div>

      <footer className="bg-[#14213d] text-gray-400 py-8 text-center text-sm">
        © {new Date().getFullYear()} HostelMS. All rights reserved.
      </footer>
    </div>
  );
}
