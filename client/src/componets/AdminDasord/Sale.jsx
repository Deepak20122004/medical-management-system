import React, { useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";

function getCurrentDate() {
  const now = new Date();
  return now.toISOString().split("T")[0];
}

const Sale = () => {
  const { backendUrl } = useContext(AppContext);

  const [step, setStep] = useState(1);

  const [patients, setPatients] = useState([]);
  const [medicinesStock, setMedicinesStock] = useState([]);

  const [info, setInfo] = useState({
    date: getCurrentDate(),
    patient: "",
    doctor: "",
    mobile: "",
  });

  const [medicineForm, setMedicineForm] = useState({
    medicine: "",
    batch: "",
    quantity: "",
    amount: "",
    exp: "",
  });

  const [medicines, setMedicines] = useState([]);
  const [discount, setDiscount] = useState(0);

  /* ================= SEARCH PATIENT ================= */

  const searchPatient = async (name) => {
    try {
      const res = await axios.get(
        `${backendUrl}/api/sale/search-patient?name=${name}`,
        { withCredentials: true },
      );

      setPatients(res.data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  /* ================= SEARCH MEDICINE ================= */
  const searchMedicine = async (name) => {
    try {
      const res = await axios.get(
        `${backendUrl}/api/stock/search?name=${name}`,
        { withCredentials: true },
      );

      const stocks = res.data.data || [];

      const medicines = stocks.flatMap((stock) =>
        stock.medicines.map((m) => ({
          _id: stock._id + m._id,
          product: m.product,
          batchNo: m.batchNo,
          batchExpiry: m.batchExpiry,
          mrp: m.mrp,
          quantity: m.quantity,
        })),
      );

      setMedicinesStock(medicines);
    } catch (err) {
      console.log(err);
    }
  };

  /* ================= SELECT MEDICINE ================= */

  const selectMedicine = (m) => {
    setMedicineForm({
      medicine: m.product,
      batch: m.batchNo,
      quantity: 1,
      amount: m.mrp,
      exp: m.batchExpiry,
    });

    setMedicinesStock([]);
  };

  /* ================= INPUT HANDLERS ================= */

  const handleInfoChange = (e) => {
    setInfo({ ...info, [e.target.name]: e.target.value });
  };

  const handleMedicineChange = (e) => {
    setMedicineForm({ ...medicineForm, [e.target.name]: e.target.value });
  };

  /* ================= STEP 1 ================= */

  const handleStep1 = (e) => {
    e.preventDefault();

    if (!info.patient) {
      toast.error("Enter patient name");
      return;
    }

    if (!info.doctor) {
      toast.error("Enter doctor");
      return;
    }

    setStep(2);
  };

  /* ================= ADD MEDICINE ================= */

  const addMedicine = (e) => {
    e.preventDefault();

    if (!medicineForm.medicine) {
      toast.error("Enter medicine");
      return;
    }

    if (!medicineForm.quantity) {
      toast.error("Enter quantity");
      return;
    }

    setMedicines([...medicines, medicineForm]);

    setMedicineForm({
      medicine: "",
      batch: "",
      quantity: "",
      amount: "",
      exp: "",
    });
  };

  const deleteMedicine = (index) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  /* ================= CALCULATIONS ================= */

  const totalAmount = medicines.reduce(
    (sum, m) => sum + Number(m.amount) * Number(m.quantity),
    0,
  );

  const discountAmount = Math.round(totalAmount * (discount / 100));

  const grandTotal = totalAmount - discountAmount;

  /* ================= SAVE SALE ================= */

  const saveSale = async () => {
    try {
      await axios.post(
        `${backendUrl}/api/sale/add`,
        {
          patient: info.patient,
          doctor: info.doctor,
          mobile: info.mobile,
          date: info.date,
          medicines,
          discount,
        },
        { withCredentials: true },
      );

      toast.success("Sale saved");
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  };

  /* ================= PRINT ================= */

  const saveAndPrint = async () => {
    const bill = document.getElementById("print-bill");

    if (!bill) {
      toast.error("Bill not found");
      return;
    }

    await saveSale();

    // clone bill
    const billClone = bill.cloneNode(true);

    // remove discount input
    const inputs = billClone.querySelectorAll("input");
    inputs.forEach((i) => i.remove());

    const win = window.open("", "", "width=900,height=700");

    win.document.write(`
  <html>
  <head>
  <title>Bill</title>

  <style>

  body{
  font-family:Arial;
  padding:20px;
  }

  table{
  width:100%;
  border-collapse:collapse;
  }

  th,td{
  border:1px solid black;
  padding:6px;
  }

  h2{
  text-align:center;
  }

  </style>

  </head>

  <body>

  ${billClone.innerHTML}

  </body>

  </html>
  `);

    win.document.close();

    win.print();

    setTimeout(() => {
      setStep(1);
      setMedicines([]);
      setDiscount(0);
    }, 500);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-xl p-8 mt-8">
      <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
        Pharmacy Sale
      </h2>

      {/* STEP 1 */}

      {step === 1 && (
        <form onSubmit={handleStep1} className="space-y-4">
          <input
            type="date"
            name="date"
            value={info.date}
            onChange={handleInfoChange}
            className="border p-2 w-full rounded"
          />

          <input
            type="text"
            name="patient"
            value={info.patient}
            placeholder="Search Patient"
            onChange={(e) => {
              handleInfoChange(e);
              searchPatient(e.target.value);
            }}
            className="border p-2 w-full"
          />

          {patients.length > 0 && (
            <select
              className="border p-2 w-full"
              onChange={(e) => {
                const p = patients.find((x) => x.name === e.target.value);

                setInfo({
                  ...info,
                  patient: p.name,
                  mobile: p.mobile,
                });
              }}
            >
              <option>Select Patient</option>

              {patients.map((p) => (
                <option key={p._id}>{p.name}</option>
              ))}
            </select>
          )}

          <input
            type="text"
            name="doctor"
            value={info.doctor}
            onChange={handleInfoChange}
            placeholder="Doctor"
            className="border p-2 w-full"
          />

          <input
            type="text"
            name="mobile"
            value={info.mobile}
            onChange={handleInfoChange}
            placeholder="Mobile"
            className="border p-2 w-full"
          />

          <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">
            Next
          </button>
        </form>
      )}

      {/* STEP 2 */}

      {step === 2 && (
        <div>
          <form onSubmit={addMedicine} className="space-y-3">
            <input
              type="text"
              name="medicine"
              value={medicineForm.medicine}
              placeholder="Search Medicine"
              onChange={(e) => {
                handleMedicineChange(e);
                searchMedicine(e.target.value);
              }}
              className="border p-2 w-full"
            />
            {medicinesStock.length > 0 && (
              <select
                className="border p-2 w-full"
                onChange={(e) => {
                  const m = medicinesStock.find(
                    (x) => x._id === e.target.value,
                  );

                  if (m) selectMedicine(m);
                }}
              >
                <option>Select Medicine</option>

                {medicinesStock.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.product} | Batch: {m.batchNo} | Exp: {m.batchExpiry} |
                    MRP ₹{m.mrp}
                  </option>
                ))}
              </select>
            )}

            <input
              type="text"
              name="batch"
              value={medicineForm.batch}
              onChange={handleMedicineChange}
              placeholder="Batch"
              className="border p-2 w-full"
            />

            <input
              type="number"
              name="quantity"
              value={medicineForm.quantity}
              onChange={handleMedicineChange}
              placeholder="Quantity"
              className="border p-2 w-full"
            />

            <input
              type="number"
              name="amount"
              value={medicineForm.amount}
              onChange={handleMedicineChange}
              placeholder="MRP"
              className="border p-2 w-full"
            />

            <input
              type="date"
              name="exp"
              value={medicineForm.exp}
              onChange={handleMedicineChange}
              className="border p-2 w-full"
            />

            <button className="bg-green-600 text-white px-4 py-2 rounded w-full">
              Add Medicine
            </button>
          </form>

          {medicines.length > 0 && (
            <div className="mt-6">
              <table className="w-full border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2">Medicine</th>
                    <th className="p-2">Batch</th>
                    <th className="p-2">Qty</th>
                    <th className="p-2">Price</th>
                    <th className="p-2">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {medicines.map((m, i) => (
                    <tr key={i}>
                      <td className="p-2">{m.medicine}</td>
                      <td className="p-2">{m.batch}</td>
                      <td className="p-2">{m.quantity}</td>
                      <td className="p-2">
                        ₹{Number(m.amount) * Number(m.quantity)}
                      </td>

                      <td className="p-2">
                        <button
                          onClick={() => deleteMedicine(i)}
                          className="bg-red-500 text-white px-2 py-1 rounded"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <button
                onClick={() => setStep(3)}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded w-full"
              >
                Preview Bill
              </button>
            </div>
          )}
        </div>
      )}

      {/* STEP 3 */}

      {step === 3 && (
        <div className="mt-6">
          <div id="print-bill">
            <h2 className="text-center text-xl font-bold">MEDICAL STORE</h2>

            <p>Patient: {info.patient}</p>
            <p>Doctor: {info.doctor}</p>
            <p>Date: {info.date}</p>

            <table className="w-full border mt-3">
              <thead>
                <tr>
                  <th>Medicine</th>
                  <th>Batch</th>
                  <th>Qty</th>
                  <th>Price</th>
                </tr>
              </thead>

              <tbody>
                {medicines.map((m, i) => (
                  <tr key={i}>
                    <td>{m.medicine}</td>
                    <td>{m.batch}</td>
                    <td>{m.quantity}</td>
                    <td>₹{Number(m.amount) * Number(m.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="text-right mt-4">
              {/* input only for screen */}
              <div className="no-print">
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="border p-1"
                  placeholder="Discount %"
                />
              </div>

              <p>Total : ₹{totalAmount}</p>
              <p>Discount : ₹{discountAmount}</p>

              <p className="font-bold">Grand Total : ₹{grandTotal}</p>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={saveSale}
              className="bg-blue-600 text-white px-4 py-2 rounded w-full"
            >
              Save
            </button>

            <button
              onClick={saveAndPrint}
              className="bg-green-600 text-white px-4 py-2 rounded w-full"
            >
              Save & Print
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sale;
