import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

// Stripe public key
const stripePromise = loadStripe("pk_test_51N...YOUR_KEY_HERE");

const CARD_OPTIONS = {
  style: {
    base: {
      fontSize: "16px",
      color: "#1a1a1a",
      "::placeholder": { color: "#a0aec0" },
    },
    invalid: {
      color: "#e53e3e",
    },
  },
};

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [darkMode, setDarkMode] = useState(false);
  const [saveCard, setSaveCard] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    room: "",
    amount: "",
  });

  const handlePayment = async (e) => {
    e.preventDefault();
    setError("");

    if (!stripe || !elements) return;

    if (!formData.name || !formData.room || !formData.amount) {
      setError("Please fill all required fields.");
      return;
    }

    setLoading(true);

    const cardElement = elements.getElement(CardElement);

    const { error: stripeError, paymentMethod } =
      await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: {
          name: formData.name,
        },
      });

    if (stripeError) {
      setError(stripeError.message);
      setLoading(false);
      return;
    }

    console.log("PaymentMethod:", paymentMethod);

    // Simulate success
    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
    }, 1500);
  };

  if (success) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-2xl font-bold text-green-500">
          ✅ Payment Successful
        </h1>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen p-6 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100"
      }`}
    >
      {/* Toggle Dark Mode */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-3 py-1 border rounded"
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        {/* LEFT SIDE */}
        <div
          className={`md:col-span-2 p-6 rounded-xl shadow ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h2 className="text-xl font-semibold mb-4">
            Credit Card Information
          </h2>

          {/* Name */}
          <input
            type="text"
            placeholder="Student Name"
            className="w-full mb-3 p-3 border rounded-lg text-black"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
          />

          {/* Room */}
          <input
            type="text"
            placeholder="Room Number"
            className="w-full mb-3 p-3 border rounded-lg text-black"
            value={formData.room}
            onChange={(e) =>
              setFormData({ ...formData, room: e.target.value })
            }
          />

          {/* Amount */}
          <input
            type="number"
            placeholder="Amount (LKR)"
            className="w-full mb-3 p-3 border rounded-lg text-black"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
          />

          {/* Card Icons */}
          <div className="flex gap-2 mb-2">
            <img
              src="https://img.icons8.com/color/48/visa.png"
              alt="visa"
              className="w-10"
            />
            <img
              src="https://img.icons8.com/color/48/mastercard-logo.png"
              alt="mc"
              className="w-10"
            />
            <img
              src="https://img.icons8.com/color/48/amex.png"
              alt="amex"
              className="w-10"
            />
          </div>

          {/* Card Element */}
          <div className="border p-3 rounded-lg mb-3 bg-white">
            <CardElement options={CARD_OPTIONS} />
          </div>

          {/* Save Card */}
          <div className="flex items-center gap-2 mb-3">
            <input
              type="checkbox"
              checked={saveCard}
              onChange={() => setSaveCard(!saveCard)}
            />
            <span className="text-sm">Save card for next time</span>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-500 mb-3 text-sm">{error}</div>
          )}

          {/* Button */}
          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
          >
            {loading ? "Processing..." : `Pay LKR ${formData.amount || 0}`}
          </button>
        </div>

        {/* RIGHT SIDE */}
        <div
          className={`p-5 rounded-xl shadow h-fit ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h3 className="font-semibold text-lg mb-4">Order Summary</h3>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Room Fee</span>
              <span>LKR {formData.amount || 0}</span>
            </div>

            <div className="flex justify-between">
              <span>Service Fee</span>
              <span>LKR 500</span>
            </div>

            <div className="flex justify-between">
              <span>Tax</span>
              <span>LKR 300</span>
            </div>

            <hr />

            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>
                LKR {Number(formData.amount || 0) + 800}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Payment = () => (
  <Elements stripe={stripePromise}>
    <CheckoutForm />
  </Elements>
);

export default Payment;