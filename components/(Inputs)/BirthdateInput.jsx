const BirthdateInput = ({ birthDate, setBirthDate }) => {
  return (
    <div>
      <label className="block mb-1 text-gray-700 font-medium">생년월일</label>
      <input
        type="date"
        value={birthDate || ""}
        onChange={(e) => setBirthDate(e.target.value)}
        max={new Date().toISOString().split("T")[0]}
        required
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
};

export default BirthdateInput;
