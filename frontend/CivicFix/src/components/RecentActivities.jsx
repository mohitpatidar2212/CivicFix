const activities = [
  "User John submitted a new request",
  "Task #23 completed by Admin",
  "New report generated for March",
  "User Alice updated profile",
];

const RecentActivities = () => {
  return (
    <div className="bg-white shadow-lg rounded-xl p-5">
      <h3 className="text-gray-700 font-semibold mb-4">Recent Activities</h3>
      <ul className="list-disc list-inside space-y-2 text-gray-600">
        {activities.map((act, idx) => (
          <li key={idx}>{act}</li>
        ))}
      </ul>
    </div>
  );
};

export default RecentActivities;
