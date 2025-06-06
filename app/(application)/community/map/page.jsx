'use client';

import { useState, useEffect, useRef } from 'react';

function MapInformation() {
  const [latitude, setLatitude] = useState(37.3595704);
  const [longitude, setLongitude] = useState(127.105399);
  const [searchTerm, setSearchTerm] = useState('');
  const [places, setPlaces] = useState([]);
  const mapRef = useRef(null);
  const markersRef = useRef([]);

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

    const mapOptions = {
      center: new naver.maps.LatLng(latitude, longitude),
      zoom: 13,
      zoomControl: true,
      zoomControlOptions: {
        style: naver.maps.ZoomControlStyle.SMALL,
        position: naver.maps.Position.TOP_RIGHT,
      },
    };

    mapRef.current = new naver.maps.Map('map', mapOptions);

    // 초기 마커 (선택 사항)
    new naver.maps.Marker({
      position: new naver.maps.LatLng(latitude, longitude),
      map: mapRef.current,
    });
  };

  useEffect(() => {
    if (typeof window.naver === 'undefined') {
      loadScript(
        `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_MAP_KEY}`,
        initMap
      );
    } else {
      initMap();
    }
  }, []);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    try {
      const res = await fetch(`/api/searchPlace?query=${encodeURIComponent(searchTerm)}`);
      const data = await res.json();

      const items = data.items.map((item, idx) => ({
        id: idx,
        name: item.title.replace(/<[^>]*>?/g, ''),
        lat: parseFloat(item.mapy),
        lng: parseFloat(item.mapx),
        address: item.roadAddress || item.address,
      }));

      setPlaces(items);
      renderMarkers(items);
    } catch (err) {
      console.error('검색 실패:', err);
    }
  };

  const renderMarkers = (places) => {
    if (!mapRef.current) return;

    const naver = window.naver;

    // 기존 마커 제거
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    places.forEach((place) => {
      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(place.lat, place.lng),
        map: mapRef.current,
      });

      const infoWindow = new naver.maps.InfoWindow({
        content: `<div style="padding:5px;">${place.name}</div>`,
      });

      naver.maps.Event.addListener(marker, 'click', () => {
        infoWindow.open(mapRef.current, marker);
        mapRef.current.setCenter(new naver.maps.LatLng(place.lat, place.lng));
        mapRef.current.setZoom(15);
      });

      markersRef.current.push(marker);
    });

    // 첫 장소로 이동
    if (places.length > 0) {
      const first = places[0];
      mapRef.current.setCenter(new naver.maps.LatLng(first.lat, first.lng));
      mapRef.current.setZoom(15);
    }
  };

  return (
    <div className="w-full">
      <div className="p-4 flex gap-2 bg-white border-b">
        <input
          type="text"
          placeholder="장소명을 입력하세요"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSearch();
          }}
          className="flex-1 p-2 border rounded"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          검색
        </button>
      </div>

      <div id="map" className="w-full h-[500px]" />

      <div className="p-4 bg-gray-50">
        {places.map((place) => (
          <div
            key={place.id}
            className="mb-3 p-3 bg-white rounded shadow hover:bg-gray-100 cursor-pointer"
            onClick={() => {
              const naver = window.naver;
              const latLng = new naver.maps.LatLng(place.lat, place.lng);
              mapRef.current.setCenter(latLng);
              mapRef.current.setZoom(15);
            }}
          >
            <div className="font-bold">{place.name}</div>
            <div className="text-sm text-gray-600">{place.address}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MapInformation;
