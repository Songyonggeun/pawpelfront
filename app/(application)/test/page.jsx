'use client'

import { useEffect, useState } from 'react'

export default function KakaoMapHospitals() {
  const [converted, setConverted] = useState([])

  const hospitalData = [
    {
      name: '24시SD동물의료센터 서울점',
      district: '중구',
      tel: '02-2039-0303',
      addr: '서울 중구 왕십리로 407',
      link: 'https://place.map.kakao.com/1052150923',
    },
    {
      name: '웰튼동물의료센터',
      district: '중구',
      tel: '02-2253-2233',
      addr: '서울 중구 난계로 197',
      link: 'https://place.map.kakao.com/1584755450',
    },
  ]

  const getLatLngFromAddress = async (address) => {
    const KAKAO_API_KEY = '3497bb940c651b04b20072df05677a18'

    try {
      const res = await fetch(
        `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(address)}`,
        {
          headers: {
            Authorization: `KakaoAK ${KAKAO_API_KEY}`
          }
        }
      )

      const data = await res.json()
      if (data?.documents?.length > 0) {
        return {
          lat: data.documents[0].y,
          lng: data.documents[0].x
        }
      } else {
        console.warn('주소 검색 실패:', address)
        return { lat: null, lng: null }
      }
    } catch (e) {
      console.error("지오코딩 에러", e)
      return { lat: null, lng: null }
    }
  }

  useEffect(() => {
    const convertAll = async () => {
      const result = await Promise.all(
        hospitalData.map(async (h) => {
          const { lat, lng } = await getLatLngFromAddress(h.addr)
          return {
            ...h,
            lat: lat ? Number(parseFloat(lat).toFixed(4)) : null,
            lng: lng ? Number(parseFloat(lng).toFixed(4)) : null
          }
        })
      )
      setConverted(result)
    }

    convertAll()
  }, [])

  return (
    <div className="p-4 text-sm whitespace-pre-wrap font-mono bg-gray-50 rounded">
      {converted.length > 0
        ? converted.map(h => {
            return `{
  name: '${h.name}',
  lat: ${h.lat},
  lng: ${h.lng},
  district: '${h.district}',
  tel: '${h.tel}',
  addr: '${h.addr}',
  link: '${h.link}',
},\n`
          })
        : '⏳ 주소 → 위도/경도 변환 중...'}
    </div>
  )
}
