import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NextGenHome from "./components/NextGenHome";
import StockAnalyser from "./components/StockAnalyser";
import PortfolioAnalyser from "./components/PortfolioAnalyser";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<NextGenHome />} />
        <Route path="/stock" element={<StockAnalyser />} />
        <Route path="/portfolio" element={<PortfolioAnalyser />} />
      </Routes>
    </Router>
  );
}
