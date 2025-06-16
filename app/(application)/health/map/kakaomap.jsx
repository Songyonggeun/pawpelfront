"use client";

import { useEffect, useRef, useState } from "react";

export default function KakaoMap() {
    const mapRef = useRef(null);
    const [map, setMap] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState("전체");
    const infoWindowRef = useRef(null);
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
    const [pageGroup, setPageGroup] = useState(1); // 현재 페이지 그룹 (1-10, 11-20, 등)
    const hospitalsPerPage = 9; // 한 페이지에 표시할 병원 수

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
        양천구: { lat: 37.517, lng: 126.8665 },
        영등포구: { lat: 37.5264, lng: 126.8963 },
        용산구: { lat: 37.5324, lng: 126.99 },
        은평구: { lat: 37.6176, lng: 126.9227 },
        종로구: { lat: 37.5731, lng: 126.9793 },
        중구: { lat: 37.5636, lng: 126.997 },
        중랑구: { lat: 37.6063, lng: 127.0927 },
    };

    const hospitals = [
        // 강남구
        {
            name: "예은동물의료센터",
            lat: 37.5147,
            lng: 127.0312,
            district: "강남구",
            tel: "02-529-5575",
            addr: "서울 강남구 학동로29길 5",
            link: "https://place.map.kakao.com/17733573",
        },
        {
            name: "VIP동물의료센터 청담점",
            lat: 37.5195,
            lng: 127.049,
            district: "강남구",
            tel: "02-511-7522",
            addr: "서울 강남구 삼성로133길 7",
            link: "https://place.map.kakao.com/356547106",
        },
        {
            name: "OK동물병원",
            lat: 37.4956,
            lng: 127.0498,
            district: "강남구",
            tel: "02-569-7582",
            addr: "서울 강남구 도곡로51길 4",
            link: "https://place.map.kakao.com/713282068",
        },
        {
            name: "스마트동물병원 신사본점",
            lat: 37.5207,
            lng: 127.03,
            district: "강남구 ",
            tel: "02-549-0275",
            addr: "서울 강남구 도산대로 213",
            link: "https://place.map.kakao.com/24568431",
        },
        {
            name: "24시SNC동물메디컬센터",
            lat: 37.4974,
            lng: 127.0389,
            district: "강남구 ",
            tel: "02-562-7582",
            addr: "서울 강남구 논현로 416",
            link: "https://place.map.kakao.com/343159472",
        },
        {
            name: "VIP동물의료센터 청담점",
            lat: 37.5195,
            lng: 127.049,
            district: "강남구",
            tel: "02-511-7522",
            addr: "서울 강남구 삼성로133길 7",
            link: "https://place.map.kakao.com/356547106",
        },
        {
            name: "OK동물병원",
            lat: 37.4956,
            lng: 127.0498,
            district: "강남구",
            tel: "02-569-7582",
            addr: "서울 강남구 도곡로51길 4",
            link: "https://place.map.kakao.com/713282068",
        },
        {
            name: "스마트동물병원 신사본점",
            lat: 37.5207,
            lng: 127.03,
            district: "강남구",
            tel: "02-549-0275",
            addr: "서울 강남구 도산대로 213",
            link: "https://place.map.kakao.com/24568431",
        },
        {
            name: "24시SNC동물메디컬센터",
            lat: 37.4974,
            lng: 127.0389,
            district: "강남구",
            tel: "02-562-7582",
            addr: "서울 강남구 논현로 416",
            link: "https://place.map.kakao.com/343159472",
        },
        {
            name: "24시청담우리동물병원",
            lat: 37.5145,
            lng: 127.0529,
            district: "강남구",
            tel: "02-541-7515",
            addr: "서울 강남구 삼성로 614",
            link: "https://place.map.kakao.com/19883932",
        },
        {
            name: "와이즈24시동물병원",
            lat: 37.5113,
            lng: 127.0239,
            district: "강남구",
            tel: "02-3446-8253",
            addr: "서울 강남구 학동로6길 7",
            link: "https://place.map.kakao.com/19072093",
        },
        {
            name: "청담아이윌24시동물병원",
            lat: 37.5196,
            lng: 127.0492,
            district: "강남구",
            tel: "02-6925-7021",
            addr: "서울 강남구 삼성로133길 3",
            link: "https://place.map.kakao.com/24172268",
        },
        {
            name: "도곡치유동물병원",
            lat: 37.4924,
            lng: 127.04,
            district: "강남구",
            tel: "02-508-7678",
            addr: "서울 강남구 도곡로 189",
            link: "https://place.map.kakao.com/658963308",
        },
        {
            name: "대치동물메디컬센터",
            lat: 37.4994,
            lng: 127.0635,
            district: "강남구",
            tel: "02-501-8275",
            addr: "서울 강남구 도곡로 520",
            link: "https://place.map.kakao.com/339628146",
        },
        {
            name: "에이드동물병원",
            lat: 37.5212,
            lng: 127.0276,
            district: "강남구",
            tel: "02-545-4975",
            addr: "서울 강남구 논현로 813",
            link: "https://place.map.kakao.com/262637344",
        },
        // 강동구
        {
            name: "고덕24시동물병원",
            lat: 37.552,
            lng: 127.1558,
            district: "강동구",
            tel: "02-6227-8275",
            addr: "서울 강동구 동남로 877",
            link: "https://place.map.kakao.com/26809754",
        },
        {
            name: "로얄동물메디컬센터 강동",
            lat: 37.5341,
            lng: 127.1414,
            district: "강동구",
            tel: "02-457-0075",
            addr: "서울 강동구 천호대로 1171",
            link: "https://place.map.kakao.com/276576667",
        },
        {
            name: "강동24시 SKY동물의료센터",
            lat: 37.5343,
            lng: 127.136,
            district: "강동구",
            tel: "02-472-7579",
            addr: "서울 강동구 천호대로 1122",
            link: "https://place.map.kakao.com/442368263",
        },
        {
            name: "24시더파크동물의료센터",
            lat: 37.5284,
            lng: 127.1254,
            district: "강동구",
            tel: "02-6949-2475",
            addr: "서울 강동구 성내로 48",
            link: "https://place.map.kakao.com/1471880855",
        },
        // 강북구
        {
            name: "24시 루시드동물메디컬센터",
            lat: 37.6096,
            lng: 127.0307,
            district: "강북구",
            tel: "02-941-7900",
            addr: "서울 강북구 월계로 3",
            link: "https://place.map.kakao.com/1209060656",
        },
        {
            name: "24시 바른펫 동물의료센터",
            lat: 37.6414,
            lng: 127.0222,
            district: "강북구",
            tel: "02-903-7582",
            addr: "서울 강북구 노해로 65",
            link: "https://place.map.kakao.com/1407038689",
        },
        // 강서구
        {
            name: "24시마곡M동물의료센터",
            lat: 37.5686,
            lng: 126.8163,
            district: "강서구",
            tel: "02-2662-7515",
            addr: "서울 강서구 방화대로33길 3",
            link: "https://place.map.kakao.com/357483361",
        },
        {
            name: "24시연동물의료센터",
            lat: 37.5429,
            lng: 126.8423,
            district: "강서구",
            tel: "02-2605-7553",
            addr: "서울 강서구 화곡로 191",
            link: "https://place.map.kakao.com/276030777",
        },
        {
            name: "24시 강서젠틀리동물의료센터",
            lat: 37.559,
            lng: 126.8201,
            district: "강서구",
            tel: "02-2662-8111",
            addr: "서울 강서구 마곡중앙1로 72기",
            link: "https://place.map.kakao.com/2139268595",
        },
        {
            name: "24시율동물의료센터",
            lat: 37.5586,
            lng: 126.8327,
            district: "강서구",
            tel: "02-2135-5611",
            addr: "서울 강서구 공항대로 228",
            link: "https://place.map.kakao.com/1907537815",
        },
        {
            name: "강서YD동물의료센터",
            lat: 37.557,
            lng: 126.8522,
            district: "강서구",
            tel: "02-518-7500",
            addr: "서울 강서구 화곡로 371",
            link: "https://place.map.kakao.com/27465786",
        },
        {
            name: "마곡나무동물병원",
            lat: 37.559,
            lng: 126.8201,
            district: "강서구",
            tel: "02-2661-7515",
            addr: "서울 강서구 마곡중앙1로 72",
            link: "https://place.map.kakao.com/986942829",
        },
        // 관악구
        {
            name: "24시굿케어동물의료센터",
            lat: 37.48,
            lng: 126.9569,
            district: "관악구",
            tel: "02-6956-2475",
            addr: "서울 관악구 남부순환로 1861",
            link: "https://place.map.kakao.com/2057014950",
        },
        // 구로구
        {
            name: "24시지구촌 동물메디컬센터",
            lat: 37.4982,
            lng: 126.8859,
            district: "구로구",
            tel: "02-869-7582",
            addr: "서울 구로구 구로중앙로 107",
            link: "https://place.map.kakao.com/10775432",
        },
        {
            name: "24시메리트원동물의료센터",
            lat: 37.5032,
            lng: 126.8512,
            district: "구로구",
            tel: "02-2611-1925",
            addr: "서울 구로구 고척로 156",
            link: "https://place.map.kakao.com/1020922085",
        },
        {
            name: "24시명동물메디컬센터",
            lat: 37.5016,
            lng: 126.8472,
            district: "구로구",
            tel: "02-2619-5102",
            addr: "서울 구로구 남부순환로 775",
            link: "https://place.map.kakao.com/24807113",
        },
        // 금천구
        {
            name: "우리동물메디컬센터",
            lat: 37.4797,
            lng: 126.9047,
            district: "금천구",
            tel: "02-853-7582",
            addr: "서울 금천구 남부순환로 1386",
            link: "https://place.map.kakao.com/22454588",
        },
        {
            name: "금천24시K동물의료센터",
            lat: 37.4561,
            lng: 126.8996,
            district: "금천구",
            tel: "02-808-2475",
            addr: "서울 금천구 시흥대로 251",
            link: "https://place.map.kakao.com/270921004",
        },
        {
            name: "24시 글로리 동물병원",
            lat: 37.4767,
            lng: 126.8983,
            district: "금천구",
            tel: "02-855-8575",
            addr: "서울 금천구 시흥대로 483",
            link: "https://place.map.kakao.com/1458016012",
        },
        // 노원구
        {
            name: "N동물의료센터 노원점",
            lat: 37.6531,
            lng: 127.0681,
            district: "노원구",
            tel: "02-919-0075",
            addr: "서울 노원구 노원로 408",
            link: "https://place.map.kakao.com/20646966",
        },
        {
            name: "VIP동물의료센터 노원점",
            lat: 37.6478,
            lng: 127.0623,
            district: "노원구",
            tel: "02-931-1333",
            addr: "서울 노원구 동일로 1333",
            link: "https://place.map.kakao.com/1465177652",
        },
        // 도봉구
        {
            name: "24시딜라이트 동물의료센터",
            lat: 37.6563,
            lng: 127.0397,
            district: "도봉구",
            tel: "02-904-1004",
            addr: "서울 도봉구 도봉로 578",
            link: "https://place.map.kakao.com/1473420540",
        },
        {
            name: "N동물의료센터 노원점",
            lat: 37.6531,
            lng: 127.0681,
            district: "노원구",
            tel: "02-919-0075",
            addr: "서울 노원구 노원로 408",
            link: "https://place.map.kakao.com/20646966",
        },
        {
            name: "VIP동물의료센터 노원점",
            lat: 37.6478,
            lng: 127.0623,
            district: "노원구",
            tel: "02-931-1333",
            addr: "서울 노원구 동일로 1333",
            link: "https://place.map.kakao.com/1465177652",
        },
        // 동대문구
        {
            name: "VIP동물의료센터 동대문점",
            lat: 37.5663,
            lng: 127.0676,
            district: "동대문구",
            tel: "02-2215-7522",
            addr: "서울 동대문구 한천로14길 87",
            link: "https://place.map.kakao.com/27532150",
        },
        {
            name: "루시드동물메디컬센터 동대문점",
            lat: 37.5701,
            lng: 127.0569,
            district: "동대문구",
            tel: "02-6217-0202",
            addr: "서울 동대문구 전농로 57-1",
            link: "https://place.map.kakao.com/73859253",
        },
        // 동작구
        {
            name: "24시 품 동물의료센터",
            lat: 37.5044,
            lng: 126.9494,
            district: "동작구",
            tel: "02-812-7585",
            addr: "서울 동작구 양녕로 277-1",
            link: "https://place.map.kakao.com/1382862912",
        },
        // 마포구
        {
            name: "동물메디컬센터W",
            lat: 37.5535,
            lng: 126.9123,
            district: "마포구",
            tel: "02-323-8275",
            addr: "서울 마포구 월드컵로 46",
            link: "https://place.map.kakao.com/8211470",
        },
        // 서대문구
        {
            name: "홍제24시모아동물의료센터",
            lat: 37.5873,
            lng: 126.9462,
            district: "서대문구",
            tel: "02-2138-2030",
            addr: "서울 서대문구 통일로 426",
            link: "https://place.map.kakao.com/1811500094",
        },
        // 서초구
        {
            name: "헬릭스동물메디컬센터",
            lat: 37.5049,
            lng: 127.0023,
            district: "서초구",
            tel: "02-2135-9119",
            addr: "서울 서초구 신반포로 162",
            link: "https://place.map.kakao.com/916295968",
        },
        {
            name: "VIP동물의료센터 서초점",
            lat: 37.4797,
            lng: 126.9822,
            district: "서초구",
            tel: "02-525-3102",
            addr: "서울 서초구 동작대로 36",
            link: "https://place.map.kakao.com/505915639",
        },
        {
            name: "탑벳동물병원",
            lat: 37.4881,
            lng: 127.0091,
            district: "서초구",
            tel: "",
            addr: "서울 서초구 반포대로 89",
            link: "https://place.map.kakao.com/2140460107",
        },
        {
            name: "24시예스종합동물병원",
            lat: 37.5071,
            lng: 127.0099,
            district: "서초구",
            tel: "02-534-3475",
            addr: "서울 서초구 잠원로 24",
            link: "https://place.map.kakao.com/12649321",
        },
        // 성동구
        {
            name: "24시센트럴동물메디컬센터",
            lat: 37.5587,
            lng: 127.0337,
            district: "성동구",
            tel: "02-3395-7975",
            addr: "서울 성동구 고산자로 207",
            link: "https://place.map.kakao.com/27169610",
        },
        // 성북구
        {
            name: "VIP동물의료센터 성북점",
            lat: 37.5923,
            lng: 127.0134,
            district: "성북구",
            tel: "02-953-0075",
            addr: "서울 성북구 동소문로 73",
            link: "https://place.map.kakao.com/27559633",
        },
        // 송파구
        {
            name: "24시샤인동물메디컬센터",
            lat: 37.5108,
            lng: 127.1116,
            district: "송파구",
            tel: "02-2088-7775",
            addr: "서울 송파구 오금로 147",
            link: "https://place.map.kakao.com/1941364028",
        },
        {
            name: "리베동물메디컬센터",
            lat: 37.5038,
            lng: 127.0879,
            district: "송파구",
            tel: "02-6953-7502",
            addr: "서울 송파구 삼전로 56",
            link: "https://place.map.kakao.com/2058063409",
        },
        {
            name: "24시송파리움동물의료센터",
            lat: 37.4906,
            lng: 127.1237,
            district: "송파구",
            tel: "02-6958-7512",
            addr: "서울 송파구 동남로 115",
            link: "https://place.map.kakao.com/70673118",
        },
        // 양천구
        {
            name: "24시우리들동물메디컬센터",
            lat: 37.5223,
            lng: 126.8605,
            district: "양천구",
            tel: "02-2642-7588",
            addr: "서울 양천구 신월로 355",
            link: "https://place.map.kakao.com/16087655",
        },
        {
            name: "24시월드펫동물메디컬센터",
            lat: 37.5205,
            lng: 126.8454,
            district: "양천구",
            tel: "02-2698-7582",
            addr: "서울 양천구 신월로 208",
            link: "https://place.map.kakao.com/1509590395",
        },
        // 용산구
        {
            name: "시유동물메디컬센터",
            lat: 37.52,
            lng: 126.9699,
            district: "용산구",
            tel: "02-793-0075",
            addr: "서울 용산구 이촌로64길 24",
            link: "https://place.map.kakao.com/96806084",
        },
        {
            name: "24시더힐동물센터",
            lat: 37.5346,
            lng: 127.0096,
            district: "용산구",
            tel: "",
            addr: "서울 용산구 독서당로 81-1",
            link: "https://place.map.kakao.com/1725742948",
        },
        // 은평구
        {
            name: "24시 스마트동물메디컬센터",
            lat: 37.5998,
            lng: 126.9181,
            district: "은평구",
            tel: "02-387-7582",
            addr: "서울 은평구 은평로 93",
            link: "https://place.map.kakao.com/19244935",
        },
        // 중구
        {
            name: "24시SD동물의료센터 서울점",
            lat: 37.5648,
            lng: 127.0247,
            district: "중구",
            tel: "02-2039-0303",
            addr: "서울 중구 왕십리로 407",
            link: "https://place.map.kakao.com/1052150923",
        },
        {
            name: "웰튼동물의료센터",
            lat: 37.5691,
            lng: 127.0233,
            district: "중구",
            tel: "02-2253-2233",
            addr: "서울 중구 난계로 197",
            link: "https://place.map.kakao.com/1584755450",
        },
    ];

    const [selectedMarker, setSelectedMarker] = useState(null);
    const [selectedInfoWindow, setSelectedInfoWindow] = useState(null);

    const filteredHospitals = hospitals.filter(
        (h) => selectedDistrict === "전체" || h.district === selectedDistrict
    );

    const totalPages = Math.ceil(filteredHospitals.length / hospitalsPerPage);
    const totalPageGroups = Math.ceil(totalPages / 10); // 페이지 그룹의 총 수

    const currentHospitals = filteredHospitals.slice(
        (currentPage - 1) * hospitalsPerPage,
        currentPage * hospitalsPerPage
    );

    useEffect(() => {
        const script = document.createElement("script");
        script.src =
            "https://dapi.kakao.com/v2/maps/sdk.js?appkey=01e9946fcf20493c466a249e0a77d49b&autoload=false";
        script.async = true;

        script.onload = () => {
            window.kakao.maps.load(() => {
                const mapInstance = new window.kakao.maps.Map(mapRef.current, {
                    center: new window.kakao.maps.LatLng(37.5665, 126.978),
                    level: 6,
                });
                setMap(mapInstance);
            });
        };

        document.head.appendChild(script);
    }, []);

    useEffect(() => {
        if (!map || !window.kakao) return;

        const markers = [];
        const bounds = new window.kakao.maps.LatLngBounds();

        currentHospitals.forEach((hospital) => {
            const position = new window.kakao.maps.LatLng(
                hospital.lat,
                hospital.lng
            );
            bounds.extend(position);

            const marker = new window.kakao.maps.Marker({
                map,
                position,
                title: hospital.name,
            });

            const overlayContent = `
                <div style="padding: 12px; font-size: 14px; background: white; border-radius: 8px;
                    border: 1px solid #d1d5db; box-shadow: 0 2px 6px rgba(0,0,0,0.2); white-space: nowrap;">
                    <div style="font-size: 16px; font-weight: bold; margin-bottom: 6px;">🏥 ${hospital.name}</div>
                    <div>📍 ${hospital.addr}</div>
                    <div>📞 <a href="tel:${hospital.tel}" style="color:#2563eb; text-decoration:none;">${hospital.tel}</a></div>
                </div>`;

            const overlay = new window.kakao.maps.CustomOverlay({
                content: overlayContent,
                position,
                yAnchor: 1,
                zIndex: 3,
            });

            window.kakao.maps.event.addListener(marker, "click", () => {
                if (infoWindowRef.current) infoWindowRef.current.setMap(null);
                overlay.setMap(map);
                infoWindowRef.current = overlay;
                map.setCenter(position);
                map.setLevel(5);
            });

            markers.push(marker);
        });

        if (selectedDistrict === "전체") {
            map.setBounds(bounds);
        } else {
            const center = districts[selectedDistrict];
            if (center) {
                map.setCenter(
                    new window.kakao.maps.LatLng(center.lat, center.lng)
                );
                map.setLevel(5);
            }
        }

        window.kakao.maps.event.addListener(map, "click", () => {
            if (infoWindowRef.current) {
                infoWindowRef.current.setMap(null);
                infoWindowRef.current = null;
            }
        });

        return () => {
            markers.forEach((m) => m.setMap(null));
        };
    }, [map, selectedDistrict, currentPage]);

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return; // 페이지 범위 체크
        setCurrentPage(page);

        // 페이지 그룹을 새롭게 설정합니다.
        const newPageGroup = Math.ceil(page / 10);
        setPageGroup(newPageGroup);
    };

    const handlePageGroupChange = (direction) => {
        let newGroup = pageGroup + direction;

        if (newGroup < 1) newGroup = 1;
        if (newGroup > totalPageGroups) newGroup = totalPageGroups;

        setPageGroup(newGroup);

        // 첫 번째 페이지로 이동
        setCurrentPage((newGroup - 1) * 10 + 1);
    };

    return (
        <div className="max-w-[1100px] p-4 mx-auto mb-20">
            <h2 className="text-xl font-bold mb-4">서울 24시 동물병원</h2>

            {/* 버튼 */}
            <div className="flex flex-wrap gap-2 p-4 bg-white border-b">
                <button
                    onClick={() => setSelectedDistrict("전체")}
                    className={`px-2 py-0.5 text-sm rounded-md border ${
                        selectedDistrict === "전체"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-300 hover:text-black border-transparent"
                    }`}
                >
                    전체
                </button>
                {Object.keys(districts).map((d) => (
                    <button
                        key={d}
                        onClick={() => setSelectedDistrict(d)}
                        className={`px-2 py-0.5 text-sm rounded-md border ${
                            selectedDistrict === d
                                ? "bg-blue-500 text-white"
                                : "bg-gray-100 text-gray-800 hover:bg-gray-300 hover:text-black border-transparent"
                        }`}
                    >
                        {d}
                    </button>
                ))}
            </div>

            {/* 지도 */}
            <div
                ref={mapRef}
                className="w-full h-[400px] border border-gray-300 rounded-md"
            />

            {/* 카드 리스트 */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {currentHospitals.length === 0 ? (
                    <div className="col-span-full text-center text-gray-500">
                        해당 지역에 병원이 없습니다
                    </div>
                ) : (
                    currentHospitals.map((h, i) => (
                        <div
                            key={i}
                            className="border border-gray-200 p-4 rounded-lg shadow-sm bg-white cursor-pointer hover:bg-gray-100 transition text-sm"
                            onClick={() => {
                                const pos = new window.kakao.maps.LatLng(
                                    h.lat,
                                    h.lng
                                );
                                map.setCenter(pos);
                                map.setLevel(5);
                            }}
                        >
                            <h3 className="font-semibold text-base mb-1">
                                🏥 {h.name}
                            </h3>
                            <p className="text-gray-700 mb-1">📍 {h.addr}</p>
                            <p className="text-gray-600">📞 {h.tel}</p>
                            <a
                                href={h.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block mt-2 text-blue-500 hover:underline text-xs"
                            >
                                카카오맵에서 보기
                            </a>
                        </div>
                    ))
                )}
            </div>

            {/* 페이징 */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                    {/* "이전" 버튼 */}
                    {pageGroup > 1 && (
                        <button
                            onClick={() => handlePageGroupChange(-1)}
                            className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                        >
                            이전
                        </button>
                    )}

                    {/* 페이지 번호 */}
                    {Array.from(
                        {
                            length: Math.min(
                                10,
                                totalPages - (pageGroup - 1) * 10
                            ),
                        },
                        (_, index) => (
                            <button
                                key={index}
                                onClick={() =>
                                    handlePageChange(
                                        (pageGroup - 1) * 10 + index + 1
                                    )
                                }
                                className={`px-3 py-1 rounded ${
                                    currentPage ===
                                    (pageGroup - 1) * 10 + index + 1
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                            >
                                {(pageGroup - 1) * 10 + index + 1}
                            </button>
                        )
                    )}

                    {/* "다음" 버튼 */}
                    {pageGroup < totalPageGroups && (
                        <button
                            onClick={() => handlePageGroupChange(1)}
                            className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                        >
                            다음
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
