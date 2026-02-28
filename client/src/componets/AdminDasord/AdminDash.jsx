import React from "react";

const AdminDash = () => {
  return (
    <section className="w-full mb-8 rounded-xl bg-gradient-to-r from-gray-900 to-gray-800 shadow-lg p-6 md:p-10 flex flex-col gap-8">
      <h2 className="text-2xl font-bold text-white mb-2 text-center">
        Admin Dashboard
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white rounded-lg p-6 shadow flex flex-col items-center">
          <span className="text-lg font-semibold">Total Purchase</span>
          <span className="text-2xl font-bold mt-2">120</span>
        </div>
        <div className="bg-gradient-to-r from-green-700 to-green-500 text-white rounded-lg p-6 shadow flex flex-col items-center">
          <span className="text-lg font-semibold">Total Sale</span>
          <span className="text-2xl font-bold mt-2">95</span>
        </div>
        <div className="bg-gradient-to-r from-purple-700 to-purple-500 text-white rounded-lg p-6 shadow flex flex-col items-center">
          <span className="text-lg font-semibold">Total Stock</span>
          <span className="text-2xl font-bold mt-2">340</span>
        </div>
        <div className="bg-gradient-to-r from-yellow-700 to-yellow-500 text-white rounded-lg p-6 shadow flex flex-col items-center">
          <span className="text-lg font-semibold">Suppliers</span>
          <span className="text-2xl font-bold mt-2">8</span>
        </div>
        <div className="bg-gradient-to-r from-pink-700 to-pink-500 text-white rounded-lg p-6 shadow flex flex-col items-center">
          <span className="text-lg font-semibold">Customers</span>
          <span className="text-2xl font-bold mt-2">42</span>
        </div>
        <div className="bg-gradient-to-r from-red-700 to-red-500 text-white rounded-lg p-6 shadow flex flex-col items-center">
          <span className="text-lg font-semibold">Low Stock</span>
          <span className="text-2xl font-bold mt-2">3</span>
        </div>
        <div className="bg-gradient-to-r from-gray-700 to-gray-500 text-white rounded-lg p-6 shadow flex flex-col items-center">
          <span className="text-lg font-semibold">Expired Items</span>
          <span className="text-2xl font-bold mt-2">1</span>
        </div>
      </div>
    </section>
  );
};

export default AdminDash;
