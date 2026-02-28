import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";

const Distributor = () => {
  const { backendUrl } = useContext(AppContext);
  const [deleteId, setDeleteId] = useState(null);
  const [data, setData] = useState([]);
  const [form, setForm] = useState({
    gstin: "",
    district: "",
    name: "",
    mobile: "",
    licence: "",
  });
  const [editingId, setEditingId] = useState(null);

  const fetchData = async () => {
    const res = await axios.get(`${backendUrl}/api/distributor`);
    setData(res.data.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const confirmDelete = async () => {
    try {
      await axios.delete(`${backendUrl}/api/distributor/${deleteId}`);
      toast.success("Distributor Deleted Successfully");
      setDeleteId(null);
      fetchData();
    } catch (error) {
      toast.error("Delete Failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${backendUrl}/api/distributor/${editingId}`, form);
        toast.success("Updated Successfully");
      } else {
        await axios.post(`${backendUrl}/api/distributor/add`, form);
        toast.success("Added Successfully");
      }

      setForm({ gstin: "", district: "", name: "", mobile: "", licence: "" });
      setEditingId(null);
      fetchData();
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  const handleEdit = (item) => {
    setForm(item);
    setEditingId(item._id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${backendUrl}/api/distributor/${id}`);
    toast.success("Deleted Successfully");
    fetchData();
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-200 p-10">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">
          Distributor Management
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-8">
          {Object.keys(form).map((key) => (
            <input
              key={key}
              type="text"
              placeholder={key.toUpperCase()}
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              className="border p-2 rounded-lg focus:ring-2 focus:ring-blue-400"
              required
            />
          ))}

          <button className="col-span-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg font-semibold hover:opacity-90 transition">
            {editingId ? "Update Distributor" : "Add Distributor"}
          </button>
        </form>

        {/* Mobile-first cards (primary for small screens) */}
        <div className="space-y-3 md:hidden">
          {data.map((d) => (
            <div key={d._id} className="bg-white rounded-xl shadow p-4 border">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">{(d.name || "").charAt(0)}</div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-800 truncate">{d.name}</h3>
                    <div className="text-xs text-gray-500">{d.mobile}</div>
                  </div>
                  <div className="mt-1 text-xs text-gray-500 truncate">{d.district} • {d.gstin}</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button onClick={() => handleEdit(d)} className="px-3 py-1 rounded-lg bg-yellow-400 text-white text-xs shadow-sm">Edit</button>
                    <button onClick={() => setDeleteId(d._id)} className="px-3 py-1 rounded-lg bg-red-500 text-white text-xs shadow-sm">Delete</button>
                    <button className="px-3 py-1 rounded-lg bg-blue-500 text-white text-xs shadow-sm">History</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop table (visible on md+) */}
        <div className="hidden md:block">
          <table className="w-full text-sm bg-white rounded-lg overflow-hidden shadow-sm">
            <thead className="bg-blue-100 text-blue-700">
              <tr>
                <th className="p-3 text-left">GSTIN</th>
                <th className="p-3 text-left">District</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Mobile</th>
                <th className="p-3 text-left">Licence</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr key={d._id} className="border-b last:border-none hover:bg-blue-50 transition">
                  <td className="p-3">{d.gstin}</td>
                  <td className="p-3">{d.district}</td>
                  <td className="p-3 font-medium text-gray-700">{d.name}</td>
                  <td className="p-3">{d.mobile}</td>
                  <td className="p-3">{d.licence}</td>
                  <td className="p-3 text-center">
                    <div className="inline-flex items-center gap-2">
                      <button onClick={() => handleEdit(d)} className="bg-yellow-400 px-3 py-1 rounded text-white">Edit</button>
                      <button onClick={() => setDeleteId(d._id)} className="bg-red-500 px-3 py-1 rounded text-white hover:bg-red-600 transition">Delete</button>
                      <button className="bg-blue-500 px-3 py-1 rounded text-white">History</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fadeIn">
            <h3 className="text-xl font-bold text-red-600 text-center mb-4">
              ⚠ Confirm Delete
            </h3>

            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to delete this distributor?
              <br />
              <span className="text-sm text-red-500">
                This action cannot be undone.
              </span>
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setDeleteId(null)}
                className="px-5 py-2 bg-gray-200 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="px-5 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Distributor;
