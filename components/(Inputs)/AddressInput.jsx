const AddressInput = ({ address, setAddress }) => {
  return (
    <div>
      <label className="block mb-1 text-gray-700 font-medium">주소</label>
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        required
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="주소를 입력하세요"
      />
    </div>
  );
};

export default AddressInput;
