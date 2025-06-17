// 출석체크 및 미션 완료 포인트 적립
'use client';

import { useEffect, useState } from 'react';

export default function MissionAttendancePage() {
  const [user, setUser] = useState(null);
  const [missionStatus, setMissionStatus] = useState('');
  const [attendanceStatus, setAttendanceStatus] = useState('');
  const [selectedMissions, setSelectedMissions] = useState([]);

  const missionList = [
    { key: 'WALK', label: '🐕 산책하기' },
    { key: 'WATER', label: '💧 물 마시기' },
    { key: 'FOOD', label: '🍖 제시간에 밥 먹기' },
    { key: 'TOOTH', label: '🪥 양치하기' },
    { key: 'PLAY', label: '🩺 놀이시간 갖기' },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/user/info`, {
        credentials: 'include',
      });
      const data = await res.json();
      setUser(data);
    };
    fetchUser();
  }, []);

  const handleMissionCheck = (key) => {
    setSelectedMissions((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const submitMission = async () => {
    if (!user) return;

    if (selectedMissions.length === 0) {
    alert('미션을 1개 이상 선택해주세요!');
    return;
  }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/api/points/mission/complete`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ userId: user.id, missions: selectedMissions.join(',') }),
      });
      const msg = await res.text(); 
      setMissionStatus(msg);


      // ✅ 포인트 재조회
      const userRes = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/user/info`, {
        credentials: 'include',
      });
      const updatedUser = await userRes.json();
      setUser(updatedUser);
    } catch (err) {
      console.error(err);
      setMissionStatus('미션 포인트 적립 실패');
    }
  };

  const submitAttendance = async () => {
    if (!user) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/api/points/attendance`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ userId: user.id }),
      });
      const msg = await res.text();
      setAttendanceStatus(msg);

      // ✅ 포인트 재조회
      const userRes = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/user/info`, {
        credentials: 'include',
      });
      const updatedUser = await userRes.json();
      setUser(updatedUser);
    } catch (err) {
      console.error(err);
      setAttendanceStatus('출석체크 실패');
    }
  };

  if (!user) return <div className="p-6 text-center">유저 정보를 불러오는 중...</div>;

  return (
    <div className="p-6 max-w-xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-center text-black-700">🐾 오늘의 포인트 챌린지</h1>

      {/* 💰 포인트 표시 박스 */}
      <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-xl p-4 text-center shadow-sm">
        <p className="text-sm font-semibold mb-1">현재 보유 포인트</p>
        <p className="text-3xl font-bold">{user.point?.toLocaleString() || 0} P</p>
      </div>

      {/* 🟢 미션 박스 */}
      <section className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">✅ 오늘의 미션</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {missionList.map((m) => (
                <label
                className={`flex items-center justify-start px-4 py-3 rounded-md shadow-sm border cursor-pointer transition 
                ${selectedMissions.includes(m.key)
                ? 'bg-green-100 border-green-400 text-green-800 font-semibold'
                : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                onClick={() => handleMissionCheck(m.key)}
            >
            <span className="text-base">{m.label}</span>
            </label>

                ))}
        </div>

        <button
          onClick={submitMission}
          className="mt-6 w-full py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition"
        >
          미션 포인트 적립하기
        </button>
        {missionStatus && <p className="mt-3 text-center text-sm text-gray-700">{missionStatus}</p>}
      </section>

      {/* 🔵 출석 체크 박스 */}
      <section className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">📅 출석 체크</h2>
        <button
          onClick={submitAttendance}
          className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition"
        >
          오늘 출석하기
        </button>
        {attendanceStatus && <p className="mt-3 text-center text-sm text-gray-700">{attendanceStatus}</p>}
      </section>
    </div>
  );
}
