import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function PortfolioAnalyser() {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Change this in the useEffect hook
useEffect(() => {
  axios
    .get("http://localhost:8080/api/clients") // Changed 5000 to 8080
    .then((res) => setClients(res.data))
    .catch((err) => console.error(err));
}, []);

// And change this in the handleEvaluate function
  useEffect(() => {
    if (!selectedClient) {
      setPortfolioData(null); // Clear data if no client is selected
      return;
    }

    setLoading(true);
    axios
      .post(`http://localhost:8080/api/clients/${selectedClient}/evaluate`)
      .then((res) => setPortfolioData(res.data))
      .catch((err) => console.error("Evaluation failed:", err))
      .finally(() => setLoading(false));
  }, [selectedClient]); // This hook runs whenever `selectedClient` changes

  // Search client
  const handleSearch = () => {
    if (!searchTerm) return;
    setSelectedClient(searchTerm);
  };

  // Pie chart for sector diversification
  const pieChartData = portfolioData
    ? {
        labels: Object.keys(portfolioData.portfolioAnalysis.sectorDiversification),
        datasets: [
          {
            label: "Sector % Allocation",
            data: Object.values(portfolioData.portfolioAnalysis.sectorDiversification),
            backgroundColor: [
              "#6366F1", "#10B981", "#F59E0B", "#EF4444", "#3B82F6", "#8B5CF6", "#F472B6",
            ],
            borderColor: "#1E293B",
            borderWidth: 2,
          },
        ],
      }
    : null;

  // Bar chart for performance
  const barChartData = portfolioData
    ? {
        labels: ["1 Year", "3 Year", "5 Year"],
        datasets: [
          {
            label: "Return (%)",
            data: [
              portfolioData.portfolioAnalysis.performance.oneYearReturn,
              portfolioData.portfolioAnalysis.performance.threeYearReturn,
              portfolioData.portfolioAnalysis.performance.fiveYearReturn,
            ],
            backgroundColor: "#10B981",
          },
        ],
      }
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white p-8">
      <h1 className="text-5xl font-extrabold text-center mb-12">💼 Portfolio Analyser</h1>

      {/* Client Selection */}
      <div className="max-w-7xl mx-auto mb-12">
        <h2 className="text-2xl font-semibold mb-4">Select a Client</h2>
        <div className="flex gap-4 mb-4 flex-wrap">
          {clients.map((client) => (
            <button
              key={client}
              onClick={() => setSelectedClient(client)}
              className={`px-4 py-2 rounded-xl border text-lg font-medium transition-all hover:scale-[1.05] transform ${
                selectedClient === client
                  ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-transparent shadow-lg"
                  : "bg-slate-800 border-slate-700 hover:bg-slate-700"
              }`}
            >
              {client}
            </button>
          ))}
        </div>

        {/* Search */}
        {/* <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Search Client ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 font-semibold shadow-lg hover:scale-[1.05] transform transition"
          >
            Search
          </button>
        
        </div> */}
      </div>

      {/* Loading Indicator */}
      {loading && <div className="text-center text-lg">Evaluating...</div>}

      {/* Portfolio Summary (No changes needed here) */}
      {portfolioData && !loading && (
        // ... rest of your JSX to display portfolio data
        <div className="max-w-6xl mx-auto p-8 bg-slate-800 rounded-3xl shadow-2xl border border-slate-700">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold">Total Portfolio Value</h2>
            <p className="text-4xl font-extrabold text-emerald-400 mt-2">
              ₹{portfolioData.portfolioAnalysis.totalValue.toLocaleString()}
            </p>
            <p className="text-slate-300 mt-1 text-lg">Trader Type: {portfolioData.traderType}</p>
          </div>

          {/* Charts */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-700">
              <h3 className="text-xl font-bold mb-4 text-center">Sector Diversification</h3>
              <Pie data={pieChartData} />
            </div>

            <div className="bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-700">
              <h3 className="text-xl font-bold mb-4 text-center">Portfolio Performance</h3>
              <Bar data={barChartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
            </div>
          </div>

          {/* Diversification Metrics */}
          <div className="mb-8 bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-700">
            <h3 className="text-xl font-bold mb-4">Diversification Metrics</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(portfolioData.portfolioAnalysis.diversificationMetrics).map(([key, val]) => (
                <div
                  key={key}
                  className="p-3 bg-slate-800 rounded-xl border border-slate-700 shadow-inner flex justify-between"
                >
                  <span className="capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                  <span className="text-emerald-400 font-bold">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Possible Diversification */}
          {portfolioData.possibleDiversification && (
            <div className="mb-8 bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-700">
              <h3 className="text-xl font-bold mb-4">Possible Diversification</h3>
              <ul className="list-disc list-inside space-y-2 text-slate-300">
                {portfolioData.possibleDiversification.map((item, idx) => (
                  <li key={idx}>
                    <span className="font-semibold">{item.sector}:</span> {item.recommendation}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Summary */}
          <div className="p-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl text-white font-bold text-lg text-center">
            {portfolioData.summary}
          </div>
        </div>
      )}
    </div>
  );
}