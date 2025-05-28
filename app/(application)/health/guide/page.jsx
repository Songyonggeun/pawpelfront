'use client';

import { useState } from 'react';
import PuppyTable from './PuppyTable';
import YoungAdultTable from './YoungAdultTable';
import MatureAdultTable from './MatureAdultTable';
import SeniorTable from './SeniorTable';

const tabs = [
  { id: 'puppy', label: 'Baby (1세 미만)' },
  { id: 'young', label: 'Young Adult (1~7세)' },
  { id: 'mature', label: 'Mature Adult (8~12세)' },
  { id: 'senior', label: 'Senior (12세 이상)' },
];

export default function HealthGuideTabs() {
  const [activeTab, setActiveTab] = useState('puppy');

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      {/* 탭 버튼 */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '32px' }}>
        {tabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              cursor: 'pointer',
              padding: '14px 24px',
              borderRadius: '20px',
              border: activeTab === tab.id ? '2px solid #026DCE' : '1px solid #ccc',
              background: activeTab === tab.id ? '#026DCE' : '#f8f8f8',
              color: activeTab === tab.id ? '#fff' : '#333',
              fontWeight: 600,
              fontSize: '18px',
              boxShadow: activeTab === tab.id ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
              transition: 'all 0.3s',
            }}
          >
            {tab.label}
          </div>
        ))}
      </div>

      {/* 탭 콘텐츠 */}
      <div>
        {activeTab === 'puppy' && <PuppyTable />}
        {activeTab === 'young' && <YoungAdultTable />}
        {activeTab === 'mature' && <MatureAdultTable />}
        {activeTab === 'senior' && <SeniorTable />}
      </div>
    </div>
  );
}