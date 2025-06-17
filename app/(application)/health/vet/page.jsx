'use client'
import React, { useState } from 'react';

const DoctorProfile = () => {
  const [activeTab, setActiveTab] = useState('experience');

  const tabs = [    { id: 'experience', label: '주요경력' },    { id: 'education', label: '학력' },    { id: 'activities', label: '학회활동' },    { id: 'story', label: '수의사이야기' },  ];

  const content = {
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

처음 강아지를 가족으로 맞이하면서, 동물은 단순한 반려동물을 넘어 한 가정의 소중한 일원이자 사랑의 중심이라는 것을 깊이 깨닫게 되었습니다. 그 사랑이 동물에게 얼마나 큰 행복과 안정감을 주는지, 그리고 그로 인해 가족 모두가 더욱 따뜻해진다는 사실을 경험하며, 제 꿈도 더욱 구체화되었습니다.

그래서 저는 단순히 ‘동물을 잘 치료하는 수의사’가 되고자 한 데서 나아가, ‘반려동물과 가족이 함께 오래도록 행복하고 건강한 시간을 보낼 수 있도록 돕는 수의사’가 되고자 합니다.

우리 아이를 돌보는 마음으로, 반려동물과 그 가족 모두의 평안과 행복을 최우선으로 여기며, 언제나 진심을 다해 여러분의 가족을 보살피겠습니다.`,
};

  return (
    <div style={styles.container}>
      <div style={styles.left}>
        <img
          src="/images/vet-consult.jpg" // 실제 이미지 URL로 교체하세요
          alt="이익준 수의사"
          style={styles.image}
        />
      </div>
      <div style={styles.right}>
      <h2 style={styles.title}>
          이익준{' '}
          <span style={{ fontWeight: '300', color: 'gray' }}>
            수의사
          </span>
        </h2>
        <button style={styles.introButton}>의료진 소개</button>

        <nav style={styles.tabNav}>
          {tabs.map((tab) => (
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
            {content[activeTab]}
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    maxWidth: '900px',
    margin: '40px auto',
    padding: '0 20px',
    fontFamily: "'Noto Sans KR', sans-serif",
    color: '#333',
  },
  left: {
    flex: '0 0 280px',
    marginRight: '40px',
  },
  image: {
    width: '100%',
    height: 'auto',
    borderRadius: '4px',
    objectFit: 'cover',
  },
  right: {
    flex: '1',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700', // 기본 굵기
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
