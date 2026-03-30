"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  BarChart, Bar, PieChart, Pie, Cell,
  AreaChart, Area
} from "recharts";
import Link from "next/link";

const COLORS = ["#00eaff", "#0ea5e9", "#0284c7"];

export default function RealTimeDashboard() {

  const [threats, setThreats] = useState(15);
  const [visibility, setVisibility] = useState(75);
  const [risk, setRisk] = useState("Low");
  const [accuracy, setAccuracy] = useState(0.88);
  const [statusMsg, setStatusMsg] = useState("System stable. Monitoring environment.");
  const [loading, setLoading] = useState(false);

  const [lineData, setLineData] = useState([
    { t: "1", v: 70 },
    { t: "2", v: 75 },
    { t: "3", v: 72 },
    { t: "4", v: 80 },
  ]);

  const [barData, setBarData] = useState([
    { name: "Scan 1", value: 5 },
    { name: "Scan 2", value: 8 },
    { name: "Scan 3", value: 6 },
    { name: "Scan 4", value: 9 },
  ]);

  const [visibilityData, setVisibilityData] = useState([
    { t: "1", v: 70 },
    { t: "2", v: 72 },
    { t: "3", v: 68 },
    { t: "4", v: 75 },
  ]);

  const [pieData, setPieData] = useState([
    { name: "Safe", value: 60 },
    { name: "Moderate", value: 25 },
    { name: "High Risk", value: 15 },
  ]);

  // 🔄 SIMULATION
  useEffect(() => {
    const interval = setInterval(() => {

      setThreats((t) => t + Math.floor(Math.random() * 2));

      setVisibility((v) =>
        Math.max(60, Math.min(90, v + (Math.random() * 4 - 2)))
      );

      const risks = ["Low", "Medium", "High"];
      const newRisk = risks[Math.floor(Math.random() * 3)];
      setRisk(newRisk);

      if (newRisk === "High") {
        setStatusMsg("⚠ High risk detected. Immediate attention required.");
      } else if (newRisk === "Medium") {
        setStatusMsg("⚠ Moderate anomalies detected.");
      } else {
        setStatusMsg("System stable. Monitoring environment.");
      }

      setLineData((prev) =>
        prev.map((d) => ({
          ...d,
          v: Math.max(60, Math.min(95, d.v + (Math.random() * 5 - 2)))
        }))
      );

      setBarData((prev) =>
        prev.map((d) => ({
          ...d,
          value: Math.max(3, Math.min(12, d.value + (Math.random() * 3 - 1)))
        }))
      );

      setVisibilityData((prev) =>
        prev.map((d) => ({
          ...d,
          v: Math.max(60, Math.min(90, d.v + (Math.random() * 3 - 1)))
        }))
      );

    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // 🚀 GENERATE REPORT FUNCTION
  const generateReport = async () => {
    try {
      setLoading(true);

      const data = {
        threats,
        visibility,
        risk,
        accuracy,
        barData,
        lineData,
        pieData
      };

      const res = await fetch("http://localhost:8000/generate-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url);

    } catch (err) {
      console.error("Report generation failed", err);
    } finally {
      setLoading(false);
    }
  };

  // 🎯 TOOLTIP
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: "#020617",
          padding: "10px",
          border: "1px solid #00eaff",
          borderRadius: "8px"
        }}>
          <p>{label}</p>
          <p style={{ color: "#00eaff" }}>
            Value: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  // 🥧 PIE TOOLTIP
  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div style={{
          background: "#020617",
          padding: "10px",
          border: "1px solid #00eaff",
          borderRadius: "8px"
        }}>
          <p style={{ color: "#00eaff" }}>{data.name}</p>
          <p>{data.value}% of system state</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="container">

      {/* TOP BAR */}
      <div className="topBar">
        <Link href="/" className="backBtn">
          ← Back to Home
        </Link>

        <button onClick={generateReport} className="reportBtn">
          {loading ? "Generating..." : "Generate AI Report"}
        </button>
      </div>

      {/* HERO */}
      <div className="hero">
        <h1>
          Real-Time <span>Marine Intelligence</span>
        </h1>
        <p>AI-powered underwater monitoring & threat detection system</p>
      </div>

      {/* METRICS */}
      <div className="metrics">
        <div className="card glow">
          <h4>Total Threats</h4>
          <motion.h2>{threats}</motion.h2>
        </div>

        <div className="card">
          <h4>Visibility</h4>
          <motion.h2>{visibility}%</motion.h2>
        </div>

        <div className="card">
          <h4>Accuracy</h4>
          <motion.h2>{(accuracy * 100).toFixed(1)}%</motion.h2>
        </div>

        <div className={`card ${risk === "High" ? "danger" : ""}`}>
          <h4>Risk</h4>
          <motion.h2>{risk}</motion.h2>
        </div>
      </div>

      {/* GRID */}
      <div className="grid">

        <div className="card">
          <h3>Detection Confidence Trend</h3>
          <AreaChart width={350} height={220} data={lineData}>
            <XAxis dataKey="t" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="v" stroke="#00eaff" fill="#00eaff33" />
          </AreaChart>
        </div>

        <div className="card">
          <h3>Objects Detected per Scan</h3>
          <BarChart width={350} height={220} data={barData}>
            <XAxis dataKey="name" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" fill="#00eaff" />
          </BarChart>
        </div>

        <div className="card">
          <h3>Water Visibility Trend</h3>
          <LineChart width={350} height={220} data={visibilityData}>
            <XAxis dataKey="t" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="v" stroke="#00eaff" />
          </LineChart>
        </div>

        <div className="card">
          <h3>Risk Level Distribution</h3>
          <PieChart width={300} height={220}>
            <Pie data={pieData} dataKey="value" outerRadius={80}>
              {pieData.map((entry, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Pie>
            <Tooltip content={<PieTooltip />} />
          </PieChart>
        </div>

        <div className="card full">
          <h3>Live System Intelligence</h3>

          <motion.div
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ repeat: Infinity, duration: 2 }}
            style={{
              color: risk === "High" ? "red" : "#00eaff",
              fontWeight: "bold",
              fontSize: "16px"
            }}
          >
            {statusMsg}
          </motion.div>

          <div className="statusGrid">
            <span>✔ Sensors Active</span>
            <span>✔ AI Model Running</span>
            <span>✔ Data Streaming</span>
            <span>Latency: 0.4s</span>
          </div>
        </div>

      </div>

      <style jsx>{`
        .container {
          background: #020617;
          min-height: 100vh;
          padding: 30px;
          color: white;
        }

        .topBar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .backBtn {
          color: #00eaff;
          font-weight: bold;
          text-decoration: none;
          border: 1px solid #00eaff;
          padding: 8px 16px;
          border-radius: 20px;
          transition: 0.3s;
        }

        .backBtn:hover {
          background: #00eaff;
          color: #020617;
        }

        .reportBtn {
          background: #00eaff;
          color: #020617;
          font-weight: bold;
          padding: 10px 18px;
          border-radius: 25px;
          border: none;
          cursor: pointer;
          transition: 0.3s;
          box-shadow: 0 0 20px rgba(0,234,255,0.4);
        }

        .reportBtn:hover {
          background: #22d3ee;
          transform: scale(1.05);
        }

        .hero h1 {
          font-size: 48px;
          font-weight: 800;
        }

        .hero span {
          color: #00eaff;
          text-shadow: 0 0 20px rgba(0,234,255,0.7);
        }

        .metrics {
          display: grid;
          grid-template-columns: repeat(4,1fr);
          gap: 15px;
          margin: 30px 0;
        }

        .grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .full {
          grid-column: span 2;
        }

        .card {
          background: rgba(15,23,42,0.8);
          padding: 20px;
          border-radius: 16px;
          border: 1px solid rgba(0,234,255,0.1);
        }

        .glow {
          box-shadow: 0 0 20px rgba(0,234,255,0.3);
        }

        .danger {
          box-shadow: 0 0 20px red;
        }

        .statusGrid {
          margin-top: 15px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
}