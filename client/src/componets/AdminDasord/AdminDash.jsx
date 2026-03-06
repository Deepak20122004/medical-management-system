import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../../context/AppContext";

const AdminDash = () => {

  const { backendUrl } = useContext(AppContext);

  const [stats, setStats] = useState({
    purchase: 0,
    sale: 0,
    stock: 0,
    suppliers: 0,
    customers: 0,
    lowStock: 0,
    expired: 0,
  });

  const [loading, setLoading] = useState(true);

  /* ================= FETCH DASHBOARD DATA ================= */

  const fetchDashboard = async () => {
    try {

      const res = await axios.get(
        `${backendUrl}/api/dashboard`,
        { withCredentials: true }
      );

      setStats(res.data.data);

    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  /* ================= UI ================= */

  return (
    <section className="w-full mb-8 rounded-xl bg-gradient-to-r from-gray-900 to-gray-800 shadow-lg p-6 md:p-10 flex flex-col gap-8">

      <h2 className="text-2xl font-bold text-white mb-2 text-center">
        Admin Dashboard
      </h2>

      {loading ? (
        <p className="text-white text-center">Loading...</p>
      ) : (

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

          {/* Purchase */}

          <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white rounded-lg p-6 shadow flex flex-col items-center">
            <span className="text-lg font-semibold">Total Purchase</span>
            <span className="text-2xl font-bold mt-2">{stats.purchase}</span>
          </div>

          {/* Sale */}

          <div className="bg-gradient-to-r from-green-700 to-green-500 text-white rounded-lg p-6 shadow flex flex-col items-center">
            <span className="text-lg font-semibold">Total Sale</span>
            <span className="text-2xl font-bold mt-2">{stats.sale}</span>
          </div>

          {/* Stock */}

          <div className="bg-gradient-to-r from-purple-700 to-purple-500 text-white rounded-lg p-6 shadow flex flex-col items-center">
            <span className="text-lg font-semibold">Total Stock</span>
            <span className="text-2xl font-bold mt-2">{stats.stock}</span>
          </div>

          {/* Suppliers */}

          <div className="bg-gradient-to-r from-yellow-700 to-yellow-500 text-white rounded-lg p-6 shadow flex flex-col items-center">
            <span className="text-lg font-semibold">Suppliers</span>
            <span className="text-2xl font-bold mt-2">{stats.suppliers}</span>
          </div>

          {/* Customers */}

          <div className="bg-gradient-to-r from-pink-700 to-pink-500 text-white rounded-lg p-6 shadow flex flex-col items-center">
            <span className="text-lg font-semibold">Customers</span>
            <span className="text-2xl font-bold mt-2">{stats.customers}</span>
          </div>

          {/* Low Stock */}

          <div className="bg-gradient-to-r from-red-700 to-red-500 text-white rounded-lg p-6 shadow flex flex-col items-center">
            <span className="text-lg font-semibold">Low Stock</span>
            <span className="text-2xl font-bold mt-2">{stats.lowStock}</span>
          </div>

          {/* Expired */}

          <div className="bg-gradient-to-r from-gray-700 to-gray-500 text-white rounded-lg p-6 shadow flex flex-col items-center">
            <span className="text-lg font-semibold">Expired Items</span>
            <span className="text-2xl font-bold mt-2">{stats.expired}</span>
          </div>

        </div>

      )}

    </section>
  );
};

export default AdminDash;