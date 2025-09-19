import React, { useEffect, useState, useContext } from "react";
import api from "../api/apiClient"; // axios instance
import { AuthContext } from "../components/AuthContext";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

const Analytics = () => {
  const [statusData, setStatusData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [statusSummary, setStatusSummary] = useState({
    Submitted: 0,
    "In Progress": 0,
    Solved: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, token } = useContext(AuthContext);

  const COLORS = ["#FF8042", "#0088FE", "#00C49F", "#FFBB28", "#AA336A", "#FF6666"];

  useEffect(() => {
    if (!user || !token) return;

    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await api.get("/reports/reports/analytics");

        const { status_data, monthly_data, category_data } = res.data;

        // Status chart data
        setStatusData(
          Object.entries(status_data || {}).map(([key, value]) => ({ name: key, value }))
        );

        // Monthly complaints chart
        setMonthlyData(monthly_data || []);

        // Category chart data
        setCategoryData(
          category_data
            ? Object.entries(category_data).map(([key, value]) => ({ category: key, complaints: value }))
            : []
        );

        // Status summary
        setStatusSummary({
          Submitted: status_data?.Submitted || 0,
          "In Progress": status_data?.["In Progress"] || 0,
          Solved: status_data?.Solved || 0,
        });
      } catch (err) {
        console.error("Error fetching analytics:", err);
        setError("Failed to load analytics. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [user, token]);

  if (loading) {
    return (
      <div className="pt-20 px-6 text-center text-gray-600">
        <p>Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-20 px-6 text-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="pt-20 px-6">
      <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>

      {/* Summary Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {Object.entries(statusSummary).map(([key, value]) => (
          <div
            key={key}
            className={`p-6 rounded-xl shadow-md ${
              key === "Submitted"
                ? "bg-blue-100 text-blue-800"
                : key === "In Progress"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            <h2 className="text-lg font-semibold">{key}</h2>
            <p className="text-3xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Status Distribution */}
        <div className="bg-white shadow-md rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-4">Complaints Status</h2>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {statusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500">No status data available</p>
          )}
        </div>

        {/* Monthly Complaints */}
        <div className="bg-white shadow-md rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-4">Monthly Complaints</h2>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="complaints" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500">No monthly data available</p>
          )}
        </div>
      </div>

      {/* Complaints by Category */}
      {categoryData.length > 0 && (
        <div className="bg-white shadow-md rounded-xl p-4 mt-8">
          <h2 className="text-lg font-semibold mb-4">Complaints by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="complaints" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default Analytics;
