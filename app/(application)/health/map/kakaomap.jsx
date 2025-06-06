'use client';

import { useEffect, useRef, useState } from 'react';

export default function KakaoMap() {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState('전체');

  const districts = {
    강남구: { lat: 37.5172, lng: 127.0473 },
    강동구: { lat: 37.5302, lng: 127.1238 },
    강북구: { lat: 37.6396, lng: 127.0256 },
    강서구: { lat: 37.5509, lng: 126.8495 },
    관악구: { lat: 37.4781, lng: 126.9516 },
    광진구: { lat: 37.5384, lng: 127.0826 },
    구로구: { lat: 37.4955, lng: 126.8875 },
    금천구: { lat: 37.4603, lng: 126.9009 },
    노원구: { lat: 37.6542, lng: 127.0568 },
    도봉구: { lat: 37.6688, lng: 127.0471 },
    동대문구: { lat: 37.5744, lng: 127.0396 },
    동작구: { lat: 37.5124, lng: 126.9393 },
    마포구: { lat: 37.5663, lng: 126.9014 },
    서대문구: { lat: 37.5794, lng: 126.9368 },
    서초구: { lat: 37.4836, lng: 127.0326 },
    성동구: { lat: 37.5633, lng: 127.0367 },
    성북구: { lat: 37.5894, lng: 127.0167 },
    송파구: { lat: 37.5145, lng: 127.1056 },
    양천구: { lat: 37.5170, lng: 126.8665 },
    영등포구: { lat: 37.5264, lng: 126.8963 },
    용산구: { lat: 37.5324, lng: 126.9900 },
    은평구: { lat: 37.6176, lng: 126.9227 },
    종로구: { lat: 37.5731, lng: 126.9793 },
    중구: { lat: 37.5636, lng: 126.9970 },
    중랑구: { lat: 37.6063, lng: 127.0927 },
  };

  const hospitals = [
    {
      name: '예은동물의료센터',
      lat: 37.5196,
      lng: 127.0355,
      district: '강남구',
      tel: '02-529-5575',
      addr: '서울 강남구 학동로29길 5',
    },
    {
      name: '산들산들동물병원',
      lat: 37.5531,
      lng: 126.9566,
      district: '마포구',
      tel: '02-393-3588',
      addr: '서울 마포구 마포대로16길 7',
    },
    {
      name: '잠실ON동물의료센터',
      lat: 37.5138,
      lng: 127.1007,
      district: '송파구',
      tel: '02-418-0724',
      addr: '서울 송파구 올림픽로 76 J타워',
    },
    {
      name: '24시 수 동물병원',
      lat: 37.5244,
      lng: 126.8958,
      district: '영등포구',
      tel: '02-2676-7582',
      addr: '서울 영등포구 영등포로 85-1',
    },
    {
      name: '노원24시N동물의료센터',
      lat: 37.6550,
      lng: 127.0636,
      district: '노원구',
      tel: '02-919-0075',
      addr: '서울 노원구 노원로 408',
    },
  ];


  const filteredHospitals = selectedDistrict === '전체'
    ? hospitals
    : hospitals.filter(h => h.district === selectedDistrict);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://dapi.kakao.com/v2/maps/sdk.js?appkey=01e9946fcf20493c466a249e0a77d49b&autoload=false';
    script.async = true;

    script.onload = () => {
      window.kakao.maps.load(() => {
        const mapInstance = new window.kakao.maps.Map(mapRef.current, {
          center: new window.kakao.maps.LatLng(37.5665, 126.9780),
          level: 7,
        });
        setMap(mapInstance);
      });
    };

    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!map || !window.kakao) return;

    // 마커 제거를 위한 관리
    const markers = [];

    const bounds = new window.kakao.maps.LatLngBounds();

    filteredHospitals.forEach(hospital => {
      const position = new window.kakao.maps.LatLng(hospital.lat, hospital.lng);
      bounds.extend(position);

      const marker = new window.kakao.maps.Marker({
        position,
        map,
        title: hospital.name,
      });

      const infoWindow = new window.kakao.maps.InfoWindow({
        content: `
          <div style="
            padding:6px;
            font-size:13px;
            white-space:nowrap;
            max-width:none;
          ">
            ${hospital.name}
          </div>
        `,
      });

      window.kakao.maps.event.addListener(marker, 'click', () => {
        infoWindow.open(map, marker);
      });

      markers.push(marker);
    });

    if (selectedDistrict === '전체') {
      if (filteredHospitals.length > 0) {
        const center = new window.kakao.maps.LatLng(37.5665, 126.9780);
        map.setCenter(center);
        map.setLevel(6);
      }
    } else {
      const pos = districts[selectedDistrict];
      const center = new window.kakao.maps.LatLng(pos.lat, pos.lng);
      map.setCenter(center);
      map.setLevel(5);
    }

    return () => {
      // 기존 마커 제거
      markers.forEach(marker => marker.setMap(null));
    };
  }, [map, selectedDistrict]);

  return (
    <div className="max-w-[1100px] p-4 justify-center mx-auto">
      <h2 className="text-lg font-bold mb-4">서울 24시 동물병원</h2>

      <div className="mx-auto">
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setSelectedDistrict('전체')}
            className={`px-2 py-0.5 text-xs rounded-md border ${
              selectedDistrict === '전체'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-300 hover:text-black border-transparent'
            }`}
          >
            서울
          </button>
          {Object.keys(districts).map(d => (
            <button
              key={d}
              onClick={() => setSelectedDistrict(d)}
              className={`px-2 py-0.5 text-xs rounded-md border ${
                selectedDistrict === d
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-300 hover:text-black border-transparent'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-[1100px]" ref={mapRef} style={{ width: '100%', height: '500px', border: '1px solid #ccc' }} />
      <div className="mt-6">
        <h3 className="text-sm font-semibold mb-2">
          {selectedDistrict === '전체'
            ? '전체 병원 목록'
            : `${selectedDistrict} 병원 목록`}
        </h3>
        <ul className="space-y-2 text-xs text-gray-700">
          {filteredHospitals.map((h, index) => (
            <li key={index} className="p-1 hover:bg-gray-50 rounded">
              🏥 <span className="font-medium">{h.name}</span>
              <span className="ml-1 text-gray-500">({h.district})</span>
              <br />
              📞 {h.tel} <br />
              📍 {h.addr}
            </li>
          ))}
          {filteredHospitals.length === 0 && (
            <li className="text-gray-500 text-xs">해당 구에 등록된 병원이 없습니다.</li>
          )}
        </ul>
      </div>
      <div className="mt-10">
        <span className="text-xs space-y-10 text-gray-500">* 추후 타지역도 업데이트 예정입니다.</span>
      </div>
    </div>
  );
}
