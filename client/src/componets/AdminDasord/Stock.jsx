import axios from "axios";
import React, { useRef, useState } from "react";
import { useContext } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";

const gstOptions = ["0%", "3%", "5%", "12%", "18%", "28%"];

const normalizeImportHeader = (header) =>
  header.toLowerCase().replace(/[^a-z0-9]/g, "");

const parseImportCsv = (text) => {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map(normalizeImportHeader);
  return lines.slice(1).map((line) => {
    const values = line.split(",");
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index]?.trim() || "";
    });

    return {
      product: row.product || row.medicine || row.productname || "",
      hsn: row.hsn || "",
      batchNo: row.batchno || row.batch || "",
      batchExpiry: row.batchexpiry || row.expiry || "",
      gst: row.gst || "12%",
      unitPerPack: row.unitperpack || row.pack || "",
      quantity: row.quantity || row.qty || "",
      free: row.free || "0",
      rate: row.rate || "",
      mrp: row.mrp || "",
    };
  });
};
// Stock: main stock management component
// - Fetches and displays purchase invoices (stock) and their medicines
// - Supports adding new invoices, adding/editing medicines (temporary and saved), deleting items/invoices
// - Provides search, pagination and basic stats (total, low stock, expired)
const Stock = () => {
  const { backendUrl } = useContext(AppContext);
  // console.log(backendUrl);
  // const API = "http://localhost:4000/api/stock";
  // http://localhost:4000

  const [data, setData] = useState([]);
  const [stats, setStats] = useState({
    totalStock: 0,
    lowStock: 0,
    expired: 0,
  });

  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState("all");

  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [showMedicineForm, setShowMedicineForm] = useState(false);
  const [viewInvoice, setViewInvoice] = useState(null);

 

  const [invoiceForm, setInvoiceForm] = useState({
    distributor: "",
    invoiceNumber: "",
    invoiceDate: "",
  });

  const [currentItems, setCurrentItems] = useState([]);
  const [itemForm, setItemForm] = useState({
    product: "",
    hsn: "",
    batchNo: "",
    batchExpiry: "",
    gst: "12%",
    unitPerPack: "",
    quantity: "",
    free: "0",
    rate: "",
    mrp: "",
  });

  const [editIndex, setEditIndex] = useState(null);
  const [success, setSuccess] = useState(false);
  const [editingExisting, setEditingExisting] = useState({
    invoiceId: null,
    itemId: null,
  });
  const [deleteConfirm, setDeleteConfirm] = useState({
    show: false,
    invoiceId: null,
    itemId: null,
  });
  const bulkImportRef = useRef(null);

  /* ================= FETCH ================= */

  // fetchStock: retrieve all stock invoices from backend and normalize items
  // - maps `medicines` or `items` to `items` field and ensures a stable `id`
  const fetchStock = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${backendUrl}/api/stock`);
      const raw = res.data.data || [];
      const list = raw.map((inv, idx) => ({
        ...inv,
        items: inv.items || inv.medicines || [],
        id: inv.id || inv._id || idx,
      }));
      setData(list);
    } catch {
      toast.error("Failed to fetch stock");
    } finally {
      setLoading(false);
    }
  };

  // fetchStats: retrieve aggregated stock statistics (total, lowStock, expired)
  const fetchStats = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/stock`);
      setStats(res.data);
    } catch {
      toast.error("Failed to fetch stats");
    }
  };

  /*=========*/
  const [distributors, setDistributors] = useState([]);

  // fetchDistributors: load distributor list for the invoice form dropdown
  const fetchDistributors = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/distributor`);
      setDistributors(res.data.data);
    } catch {
      toast.error("Failed to load distributors");
    }
  };

  // Load initial data on mount: stock list, stats and distributor options
  useEffect(() => {
    fetchStock();
    fetchStats();
    fetchDistributors();
  }, []);

  console.log(stats);

 

  // handleInvoiceChange: update invoice form fields (distributor, number, date)
  const handleInvoiceChange = (e) => {
    const { name, value } = e.target;
    setInvoiceForm((p) => ({ ...p, [name]: value }));
  };

  // handleInvoiceSubmit: validate invoice info and open medicine entry form
  const handleInvoiceSubmit = (e) => {
    e.preventDefault();
    if (!invoiceForm.distributor || !invoiceForm.invoiceNumber) {
      toast.error("Fill invoice details");
      return;
    }
    setShowInvoiceForm(false);
    setShowMedicineForm(true);
  };

  const handleBulkImport = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    try {
      const text = await file.text();
      const importedItems = parseImportCsv(text);
      const validItems = importedItems.filter(
        (item) =>
          item.product &&
          item.hsn &&
          item.batchNo &&
          item.batchExpiry &&
          item.unitPerPack &&
          item.quantity !== "" &&
          item.rate !== "" &&
          item.mrp !== "",
      );

      if (!validItems.length) {
        toast.error("No valid medicine rows found in CSV");
        return;
      }

      setCurrentItems((previous) => [...previous, ...validItems]);
      toast.success(`${validItems.length} medicines imported`);
    } catch {
      toast.error("Unable to read CSV file");
    }
  };

  /* ================= ADD MEDICINE TEMP ================= */

  // handleAddItem: add or update a medicine entry
  // - If `editingExisting.itemId` is set, update the saved medicine via API
  // - Else if `editIndex` is set, update a temporary item in `currentItems`
  // - Otherwise append the new item to `currentItems`
  // - Reset `itemForm` after add/update
  const handleAddItem = (e) => {
    e.preventDefault();

    // If editing an existing saved medicine (from a saved invoice)
    if (editingExisting && editingExisting.itemId) {
      // call update API
      (async () => {
        try {
          setLoading(true);
          await axios.put(
            `${backendUrl}/api/stock/${editingExisting.invoiceId}/medicine/${editingExisting.itemId}`,
            itemForm,
          );
          toast.success("Medicine updated");
          setEditingExisting({ invoiceId: null, itemId: null });
          setShowMedicineForm(false);
          fetchStock();
          fetchStats();
        } catch (err) {
          toast.error("Update failed");
        } finally {
          setLoading(false);
        }
      })();
    } else if (editIndex !== null) {
      const updated = [...currentItems];
      updated[editIndex] = itemForm;
      setCurrentItems(updated);
      setEditIndex(null);
      toast.success("Medicine updated");
    } else {
      setCurrentItems([...currentItems, itemForm]);
      toast.success("Medicine added");
    }

    setItemForm({
      product: "",
      hsn: "",
      batchNo: "",
      batchExpiry: "",
      gst: "12%",
      unitPerPack: "",
      quantity: "",
      free: "0",
      rate: "",
      mrp: "",
    });
  };

  /* ================= SAVE STOCK ================= */

  // handleSaveStock: validate invoice and medicines, then POST to backend to create stock record
  const handleSaveStock = async () => {
    if (
      !invoiceForm.distributor ||
      !invoiceForm.invoiceNumber ||
      !invoiceForm.invoiceDate
    ) {
      toast.error("Fill distributor, invoice number and date");
      return;
    }

    if (currentItems.length === 0) {
      toast.error("Add at least one medicine");
      return;
    }

    try {
      setLoading(true);
      const medicines = currentItems.map((medicine) => ({
        ...medicine,
        quantity: Number(medicine.quantity),
        free: Number(medicine.free || 0),
        rate: Number(medicine.rate),
        mrp: Number(medicine.mrp),
      }));

      if (
        medicines.some(
          (medicine) =>
            !medicine.product ||
            !medicine.hsn ||
            !medicine.batchNo ||
            !medicine.batchExpiry ||
            !medicine.unitPerPack ||
            !Number.isFinite(medicine.quantity) ||
            !Number.isFinite(medicine.rate) ||
            !Number.isFinite(medicine.mrp),
        )
      ) {
        toast.error("Complete all medicine details before saving");
        return;
      }

      await axios.post(
        `${backendUrl}/api/stock/add`,
        {
          distributor: invoiceForm.distributor,
          invoiceNumber: invoiceForm.invoiceNumber.trim(),
          invoiceDate: invoiceForm.invoiceDate,
          medicines,
        },
        { withCredentials: true },
      );

      toast.success("Stock added successfully");

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);

      setShowInvoiceForm(false);
      setShowMedicineForm(false);
      setCurrentItems([]);
      setInvoiceForm({
        distributor: "",
        invoiceNumber: "",
        invoiceDate: "",
      });

      fetchStock();
      fetchStats();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding stock");
    } finally {
      setLoading(false);
    }
  };

  // handleShowDeleteConfirm: open confirmation modal for deleting a medicine from an invoice
  const handleShowDeleteConfirm = (invoiceId, itemIndex) => {
    setDeleteConfirm({ show: true, invoiceId, itemId: itemIndex });
  };

  // handleConfirmDelete: delete a medicine from an invoice via API, refresh data
  const handleConfirmDelete = async () => {
    if (!deleteConfirm.invoiceId && deleteConfirm.invoiceId !== 0) return;
    try {
      setLoading(true);
      await axios.delete(
        `${backendUrl}/api/stock/${deleteConfirm.invoiceId}/medicine/${deleteConfirm.itemId}`,
      );
      toast.success("Medicine deleted");
      setDeleteConfirm({ show: false, invoiceId: null, itemId: null });
      setViewInvoice(null);
      fetchStock();
      fetchStats();
    } catch (err) {
      toast.error("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  // handleEditMedicine: pre-fill itemForm for editing a medicine
  // - if invoiceId and item._id present, set `editingExisting` to update saved item
  // - otherwise set `editIndex` to edit a temporary item in `currentItems`
  const handleEditMedicine = (item, invoiceId, itemIndex) => {
    setItemForm({
      product: item.product || item.medicine || "",
      hsn: item.hsn || "",
      batchNo: item.batchNo || "",
      batchExpiry: item.batchExpiry || "",
      gst: item.gst || "12%",
      unitPerPack: item.unitPerPack || "",
      quantity: item.quantity || "",
      free: item.free || "0",
      rate: item.rate || "",
      mrp: item.mrp || "",
    });
    if (invoiceId && item._id) {
      setEditingExisting({ invoiceId, itemId: item._id });
    } else {
      // editing temporary currentItems: set index to editIndex
      setEditIndex(itemIndex);
    }
    setShowMedicineForm(true);
  };

  /*=============ADD INVOICE DELETE=========*/
  // handleDeleteInvoice: delete an entire invoice (after confirmation)
  const handleDeleteInvoice = async (invoiceId) => {
    if (!window.confirm("Delete full invoice?")) return;

    try {
      await axios.delete(`${backendUrl}/api/stock/${invoiceId}`);
      toast.success("Invoice deleted");
      fetchStock();
      fetchStats();
    } catch {
      toast.error("Invoice delete failed");
    }
  };

  /* ================= PAGINATION ================= */

  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 5;

  const indexOfLast = currentPage * perPage;
  const indexOfFirst = indexOfLast - perPage;

  // filtered: filter invoices by search query (invoice number or distributor name)
  const filtered = data.filter((inv) => {
    const q = (search || "").toLowerCase();
    const invNumber = (inv.invoiceNumber || "").toLowerCase();
    let distributorName = "";
    if (inv.distributor) {
      distributorName =
        typeof inv.distributor === "string"
          ? inv.distributor
          : inv.distributor.name || "";
      distributorName = distributorName.toLowerCase();
    }
    const searchMatch = invNumber.includes(q) || distributorName.includes(q);
    const items = inv.items || inv.medicines || [];
    const hasLowStock = items.some((item) => Number(item.quantity) < 5);
    const hasExpired = items.some((item) => {
      if (!item.batchExpiry) return false;
      return new Date(`${item.batchExpiry}-01`) < new Date();
    });

    const statusMatch =
      stockFilter === "low"
        ? hasLowStock
        : stockFilter === "expired"
          ? hasExpired
          : true;

    return searchMatch && statusMatch;
  });

  const currentInvoices = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / perPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, stockFilter]);

  const productCatalog = Array.from(
    new Map(
      data
        .flatMap((invoice) => invoice.items || invoice.medicines || [])
        .map((item) => [
          (item.product || item.medicine || "").trim().toLowerCase(),
          item,
        ])
        .filter(([name]) => name),
    ).values(),
  );

  const productSuggestions = productCatalog
    .filter((item) => {
      const name = item.product || item.medicine || "";
      return (
        itemForm.product.trim() &&
        name.toLowerCase().includes(itemForm.product.trim().toLowerCase())
      );
    })
    .slice(0, 6);

  const fillProductDetails = (item) => {
    setItemForm((previous) => ({
      ...previous,
      product: item.product || item.medicine || "",
      hsn: item.hsn || "",
      batchNo: item.batchNo || "",
      batchExpiry: item.batchExpiry || "",
      gst: item.gst || "12%",
      unitPerPack: item.unitPerPack || "",
      quantity: item.quantity || "",
      free: item.free || "0",
      rate: item.rate || "",
      mrp: item.mrp || "",
    }));
  };

  return (
    <div className="admin-page">
      <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
        Stock Management
      </h2>
      {/* Summary Cards */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-lg p-6 shadow flex flex-col items-center">
          <span className="text-lg font-semibold">Total Stock</span>
          <span className="text-2xl font-bold mt-2">{stats.totalStock}</span>
        </div>
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-white rounded-lg p-6 shadow flex flex-col items-center">
          <span className="text-lg font-semibold">Low Stock Items</span>
          <span className="text-2xl font-bold mt-2">{stats.lowStock}</span>
        </div>
        <div className="bg-gradient-to-r from-red-500 to-red-400 text-white rounded-lg p-6 shadow flex flex-col items-center">
          <span className="text-lg font-semibold">Expired Items</span>
          <span className="text-2xl font-bold mt-2">{stats.expired}</span>
        </div>
      </div> */}

      {/* Search and Add Button */}
      <div className="mb-6 flex flex-col xl:flex-row gap-3 items-center justify-between">
        <div className="w-full sm:w-80 relative bg-white rounded-xl border border-gray-100 shadow-sm px-3 py-2 flex items-center">
          <span className="text-blue-500 mr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.9 14.32a8 8 0 111.414-1.414l4.387 4.386a1 1 0 01-1.414 1.415l-4.387-4.387zM14 8a6 6 0 11-12 0 6 6 0 0112 0z"
                clipRule="evenodd"
              />
            </svg>
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by medicine or distributor..."
            className="flex-1 bg-transparent outline-none placeholder-gray-400 text-sm"
          />
          {search ? (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="ml-2 text-xs text-gray-500 px-2 py-1 rounded hover:bg-gray-100"
            >
              Clear
            </button>
          ) : (
            <span className="ml-2 text-xs text-gray-300">Quick search</span>
          )}
        </div>

        <div className="stock-filter-group flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1">
          {["all", "low", "expired"].map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setStockFilter(filter)}
              className={`stock-filter-button px-3 py-1.5 text-xs font-semibold ${
                stockFilter === filter ? "is-selected" : ""
              }`}
            >
              {filter === "all"
                ? "All"
                : filter === "low"
                  ? "Low Stock"
                  : "Expired"}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-2 bg-linear-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full font-semibold shadow-lg hover:scale-[1.02] transform transition"
            onClick={() => setShowInvoiceForm(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            <span className="hidden sm:inline">Add Stock</span>
          </button>
        </div>
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
            <h3 className="text-2xl font-extrabold text-blue-700 mb-2 text-center tracking-wide">
              Invoice Details
            </h3>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="distributor"
                className="font-semibold text-blue-700"
              >
                Distributor Name
              </label>
              <select
                name="distributor"
                value={invoiceForm.distributor}
                onChange={handleInvoiceChange}
                className="px-4 py-2 border rounded-lg"
                required
              >
                <option value="">Select Distributor</option>
                {distributors.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="invoiceNumber"
                className="font-semibold text-blue-700"
              >
                Invoice Number
              </label>
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
              <label
                htmlFor="invoiceDate"
                className="font-semibold text-blue-700"
              >
                Invoice Date
              </label>
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
              onSubmit={handleAddItem}
              type="submit"
              className="bg-linear-to-r from-blue-600 to-blue-400 text-white px-6 py-2 rounded-lg font-bold shadow hover:from-blue-700 hover:to-blue-500 transition text-lg mt-2"
            >
              Next: Add Medicines
            </button>
          </form>
        </div>
      )}

      {/* Step 2: Add Medicines Modal */}
      {showMedicineForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3">
          <div className="stock-medicine-modal bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden relative animate-fadeIn border border-blue-50 flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between p-4 bg-linear-to-r from-blue-600 to-blue-400 text-white">
              <div className="flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 opacity-90"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m2 0a2 2 0 012 2v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4a2 2 0 012-2h14zM7 8V6a5 5 0 0110 0v2"
                  />
                </svg>
                <div>
                  <div className="text-lg font-bold">
                    Add Medicines to Invoice
                  </div>
                  <div className="text-xs opacity-90">
                    Invoice: {invoiceForm.invoiceNumber || "(not set)"} •
                    Distributor: {invoiceForm.distributor || "(not set)"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  ref={bulkImportRef}
                  type="file"
                  accept=".csv,text/csv"
                  className="hidden"
                  onChange={handleBulkImport}
                />
                <button
                  type="button"
                  className="stock-bulk-import rounded-lg bg-white/15 px-3 py-2 text-xs font-semibold text-white hover:bg-white/25"
                  onClick={() => bulkImportRef.current?.click()}
                >
                  Bulk Import CSV
                </button>
                <button
                  type="button"
                  className="text-white/90 bg-white/10 hover:bg-white/20 rounded-full w-9 h-9 flex items-center justify-center"
                  onClick={() => {
                    setShowMedicineForm(false);
                    setCurrentItems([]);
                    setInvoiceForm({
                      distributor: "",
                      invoiceNumber: "",
                      invoiceDate: "",
                    });
                  }}
                >
                  &times;
                </button>
              </div>
            </div>
            <div className="stock-medicine-modal__body flex-1 overflow-hidden flex flex-col md:flex-row gap-4 p-4">
              <div className="flex-1 overflow-y-auto pr-2">
                <form
                  onSubmit={handleAddItem}
                  className="grid grid-cols-1 md:grid-cols-2 gap-3"
                >
                  <div className="relative flex flex-col gap-1">
                    <label
                      htmlFor="medicine"
                      className="font-semibold text-blue-700"
                    >
                      Product Name
                    </label>
                    <input
                      id="product"
                      type="text"
                      name="product"
                      value={itemForm.product}
                      onChange={(e) =>
                        setItemForm((p) => ({ ...p, product: e.target.value }))
                      }
                      className="px-3 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
                      placeholder="Enter product name"
                      required
                    />
                    {productSuggestions.length > 0 && (
                      <div className="stock-product-suggestions absolute left-0 right-0 top-full z-30 mt-1 overflow-hidden rounded-lg border bg-white shadow-lg">
                        {productSuggestions.map((item) => (
                          <button
                            key={`${item.product || item.medicine}-${item.batchNo || "batch"}`}
                            type="button"
                            className="stock-product-suggestion flex w-full items-center justify-between px-3 py-2 text-left text-sm"
                            onClick={() => fillProductDetails(item)}
                          >
                            <span className="font-medium">
                              {item.product || item.medicine}
                            </span>
                            <span className="text-xs text-slate-500">
                              {item.batchNo || "Existing stock"}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="hsn"
                      className="font-semibold text-blue-700"
                    >
                      HSN
                    </label>
                    <input
                      id="hsn"
                      type="text"
                      name="hsn"
                      value={itemForm.hsn}
                      onChange={(e) =>
                        setItemForm((p) => ({ ...p, hsn: e.target.value }))
                      }
                      className="px-3 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
                      placeholder="Enter HSN"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="batchNo"
                      className="font-semibold text-blue-700"
                    >
                      Batch No
                    </label>
                    <input
                      id="batchNo"
                      type="text"
                      name="batchNo"
                      value={itemForm.batchNo}
                      onChange={(e) =>
                        setItemForm((p) => ({ ...p, batchNo: e.target.value }))
                      }
                      className="px-3 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
                      placeholder="Enter batch no"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="batchExpiry"
                      className="font-semibold text-blue-700"
                    >
                      Batch Expiry
                    </label>
                    <input
                      id="batchExpiry"
                      type="month"
                      name="batchExpiry"
                      value={itemForm.batchExpiry}
                      onChange={(e) =>
                        setItemForm((p) => ({
                          ...p,
                          batchExpiry: e.target.value,
                        }))
                      }
                      className="px-3 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="gst"
                      className="font-semibold text-blue-700"
                    >
                      GST
                    </label>
                    <select
                      id="gst"
                      name="gst"
                      value={itemForm.gst}
                      onChange={(e) =>
                        setItemForm((p) => ({ ...p, gst: e.target.value }))
                      }
                      className="px-3 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
                      required
                    >
                      {gstOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="unitPerPack"
                      className="font-semibold text-blue-700"
                    >
                      Unit/Pack
                    </label>
                    <input
                      id="unitPerPack"
                      type="text"
                      name="unitPerPack"
                      value={itemForm.unitPerPack}
                      onChange={(e) =>
                        setItemForm((p) => ({
                          ...p,
                          unitPerPack: e.target.value,
                        }))
                      }
                      className="px-3 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
                      placeholder="e.g. 10 tablets"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="quantity"
                      className="font-semibold text-blue-700"
                    >
                      Purchase Qty
                    </label>
                    <input
                      id="quantity"
                      type="number"
                      name="quantity"
                      value={itemForm.quantity}
                      onChange={(e) =>
                        setItemForm((p) => ({ ...p, quantity: e.target.value }))
                      }
                      className="px-3 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
                      placeholder="Enter quantity"
                      min="1"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="free"
                      className="font-semibold text-blue-700"
                    >
                      FREE
                    </label>
                    <input
                      id="free"
                      type="number"
                      name="free"
                      value={itemForm.free}
                      onChange={(e) =>
                        setItemForm((p) => ({ ...p, free: e.target.value }))
                      }
                      className="px-3 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
                      placeholder="Enter free qty"
                      min="0"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="rate"
                      className="font-semibold text-blue-700"
                    >
                      Rate
                    </label>
                    <input
                      id="rate"
                      type="number"
                      name="rate"
                      value={itemForm.rate}
                      onChange={(e) =>
                        setItemForm((p) => ({ ...p, rate: e.target.value }))
                      }
                      className="px-3 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
                      placeholder="Enter rate"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="mrp"
                      className="font-semibold text-blue-700"
                    >
                      MRP
                    </label>
                    <input
                      id="mrp"
                      type="number"
                      name="mrp"
                      value={itemForm.mrp}
                      onChange={(e) =>
                        setItemForm((p) => ({ ...p, mrp: e.target.value }))
                      }
                      className="px-3 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
                      placeholder="Enter MRP"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="col-span-full md:col-span-2 bg-linear-to-r from-indigo-600 to-indigo-400 text-white px-5 py-2 rounded-lg font-semibold shadow hover:from-indigo-700 hover:to-indigo-500 transition text-base mt-1"
                  >
                    Add Medicine
                  </button>
                </form>
              </div>

              {/* Right: Added items panel */}
              <div className="w-full md:w-80 bg-gray-50 rounded-lg p-3 border border-gray-100 flex flex-col overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-700">
                    Added Medicines
                  </h4>
                  <span className="text-xs text-gray-500">
                    {currentItems.length}
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                  {currentItems.length === 0 ? (
                    <div className="text-sm text-gray-400">
                      No medicines added yet.
                    </div>
                  ) : (
                    currentItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-white rounded shadow-sm p-3 flex items-start gap-3"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm truncate">
                            {item.product || item.medicine}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            Batch: {item.batchNo} • Qty: {item.quantity} • MRP:
                            ₹{item.mrp}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 ml-2">
                          <button
                            type="button"
                            className="text-xs px-2 py-1 bg-yellow-50 text-yellow-700 rounded hover:bg-yellow-100"
                            onClick={() => handleEditMedicine(item, null, idx)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="text-xs px-2 py-1 bg-red-50 text-red-700 rounded hover:bg-red-100"
                            onClick={() =>
                              setCurrentItems((prev) =>
                                prev.filter((_, i) => i !== idx),
                              )
                            }
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="border-t bg-white p-4 flex items-center justify-end gap-3">
              <button
                className="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200"
                onClick={() => {
                  setShowMedicineForm(false);
                }}
              >
                Close
              </button>
              <button
                className="px-5 py-2 rounded-lg bg-linear-to-r from-green-600 to-green-400 text-white font-semibold hover:from-green-700 hover:to-green-500 disabled:opacity-60"
                onClick={handleSaveStock}
                disabled={currentItems.length === 0}
              >
                Save Invoice & Medicines
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="text-green-600 text-center font-semibold mb-4">
          Stock added successfully!
        </div>
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
            {currentInvoices.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-400">
                  No stock found.
                </td>
              </tr>
            ) : (
              currentInvoices.map((invoice) => {
                const items = invoice.items || invoice.medicines || [];
                return (
                  <tr
                    key={invoice.id}
                    className="border-b last:border-none hover:bg-blue-50 transition"
                  >
                    <td className="py-2 px-3">{invoice.invoiceNumber}</td>
                    <td className="py-2 px-3">{invoice.invoiceDate}</td>
                    <td className="py-2 px-3">
                      {invoice.distributor?.name || "-"}
                    </td>
                    <td className="py-2 px-3 text-right">{items.length}</td>
                    <td className="py-2 px-3 text-center">
                      <button
                        className="bg-blue-100 text-blue-700 px-3 m-2 py-1 rounded-md text-sm hover:bg-blue-200 transition cursor-pointer"
                        onClick={() => setViewInvoice(invoice)}
                      >
                        View Details
                      </button>

                      <button
                        className="bg-red-400 text-white px-2 ml-2 py-1 rounded cursor-pointer"
                        onClick={() => handleDeleteInvoice(invoice._id)}
                      >
                        Delete Invoice
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-600">
            Showing {(currentPage - 1) * perPage + 1} -{" "}
            {Math.min(currentPage * perPage, filtered.length)} of{" "}
            {filtered.length}
          </div>
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                className={`px-3 py-1 rounded ${p === currentPage ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200"}`}
                onClick={() => setCurrentPage(p)}
              >
                {p}
              </button>
            ))}

            <button
              className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}

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
            <h3 className="text-2xl font-extrabold text-blue-700 mb-2 text-center tracking-wide">
              Invoice Details
            </h3>
            <div className="mb-2 text-sm text-gray-700 grid grid-cols-1 md:grid-cols-3 gap-2">
              <div>
                <span className="font-semibold">Distributor:</span>{" "}
                {viewInvoice.distributor &&
                typeof viewInvoice.distributor === "object"
                  ? viewInvoice.distributor.name || "-"
                  : viewInvoice.distributor || "-"}
              </div>
              <div>
                <span className="font-semibold">Invoice No:</span>{" "}
                {viewInvoice.invoiceNumber}
              </div>
              <div>
                <span className="font-semibold">Date:</span>{" "}
                {viewInvoice.invoiceDate}
              </div>
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
                        <td className="py-1 px-2">
                          {item.product || item.medicine}
                        </td>
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
                            onClick={() =>
                              handleEditMedicine(
                                item,
                                viewInvoice._id || viewInvoice.id,
                                idx,
                              )
                            }
                          >
                            Edit
                          </button>
                          <button
                            className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-semibold hover:bg-red-200"
                            onClick={() =>
                              handleShowDeleteConfirm(
                                viewInvoice._id || viewInvoice.id,
                                item._id || item.id || idx,
                              )
                            }
                          >
                            Delete
                          </button>
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
            <h3 className="text-xl font-bold text-red-600 mb-2 text-center">
              Confirm Delete
            </h3>
            <p className="text-gray-600 text-center">
              Are you sure you want to delete this medicine from the invoice?
              <br />
              <span className="text-sm text-red-500">
                This action cannot be undone.
              </span>
            </p>
            <div className="flex justify-center gap-3 mt-2">
              <button
                className="px-6 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition"
                onClick={() =>
                  setDeleteConfirm({
                    show: false,
                    invoiceId: null,
                    itemId: null,
                  })
                }
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
