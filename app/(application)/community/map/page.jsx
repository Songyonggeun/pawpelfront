'use client';

import { useState, useEffect, useRef } from 'react';

const PLACES = [
  { id: 1, name: '제이투제이', lat: 37.506767, lng: 127.104987, address: '서울 송파구 백제고분로39길 22-17 CAFE J2J', phone: '0507-1326-5129' },
  { id: 2, name: '비터솔트 BitterSalt', lat: 37.509209, lng: 127.110520, address: '서울 송파구 백제고분로45길 5 2층', phone: '0507-1493-9402' },
  { id: 3, name: '피킹플레져', lat: 37.548852, lng: 127.045988, address: '서울 성동구 왕십리로14길 19-7 1층', phone: '0507-1403-1494' },
  { id: 4, name: '퍼먼트 서울숲점', lat: 37.546620, lng: 127.042686, address: '서울 성동구 서울숲2길 37 1층 , 지하', phone: '010-3911-0072' },
  { id: 5, name: '롤앤번', lat: 37.543648, lng: 127.051091, address: '서울 성동구 연무장길 14 1층 롤앤번', phone: '0507-1366-7421' },
  { id: 6, name: '카페시나몬', lat: 37.509106, lng: 127.104863, address: '서울 송파구 석촌호수로 258 101호 카페 시나몬', phone: '0507-1418-8812' },
  { id: 7, name: '로꼬르', lat: 37.500229, lng: 127.102191, address: '서울 송파구 가락로5길 8 우경빌딩 1층 101호', phone: '010-7433-5860' },
  { id: 8, name: '재해석 석촌점', lat: 37.507058, lng: 127.103310, address: '서울 송파구 백제고분로39길 33 2층', phone: '0507-1358-2418' },
  { id: 9, name: '모모 베이글', lat: 37.509693, lng: 127.054696, address: '서울 강남구 삼성로 535 1층 모모베이글', phone: '0507-1479-9335' },
  { id: 10, name: '토치커피 삼성점', lat: 37.509593, lng: 127.051916, address: '서울 강남구 봉은사로68길 41 1층', phone: '02-555-0224' },
  { id: 11, name: 'YISEULJAE 이슬재', lat: 37.519511, lng: 127.049285, address: '서울 강남구 학동로77길 10 1층 카페 이슬재', phone: '0507-1404-7738' },
  { id: 12, name: '포히어오어투고', lat: 37.505385, lng: 127.078842, address: '서울 송파구 도곡로64길 7 1층 포히어오어투고', phone: '0507-1441-6685' },
];

const districts = {
  서울: { lat: 37.5665, lng: 126.9780 },
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

function MapInformation() {
  const [selectedDistrict, setSelectedDistrict] = useState('서울');
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const infoWindowRef = useRef(null);

  const loadScript = (src, callback) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      callback();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = callback;
    document.head.appendChild(script);
  };

  const initMap = () => {
    const naver = window.naver;
    if (!naver || !document.getElementById('map')) return;

    const center = districts[selectedDistrict];
    const mapOptions = {
      center: new naver.maps.LatLng(center.lat, center.lng),
      zoom: 13,
    };

    mapRef.current = new naver.maps.Map('map', mapOptions);
    infoWindowRef.current = new naver.maps.InfoWindow({ content: '' });

    renderMarkers();
  };

  useEffect(() => {
    loadScript(
      `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_MAP_KEY}`,
      initMap
    );
  }, []);

  useEffect(() => {
    renderMarkers();
  }, [selectedDistrict]);

  const renderMarkers = () => {
    const naver = window.naver;
    if (!mapRef.current) return;

    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    const filteredPlaces = getFilteredPlaces();

    filteredPlaces.forEach((place) => {
      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(place.lat, place.lng),
        map: mapRef.current,
        icon: {
          url: '/paw-print.png',
          size: new naver.maps.Size(32, 32),
          anchor: new naver.maps.Point(16, 32),
        },
      });

      naver.maps.Event.addListener(marker, 'click', () => {
        infoWindowRef.current.setContent(`
          <div style="padding:10px; max-width:250px; font-size:14px;">
            <strong style="font-size:16px;">${place.name}</strong><br />
            <span>${place.address}</span><br />
            <a href="tel:${place.phone}" style="color:blue;">${place.phone}</a>
          </div>
        `);
        infoWindowRef.current.open(mapRef.current, marker);
        mapRef.current.setCenter(marker.getPosition());
        mapRef.current.setZoom(15);
      });

      markersRef.current.push(marker);
    });

    const center = districts[selectedDistrict];
    if (center) {
      mapRef.current.setCenter(new naver.maps.LatLng(center.lat, center.lng));
      mapRef.current.setZoom(13);
    }
  };

  const getFilteredPlaces = () =>
    selectedDistrict === '서울'
      ? PLACES
      : PLACES.filter((place) => place.address.includes(selectedDistrict));

  return (
    <div className="max-w-[1100px] p-4 justify-center mx-auto">
      <h2 className="text-lg font-bold mb-4">서울 애견동반 카페</h2>
      <div className="w-auto">
        {/* 구 선택 버튼 */}
        <div className="flex flex-wrap gap-2 p-4 bg-white border-b">
          {Object.keys(districts).map((district) => (
            <button
              key={district}
              onClick={() => setSelectedDistrict(district)}
              className={`px-2 py-0.5 text-sm rounded-md border ${
                selectedDistrict === district
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-300 hover:text-black border-transparent'
              }`}
            >
              {district}
            </button>
          ))}
        </div>

        {/* 지도 */}
        <div id="map" className="w-full h-[400px]" />

        {/* 카페 카드 목록 */}
        <div className="mt-4 px-4 pb-8">
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {getFilteredPlaces().map((place, index) => (
              <li
                key={index}
                className="border border-gray-300 p-4 rounded-lg shadow-sm bg-white cursor-pointer hover:bg-gray-100 transition"
                onClick={() => {
                  const position = new window.naver.maps.LatLng(place.lat, place.lng);
                  mapRef.current.setCenter(position);
                  mapRef.current.setZoom(15);

                  const marker = new window.naver.maps.Marker({
                    position,
                    map: mapRef.current,
                    icon: {
                      url: '/paw-print.png',
                      size: new window.naver.maps.Size(32, 32),
                      anchor: new window.naver.maps.Point(16, 32),
                    },
                  });

                  infoWindowRef.current.setContent(`
                    <div style="padding:10px; max-width:250px; font-size:14px; line-height:1.6;">
                      <div style="font-size:16px;">🏠 <strong>${place.name}</strong></div>
                      <div>📍 ${place.address}</div>
                      <div>📞 <a href="tel:${place.phone}" style="color:#2563eb; text-decoration:none;">${place.phone}</a></div>
                    </div>
                  `);
                  infoWindowRef.current.open(mapRef.current, marker);
                }}
              >
                <h3 className="text-m font-semibold">{place.name}</h3>
                <p className="text-sm text-gray-600">{place.address}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default MapInformation;
