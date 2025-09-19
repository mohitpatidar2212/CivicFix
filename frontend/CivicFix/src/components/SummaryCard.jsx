const SummaryCard = ({ title, value, icon }) => {
  return (
    <div className="bg-white shadow-lg rounded-xl p-5 flex justify-between items-center">
      <div>
        <p className="text-gray-500">{title}</p>
        <h2 className="text-2xl font-bold text-gray-800">{value}</h2>
      </div>
      <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
        {icon}
      </div>
    </div>
  );
};

export default SummaryCard;
