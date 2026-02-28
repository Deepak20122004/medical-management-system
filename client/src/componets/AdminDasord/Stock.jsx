import React, { useState } from 'react';

const gstOptions = ['0%', '3%', '5%', '12%', '18%', '28%'];

// Dummy data for demonstration
const stockData = [
  { 
    id: 1,
    invoiceNumber: 'INV-001',
    invoiceDate: '2025-09-05',
    items: [
      { 
        medicine: 'Paracetamol',
        hsn: '30049099',
        batchNo: 'BAT123',
        batchExpiry: '2026-03',
        gst: '12%',
        unitPerPack: '10 tablets',
        quantity: 120,
        free: 10,
        rate: 5,
        mrp: 7
      }
    ]
  }
];

const Stock = () => {
  const [search, setSearch] = useState('');
  const [data, setData] = useState(stockData);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [showItemForm, setShowItemForm] = useState(false);
  const [success, setSuccess] = useState(false);
  

  // Step 1: Invoice form state

  const [invoiceForm, setInvoiceForm] = useState({
    distributor: '',
    invoiceNumber: '',
    invoiceDate: ''
  });

  // Step 2: Medicine items state
  const [currentItems, setCurrentItems] = useState([]);
  const [itemForm, setItemForm] = useState({
    medicine: '',
    hsn: '',
    batchNo: '',
    batchExpiry: '',
    gst: '12%',
    unitPerPack: '',
    quantity: '',
    free: '0',
    rate: '',
    mrp: ''
  });
  // For editing a medicine
  const [editIndex, setEditIndex] = useState(null);


  // Filter by invoice number or any medicine in invoice
  const filtered = data.filter(invoice =>
    invoice.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
    invoice.items.some(item =>
      item.medicine.toLowerCase().includes(search.toLowerCase()) ||
      item.batchNo.toLowerCase().includes(search.toLowerCase())
    )
  );


  // Statistics
  const totalStock = data.reduce((sum, invoice) =>
    sum + invoice.items.reduce((itemSum, item) => itemSum + Number(item.quantity), 0), 0
  );
  const lowStock = data.reduce((sum, invoice) =>
    sum + invoice.items.filter(item => Number(item.quantity) < 50).length, 0
  );
  const expired = data.reduce((sum, invoice) =>
    sum + invoice.items.filter(item => {
      // batchExpiry is YYYY-MM
      const [year, month] = item.batchExpiry.split('-');
      const expiryDate = new Date(Number(year), Number(month), 0);
      return expiryDate < new Date();
    }).length, 0
  );


  // Step 1: Invoice form submit

  const handleInvoiceSubmit = (e) => {
    e.preventDefault();
    if (invoiceForm.distributor && invoiceForm.invoiceNumber && invoiceForm.invoiceDate) {
      setShowInvoiceForm(false);
      setShowItemForm(true);
    }
  };

  // Step 2: Add medicine item
  const handleAddItem = (e) => {
    e.preventDefault();
    if (editIndex !== null) {
      // Update existing
      const updated = [...currentItems];
      updated[editIndex] = itemForm;
      setCurrentItems(updated);
      setEditIndex(null);
    } else {
      setCurrentItems([...currentItems, itemForm]);
    }
    setItemForm({
      medicine: '', hsn: '', batchNo: '', batchExpiry: '', gst: '12%', unitPerPack: '', quantity: '', free: '0', rate: '', mrp: ''
    });
  };
  // Edit medicine in modal
  const handleEditMedicine = (item, idx) => {
    setItemForm(item);
    setEditIndex(idx);
    setShowItemForm(true);
  };

  // Show delete confirmation
  const handleShowDeleteConfirm = (invoiceId, idx) => {
    setDeleteConfirm({ show: true, invoiceId, itemIndex: idx });
  };

  // Delete medicine after confirmation
  const handleConfirmDelete = () => {
    const { invoiceId, itemIndex } = deleteConfirm;
    setData(prev => prev.map(inv => {
      if (inv.id === invoiceId) {
        const items = inv.items.filter((_, i) => i !== itemIndex);
        return { ...inv, items };
      }
      return inv;
    }));
    // If modal is open, update viewInvoice state
    if (viewInvoice && viewInvoice.id === invoiceId) {
      setViewInvoice(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== itemIndex) }));
    }
    setDeleteConfirm({ show: false, invoiceId: null, itemIndex: null });
  };

  // Step 2: Final submit (save invoice + items)

  const handleSaveStock = () => {
    if (currentItems.length > 0) {
      setData([
        ...data,
        {
          id: data.length + 1,
          distributor: invoiceForm.distributor,
          invoiceNumber: invoiceForm.invoiceNumber,
          invoiceDate: invoiceForm.invoiceDate,
          items: currentItems
        }
      ]);
      setShowItemForm(false);
      setCurrentItems([]);
      setInvoiceForm({ distributor: '', invoiceNumber: '', invoiceDate: '' });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    }
  };

  // Input handlers
  const handleInvoiceChange = e => setInvoiceForm({ ...invoiceForm, [e.target.name]: e.target.value });

  // View Details modal state
  const [viewInvoice, setViewInvoice] = useState(null);
  // For delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, invoiceId: null, itemIndex: null });
  const handleItemChange = e => setItemForm({ ...itemForm, [e.target.name]: e.target.value });

  return (
    <div className="max-w-6xl mx-auto bg-white/90 rounded-xl shadow-lg p-6 md:p-10 mt-8">
      <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">Stock Management</h2>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-lg p-6 shadow flex flex-col items-center">
          <span className="text-lg font-semibold">Total Stock</span>
          <span className="text-2xl font-bold mt-2">{totalStock}</span>
        </div>
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-white rounded-lg p-6 shadow flex flex-col items-center">
          <span className="text-lg font-semibold">Low Stock Items</span>
          <span className="text-2xl font-bold mt-2">{lowStock}</span>
        </div>
        <div className="bg-gradient-to-r from-red-500 to-red-400 text-white rounded-lg p-6 shadow flex flex-col items-center">
          <span className="text-lg font-semibold">Expired Items</span>
          <span className="text-2xl font-bold mt-2">{expired}</span>
        </div>
      </div>

      {/* Search and Add Button */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by medicine or supplier..."
          className="w-full sm:w-72 px-4 py-2 rounded-md border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold shadow hover:bg-blue-700 transition"
          onClick={() => setShowInvoiceForm(true)}
        >
          + Add Stock
        </button>
      </div>


      {/* Step 1: Invoice Form Modal */}
      {showInvoiceForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-2">
          <form
            onSubmit={handleInvoiceSubmit}
            className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md flex flex-col gap-4 relative animate-fadeIn border border-blue-100"
          >
            <button
              type="button"
              className="absolute top-2 right-2 text-gray-400 hover:text-blue-600 text-2xl"
              onClick={() => setShowInvoiceForm(false)}
            >
              &times;
            </button>
            <h3 className="text-2xl font-extrabold text-blue-700 mb-2 text-center tracking-wide">Invoice Details</h3>
            <div className="flex flex-col gap-2">
              <label htmlFor="distributor" className="font-semibold text-blue-700">Distributor Name</label>
              <input
                id="distributor"
                type="text"
                name="distributor"
                value={invoiceForm.distributor}
                onChange={handleInvoiceChange}
                className="px-4 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
                placeholder="Enter distributor name"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="invoiceNumber" className="font-semibold text-blue-700">Invoice Number</label>
              <input
                id="invoiceNumber"
                type="text"
                name="invoiceNumber"
                value={invoiceForm.invoiceNumber}
                onChange={handleInvoiceChange}
                className="px-4 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
                placeholder="Enter invoice number"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="invoiceDate" className="font-semibold text-blue-700">Invoice Date</label>
              <input
                id="invoiceDate"
                type="date"
                name="invoiceDate"
                value={invoiceForm.invoiceDate}
                onChange={handleInvoiceChange}
                className="px-4 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-6 py-2 rounded-lg font-bold shadow hover:from-blue-700 hover:to-blue-500 transition text-lg mt-2"
            >
              Next: Add Medicines
            </button>
          </form>
        </div>
      )}

      {/* Step 2: Add Medicines Modal */}
      {showItemForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 overflow-y-auto p-2">
          <div className="bg-white rounded-2xl shadow-2xl p-4 w-full max-w-lg flex flex-col gap-4 relative animate-fadeIn border border-blue-100">
            <button
              type="button"
              className="absolute top-2 right-2 text-gray-400 hover:text-blue-600 text-2xl"
              onClick={() => { setShowItemForm(false); setCurrentItems([]); setInvoiceForm({ distributor: '', invoiceNumber: '', invoiceDate: '' }); }}
            >
              &times;
            </button>
            <h3 className="text-2xl font-extrabold text-blue-700 mb-2 text-center tracking-wide">Add Medicines to Invoice</h3>
            <form onSubmit={handleAddItem} className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label htmlFor="medicine" className="font-semibold text-blue-700">Product Name</label>
                <input id="medicine" type="text" name="medicine" value={itemForm.medicine} onChange={handleItemChange} className="px-3 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base" placeholder="Enter product name" required />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="hsn" className="font-semibold text-blue-700">HSN</label>
                <input id="hsn" type="text" name="hsn" value={itemForm.hsn} onChange={handleItemChange} className="px-3 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base" placeholder="Enter HSN" required />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="batchNo" className="font-semibold text-blue-700">Batch No</label>
                <input id="batchNo" type="text" name="batchNo" value={itemForm.batchNo} onChange={handleItemChange} className="px-3 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base" placeholder="Enter batch no" required />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="batchExpiry" className="font-semibold text-blue-700">Batch Expiry</label>
                <input id="batchExpiry" type="month" name="batchExpiry" value={itemForm.batchExpiry} onChange={handleItemChange} className="px-3 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base" required />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="gst" className="font-semibold text-blue-700">GST</label>
                <select id="gst" name="gst" value={itemForm.gst} onChange={handleItemChange} className="px-3 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base" required>
                  {gstOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="unitPerPack" className="font-semibold text-blue-700">Unit/Pack</label>
                <input id="unitPerPack" type="text" name="unitPerPack" value={itemForm.unitPerPack} onChange={handleItemChange} className="px-3 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base" placeholder="e.g. 10 tablets" required />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="quantity" className="font-semibold text-blue-700">Purchase Qty</label>
                <input id="quantity" type="number" name="quantity" value={itemForm.quantity} onChange={handleItemChange} className="px-3 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base" placeholder="Enter quantity" min="1" required />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="free" className="font-semibold text-blue-700">FREE</label>
                <input id="free" type="number" name="free" value={itemForm.free} onChange={handleItemChange} className="px-3 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base" placeholder="Enter free qty" min="0" required />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="rate" className="font-semibold text-blue-700">Rate</label>
                <input id="rate" type="number" name="rate" value={itemForm.rate} onChange={handleItemChange} className="px-3 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base" placeholder="Enter rate" min="0" step="0.01" required />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="mrp" className="font-semibold text-blue-700">MRP</label>
                <input id="mrp" type="number" name="mrp" value={itemForm.mrp} onChange={handleItemChange} className="px-3 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base" placeholder="Enter MRP" min="0" step="0.01" required />
              </div>
              <button type="submit" className="col-span-full bg-gradient-to-r from-blue-600 to-blue-400 text-white px-6 py-2 rounded-lg font-bold shadow hover:from-blue-700 hover:to-blue-500 transition text-lg mt-2">Add Medicine</button>
            </form>
            {/* List of added medicines */}
            {currentItems.length > 0 && (
              <div className="mt-2">
                <h4 className="font-semibold text-blue-700 mb-2">Added Medicines:</h4>
                <ul className="max-h-32 overflow-y-auto divide-y">
                  {currentItems.map((item, idx) => (
                    <li key={idx} className="py-1 flex flex-wrap gap-2 text-xs md:text-sm">
                      <span className="font-bold">{item.medicine}</span>
                      <span>Batch: {item.batchNo}</span>
                      <span>Qty: {item.quantity}</span>
                      <span>MRP: ₹{item.mrp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <button
              className="mt-4 bg-gradient-to-r from-green-600 to-green-400 text-white px-6 py-2 rounded-lg font-bold shadow hover:from-green-700 hover:to-green-500 transition text-lg"
              onClick={handleSaveStock}
              disabled={currentItems.length === 0}
            >
              Save Invoice & Medicines
            </button>
          </div>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="text-green-600 text-center font-semibold mb-4">Stock added successfully!</div>
      )}


      {/* Stock Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow text-sm">
          <thead>
            <tr className="bg-blue-100 text-blue-700">
              <th className="py-2 px-3 text-left">Invoice No</th>
              <th className="py-2 px-3 text-left">Date</th>
              <th className="py-2 px-3 text-left">Distributor</th>
              <th className="py-2 px-3 text-right">Total Items</th>
              <th className="py-2 px-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-400">No stock found.</td>
              </tr>
            ) : (
              filtered.map(invoice => (
                <tr key={invoice.id} className="border-b last:border-none hover:bg-blue-50 transition">
                  <td className="py-2 px-3">{invoice.invoiceNumber}</td>
                  <td className="py-2 px-3">{invoice.invoiceDate}</td>
                  <td className="py-2 px-3">{invoice.distributor || '-'}</td>
                  <td className="py-2 px-3 text-right">{invoice.items.length}</td>
                  <td className="py-2 px-3 text-center">
                    <button
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md text-sm hover:bg-blue-200 transition"
                      onClick={() => setViewInvoice(invoice)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* View Details Modal */}
      {viewInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-2">
          <div className="bg-white rounded-2xl shadow-2xl p-4 w-full max-w-2xl flex flex-col gap-4 relative animate-fadeIn border border-blue-100">
            <button
              type="button"
              className="absolute top-2 right-2 text-gray-400 hover:text-blue-600 text-2xl"
              onClick={() => setViewInvoice(null)}
            >
              &times;
            </button>
            <h3 className="text-2xl font-extrabold text-blue-700 mb-2 text-center tracking-wide">Invoice Details</h3>
            <div className="mb-2 text-sm text-gray-700 grid grid-cols-1 md:grid-cols-3 gap-2">
              <div><span className="font-semibold">Distributor:</span> {viewInvoice.distributor || '-'}</div>
              <div><span className="font-semibold">Invoice No:</span> {viewInvoice.invoiceNumber}</div>
              <div><span className="font-semibold">Date:</span> {viewInvoice.invoiceDate}</div>
            </div>
            <div>
              <h4 className="font-semibold text-blue-700 mb-2">Medicines:</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg shadow text-xs">
                  <thead>
                    <tr className="bg-blue-50 text-blue-700">
                      <th className="py-1 px-2">Product</th>
                      <th className="py-1 px-2">HSN</th>
                      <th className="py-1 px-2">Batch</th>
                      <th className="py-1 px-2">Expiry</th>
                      <th className="py-1 px-2">GST</th>
                      <th className="py-1 px-2">Unit/Pack</th>
                      <th className="py-1 px-2">Qty</th>
                      <th className="py-1 px-2">Free</th>
                      <th className="py-1 px-2">Rate</th>
                      <th className="py-1 px-2">MRP</th>
                      <th className="py-1 px-2 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewInvoice.items.map((item, idx) => (
                      <tr key={idx} className="border-b last:border-none">
                        <td className="py-1 px-2">{item.medicine}</td>
                        <td className="py-1 px-2">{item.hsn}</td>
                        <td className="py-1 px-2">{item.batchNo}</td>
                        <td className="py-1 px-2">{item.batchExpiry}</td>
                        <td className="py-1 px-2">{item.gst}</td>
                        <td className="py-1 px-2">{item.unitPerPack}</td>
                        <td className="py-1 px-2">{item.quantity}</td>
                        <td className="py-1 px-2">{item.free}</td>
                        <td className="py-1 px-2">₹{item.rate}</td>
                        <td className="py-1 px-2">₹{item.mrp}</td>
                        <td className="py-1 px-2 text-center flex gap-1 justify-center">
                          <button
                            className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-semibold hover:bg-yellow-200"
                            onClick={() => handleEditMedicine(item, idx)}
                          >Edit</button>
                          <button
                            className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-semibold hover:bg-red-200"
                            onClick={() => handleShowDeleteConfirm(viewInvoice.id, idx)}
                          >Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-2">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md flex flex-col gap-4 relative animate-fadeIn border border-red-100">
            <h3 className="text-xl font-bold text-red-600 mb-2 text-center">Confirm Delete</h3>
            <p className="text-gray-600 text-center">
              Are you sure you want to delete this medicine from the invoice?
              <br />
              <span className="text-sm text-red-500">This action cannot be undone.</span>
            </p>
            <div className="flex justify-center gap-3 mt-2">
              <button
                className="px-6 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition"
                onClick={() => setDeleteConfirm({ show: false, invoiceId: null, itemIndex: null })}
              >
                Cancel
              </button>
              <button
                className="px-6 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition"
                onClick={handleConfirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stock;