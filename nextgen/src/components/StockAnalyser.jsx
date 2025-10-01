// src/components/StockAnalyser.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function StockAnalyser() {
  const [stocks, setStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [parameters, setParameters] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState(null);

  // Fetch all stock symbols
  useEffect(() => {
    axios.get("http://localhost:8080/api/stocks")
      .then((res) => {
        const uniqueStocks = [...new Set(res.data)];
        setStocks(uniqueStocks);
      })
      .catch((err) => console.error(err));
  }, []);

  // Fetch parameters for selected stock
  const handleStockClick = (symbol) => {
    setSelectedStock(symbol);
    setFeedback(null);
    axios.get(`http://localhost:8080/api/stocks/${symbol}/parameters`)
      .then((res) => {
        setParameters(res.data);
        const labels = Object.keys(res.data);
        const values = Object.values(res.data);

        // Chart with gradient styling
        setChartData({
          labels,
          datasets: [
            {
              label: `${symbol} Metrics`,
              data: values,
              borderColor: "rgba(139,92,246,1)",
              backgroundColor: (ctx) => {
                const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 400);
                gradient.addColorStop(0, "rgba(139,92,246,0.6)");
                gradient.addColorStop(1, "rgba(99,102,241,0.1)");
                return gradient;
              },
              borderWidth: 3,
              pointBackgroundColor: "#facc15",
              pointBorderColor: "#1e293b",
              pointRadius: 6,
              pointHoverRadius: 10,
              tension: 0.4,
              fill: true,
            },
          ],
        });
      })
      .catch((err) => console.error(err));
  };

  // Evaluate stock
  const handleEvaluate = () => {
    if (!selectedStock) return;
    setLoading(true);
    axios.post(`http://localhost:8080/api/stocks/${selectedStock}/evaluate`, parameters)
      .then((res) => setFeedback(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        labels: { color: "#e2e8f0", font: { size: 14, weight: "bold" } },
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "rgba(15,23,42,0.95)",
        titleColor: "#facc15",
        bodyColor: "#e2e8f0",
        borderColor: "#6366f1",
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        ticks: { color: "#cbd5e1" },
        grid: { color: "rgba(255,255,255,0.05)" },
      },
      x: {
        ticks: { color: "#cbd5e1" },
        grid: { color: "rgba(255,255,255,0.05)" },
      },
    },
    animation: {
      duration: 1800,
      easing: "easeOutQuart",
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-slate-100 antialiased">
      {/* HERO HEADER */}
      <header className="max-w-7xl mx-auto px-6 py-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
          Stock Evaluator
        </h1>
        <p className="mt-3 text-slate-400 text-lg">
          Dive deep into metrics • AI-powered feedback • Clear decisions
        </p>
      </header>

      <main className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* LEFT: Stock List */}
          <div className="col-span-1 bg-slate-800/60 backdrop-blur-xl rounded-2xl border border-slate-700 shadow-lg p-4 h-[75vh] flex flex-col">
            <h2 className="text-lg font-semibold mb-4">Available Stocks</h2>
            <div className="overflow-y-auto flex-1 space-y-2 pr-2">
              {stocks.length === 0 ? (
                <p className="text-slate-400 text-sm">Loading stocks...</p>
              ) : (
                stocks.map((stock) => (
                  <button
                    key={stock}
                    onClick={() => handleStockClick(stock)}
                    className={`w-full px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-[1.02] transform ${
                      selectedStock === stock
                        ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md"
                        : "bg-slate-900/70 hover:bg-slate-700 text-slate-200 border border-slate-700"
                    }`}
                  >
                    {stock}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* RIGHT: Parameters */}
          <div className="col-span-3 space-y-10">
            {!selectedStock ? (
              <div className="h-[75vh] flex items-center justify-center bg-slate-800/60 rounded-3xl border border-slate-700 shadow-xl">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">Choose a Stock</h3>
                  <p className="text-slate-400">Select from the left panel to view metrics & insights.</p>
                </div>
              </div>
            ) : (
              <>
                <div className="bg-slate-800 p-6 rounded-3xl shadow-lg border border-slate-700">
                  <h3 className="text-xl font-bold mb-6">{selectedStock} Parameters</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.keys(parameters).map((key) => (
                      <div
                        key={key}
                        className="p-4 bg-slate-900 rounded-xl border border-slate-700 shadow-inner hover:scale-[1.02] transition flex flex-col text-center"
                      >
                        <span className="text-xs text-slate-400">{key.replace(/([A-Z])/g, " $1")}</span>
                        <span className="text-emerald-400 text-lg font-bold">{parameters[key]}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-center mt-6">
                    <button
                      onClick={handleEvaluate}
                      className="bg-gradient-to-r from-green-400 to-emerald-500 px-6 py-3 rounded-2xl font-semibold shadow-md hover:scale-[1.05] transform transition"
                    >
                      {loading ? "Evaluating..." : "Evaluate"}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* METRICS CHART (FULL WIDTH) */}
        {chartData && (
          <div className="mt-12 bg-slate-800 p-8 rounded-3xl shadow-2xl border border-slate-700 relative">
            <h3 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
              {selectedStock} Metrics Chart
            </h3>
            <div className="h-[500px]">
              <Line data={chartData} options={chartOptions} />
            </div>
            <div className="absolute -left-10 top-10 w-40 h-40 bg-purple-500/30 blur-3xl rounded-full"></div>
            <div className="absolute -right-10 bottom-10 w-48 h-48 bg-indigo-500/30 blur-3xl rounded-full"></div>
          </div>
        )}

        {/* FEEDBACK (FULL WIDTH) */}
        {feedback && (
          <div className="mt-12 bg-slate-900 p-8 rounded-3xl shadow-2xl border border-slate-700">
            <h3 className="text-3xl font-extrabold mb-8 text-center bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
              Evaluation Feedback
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {Object.keys(feedback.feedback).map((key) => (
                <div
                  key={key}
                  className="p-6 bg-slate-800 rounded-xl border border-slate-700 hover:scale-[1.03] transition shadow-lg"
                >
                  <span className="font-semibold block mb-2 text-indigo-400">{key.replace(/([A-Z])/g, " $1")}</span>
                  <p className="text-slate-300 text-sm">{feedback.feedback[key]}</p>
                </div>
              ))}
            </div>
            <div className="p-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl text-center font-bold text-white shadow-xl text-lg">
              {feedback.summary}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
