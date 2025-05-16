const GenderInput = ({ gender, setGender }) => {
  return (
    <div>
      <label className="block mb-1 text-gray-700 font-medium">성별</label>
      <select
        value={gender}
        onChange={(e) => setGender(e.target.value)}
        required
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value="">성별 선택</option>
        <option value="male">남성</option>
        <option value="female">여성</option>
      </select>
    </div>
  );
};

export default GenderInput;
