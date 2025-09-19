import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api/apiClient";

const ResolvedCasesPage = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResolved = async () => {
      try {
        const res = await api.get("/reports/reports/official/resolved");
        const data = res.data;
        setCases(data);
      } catch (err) {
        console.error("Error fetching resolved cases:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResolved();
  }, []);

  return (
    <div className="min-h-screen mt-6">
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Resolved Cases</h1>

        {loading ? (
          <p>Loading resolved cases...</p>
        ) : cases.length === 0 ? (
          <p className="text-gray-600">No resolved cases yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {cases.map((c) => (
              <div
                key={c.id}
                className="bg-white shadow-md rounded-lg p-4 border"
              >
                <h2 className="text-lg font-semibold">{c.title}</h2>
                <p className="text-gray-600 mt-2">{c.description}</p>
                <p className="text-sm mt-1">
                  <strong>Status:</strong>{" "}
                  <span className="text-green-600">{c.status}</span>
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  <strong>Resolved On:</strong>{" "}
                  {new Date(c.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResolvedCasesPage;
