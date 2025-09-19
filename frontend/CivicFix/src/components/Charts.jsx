import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const data = [
  { name: "Jan", requests: 30 },
  { name: "Feb", requests: 45 },
  { name: "Mar", requests: 60 },
  { name: "Apr", requests: 50 },
  { name: "May", requests: 70 },
];

const Charts = () => {
  return (
    <div className="bg-white shadow-lg rounded-xl p-5">
      <h3 className="text-gray-700 font-semibold mb-4">Request Trends</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="requests" stroke="#3182ce" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Charts;
