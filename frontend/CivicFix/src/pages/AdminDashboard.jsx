export default function AdminDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-blue-700">Municipal Dashboard</h1>
      <div className="grid grid-cols-3 gap-6 mt-6">
        <div className="bg-white shadow rounded-lg p-6">🚧 Reported Issues</div>
        <div className="bg-white shadow rounded-lg p-6">📊 Analytics</div>
        <div className="bg-white shadow rounded-lg p-6">👥 Citizens</div>
      </div>
    </div>
  );
}
