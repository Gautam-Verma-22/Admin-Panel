"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { Power4 } from "gsap/all";

export default function AdminPanel() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("customer");
  const router = useRouter();
  const dashboardRef = useRef();
  const cardRefs = useRef([]);
  const headerRef = useRef();
  const logoutRef = useRef();

  // Form state
  const [customerData, setCustomerData] = useState({
    name: "",
    mobile: "",
    address: "",
    gstNo: "",
    currentReading: 0,
  });

  const [invoiceData, setInvoiceData] = useState({
    invoiceNo: "",
    date: new Date().toISOString().split("T")[0],
    previousReading: 0,
    rentAmount: 0,
    freeCopies: 0,
    ratePerReading: 0,
    isRent: false,
    gstType: "cgst", // cgst or igst
  });

  const [netPayableReading, setNetPayableReading] = useState(0);
  const [totalBeforeTax, setTotalBeforeTax] = useState(0);
  const [totalAfterTax, setTotalAfterTax] = useState(0);
  const [gstAmount, setGstAmount] = useState(0);

  // Function to generate random invoice number
  const generateInvoiceNumber = () => {
    const prefix = "INV";
    const randomNum = Math.floor(Math.random() * 90000) + 10000; // Generates a 5-digit random number
    return `${prefix}-${randomNum}`;
  };

  useEffect(() => {
    // Check authentication status
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

    if (!isAuthenticated) {
      router.push("/login");
    } else {
      // Generate invoice number when component mounts
      setInvoiceData((prev) => ({
        ...prev,
        invoiceNo: generateInvoiceNumber(),
      }));

      setTimeout(() => {
        setIsLoading(false);
        initAnimations();
      }, 500);
    }
  }, [router]);

  const initAnimations = () => {
    gsap.registerPlugin(Power4);

    gsap.from(dashboardRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: Power4.easeOut,
    });

    gsap.from(headerRef.current, {
      y: -50,
      opacity: 0,
      duration: 0.6,
      ease: Power4.easeOut,
    });

    gsap.from(cardRefs.current, {
      y: 30,
      opacity: 0,
      stagger: 0.1,
      duration: 0.6,
      ease: Power4.easeOut,
    });

    gsap.from(logoutRef.current, {
      x: 20,
      opacity: 0,
      duration: 0.5,
      delay: 0.3,
      ease: Power4.easeOut,
    });
  };

  const handleLogout = () => {
    gsap.to(dashboardRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.5,
      ease: Power4.easeIn,
      onComplete: () => {
        localStorage.removeItem("isAuthenticated");
        router.push("/login");
      },
    });
  };

  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setCustomerData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInvoiceChange = (e) => {
    const { name, value, type, checked } = e.target;
    setInvoiceData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const calculateInvoice = () => {
    // Calculate net payable reading
    const netReading = invoiceData.isRent
      ? customerData.currentReading -
        invoiceData.previousReading -
        invoiceData.freeCopies
      : customerData.currentReading - invoiceData.previousReading;

    setNetPayableReading(netReading > 0 ? netReading : 0);

    // Calculate total before tax
    const readingCost = netPayableReading * invoiceData.ratePerReading;
    const total = invoiceData.isRent
      ? readingCost + Number(invoiceData.rentAmount)
      : readingCost;
    setTotalBeforeTax(total);

    // Calculate GST
    let gst = 0;
    if (invoiceData.gstType === "cgst") {
      gst = total * 0.09 * 2; // 9% CGST + 9% SGST
    } else {
      gst = total * 0.18; // 18% IGST
    }
    setGstAmount(gst);

    // Calculate total after tax
    setTotalAfterTax(total + gst);
  };

  useEffect(() => {
    calculateInvoice();
  }, [customerData.currentReading, invoiceData, netPayableReading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Floating background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full filter blur-xl opacity-10 bg-gradient-to-br 
              ${
                i % 2 === 0
                  ? "from-blue-500 to-blue-700"
                  : "from-emerald-500 to-emerald-700"
              }`}
            style={{
              width: [200, 150, 180, 220, 170][i],
              height: [200, 150, 180, 220, 170][i],
              top: `${[10, 70, 30, 85, 50][i]}%`,
              left: `${[80, 20, 65, 40, 90][i]}%`,
            }}
          />
        ))}
      </div>

      <header
        ref={headerRef}
        className="bg-gray-800/80 backdrop-blur-md shadow-lg border-b border-gray-700/50"
      >
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-emerald-400 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Admin Panel - Invoice Management System
          </h1>
          <div className="flex items-center gap-4">
            <button
              ref={logoutRef}
              onClick={handleLogout}
              className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-500 hover:to-red-600 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-red-500/20"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main
        ref={dashboardRef}
        className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8 relative z-10"
      >
        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-700 mb-6">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "customer"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-gray-400"
            }`}
            onClick={() => setActiveTab("customer")}
          >
            Customer Details
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "invoice"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-gray-400"
            }`}
            onClick={() => setActiveTab("invoice")}
          >
            Invoice Creation
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "preview"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-gray-400"
            }`}
            onClick={() => setActiveTab("preview")}
          >
            Invoice Preview
          </button>
        </div>

        {/* Customer Details Form */}
        {activeTab === "customer" && (
          <div
            ref={(el) => (cardRefs.current[0] = el)}
            className="bg-gray-800/80 backdrop-blur-md rounded-xl p-6 border border-gray-700/50 shadow-lg hover:shadow-blue-500/10 transition-all duration-300"
          >
            <h2 className="text-xl font-semibold text-blue-400 mb-4">
              Customer Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 mb-1">
                  Customer Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={customerData.name}
                  onChange={handleCustomerChange}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">
                  Mobile Number
                </label>
                <input
                  type="text"
                  name="mobile"
                  value={customerData.mobile}
                  onChange={handleCustomerChange}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-400 mb-1">Address</label>
                <textarea
                  name="address"
                  value={customerData.address}
                  onChange={handleCustomerChange}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  rows="3"
                ></textarea>
              </div>
              <div>
                <label className="block text-gray-400 mb-1">GST Number</label>
                <input
                  type="text"
                  name="gstNo"
                  value={customerData.gstNo}
                  onChange={handleCustomerChange}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">
                  Current Reading
                </label>
                <input
                  type="number"
                  name="currentReading"
                  value={customerData.currentReading}
                  onChange={handleCustomerChange}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Invoice Creation Form */}
        {activeTab === "invoice" && (
          <div
            ref={(el) => (cardRefs.current[1] = el)}
            className="bg-gray-800/80 backdrop-blur-md rounded-xl p-6 border border-gray-700/50 shadow-lg hover:shadow-emerald-500/10 transition-all duration-300"
          >
            <h2 className="text-xl font-semibold text-emerald-400 mb-4">
              Invoice Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 mb-1">
                  Invoice Number
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    name="invoiceNo"
                    value={invoiceData.invoiceNo}
                    readOnly
                    className="w-full bg-gray-700/50 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setInvoiceData((prev) => ({
                        ...prev,
                        invoiceNo: generateInvoiceNumber(),
                      }))
                    }
                    className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors"
                  >
                    Generate
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={invoiceData.date}
                  onChange={handleInvoiceChange}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">
                  Previous Reading
                </label>
                <input
                  type="number"
                  name="previousReading"
                  value={invoiceData.previousReading}
                  onChange={handleInvoiceChange}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">
                  Rate Per Reading
                </label>
                <input
                  type="number"
                  name="ratePerReading"
                  value={invoiceData.ratePerReading}
                  onChange={handleInvoiceChange}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isRent"
                  checked={invoiceData.isRent}
                  onChange={handleInvoiceChange}
                  className="mr-2 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label className="text-gray-400">Include Rent</label>
              </div>
              {invoiceData.isRent && (
                <>
                  <div>
                    <label className="block text-gray-400 mb-1">
                      Rent Amount
                    </label>
                    <input
                      type="number"
                      name="rentAmount"
                      value={invoiceData.rentAmount}
                      onChange={handleInvoiceChange}
                      className="w-full bg-gray-700/50 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">
                      Free Copies Count
                    </label>
                    <input
                      type="number"
                      name="freeCopies"
                      value={invoiceData.freeCopies}
                      onChange={handleInvoiceChange}
                      className="w-full bg-gray-700/50 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}
              <div>
                <label className="block text-gray-400 mb-1">GST Type</label>
                <select
                  name="gstType"
                  value={invoiceData.gstType}
                  onChange={handleInvoiceChange}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="cgst">CGST + SGST (9% + 9%)</option>
                  <option value="igst">IGST (18%)</option>
                </select>
              </div>
            </div>

            {/* Calculation Summary */}
            <div className="mt-6 bg-gray-700/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-400 mb-2">
                Calculation Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400">Net Payable Reading:</p>
                  <p className="text-xl font-bold text-white">
                    {netPayableReading}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Total Before Tax:</p>
                  <p className="text-xl font-bold text-white">
                    ₹{totalBeforeTax.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">
                    GST Amount (
                    {invoiceData.gstType === "cgst" ? "CGST+SGST" : "IGST"}):
                  </p>
                  <p className="text-xl font-bold text-white">
                    ₹{gstAmount.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Total After Tax:</p>
                  <p className="text-xl font-bold text-white">
                    ₹{totalAfterTax.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Invoice Preview */}
        {activeTab === "preview" && (
          <div
            ref={(el) => (cardRefs.current[2] = el)}
            className="bg-gray-800/80 backdrop-blur-md rounded-xl p-6 border border-gray-700/50 shadow-lg hover:shadow-purple-500/10 transition-all duration-300"
          >
            <h2 className="text-xl font-semibold text-purple-400 mb-4">
              Invoice Preview
            </h2>
            <div className="bg-white text-gray-800 p-6 rounded-lg">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-2xl font-bold">INVOICE</h1>
                  <p className="text-gray-600">#{invoiceData.invoiceNo}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-600">Date: {invoiceData.date}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="font-bold text-lg mb-2">Bill To:</h3>
                  <p className="font-semibold">{customerData.name}</p>
                  <p>{customerData.address}</p>
                  <p>Mobile: {customerData.mobile}</p>
                  <p>GST: {customerData.gstNo || "N/A"}</p>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Meter Details:</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <p>Previous Reading:</p>
                    <p className="text-right">{invoiceData.previousReading}</p>
                    <p>Current Reading:</p>
                    <p className="text-right">{customerData.currentReading}</p>
                    <p>Free Copies:</p>
                    <p className="text-right">{invoiceData.freeCopies}</p>
                    <p>Net Payable Reading:</p>
                    <p className="text-right font-bold">{netPayableReading}</p>
                  </div>
                </div>
              </div>

              <table className="w-full mb-6">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left pb-2">Description</th>
                    <th className="text-right pb-2">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData.isRent && (
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Rent Amount</td>
                      <td className="text-right py-2">
                        {invoiceData.rentAmount}
                      </td>
                    </tr>
                  )}
                  <tr className="border-b border-gray-100">
                    <td className="py-2">
                      Reading Charges ({netPayableReading} x{" "}
                      {invoiceData.ratePerReading})
                    </td>
                    <td className="text-right py-2">
                      {(netPayableReading * invoiceData.ratePerReading).toFixed(
                        2
                      )}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2">Subtotal</td>
                    <td className="text-right py-2">
                      {totalBeforeTax.toFixed(2)}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2">
                      GST (
                      {invoiceData.gstType === "cgst"
                        ? "CGST 9% + SGST 9%"
                        : "IGST 18%"}
                      )
                    </td>
                    <td className="text-right py-2">{gstAmount.toFixed(2)}</td>
                  </tr>
                  <tr className="border-b-2 border-gray-200 font-bold">
                    <td className="py-2">Total Amount</td>
                    <td className="text-right py-2">
                      {totalAfterTax.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="text-center mt-8 pt-4 border-t border-gray-200">
                <p>Thank you for your business!</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
