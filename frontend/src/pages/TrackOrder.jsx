import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

function TrackOrder() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const steps = ["Pending", "Processing", "Shipped", "Delivered"];

 useEffect(() => {
  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get(`/api/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrder(res.data);
    } catch (err) {
      console.log("Error:", err.response?.data || err.message);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  fetchOrder();
}, [id]);
  const getStepIndex = (status) => steps.indexOf(status);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading order...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="h-screen flex items-center justify-center">
        Order not found
      </div>
    );
  }

  const currentStep = getStepIndex(order.status);

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <h2 className="text-2xl font-bold mb-6">
        📦 Track Order
      </h2>

      {/* ORDER CARD */}
      <div className="bg-white p-6 rounded-2xl shadow">

        {/* STATUS TRACKER */}
        <div className="flex justify-between items-center mb-6">

          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center flex-1">

              <div
                className={`w-4 h-4 rounded-full ${
                  i <= currentStep ? "bg-green-500" : "bg-gray-300"
                }`}
              ></div>

              {i !== steps.length - 1 && (
                <div
                  className={`h-1 w-full ${
                    i < currentStep ? "bg-green-500" : "bg-gray-300"
                  }`}
                ></div>
              )}

              <span className="text-xs mt-1">{step}</span>
            </div>
          ))}

        </div>

        {/* ORDER INFO */}
        <div className="grid md:grid-cols-2 gap-4 text-sm">

          <div className="bg-gray-50 p-3 rounded">
            <p className="font-semibold mb-1">Order Info</p>
            <p>ID: {order._id}</p>
            <p>Status: {order.status}</p>
            <p>Total: ₹{order.totalAmount}</p>
          </div>

          <div className="bg-gray-50 p-3 rounded">
            <p className="font-semibold mb-1">Customer</p>
            <p>{order.customer?.name}</p>
            <p>{order.customer?.phone}</p>
            <p>{order.customer?.address}</p>
            <p>{order.customer?.city}</p>
          </div>

        </div>

        {/* ITEMS */}
        <div className="mt-4 bg-gray-50 p-3 rounded">
          <p className="font-semibold mb-2">Items</p>

          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span>{item.productId?.name}</span>
              <span>x {item.quantity}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default TrackOrder;