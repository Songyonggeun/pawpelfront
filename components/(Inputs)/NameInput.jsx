"use client";

const NameInput = ({ name, setName }) => {
  return (
    <div>
      <label className="block mb-1 text-gray-700 font-medium">이름</label>
      <input
        type="text"
        value={name}
        name = "name"
        onChange={(e) => setName(e.target.value)}
        required
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="이름을 입력하세요"
      />
    </div>
  );
};

export default NameInput;
