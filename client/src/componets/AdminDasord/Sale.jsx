
import React, { useState } from 'react';

function getCurrentDate() {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

const Sale = () => {
  // Step control
  const [step, setStep] = useState(1);
  // Patient/Doctor info
  const [info, setInfo] = useState({
    date: getCurrentDate(),
    patient: '',
    doctor: '',
    mobile: ''
  });
  // Medicines
  const [medicines, setMedicines] = useState([]);
  const [medicineForm, setMedicineForm] = useState({
    medicine: '',
    batch: '',
    quantity: '',
    amount: '',
    exp: ''
  });
  // Discount
  const [discount, setDiscount] = useState(0);
  // Print preview
  const [showPrint, setShowPrint] = useState(false);

  // Handlers
  const handleInfoChange = e => setInfo({ ...info, [e.target.name]: e.target.value });
  const handleInfoSubmit = e => {
    e.preventDefault();
    setStep(2);
  };
  const handleMedicineChange = e => setMedicineForm({ ...medicineForm, [e.target.name]: e.target.value });
  const handleMedicineAdd = e => {
    e.preventDefault();
    setMedicines([...medicines, medicineForm]);
    setMedicineForm({ medicine: '', batch: '', quantity: '', amount: '', exp: '' });
  };
  const handleBillPreview = () => setStep(3);
  const handleDiscountChange = e => {
    let val = Number(e.target.value);
    if (val < 0) val = 0;
    if (val > 90) val = 90;
    setDiscount(val);
  };
  const handlePrint = () => {
    window.print();
  };

  // Calculations
  const totalAmount = medicines.reduce((sum, m) => sum + Number(m.amount || 0), 0);
  const discountAmount = Math.round(totalAmount * (discount / 100));
  const grandTotal = totalAmount - discountAmount;

  return (
    <div className="max-w-2xl mx-auto bg-white/90 rounded-xl shadow-lg p-6 md:p-10 mt-8">
      <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">Sale Entry</h2>

      {/* Step 1: Patient/Doctor Info */}
      {step === 1 && (
        <form onSubmit={handleInfoSubmit} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-blue-700 font-semibold mb-1">Date</label>
              <input type="date" name="date" value={info.date} onChange={handleInfoChange} className="w-full px-4 py-2 rounded-md border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400" required />
            </div>
            <div>
              <label className="block text-blue-700 font-semibold mb-1">Patient Name</label>
              <input type="text" name="patient" value={info.patient} onChange={handleInfoChange} className="w-full px-4 py-2 rounded-md border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400" required />
            </div>
            <div>
              <label className="block text-blue-700 font-semibold mb-1">Doctor</label>
              <input type="text" name="doctor" value={info.doctor} onChange={handleInfoChange} className="w-full px-4 py-2 rounded-md border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400" required />
            </div>
            <div>
              <label className="block text-blue-700 font-semibold mb-1">Mobile Number <span className="text-xs text-gray-500">(optional)</span></label>
              <input type="text" name="mobile" value={info.mobile} onChange={handleInfoChange} className="w-full px-4 py-2 rounded-md border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
          </div>
          <button type="submit" className="mt-4 bg-gradient-to-r from-blue-600 to-blue-400 text-white font-bold py-2 rounded-md shadow hover:from-blue-700 hover:to-blue-500 transition-all">Next</button>
        </form>
      )}

      {/* Step 2: Add Medicines */}
      {step === 2 && (
        <div>
          <form onSubmit={handleMedicineAdd} className="flex flex-col gap-5 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-blue-700 font-semibold mb-1">Medicine</label>
                <input type="text" name="medicine" value={medicineForm.medicine} onChange={handleMedicineChange} className="w-full px-4 py-2 rounded-md border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400" required />
              </div>
              <div>
                <label className="block text-blue-700 font-semibold mb-1">Batch No</label>
                <input type="text" name="batch" value={medicineForm.batch} onChange={handleMedicineChange} className="w-full px-4 py-2 rounded-md border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400" required />
              </div>
              <div>
                <label className="block text-blue-700 font-semibold mb-1">Quantity</label>
                <input type="number" name="quantity" value={medicineForm.quantity} onChange={handleMedicineChange} className="w-full px-4 py-2 rounded-md border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400" required />
              </div>
              <div>
                <label className="block text-blue-700 font-semibold mb-1">Amount</label>
                <input type="number" name="amount" value={medicineForm.amount} onChange={handleMedicineChange} className="w-full px-4 py-2 rounded-md border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400" required />
              </div>
              <div>
                <label className="block text-blue-700 font-semibold mb-1">Exp Date</label>
                <input type="date" name="exp" value={medicineForm.exp} onChange={handleMedicineChange} className="w-full px-4 py-2 rounded-md border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400" required />
              </div>
            </div>
            <button type="submit" className="mt-2 bg-green-600 text-white font-bold py-2 rounded-md shadow hover:bg-green-700 transition-all">Add Medicine</button>
          </form>
          {/* Medicine List */}
          {medicines.length > 0 && (
            <div className="border rounded-lg overflow-x-auto mb-6">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Medicine</th>
                    <th className="px-4 py-2 text-left">Batch No</th>
                    <th className="px-4 py-2 text-right">Quantity</th>
                    <th className="px-4 py-2 text-right">Amount</th>
                    <th className="px-4 py-2 text-left">Exp Date</th>
                  </tr>
                </thead>
                <tbody>
                  {medicines.map((m, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="px-4 py-2">{m.medicine}</td>
                      <td className="px-4 py-2">{m.batch}</td>
                      <td className="px-4 py-2 text-right">{m.quantity}</td>
                      <td className="px-4 py-2 text-right">₹{m.amount}</td>
                      <td className="px-4 py-2">{m.exp}</td>
                    </tr>
                  ))}
                  <tr className="border-t bg-gray-50 font-bold">
                    <td colSpan="3" className="px-4 py-2 text-right">Total Amount:</td>
                    <td className="px-4 py-2 text-right">₹{totalAmount}</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
          <div className="flex justify-end gap-3">
            {medicines.length > 0 && (
              <button onClick={handleBillPreview} className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2 font-bold">Next</button>
            )}
          </div>
        </div>
      )}

      {/* Step 3: Bill Preview & Discount */}
      {step === 3 && (
        <div className="print:bg-white">
          <div className="border rounded-lg p-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="font-semibold">Patient Name: <span className="font-normal">{info.patient}</span></p>
                <p className="font-semibold">Doctor: <span className="font-normal">{info.doctor}</span></p>
                <p className="font-semibold">Mobile: <span className="font-normal">{info.mobile || '-'}</span></p>
                <p className="font-semibold">Date: <span className="font-normal">{info.date}</span></p>
              </div>
            </div>
            <table className="w-full mb-4">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">Medicine</th>
                  <th className="px-4 py-2 text-left">Batch No</th>
                  <th className="px-4 py-2 text-right">Quantity</th>
                  <th className="px-4 py-2 text-right">Amount</th>
                  <th className="px-4 py-2 text-left">Exp Date</th>
                </tr>
              </thead>
              <tbody>
                {medicines.map((m, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="px-4 py-2">{m.medicine}</td>
                    <td className="px-4 py-2">{m.batch}</td>
                    <td className="px-4 py-2 text-right">{m.quantity}</td>
                    <td className="px-4 py-2 text-right">₹{m.amount}</td>
                    <td className="px-4 py-2">{m.exp}</td>
                  </tr>
                ))}
                <tr className="border-t bg-gray-50 font-bold">
                  <td colSpan="3" className="px-4 py-2 text-right">Total Amount:</td>
                  <td className="px-4 py-2 text-right">₹{totalAmount}</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
            <div className="flex flex-col sm:flex-row gap-4 items-center mt-4">
              <label className="font-semibold text-blue-700">Discount (%):</label>
              <input type="number" min="0" max="90" value={discount} onChange={handleDiscountChange} className="w-24 px-4 py-2 rounded-md border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400" />
              <span className="font-semibold text-green-700">Discount: ₹{discountAmount}</span>
              <span className="font-bold text-purple-700">GRAND TOTAL: ₹{grandTotal}</span>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button 
              onClick={() => setStep(1)} 
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2 font-bold print:hidden"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Bill
            </button>
            <button 
              onClick={handlePrint} 
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2 font-bold"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print Bill
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sale;