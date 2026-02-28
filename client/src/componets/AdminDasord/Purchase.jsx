import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const backendUrl = "http://localhost:4000";

const Distributor = () => {
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

        <table className="w-full text-sm">
          <thead className="bg-blue-100 text-blue-700">
            <tr>
              <th className="p-2">GSTIN</th>
              <th className="p-2">District</th>
              <th className="p-2">Name</th>
              <th className="p-2">Mobile</th>
              <th className="p-2">Licence</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d._id} className="border-b hover:bg-blue-50">
                <td className="p-2">{d.gstin}</td>
                <td className="p-2">{d.district}</td>
                <td className="p-2">{d.name}</td>
                <td className="p-2">{d.mobile}</td>
                <td className="p-2">{d.licence}</td>
                <td className="p-2 flex gap-2 justify-center">
                  <button
                    onClick={() => handleEdit(d)}
                    className="bg-yellow-400 px-3 py-1 rounded text-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteId(d._id)}
                    className="bg-red-500 px-3 py-1 rounded text-white hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                  <button className="bg-blue-500 px-3 py-1 rounded text-white">
                    History
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
