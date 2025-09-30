// src/components/NextGenHome.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LineChart, Briefcase } from "lucide-react";
import { Line } from "react-chartjs-2";
import axios from "axios";
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
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function NextGenHome() {
  const [portfolioData, setPortfolioData] = useState([]);

  // Fetch data from API endpoint
  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/stocks"); // Your backend endpoint
        setPortfolioData(response.data); // expects [{ day: "Mon", value: 22 }, ...]
      } catch (error) {
        console.error("Failed to fetch portfolio data:", error);
      }
    };
    fetchPortfolio();
  }, []);

  // Chart data
  const chartData = {
    labels: portfolioData.length ? portfolioData.map(d => d.day) : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Portfolio Value ($k)",
        data: portfolioData.length ? portfolioData.map(d => d.value) : [22, 23, 24, 23.5, 24.8, 25, 26],
        borderColor: "rgba(59, 130, 246, 1)",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: { ticks: { color: "#cbd5e1" } },
      x: { ticks: { color: "#cbd5e1" } },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-slate-100 antialiased">
      {/* HEADER */}
      <header className="max-w-7xl mx-auto p-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold leading-tight">NextGen Market Analyser</h1>
          <p className="text-slate-300 text-sm">AI-powered insights • Real-time signals • Simple dashboards</p>
        </div>
        <nav className="flex items-center gap-4">
          <a className="px-4 py-2 rounded-lg text-sm hover:bg-slate-700 transition">Features</a>
          <a className="px-4 py-2 rounded-lg text-sm hover:bg-slate-700 transition">Pricing</a>
          <a className="px-4 py-2 rounded-lg text-sm hover:bg-slate-700 transition">Docs</a>
          <button className="ml-2 bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-900 px-4 py-2 rounded-xl font-semibold shadow-lg hover:scale-[1.02] transform transition">
            Sign in
          </button>
        </nav>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* HERO */}
        <section className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Make smarter investments with clear, beautiful data
            </h2>
            <p className="mt-4 text-slate-300 text-lg max-w-xl">
              Clean signals, community-savvy metrics and an intelligent portfolio assistant that explains recommendations in plain English.
            </p>

            <div className="mt-8 flex gap-4">
              <button className="bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-3 rounded-2xl font-semibold shadow-lg hover:scale-[1.02] transform transition">
                Get started — it's free
              </button>
              <button className="px-6 py-3 rounded-2xl border border-slate-700 text-slate-200 hover:bg-slate-800 transition">
                Explore demo
              </button>
            </div>

            <div className="mt-8 flex gap-6 items-center">
              <div className="p-3 bg-slate-800 rounded-xl shadow-inner">
                <div className="text-xs text-slate-400">Avg. Signal Accuracy</div>
                <div className="text-2xl font-bold">87%</div>
              </div>
              <div className="p-3 bg-slate-800 rounded-xl shadow-inner">
                <div className="text-xs text-slate-400">Active Users</div>
                <div className="text-2xl font-bold">12.4k</div>
              </div>
              <div className="p-3 bg-slate-800 rounded-xl shadow-inner">
                <div className="text-xs text-slate-400">Integrations</div>
                <div className="text-2xl font-bold">30+</div>
              </div>
            </div>
          </div>

          {/* CHART CARD */}
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-700">
              <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-800">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="text-xs text-slate-400">Portfolio</div>
                    <div className="text-2xl font-semibold">Kaviya — Growth</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-emerald-400 font-medium">+3.9%</div>
                    <div className="text-xs text-slate-400">since last week</div>
                  </div>
                </div>

                <div className="h-44 bg-slate-900 rounded-lg p-2">
                  <Line data={chartData} options={chartOptions} />
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3 text-center text-xs text-slate-300">
                  <div>
                    <div className="font-semibold">$24.8k</div>
                    <div className="text-slate-400">Total value</div>
                  </div>
                  <div>
                    <div className="font-semibold">$2.1k</div>
                    <div className="text-slate-400">Today</div>
                  </div>
                  <div>
                    <div className="font-semibold">7</div>
                    <div className="text-slate-400">Holdings</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full bg-gradient-to-br from-pink-500 to-yellow-400 opacity-30 blur-3xl pointer-events-none"></div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="mt-14">
          <h3 className="text-2xl font-bold">Powerful features, crafted simply</h3>
          <p className="text-slate-300 mt-2">A toolkit for any trader: signals, social sentiment, automated alerts and easy exports.</p>

          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Smart Signals", desc: "Actionable entry/exit points with confidence scores." },
              { title: "Sentiment", desc: "Social signals, trending tickers and influencer heatmaps." },
              { title: "Backtests", desc: "Run historical tests on strategies in seconds." },
              { title: "Export", desc: "CSV, PDF and direct integrations with brokers." },
            ].map((f) => (
              <div key={f.title} className="p-6 bg-slate-800 rounded-2xl border border-slate-700 shadow-sm hover:scale-[1.02] transform transition">
                <div className="text-3xl mb-3">🔎</div>
                <div className="font-semibold">{f.title}</div>
                <div className="text-slate-400 mt-2 text-sm">{f.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-14 bg-gradient-to-r from-slate-700/40 to-slate-800/30 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between">
          <div>
            <div className="text-xl font-bold">Ready to see it in action?</div>
            <div className="text-slate-300 mt-2">Sign up free, import your portfolio, and try the advisor.</div>
          </div>
          <div className="mt-6 md:mt-0">
            <button className="bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-3 rounded-2xl font-semibold shadow-lg">Create account</button>
          </div>
        </section>

        {/* ANALYSER CARDS */}
        <section className="mt-16">
          <h3 className="text-2xl font-bold text-center">Choose Your Analyser</h3>
          <p className="text-slate-300 mt-2 text-center">Explore AI-powered tools tailored for traders and investors</p>

          <div className="mt-10 grid sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Link to="/stock">
              <div className="group relative p-8 rounded-3xl border border-slate-700 bg-gradient-to-br from-blue-600/20 to-indigo-800/20 hover:from-blue-600/40 hover:to-indigo-800/40 transition transform hover:scale-[1.03] hover:shadow-2xl cursor-pointer text-center">
                <LineChart className="w-14 h-14 text-blue-400 mb-4 mx-auto" />
                <h4 className="text-xl font-bold">Stock Analyser</h4>
              </div>
            </Link>

            <Link to="/portfolio">
              <div className="group relative p-8 rounded-3xl border border-slate-700 bg-gradient-to-br from-green-600/20 to-emerald-800/20 hover:from-green-600/40 hover:to-emerald-800/40 transition transform hover:scale-[1.03] hover:shadow-2xl cursor-pointer text-center">
                <Briefcase className="w-14 h-14 text-emerald-400 mb-4 mx-auto" />
                <h4 className="text-xl font-bold">Portfolio Analyser</h4>
              </div>
            </Link>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="mt-12 border-t border-slate-700 pt-8 pb-20">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="font-semibold">NextGen Market Analyser</div>
              <div className="text-slate-400 text-sm mt-2">Built for clarity. Designed for action.</div>
            </div>

            <div className="flex gap-6 text-sm text-slate-400">
              <div>Terms</div>
              <div>Privacy</div>
              <div>Contact</div>
            </div>
          </div>

          <div className="mt-8 text-slate-500 text-xs">© {new Date().getFullYear()} NextGen. Made with care.</div>
        </footer>
      </main>
    </div>
  );
}
