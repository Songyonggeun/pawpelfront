    'use client';

    import { useState, useEffect, useRef } from 'react';

    const PLACES = [
    { id: 1, name: 'N동물의료센터 강북점', lat: 37.618355, lng: 127.029623, address: '서울 강북구 도봉로', phone: '02-984-0075' },
    { id: 2, name: '청담아이윌 24시 동물병원', lat: 37.519663, lng: 127.049190, address: '서울 강남구 청담동', phone: '02-6925-7021' },
    { id: 3, name: '와이즈 24시 동물병원', lat: 37.511230, lng: 127.023870, address: '서울 강남구 논현동', phone: '02-3446-8253' },
    { id: 4, name: '24시 SNC 동물 메디컬센터', lat: 37.497476, lng: 127.038908, address: '서울 강남구 논현동', phone: '02-562-7582' },
    { id: 5, name: '24시 애니동물병원', lat: 37.583963, lng: 127.019823, address: '서울 성북구 안암동', phone: '02-926-8275' },
    { id: 6, name: '24시 시유동물메디컬센터', lat: 37.519990, lng: 126.969858, address: '서울 용산구 이촌동', phone: '02-793-0075' },
    { id: 7, name: '24시 잠실ON동물의료센터', lat: 37.511579, lng: 127.079069, address: '서울 송파구 잠실동', phone: '0508-1496-0745' },
    { id: 8, name: 'VIP동물의료센터 성북점', lat: 37.592325, lng: 127.013544, address: '서울 성북구 동소문동', phone: '02-953-0075' },
    { id: 9, name: '24시 더케어동물의료센터', lat: 37.603334, lng: 127.147298, address: '경기도 구리시 수택동', phone: '031-516-8585' },
    { id: 10, name: '마음반려동물의료원', lat: 37.267472, lng: 127.026415, address: '경기도 수원시 팔달구', phone: '031-211-0975' },
    { id: 11, name: '24시 위너스 동물의료센터', lat: 37.658282, lng: 127.246152, address: '경기도 남양주시 호평동', phone: '031-511-7582' },
    { id: 12, name: '24시 송도 온 동물의료센터', lat: 37.388427, lng: 126.638564, address: '인천 연수구 송도동', phone: '0507-1472-7591' },
    ];

    const ITEMS_PER_PAGE = 10;

    function MapInformation() {
    const [latitude, setLatitude] = useState(37.3595704);
    const [longitude, setLongitude] = useState(127.105399);
    const [searchTerm, setSearchTerm] = useState('');
    const [places, setPlaces] = useState(PLACES);
    const [currentPage, setCurrentPage] = useState(1);

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

        if (!infoWindowRef.current) {
        infoWindowRef.current = new naver.maps.InfoWindow({ content: '' });
        }

        // 초기 마커 렌더링 (첫 페이지 아이템)
        renderMarkers(getCurrentPagePlaces());
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

    useEffect(() => {
        renderMarkers(getCurrentPagePlaces());
    }, [currentPage, places]);

    const getCurrentPagePlaces = () => {
        const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
        return places.slice(startIdx, startIdx + ITEMS_PER_PAGE);
    };

    const handleSearch = async () => {
        if (!searchTerm.trim()) return;
      
        try {
          const res = await fetch(`/api/searchPlace?query=${encodeURIComponent(searchTerm)}`);
          const data = await res.json();
      
          const convertedItems = await Promise.all(
            data.items.map(async (item, idx) => {
              const tm128 = new naver.maps.Point(parseFloat(item.mapx), parseFloat(item.mapy));
      
              // TM128 → 위경도로 변환
              const latlng = await new Promise((resolve) => {
                naver.maps.TransCoord.convert(
                  tm128,
                  naver.maps.TransCoord.TM128,
                  naver.maps.TransCoord.LatLng,
                  (result) => resolve(result)
                );
              });
      
              return {
                id: idx,
                name: item.title.replace(/<[^>]*>?/g, ''),
                lat: latlng.y,
                lng: latlng.x,
                address: item.roadAddress || item.address,
              };
            })
          );
      
          setPlaces(convertedItems);
          setCurrentPage(1);
        } catch (err) {
          console.error('검색 실패:', err);
        }
      };

    const renderMarkers = (placesToShow) => {
        if (!mapRef.current) return;

        const naver = window.naver;

        // 기존 마커 제거
        markersRef.current.forEach((marker) => marker.setMap(null));
        markersRef.current = [];

        placesToShow.forEach((place) => {
            const pawIcon = {
                url: '/paw-print.png',           // public 폴더에 두는 발바닥 아이콘 이미지 경로
                size: new naver.maps.Size(32, 32), // 아이콘 크기 (필요시 조절)
                origin: new naver.maps.Point(0, 0),
                anchor: new naver.maps.Point(16, 32), // 아이콘 기준점 (아래 중앙)
              };
              
              const marker = new naver.maps.Marker({
                  position: new naver.maps.LatLng(place.lat, place.lng),
                  map: mapRef.current,
                  icon: pawIcon,
              });

        naver.maps.Event.addListener(marker, 'click', () => {
            infoWindowRef.current.setContent(`<div style="padding:5px;">${place.name}</div>`);
            infoWindowRef.current.open(mapRef.current, marker);
            mapRef.current.setCenter(new naver.maps.LatLng(place.lat, place.lng));
            mapRef.current.setZoom(15);
        });

        markersRef.current.push(marker);
        });

        if (placesToShow.length > 0) {
        const first = placesToShow[0];
        mapRef.current.setCenter(new naver.maps.LatLng(first.lat, first.lng));
        mapRef.current.setZoom(15);

        infoWindowRef.current.setContent(`<div style="padding:5px;">${first.name}</div>`);
        infoWindowRef.current.open(mapRef.current, markersRef.current[0]);
        }
    };

    const totalPages = Math.ceil(places.length / ITEMS_PER_PAGE);

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

        <div id="map" className="w-full h-[500px] mx-auto" />

        <div className="p-4 bg-gray-50 grid grid-cols-2 gap-4">
            {getCurrentPagePlaces().map((place) => (
            <div
                key={place.id}
                className="p-3 bg-white rounded shadow hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                const naver = window.naver;
                const latLng = new naver.maps.LatLng(place.lat, place.lng);
                mapRef.current.setCenter(latLng);
                mapRef.current.setZoom(15);

                if (infoWindowRef.current) {
                    infoWindowRef.current.setContent(`<div style="padding:5px;">${place.name}</div>`);

                    // 마커 찾기 (위치 일치하는 마커)
                    const marker = markersRef.current.find((m) => {
                    const pos = m.getPosition();
                    return pos.lat() === place.lat && pos.lng() === place.lng;
                    });
                    if (marker) {
                    infoWindowRef.current.open(mapRef.current, marker);
                    }
                }
                }}
            >
                <div className="font-bold">{place.name}</div>
                <div className="text-sm text-gray-600">{place.address}</div>
                {place.phone && (
                <div className="text-sm text-gray-600">전화: {place.phone}</div>
                )}
            </div>
            ))}
        </div>

        <div className="flex justify-center items-center gap-4 my-4">
            <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
            >
            이전
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
            <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded ${
                currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}
            >
                {i + 1}
            </button>
            ))}

            <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
            >
            다음
            </button>
        </div>
        </div>
    );
    }

    export default MapInformation;
