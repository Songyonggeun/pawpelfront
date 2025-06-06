'use client';

import React, { useEffect } from 'react';

const KakaoMap = () => {
  useEffect(() => {
    // 스크립트 동적 로드
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false`;
    script.async = true;

    script.onload = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById('map');
        const options = {
          center: new window.kakao.maps.LatLng(37.5665, 126.9780), // 서울
          level: 5,
        };

        const map = new window.kakao.maps.Map(container, options);

        const hospitals = [
          {
            name: '서울동물메디컬센터',
            lat: 37.5265,
            lng: 127.0396,
          },
          {
            name: '24시 해마루동물병원',
            lat: 37.4957,
            lng: 127.124,
          },
          {
            name: 'VIP동물의료센터',
            lat: 37.4786,
            lng: 127.1453,
          },
        ];

        hospitals.forEach((hospital) => {
          const marker = new window.kakao.maps.Marker({
            map,
            position: new window.kakao.maps.LatLng(hospital.lat, hospital.lng),
            title: hospital.name,
          });

          const infowindow = new window.kakao.maps.InfoWindow({
            content: `<div style="padding:6px;font-size:14px;">${hospital.name}</div>`,
          });

          window.kakao.maps.event.addListener(marker, 'click', () => {
            infowindow.open(map, marker);
          });
        });
      });
    };

    document.head.appendChild(script);
  }, []);

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">24시간 동물병원 위치</h2>
      <div id="map" style={{ width: '100%', height: '500px' }} />
    </div>
  );
};

export default KakaoMap;
