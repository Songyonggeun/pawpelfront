'use client';
import React, { useState } from 'react';

// 수의사 목록 데이터
const doctorProfiles = [
  {
    name: '이익준',
    image: '/images/vet-consult.jpg',
    title: '수의사',
    tabs: [
      { id: 'experience', label: '주요경력' },
      { id: 'education', label: '학력' },
      { id: 'activities', label: '학회활동' },
      { id: 'story', label: '수의사이야기' },
    ],
    content: {
      experience: `- 前 베스트펫 동물병원 내과 과장
- 前 반려동물 행동클리닉 협회 자문위원
- 前 반려동물 심초음파 연구소 연구원
- 現 의학대학 애완동물학과 외래강사
- 現 한국동물심장학회 정회원
- 現 Pawple 동물병원 원장`,

      education: `- △△대학교 수의과대학 졸업
- △△대학교 수의외과학 석사 수료
- △△대학교 수의학과 겸임교수`,

      activities: `- 前 반려동물 심초음파 연구소 연구원
- 現 반려동물 행동클리닉 협회 자문위원
- 現 일본 동물임상의학회 정회원`,

      story: `어릴 적부터 저는 작고 귀여운 동물들을 돌보며 그들의 아픔을 치유하는 보람찬 삶을 꿈꿔왔습니다.

처음 강아지를 가족으로 맞이하면서, 동물은 단순한 반려동물을 넘어 한 가정의 소중한 일원이자 사랑의 중심이라는 것을 깊이 깨닫게 되었습니다.

그래서 저는 단순히 ‘동물을 잘 치료하는 수의사’가 되고자 한 데서 나아가, ‘반려동물과 가족이 함께 오래도록 행복하고 건강한 시간을 보낼 수 있도록 돕는 수의사’가 되고자 합니다.`,
    },
  },
  {
    name: '채송화',
    image: '/images/vet-bora.jpg',
    title: '수의사',
    tabs: [
      { id: 'experience', label: '주요경력' },
      { id: 'education', label: '학력' },
      { id: 'activities', label: '학회활동'},
      { id: 'story', label: '수의사이야기' },
    ],
    content: {
      experience: `- 前 24시 스마일동물병원 외과전담 수의사
- 前 시카고 펫메디컬센터 교환연수
- 現 Pawple 동물병원 외과 진료 담당`,

      education: `- △△대학교 수의과대학 졸업
- △△대학교 수의외과 레지던트 수료`,

      activities: `- 現 한국수의내과학회 정회원
- 小動物臨床學會(KSVC) 정기 학술대회 연자`,

      story: `어릴 적부터 애완동물과의 교감을 통해 생명에 대한 깊은 관심과 책임감을 키워왔습니다.

      반려동물의 건강과 복지를 증진시키는 전문 수의사로서의 길을 확신하며 진로를 선택하였습니다.

      앞으로도 지속적인 연구와 임상 경험을 바탕으로 반려동물과 그 가족의 삶의 질 향상에 기여하고자 합니다.`,
    },
  },
];

// 수의사 개별 카드 컴포넌트
const DoctorCard = ({ doctor }) => {
  const [activeTab, setActiveTab] = useState(doctor.tabs[0].id);

  return (
    <div style={styles.container}>
      <div style={styles.left}>
        <img src={doctor.image} alt={`${doctor.name} ${doctor.title}`} style={styles.image} />
      </div>
      <div style={styles.right}>
        <h2 style={styles.title}>
          {doctor.name}{' '}
          <span style={{ fontWeight: '300', color: 'gray' }}>{doctor.title}</span>
        </h2>
        <button style={styles.introButton}>의료진 소개</button>

        <nav style={styles.tabNav}>
          {doctor.tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                ...styles.tabButton,
                borderBottom: activeTab === tab.id ? '2px solid #333' : '2px solid transparent',
                fontWeight: activeTab === tab.id ? '600' : '400',
              }}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div style={styles.content}>
          <p style={{ whiteSpace: 'pre-line', lineHeight: '1.6', fontSize: '14px', color: '#444' }}>
            {doctor.content[activeTab]}
          </p>
        </div>
      </div>
    </div>
  );
};

// 전체 의료진 프로필 컴포넌트
const DoctorProfile = () => {
  return (
    <div>
      {doctorProfiles.map((doctor, index) => (
        <DoctorCard key={index} doctor={doctor} />
      ))}
    </div>
  );
};

// 공통 스타일 정의
const styles = {
  container: {
    display: 'flex',
    maxWidth: '900px',
    margin: '40px auto',
    padding: '0 20px',
    fontFamily: "'Noto Sans KR', sans-serif",
    color: '#333',
    marginBottom: '60px',
  },
  left: {
    flex: '0 0 280px',
    marginRight: '40px',
  },
  image: {
  width: '100%',
  height: '300px',      // 예: 높이를 고정
  objectFit: 'cover',
  borderRadius: '4px',
},
  right: {
    flex: '1',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#333',
    marginBottom: '12px',
  },
  introButton: {
    padding: '6px 14px',
    fontSize: '13px',
    border: '1px solid #ccc',
    backgroundColor: '#fff',
    cursor: 'pointer',
    borderRadius: '3px',
    marginBottom: '24px',
  },
  tabNav: {
    display: 'flex',
    borderBottom: '1px solid #ddd',
    marginBottom: '20px',
  },
  tabButton: {
    flex: '1',
    padding: '10px 0',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#666',
    transition: 'all 0.3s ease',
  },
  content: {
    minHeight: '220px',
  },
};

export default DoctorProfile;
