import React, { useState, useEffect } from "react";
import api from "../api/apiClient";

const Profile = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    profile_photo: null,
  });
  const [preview, setPreview] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch user info from localStorage or API
    const storedName = localStorage.getItem("name");
    const storedRole = localStorage.getItem("role");
    const user = JSON.parse(localStorage.getItem("user"));
    console.log(user)

    setUser({
      name: storedName || "",
      email: user.email || "",
      phone: user.phone || "",
      role: storedRole || "",
      profile_photo: null,
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUser({ ...user, profile_photo: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      let payload = { ...user };

      if (user.profile_photo) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          payload.profile_base64 = reader.result.split(",")[1];
          payload.profile_type = user.profile_photo.type;
          await saveProfile(payload);
        };
        reader.readAsDataURL(user.profile_photo);
      } else {
        await saveProfile(payload);
      }
    } catch (err) {
      setError(err.message || "Update failed");
      setLoading(false);
    }
  };

  const saveProfile = async (payload) => {
    try {
      // Replace with your API endpoint
      await api.put("/users/profile", payload);
      setSuccess("Profile updated successfully ✅");
    } catch (err) {
      setError(err.response?.data?.detail || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mt-6">
      <h2 className="text-2xl font-bold mb-6">My Profile</h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 flex flex-col md:flex-row gap-6"
      >
        {/* Left Panel: Photo */}
        <div className="flex flex-col items-center md:w-1/3">
          <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-blue-600 mb-4">
            {preview ? (
              <img
                src={preview}
                alt="Profile Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                No Photo
              </div>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="text-sm"
          />
        </div>

        {/* Right Panel: Details */}
        <div className="flex-1 space-y-4">
          {success && <div className="text-green-600">{success}</div>}
          {error && <div className="text-red-600">{error}</div>}

          <div>
            <label className="block text-gray-700 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Phone</label>
            <input
              type="text"
              name="phone"
              value={user.phone}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Role</label>
            <input
              type="text"
              name="role"
              value={user.role}
              disabled
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Profile;
