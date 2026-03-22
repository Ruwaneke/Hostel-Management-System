import React, { useState } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

const Payment = () => {
  const { width, height } = useWindowSize();

  const [paymentType, setPaymentType] = useState("card"); // card or deposit
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    name: "",
  });
  const [studentInfo, setStudentInfo] = useState({
    name: "",
    room: "",
    amount: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleCardChange = (e) => {
    setCardDetails({ ...cardDetails, [e.target.name]: e.target.value });
  };

  const handleStudentChange = (e) => {
    setStudentInfo({ ...studentInfo, [e.target.name]: e.target.value });
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!studentInfo.name || !studentInfo.room || !studentInfo.amount) {
      setError("Please fill in all required fields!");
      return;
    }

    if (paymentType === "card") {
      const { cardNumber, expiry, cvv, name } = cardDetails;
      if (!cardNumber || !expiry || !cvv || !name) {
        setError("Please fill in all card details!");
        return;
      }
    }

    setLoading(true);

    // simulate payment delay
    setTimeout(() => {
      setLoading(false);
      // simulate random error
      if (Math.random() < 0.1) {
        setError("Payment failed. Please try again.");
        return;
      }
      setSuccess(true);
    }, 1500);
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center h-screen relative">
        <Confetti width={width} height={height} numberOfPieces={200} />
        <h1 className="text-2xl font-bold text-green-600">
          ✅ Payment Successful
        </h1>
        <p className="mt-2">
          Hostel fee for room {studentInfo.room} has been paid.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg flex gap-6">
      {/* Payment Summary on Left */}
      <div className="w-1/3 border p-4 rounded bg-gray-50 h-fit">
        <h2 className="text-xl font-bold mb-4">Payment Summary</h2>
        <p>
          <strong>Student Name:</strong> {studentInfo.name || "-"}
        </p>
        <p>
          <strong>Room:</strong> {studentInfo.room || "-"}
        </p>
        <p>
          <strong>Amount:</strong> LKR {studentInfo.amount || "-"}
        </p>
        <p>
          <strong>Payment Type:</strong> {paymentType === "card" ? "Card" : "Deposit"}
        </p>
      </div>

      {/* Payment Form on Right */}
      <div className="w-2/3">
        <h2 className="text-2xl font-bold mb-4">Hostel Payment</h2>

        {error && (
          <div className="mb-3 p-2 bg-red-100 text-red-700 rounded">{error}</div>
        )}

        <form onSubmit={handlePaymentSubmit}>
          {/* Student Info */}
          <input
            type="text"
            name="name"
            value={studentInfo.name}
            onChange={handleStudentChange}
            placeholder="Student Name"
            className="w-full mb-3 p-2 border rounded"
            required
          />
          <input
            type="text"
            name="room"
            value={studentInfo.room}
            onChange={handleStudentChange}
            placeholder="Room Number"
            className="w-full mb-3 p-2 border rounded"
            required
          />
          <input
            type="number"
            name="amount"
            value={studentInfo.amount}
            onChange={handleStudentChange}
            placeholder="Amount (LKR)"
            className="w-full mb-3 p-2 border rounded"
            required
          />

          {/* Payment Type */}
          <div className="mb-6 flex gap-4">
            <button
              type="button"
              onClick={() => setPaymentType("card")}
              className={`px-4 py-2 rounded ${
                paymentType === "card" ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              Card
            </button>
            <button
              type="button"
              onClick={() => setPaymentType("deposit")}
              className={`px-4 py-2 rounded ${
                paymentType === "deposit" ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              Deposit
            </button>
          </div>

          {/* Card Fields */}
          {paymentType === "card" && (
            <div className="space-y-4">
              <div>
                <label className="block mb-1 font-semibold">Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={cardDetails.cardNumber}
                  onChange={handleCardChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength={16}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold">Expiry Date</label>
                <input
                  type="text"
                  name="expiry"
                  value={cardDetails.expiry}
                  onChange={handleCardChange}
                  placeholder="MM/YY"
                  maxLength={5}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold">CVV</label>
                <input
                  type="text"
                  name="cvv"
                  value={cardDetails.cvv}
                  onChange={handleCardChange}
                  placeholder="123"
                  maxLength={3}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold">Cardholder Name</label>
                <input
                  type="text"
                  name="name"
                  value={cardDetails.name}
                  onChange={handleCardChange}
                  placeholder="John Doe"
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
            </div>
          )}

          {/* Deposit Instructions */}
          {paymentType === "deposit" && (
            <div className="p-4 bg-yellow-100 rounded mb-4">
              <p>
                Please transfer the amount to our bank account:
                <br />
                <strong>Bank:</strong> ABC Bank
                <br />
                <strong>Account Number:</strong> 123456789
                <br />
                <strong>Reference:</strong> Your Student Name
              </p>
            </div>
          )}

          {/* Pay Now Button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition flex justify-center items-center gap-2"
          >
            {loading ? (
              <>
                Processing...
                <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
              </>
            ) : (
              "Pay Now"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Payment;