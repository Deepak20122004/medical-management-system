import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { AppContext } from "../../context/AppContext";

// AdminDash: displays admin dashboard with key statistics
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
  const [refreshing, setRefreshing] = useState(false);

  /* ================= FETCH DASHBOARD DATA ================= */

  const fetchDashboard = async (initialLoad = false) => {
    if (initialLoad) setLoading(true);
    setRefreshing(true);
    try {
      const res = await axios.get(`${backendUrl}/api/dashboard`, {
        withCredentials: true,
      });

      setStats(res.data.data);
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchDashboard(true);
  }, []);

  /* ================= STAT CARDS ================= */

  const statCards = [
    {
      title: "Total Purchase",
      value: stats.purchase,
      description: "Purchase records",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            d="M3 7h18M5 7v12a1 1 0 001 1h12a1 1 0 001-1V7M8 7V5a4 4 0 018 0v2"
          />
        </svg>
      ),
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },

    {
      title: "Total Sale",
      value: stats.sale,
      description: "Sale records",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            d="M3 3v18h18"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            d="M7 16l4-5 3 3 5-7"
          />
        </svg>
      ),
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },

    {
      title: "Total Stock",
      value: stats.stock,
      description: "Medicines in stock",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            d="M4 7h16M4 12h16M4 17h16"
          />
        </svg>
      ),
      iconBg: "bg-teal-50",
      iconColor: "text-teal-600",
    },

    {
      title: "Suppliers",
      value: stats.suppliers,
      description: "Registered suppliers",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
          />
        </svg>
      ),
      iconBg: "bg-violet-50",
      iconColor: "text-violet-600",
    },

    {
      title: "Customers",
      value: stats.customers,
      description: "Registered customers",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            d="M17 20a5 5 0 00-10 0M12 12a4 4 0 100-8 4 4 0 000 8z"
          />
        </svg>
      ),
      iconBg: "bg-cyan-50",
      iconColor: "text-cyan-600",
    },

    {
      title: "Low Stock",
      value: stats.lowStock,
      description: "Need restocking",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            d="M12 9v4M12 17h.01"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            d="M10.3 3.6L2.8 17a2 2 0 001.7 3h15a2 2 0 001.7-3L13.7 3.6a2 2 0 00-3.4 0z"
          />
        </svg>
      ),
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
    },

    {
      title: "Expired Items",
      value: stats.expired,
      description: "Require attention",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            d="M12 8v4l3 2"
          />
          <circle cx="12" cy="12" r="9" strokeWidth="1.8" />
        </svg>
      ),
      iconBg: "bg-red-50",
      iconColor: "text-red-600",
    },
  ];

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <section className="w-full">
        <div className="flex items-center justify-center min-h-100">
          <div className="text-center">
            <div
              className="
                w-10 h-10
                border-4
                border-slate-200
                border-t-teal-600
                rounded-full
                animate-spin
                mx-auto
              "
            />

            <p className="mt-4 text-sm text-slate-500">Loading dashboard...</p>
          </div>
        </div>
      </section>
    );
  }

  /* ================= UI ================= */

  return (
    <section className="admin-dashboard w-full">
      {/* ================= HEADER ================= */}

      <div className="admin-dashboard__header flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800">
            Dashboard
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Overview of your pharmacy management system
          </p>
        </div>

        {/* Quick Refresh */}
        <button
          onClick={() => fetchDashboard()}
          disabled={refreshing}
          className="admin-dashboard__refresh
            self-start sm:self-auto
            flex items-center gap-2
            px-4 py-2.5
            rounded-xl
            border border-slate-200
            bg-white
            text-sm font-medium
            text-slate-600
            hover:text-teal-600
            hover:border-teal-200
            hover:bg-teal-50
            transition-all
          "
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 4v5h5M20 20v-5h-5M5.5 15A7 7 0 0019 12M18.5 9A7 7 0 005 12"
            />
          </svg>
          {refreshing ? "Refreshing" : "Refresh"}
        </button>
      </div>

      {/* ================= STATISTICS ================= */}

      <div className="admin-dashboard__stats grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div
            key={card.title}
            className="admin-dashboard__stat-card
              group
              bg-white
              border border-slate-200
              rounded-2xl
              p-5
              shadow-[0_2px_10px_rgba(15,23,42,0.03)]
              hover:shadow-[0_8px_25px_rgba(15,23,42,0.07)]
              hover:-translate-y-0.5
              transition-all duration-300
            "
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {card.title}
                </p>

                <p className="text-2xl font-bold text-slate-800 mt-2">
                  {card.value}
                </p>
              </div>

              <div
                className={`
                  w-11 h-11
                  rounded-xl
                  ${card.iconBg}
                  ${card.iconColor}
                  flex items-center justify-center
                `}
              >
                {card.icon}
              </div>
            </div>

            <p className="text-xs text-slate-400 mt-4">{card.description}</p>
          </div>
        ))}
      </div>

      {/* ================= ATTENTION SECTION ================= */}

      <div className="admin-dashboard__alerts grid grid-cols-1 lg:grid-cols-2 gap-5 mt-6">
        {/* Low Stock */}

        <div
          className="
            bg-white
            border border-slate-200
            rounded-2xl
            p-5
            shadow-[0_2px_10px_rgba(15,23,42,0.03)]
          "
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    d="M12 9v4M12 17h.01"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    d="M10.3 3.6L2.8 17a2 2 0 001.7 3h15a2 2 0 001.7-3L13.7 3.6a2 2 0 00-3.4 0z"
                  />
                </svg>
              </div>

              <div>
                <h3 className="font-semibold text-slate-800">
                  Low Stock Alert
                </h3>

                <p className="text-xs text-slate-400">
                  Medicines that need restocking
                </p>
              </div>
            </div>

            <span
              className={`
                px-3 py-1
                rounded-full
                text-xs font-semibold
                ${
                  stats.lowStock > 0
                    ? "bg-amber-50 text-amber-600"
                    : "bg-emerald-50 text-emerald-600"
                }
              `}
            >
              {stats.lowStock}
            </span>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100">
            {stats.lowStock > 0 ? (
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-slate-500">
                  You have{" "}
                  <span className="font-semibold text-slate-700">
                    {stats.lowStock}
                  </span>{" "}
                  medicine{stats.lowStock > 1 ? "s" : ""} with low stock.
                </p>

                <NavLink
                  to="stock"
                  className="
                    shrink-0
                    text-sm font-semibold
                    text-teal-600
                    hover:text-teal-700
                  "
                >
                  Check Stock →
                </NavLink>
              </div>
            ) : (
              <p className="text-sm text-emerald-600">
                ✓ Stock levels look good.
              </p>
            )}
          </div>
        </div>

        {/* Expired */}

        <div
          className="
            bg-white
            border border-slate-200
            rounded-2xl
            p-5
            shadow-[0_2px_10px_rgba(15,23,42,0.03)]
          "
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="9" strokeWidth="1.8" />

                  <path
                    strokeLinecap="round"
                    strokeWidth="1.8"
                    d="M12 8v4l2.5 1.5"
                  />
                </svg>
              </div>

              <div>
                <h3 className="font-semibold text-slate-800">Expiry Alert</h3>

                <p className="text-xs text-slate-400">
                  Expired medicines requiring attention
                </p>
              </div>
            </div>

            <span
              className={`
                px-3 py-1
                rounded-full
                text-xs font-semibold
                ${
                  stats.expired > 0
                    ? "bg-red-50 text-red-600"
                    : "bg-emerald-50 text-emerald-600"
                }
              `}
            >
              {stats.expired}
            </span>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100">
            {stats.expired > 0 ? (
              <p className="text-sm text-red-600">
                ⚠ {stats.expired} expired item
                {stats.expired > 1 ? "s" : ""} found. Please review your
                inventory.
              </p>
            ) : (
              <p className="text-sm text-emerald-600">
                ✓ No expired medicines found.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ================= QUICK ACTIONS ================= */}

      <div
        className="
          mt-6
          bg-white
          border border-slate-200
          rounded-2xl
          p-5
          shadow-[0_2px_10px_rgba(15,23,42,0.03)]
        "
      >
        <div className="mb-5">
          <h3 className="font-semibold text-slate-800">Quick Actions</h3>

          <p className="text-xs text-slate-400 mt-1">
            Quickly access commonly used pharmacy operations
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* Purchase */}

          <NavLink
            to="purchase"
            className="
              group
              p-4
              rounded-xl
              border border-slate-200
              hover:border-teal-200
              hover:bg-teal-50
              transition-all
            "
          >
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeWidth="1.8"
                  d="M12 5v14M5 12h14"
                />
              </svg>
            </div>

            <p className="text-sm font-semibold text-slate-700 group-hover:text-teal-700">
              Add Purchase
            </p>

            <p className="text-xs text-slate-400 mt-1">Add new stock</p>
          </NavLink>

          {/* Stock */}

          <NavLink
            to="stock"
            className="
              group
              p-4
              rounded-xl
              border border-slate-200
              hover:border-teal-200
              hover:bg-teal-50
              transition-all
            "
          >
            <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center mb-3">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeWidth="1.8"
                  d="M4 7h16M4 12h16M4 17h16"
                />
              </svg>
            </div>

            <p className="text-sm font-semibold text-slate-700 group-hover:text-teal-700">
              View Stock
            </p>

            <p className="text-xs text-slate-400 mt-1">Manage medicines</p>
          </NavLink>

          {/* Sale */}

          <NavLink
            to="patient"
            className="
              group
              p-4
              rounded-xl
              border border-slate-200
              hover:border-teal-200
              hover:bg-teal-50
              transition-all
            "
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeWidth="1.8"
                  d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8z"
                />
              </svg>
            </div>

            <p className="text-sm font-semibold text-slate-700 group-hover:text-teal-700">
              New Sale
            </p>

            <p className="text-xs text-slate-400 mt-1">Sell medicine</p>
          </NavLink>

          {/* Invoice */}

          <NavLink
            to="invoice"
            className="
              group
              p-4
              rounded-xl
              border border-slate-200
              hover:border-teal-200
              hover:bg-teal-50
              transition-all
            "
          >
            <div className="w-9 h-9 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center mb-3">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                  d="M6 2h9l5 5v15H6a2 2 0 01-2-2V4a2 2 0 012-2z"
                />

                <path
                  strokeLinecap="round"
                  strokeWidth="1.8"
                  d="M14 2v6h6M8 13h8M8 17h6"
                />
              </svg>
            </div>

            <p className="text-sm font-semibold text-slate-700 group-hover:text-teal-700">
              Invoices
            </p>

            <p className="text-xs text-slate-400 mt-1">View invoices</p>
          </NavLink>
        </div>
      </div>

      {/* ================= HELPFUL TIP ================= */}

      <div
        className="
          mt-6
          rounded-2xl
          bg-teal-50
          border border-teal-100
          p-5
          flex items-start gap-4
        "
      >
        <div
          className="
            w-10 h-10
            shrink-0
            rounded-xl
            bg-white
            text-teal-600
            flex items-center justify-center
            shadow-sm
          "
        >
          💡
        </div>

        <div>
          <h3 className="text-sm font-semibold text-teal-800">
            Pharmacy Management Tip
          </h3>

          <p className="text-xs sm:text-sm text-teal-700/70 mt-1 leading-relaxed">
            Regularly check low-stock and expired medicines to avoid stock-outs
            and prevent expired products from being sold.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AdminDash;
