// components/Header.jsx
'use client';

import { useRouter } from 'next/navigation';
import { Layout, Button, Row, Col } from 'antd';  // Row, Col을 사용
import { AiOutlineLogin, AiOutlineLogout, AiOutlineHome, AiOutlineUser, AiOutlineFileText } from 'react-icons/ai';
import { Fragment, useState, useEffect } from 'react';

export default function HeaderComponent() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);  // 로그인 상태 관리

  useEffect(() => {
    // 예시: 로그인 여부를 확인하는 로직 (localStorage 등 활용)
    const user = localStorage.getItem('user');
    if (user) {
      setIsLoggedIn(true);  // 로그인 상태이면 true로 설정
    }
  }, []);

  const navigate = (path) => {
    router.push(path);
  };

  return (
    <Layout.Header className="sticky top-0 flex justify-between items-center border-b-2 border-b-gray-300 z-50 bg-white">
      <Row justify="space-between" align="middle" style={{ width: '100%' }}>
        {/* 왼쪽 메뉴 */}
        <Col>
          <Button type="link" size="large" onClick={() => navigate('/community')}>
            커뮤니티
          </Button>
          <Button type="link" size="large" onClick={() => navigate('/healthcheck')}>
            건강검진
          </Button>
          <Button type="link" size="large" onClick={() => navigate('/pet-insurance')}>
            펫 보험
          </Button>
        </Col>

        {/* 오른쪽 메뉴 */}
        <Col>
          {isLoggedIn ? (
            <Fragment>
              <Button type="link" size="large" icon={<AiOutlineUser />} onClick={() => navigate('/mypage')}>
                마이 페이지
              </Button>
              <Button
                type="link"
                size="large"
                icon={<AiOutlineLogout />}
                onClick={() => {
                  localStorage.removeItem('user'); // 로그인 상태 초기화
                  setIsLoggedIn(false); // 로그아웃 처리
                  navigate('/login'); // 로그인 페이지로 이동
                }}
              >
                로그아웃
              </Button>
            </Fragment>
          ) : (
            <Button type="link" size="large" icon={<AiOutlineLogin />} onClick={() => navigate('/login')}>
              로그인
            </Button>
          )}
        </Col>
      </Row>
    </Layout.Header>
  );
}
