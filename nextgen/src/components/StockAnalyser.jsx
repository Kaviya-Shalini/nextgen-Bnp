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
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function StockAnalyser() {
  const [stocks, setStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [parameters, setParameters] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);

  // Hardcoded chart data example (replace with backend values if needed)
  const sampleChartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    datasets: [
      {
        label: "Stock Price ($)",
        data: [145, 148, 147, 150, 152],
        borderColor: "rgba(99, 102, 241, 1)", // indigo-500
        backgroundColor: "rgba(99, 102, 241, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: { ticks: { color: "#cbd5e1" }, beginAtZero: false },
      x: { ticks: { color: "#cbd5e1" } },
    },
  };

  // Fetch all stock symbols
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/stocks")
      .then((res) => setStocks(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Fetch parameters for selected stock
  const handleStockClick = (symbol) => {
    setSelectedStock(symbol);
    setFeedback(null);
    axios
      .get(`http://localhost:8080/api/stocks/${symbol}/parameters`)
      .then((res) => setParameters(res.data))
      .catch((err) => console.error(err));
  };

  // Evaluate stock
  const handleEvaluate = () => {
    if (!selectedStock) return;
    setLoading(true);
    axios
      .post(`http://localhost:8080/api/stocks/${selectedStock}/evaluate`, parameters)
      .then((res) => setFeedback(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white p-8">
      <h1 className="text-5xl font-extrabold text-center mb-12">📊 Stock Evaluator</h1>

      {/* Stock Selection */}
      <div className="max-w-7xl mx-auto mb-12">
        <h2 className="text-2xl font-semibold mb-4">Select a Stock</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {stocks.length === 0 ? (
            <p className="text-slate-400 col-span-full text-center">Loading stocks...</p>
          ) : (
            stocks.map((stock) => (
              <button
                key={stock}
                onClick={() => handleStockClick(stock)}
                className={`px-4 py-2 rounded-xl border text-lg font-medium transition-all hover:scale-[1.05] transform ${
                  selectedStock === stock
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-transparent shadow-lg"
                    : "bg-slate-800 border-slate-700 hover:bg-slate-700"
                }`}
              >
                {stock}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Stock Parameters */}
      {selectedStock && (
        <div className="max-w-5xl mx-auto mb-12 bg-slate-800 p-8 rounded-3xl shadow-2xl border border-slate-700">
          <h3 className="text-3xl font-bold mb-6 text-center">{selectedStock} Parameters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.keys(parameters).map((key) => (
              <div
                key={key}
                className="p-4 bg-slate-900 rounded-xl border border-slate-700 flex justify-between items-center shadow-inner"
              >
                <span className="capitalize font-semibold">{key.replace(/([A-Z])/g, " $1")}</span>
                <span className="text-emerald-400 font-bold">{parameters[key]}</span>
              </div>
            ))}
          </div>

          {/* Evaluate Button */}
          <div className="flex justify-center mt-8">
            <button
              onClick={handleEvaluate}
              className="bg-gradient-to-r from-green-400 to-emerald-500 px-8 py-3 rounded-2xl font-bold shadow-lg hover:scale-[1.05] transform transition"
            >
              {loading ? "Evaluating..." : "Evaluate"}
            </button>
          </div>
        </div>
      )}

      {/* Chart */}
      {selectedStock && (
        <div className="max-w-4xl mx-auto mb-12 p-6 bg-slate-900 rounded-3xl shadow-2xl border border-slate-700">
          <h3 className="text-2xl font-bold text-center mb-4">{selectedStock} Price Chart</h3>
          <Line data={sampleChartData} options={chartOptions} />
        </div>
      )}

      {/* Evaluation Feedback */}
      {feedback && (
        <div className="max-w-5xl mx-auto bg-slate-900 p-8 rounded-3xl shadow-2xl border border-slate-700">
          <h3 className="text-3xl font-bold mb-6 text-center">Evaluation Feedback</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {Object.keys(feedback.feedback).map((key) => (
              <div
                key={key}
                className="p-4 bg-slate-800 rounded-xl border border-slate-700 shadow-inner"
              >
                <span className="font-semibold capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                <p className="text-slate-300 mt-1">{feedback.feedback[key]}</p>
              </div>
            ))}
          </div>

          <div className="p-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl text-white font-bold text-lg text-center">
            {feedback.summary}
          </div>
        </div>
      )}
    </div>
  );
}
