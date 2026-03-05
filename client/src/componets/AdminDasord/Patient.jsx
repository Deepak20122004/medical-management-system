import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const patientsPerPage = 6;

  const token = localStorage.getItem("token");

  const fetchPatients = async () => {
    try {
      setLoading(true);

      const res = await axios.get("http://localhost:4000/api/sale", {
        headers: { token },
      });

      const data = res.data.sales || res.data.data || [];

      setPatients(data);

      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const deleteBill = async (id) => {
    if (!window.confirm("Delete this bill?")) return;

    try {
      await axios.delete(`http://localhost:4000/api/sale/${id}`, {
        headers: { token },
      });

      toast.success("Bill deleted successfully");

      fetchPatients();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const viewBill = (bill) => {
    setSelectedBill(bill);
  };

  const indexOfLast = currentPage * patientsPerPage;
  const indexOfFirst = indexOfLast - patientsPerPage;

  const currentPatients = patients.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(patients.length / patientsPerPage);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Patients & Bills
      </h1>

      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="py-3 px-4 text-left">Patient Name</th>
                <th className="py-3 px-4 text-left">Phone</th>
                <th className="py-3 px-4 text-left">Doctor</th>
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-6">
                    Loading...
                  </td>
                </tr>
              ) : currentPatients.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-6">
                    No Patients Found
                  </td>
                </tr>
              ) : (
                currentPatients.map((p) => (
                  <tr
                    key={p._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="py-3 px-4 font-medium">{p.patient}</td>

                    <td className="py-3 px-4">{p.mobile}</td>

                    <td className="py-3 px-4">{p.doctor}</td>

                    <td className="py-3 px-4">{p.date}</td>

                    <td className="py-3 px-4 flex justify-center gap-3">
                      <button
                        onClick={() => viewBill(p)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
                      >
                        View
                      </button>

                      <button
                        onClick={() => deleteBill(p._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}

      <div className="flex justify-center mt-6 flex-wrap gap-2">
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-4 py-2 rounded-md text-sm font-medium 
${
  currentPage === index + 1
    ? "bg-indigo-600 text-white"
    : "bg-white border hover:bg-gray-100"
}`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* BILL MODAL */}

      {selectedBill && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white w-[90%] md:w-[600px] rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Patient Bill</h2>

            <div className="mb-4">
              <p>
                <b>Patient :</b> {selectedBill.patient}
              </p>
              <p>
                <b>Mobile :</b> {selectedBill.mobile}
              </p>
              <p>
                <b>Doctor :</b> {selectedBill.doctor}
              </p>
              <p>
                <b>Date :</b> {selectedBill.date}
              </p>
            </div>

            <table className="w-full border">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-2">Medicine</th>
                  <th className="p-2">Qty</th>
                  <th className="p-2">Amount</th>
                </tr>
              </thead>

              <tbody>
                {selectedBill.medicines.map((m, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-2">{m.medicine}</td>
                    <td className="p-2">{m.quantity}</td>
                    <td className="p-2">₹{m.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-4">
              <p>
                <b>Discount :</b> ₹{selectedBill.discount}
              </p>
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setSelectedBill(null)}
                className="bg-gray-600 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Patients;
