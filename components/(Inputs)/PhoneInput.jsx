const PhoneInput = ({ phone, setPhone }) => {
  const isPhoneValid = phone.match(/^(\d{3})-(\d{4})-(\d{4})$/);
  
  return (
    <div>
      <label className="block mb-1 text-gray-700 font-medium">전화번호</label>
      <input
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="전화번호를 입력하세요 (예: 010-1234-5678)"
      />
      {!isPhoneValid && phone && <p className="text-sm text-red-600">전화번호 형식이 올바르지 않습니다.</p>}
    </div>
  );
};

export default PhoneInput;
