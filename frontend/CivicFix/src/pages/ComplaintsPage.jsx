import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api/apiClient";

const ComplaintsPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await api.get("/reports/reports/official/complaints");
        const data = res.data
        setComplaints(data);
      } catch (err) {
        console.error("Error fetching complaints:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  return (
    <div className="min-h-screen mt-6">
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Citizen Complaints</h1>

        {loading ? (
          <p>Loading complaints...</p>
        ) : complaints.length === 0 ? (
          <p className="text-gray-600">No pending complaints.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {complaints.map((c) => (
                <div key={c.id} className="bg-white shadow-md rounded-lg p-4 border">
                    <h2 className="text-lg font-semibold">{c.title}</h2>
                    <p className="text-gray-600 mt-2">{c.description}</p>

                    {/* Media rendering */}
                    {c.media_url && (
                        <div className="mt-4">
                            <h3 className="text-sm font-medium text-gray-700 mb-2">
                                {c.media_type.startsWith("image") ? "Complaint Image" : "Complaint Video"}
                            </h3>
                            {c.media_type.startsWith("image") ? (
                                <img
                                    src={c.media_url}
                                    alt="Complaint"
                                    className="w-full h-48 object-cover rounded-md"
                                />
                            ) : c.media_type.startsWith("video") ? (
                                <video
                                    src={c.media_url}
                                    controls
                                    className="w-full h-48 rounded-md"
                                />
                            ) : null}
                        </div>
                    )}
                    <p className="text-sm text-gray-500 mt-2">
                        <strong>Reported By:</strong> {c.reporter_name || "Citizen"}
                    </p>
                    <p className="text-sm mt-1">
                        <strong>Status:</strong>{" "}
                        <span className="text-yellow-600">{c.status}</span>
                    </p>
                    <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                        Mark as Resolved
                    </button>
                </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintsPage;
