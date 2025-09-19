import React, { useState, useEffect } from "react";
import api from "../api/apiClient";

export default function ReportForm({ onSubmitted }) {
  const [report, setReport] = useState({
    title: "",
    description: "",
    category: "Road",
    urgency: "Medium",
    location: { lat: null, lng: null, address: "" },
    image_file: null,
  });

  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [cityName, setCityName] = useState("");
  const [locationFetched, setLocationFetched] = useState(false);

  function readFileAsBase64(file) {
    return new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload = () => res(reader.result.split(",")[1]);
      reader.onerror = rej;
      reader.readAsDataURL(file);
    });
  }

  // Try to auto-detect user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;

          setReport((prev) => ({
            ...prev,
            location: { ...prev.location, lat, lng },
          }));

          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
            );
            const data = await res.json();
            const city =
              data.address.city ||
              data.address.town ||
              data.address.village ||
              data.address.state ||
              "";
            setCityName(city);
            setReport((prev) => ({
              ...prev,
              location: { ...prev.location, address: city },
            }));
          } catch (err) {
            console.error("Failed to fetch city name:", err);
          } finally {
            setLocationFetched(true);
          }
        },
        (err) => {
          console.error("Geolocation error:", err);
          setLocationFetched(true); // mark as attempted
        }
      );
    } else {
      setLocationFetched(true);
    }
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setSuccess("");

    // Ensure location info
    if (!report.location.lat || !report.location.lng) {
      if (!cityName.trim()) {
        setErr("Please provide your city if location was not detected.");
        return;
      }
      // Use city name only if lat/lng unavailable
      setReport((prev) => ({
        ...prev,
        location: { ...prev.location, address: cityName },
      }));
    }

    setLoading(true);

    try {
      let payload = { ...report };
      if (report.image_file) {
        payload.image_base64 = await readFileAsBase64(report.image_file);
        payload.image_type = report.image_file.type;
      }

      await send(payload);
    } catch (err) {
      setErr(err.message || "Something went wrong");
      setLoading(false);
    }
  };

  async function send(payload) {
    try {
      console.log(payload);
      await api.post("/reports/reports/", payload);
      setSuccess("Report submitted successfully ✅");
      setReport({
        title: "",
        description: "",
        category: "Road",
        urgency: "Medium",
        location: { lat: null, lng: null, address: "" },
        image_file: null,
      });
      setPreview(null);
      setCityName("");
      onSubmitted && onSubmitted();
    } catch (e) {
      setErr(e.response?.data?.detail || "Submission failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="max-w-lg mx-auto space-y-4 p-6 bg-white shadow-md rounded-md mt-20"
    >
      <h2 className="text-xl font-bold">Report an Issue</h2>

      {err && <div className="text-red-600">{err}</div>}
      {success && <div className="text-green-600">{success}</div>}

      <input
        required
        placeholder="Short title"
        value={report.title}
        onChange={(e) => setReport({ ...report, title: e.target.value })}
        className="w-full p-2 border rounded"
      />

      <select
        value={report.category}
        onChange={(e) => setReport({ ...report, category: e.target.value })}
        className="w-full p-2 border rounded"
      >
        <option>Road</option>
        <option>Waste</option>
        <option>Lighting</option>
        <option>Others</option>
      </select>

      <select
        value={report.urgency}
        onChange={(e) => setReport({ ...report, urgency: e.target.value })}
        className="w-full p-2 border rounded"
      >
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>

      <textarea
        required
        placeholder="Describe the issue"
        value={report.description}
        onChange={(e) =>
          setReport({ ...report, description: e.target.value })
        }
        className="w-full p-2 border rounded"
        rows={4}
      />

      <input
        type="file"
        accept="image/*,video/*"
        onChange={(e) => {
          const file = e.target.files[0];
          setReport({ ...report, image_file: file });
          if (file) setPreview(URL.createObjectURL(file));
        }}
      />

      {preview && (
        <div className="mt-2">
          {report.image_file?.type.startsWith("video") ? (
            <video src={preview} controls className="max-h-40 rounded" />
          ) : (
            <img src={preview} alt="preview" className="max-h-40 rounded" />
          )}
        </div>
      )}

      {/* Location section */}
      <div className="p-2 border rounded bg-gray-100">
        {report.location.lat && report.location.lng ? (
          <>
            <p>
              <strong>Detected Location:</strong>{" "}
              {report.location.lat.toFixed(4)}, {report.location.lng.toFixed(4)}
            </p>
            {cityName && (
              <p>
                <strong>City:</strong> {cityName}
              </p>
            )}
          </>
        ) : (
          <>
            <p className="text-gray-600">
              Location not detected. Please enter your city:
            </p>
            <input
              required
              type="text"
              value={cityName}
              onChange={(e) => setCityName(e.target.value)}
              placeholder="Enter city"
              className="w-full p-2 border rounded mt-2"
            />
          </>
        )}
      </div>

      <div className="flex justify-end">
        <button
          disabled={loading || (!locationFetched && !cityName.trim())}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </form>
  );
}
