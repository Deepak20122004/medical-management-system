import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";

const Distributor = () => {
  const { backendUrl } = useContext(AppContext);

  const [data, setData] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    gstin: "",
    district: "",
    name: "",
    mobile: "",
    licence: "",
  });

  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyInvoices, setHistoryInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  /* ================= FETCH DISTRIBUTORS ================= */

  const fetchData = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/distributor`, {
        withCredentials: true,
      });

      setData(res.data.data);
    } catch (error) {
      toast.error("Failed to load distributors");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ================= ADD / UPDATE ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await axios.put(`${backendUrl}/api/distributor/${editingId}`, form, {
          withCredentials: true,
        });

        toast.success("Distributor Updated");
      } else {
        await axios.post(`${backendUrl}/api/distributor/add`, form, {
          withCredentials: true,
        });

        toast.success("Distributor Added");
      }

      setForm({
        gstin: "",
        district: "",
        name: "",
        mobile: "",
        licence: "",
      });

      setEditingId(null);

      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  /* ================= EDIT ================= */

  const handleEdit = (item) => {
    setForm({
      gstin: item.gstin || "",
      district: item.district || "",
      name: item.name || "",
      mobile: item.mobile || "",
      licence: item.licence || "",
    });

    setEditingId(item._id);
  };

  /* ================= DELETE ================= */

  const confirmDelete = async () => {
    try {
      await axios.delete(`${backendUrl}/api/distributor/${deleteId}`, {
        withCredentials: true,
      });

      toast.success("Distributor Deleted");

      setDeleteId(null);

      fetchData();
    } catch (error) {
      toast.error("Delete Failed");
    }
  };

  /* ================= HISTORY ================= */

 const handleOpenHistory = async (distributorId) => {
  try {

    const res = await axios.get(
      `${backendUrl}/api/stock/distributor/${distributorId}`,
      { withCredentials: true }
    );

    setHistoryInvoices(res.data.invoices);

    setSelectedInvoice(null);

    setHistoryOpen(true);

  } catch (error) {

    console.log(error);

    toast.error("Failed to load invoice history");

  }
};;

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-200 p-8">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-8">
          Distributor Management
        </h2>

        {/* ================= FORM ================= */}

        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-2 gap-4 mb-8"
        >
          {Object.keys(form).map((key) => (
            <input
              key={key}
              type="text"
              placeholder={key.toUpperCase()}
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
              required
            />
          ))}

          <button className="col-span-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition">
            {editingId ? "Update Distributor" : "Add Distributor"}
          </button>
        </form>

        {/* ================= TABLE ================= */}

        <table className="w-full text-sm bg-white shadow rounded-lg overflow-hidden">
          <thead className="bg-blue-100 text-blue-700">
            <tr>
              <th className="p-3">GSTIN</th>
              <th className="p-3">District</th>
              <th className="p-3">Name</th>
              <th className="p-3">Mobile</th>
              <th className="p-3">Licence</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {data.map((d) => (
              <tr key={d._id} className="border-b hover:bg-blue-50">
                <td className="p-3">{d.gstin}</td>
                <td className="p-3">{d.district}</td>
                <td className="p-3 font-medium">{d.name}</td>
                <td className="p-3">{d.mobile}</td>
                <td className="p-3">{d.licence}</td>

                <td className="p-3 text-center space-x-2">
                  <button
                    onClick={() => handleEdit(d)}
                    className="bg-yellow-400 px-3 py-1 rounded text-white"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => setDeleteId(d._id)}
                    className="bg-red-500 px-3 py-1 rounded text-white"
                  >
                    Delete
                  </button>

                  <button
                    onClick={() => handleOpenHistory(d._id)}
                    className="bg-purple-600 px-3 py-1 rounded text-white"
                  >
                    History
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ================= HISTORY MODAL ================= */}

        {historyOpen && (
          <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl w-[600px] shadow-xl">
              <h3 className="text-xl font-bold mb-4">
                Distributor Invoice History
              </h3>

              <select
                className="w-full border p-2 mb-4"
                onChange={(e) => {
                  const inv = historyInvoices.find(
                    (i) => i._id === e.target.value,
                  );

                  setSelectedInvoice(inv);
                }}
              >
                <option>Select Invoice</option>

                {historyInvoices.map((inv) => (
                  <option key={inv._id} value={inv._id}>
                    {inv.invoiceNumber}
                  </option>
                ))}
              </select>

              {selectedInvoice && (
                <>
                  <p>
                    <strong>Date:</strong> {selectedInvoice.invoiceDate}
                  </p>

                  <table className="w-full mt-4 border text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-2">Product</th>
                        <th className="p-2">Qty</th>
                        <th className="p-2">MRP</th>
                      </tr>
                    </thead>

                    <tbody>
                      {selectedInvoice.medicines.map((m) => (
                        <tr key={m._id} className="border-b">
                          <td className="p-2">{m.product}</td>
                          <td className="p-2">{m.quantity}</td>
                          <td className="p-2">₹{m.mrp}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}

              <button
                onClick={() => setHistoryOpen(false)}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* ================= DELETE MODAL ================= */}

        {deleteId && (
          <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
            <div className="bg-white p-6 rounded-xl shadow-xl">
              <p className="mb-4 text-center">
                Are you sure you want to delete?
              </p>

              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setDeleteId(null)}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Cancel
                </button>

                <button
                  onClick={confirmDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Distributor;
