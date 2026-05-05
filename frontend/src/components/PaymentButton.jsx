import axios from "axios";

function PaymentButton({ amount = 500, userId = "user123" }) {
  const handlePayment = async () => {
    try {
      // ✅ 1. Create order from backend
      const { data: order } = await axios.post(
        "http://localhost:5000/api/payments/create-order",
        { amount, userId }
      );

      // ✅ 2. Razorpay options
      const options = {
        key: "rzp_test_NEWKEY", // ⚠️ replace with your real KEY_ID
        amount: order.amount,
        currency: "INR",
        name: "Custom Print Store",
        description: "Order Payment",
        order_id: order.id,

        handler: async function (response) {
          try {
            // ✅ 3. Verify payment
            const { data } = await axios.post(
              "http://localhost:5000/api/payments/verify",
              response
            );

            if (data.success) {
              alert("✅ Payment Successful");
              console.log("Payment verified:", response);
            } else {
              alert("❌ Payment Failed");
            }
          } catch (err) {
            console.error(err);
            alert("Verification error");
          }
        },

        prefill: {
          name: "Customer Name",
          email: "test@gmail.com",
          contact: "9999999999",
        },

        theme: {
          color: "#3399cc",
        },
      };

      // ✅ 4. Open Razorpay
      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error(err);
      alert("Payment failed to start");
    }
  };

  return (
    <button
      onClick={handlePayment}
      style={{
        padding: "12px 25px",
        background: "#3399cc",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
      }}
    >
      Pay ₹{amount}
    </button>
  );
}

export default PaymentButton;