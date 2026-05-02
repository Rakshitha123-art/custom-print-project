import React, { useEffect, useState } from "react";
import api from "../api";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/api/orders");
        setOrders(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const steps = ["Pending", "Processing", "Shipped", "Delivered"];

  const getStepIndex = (status) => steps.indexOf(status);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <h2 className="text-3xl font-bold text-center mb-6">
        🧾 My Orders
      </h2>

      {orders.length === 0 ? (
        <div className="text-center mt-20 text-gray-500">
          No orders yet
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {orders.map((order, index) => {
            const currentStep = getStepIndex(order.status);

            return (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow-md p-5 hover:shadow-xl transition"
              >

                {/* ORDER ID */}
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-gray-700">
                    Order #{order._id.slice(-6)}
                  </h3>

                  <span className="text-xs bg-gray-200 px-3 py-1 rounded-full">
                    {order.status}
                  </span>
                </div>

                {/* PROGRESS TRACKER */}
                <div className="flex justify-between items-center mb-5">

                  {steps.map((step, i) => (
                    <div key={i} className="flex flex-col items-center flex-1">

                      {/* DOT */}
                      <div
                        className={`w-4 h-4 rounded-full ${
                          i <= currentStep
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      ></div>

                      {/* LINE */}
                      {i !== steps.length - 1 && (
                        <div
                          className={`h-1 w-full ${
                            i < currentStep
                              ? "bg-green-500"
                              : "bg-gray-300"
                          }`}
                        ></div>
                      )}

                      <span className="text-[10px] mt-1 text-gray-500">
                        {step}
                      </span>
                    </div>
                  ))}

                </div>

                {/* ITEMS */}
                <div className="bg-gray-50 p-3 rounded-lg text-sm space-y-1">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between">
                      <span>{item.productId?.name}</span>
                      <span className="text-gray-500">
                        × {item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                {/* TOTAL */}
                <div className="flex justify-between mt-4 font-semibold">
                  <span>Total</span>
                  <span className="text-green-600">
                    ₹{order.totalAmount}
                  </span>
                </div>

                {/* TRACK BUTTON */}
                <button 
                  className="w-full mt-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white py-2 rounded-xl hover:scale-[1.02] transition"
                  onClick={() => navigate(`/track-orders/${order._id}`)}
                >
  Track Order →
</button>
              </motion.div>
            );
          })}

        </div>
      )}
    </div>
  );
}

export default Orders;