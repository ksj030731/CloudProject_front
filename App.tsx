import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CourseGrid } from './components/CourseGrid';
import { MapSection } from './components/MapSection';
import { About } from './components/About';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { CourseDetail } from './components/CourseDetail';
import { MyPage } from './components/MyPage';
import { AdminPage } from './components/AdminPage';
import { Community } from './components/Community';
import { ReviewModal } from './components/ReviewModal';
import { QRScanModal } from './components/QRScanModal';
import { BadgeModal } from './components/BadgeModal';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';

// 1. 타입 Import
import { Course, User, Review, Badge, CourseRanking, GlobalRanking } from './types';

// 2. Mock Data Import (mockCourses 제거, 뱃지 정의용 데이터는 유지)
import { mockBadges } from './data/mockData';

import './styles/globals.css';

// 3. 리디렉션 페이지 컴포넌트
import { AuthCallback } from './components/AuthCallback';
import { RegisterSocial } from './components/RegisterSocial';

// 4. 빈 랭킹 객체 정의 (TS 오류 방지 및 초기값)
const emptyCourseRankings: CourseRanking[] = [];
const emptyGlobalRanking: GlobalRanking = {
  period: 'weekly',
  rankings: [],
  lastUpdated: new Date().toISOString()
};

export default function App() {
  
  type PageName = 'home' | 'courses' | 'map' | 'about' | 'community' | 'mypage' | 'admin' 
                | 'authCallback'   // 로그인 콜백
                | 'registerSocial' // 추가 정보 입력
                | 'loading';       // 로딩 중

  // 초기 상태를 'loading'으로 설정
  const [currentPage, setCurrentPage] = useState<PageName>('loading');

  // 상태 관리
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isQRScanModalOpen, setIsQRScanModalOpen] = useState(false);
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);
  const [newBadge, setNewBadge] = useState<Badge | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // ✨ [핵심] DB에서 가져올 데이터는 빈 배열로 초기화
  const [courses, setCourses] = useState<Course[]>([]); 
  const [reviews, setReviews] = useState<Review[]>([]); 
  
  const [favorites, setFavorites] = useState<number[]>([]);
  const [completedCourses, setCompletedCourses] = useState<number[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);

  // 5. 데이터 페칭 (코스 & 리뷰)
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 코스 데이터 가져오기
        const courseRes = await axios.get('/api/courses');
        setCourses(courseRes.data);
        console.log("DB 코스 데이터 로드 완료:", courseRes.data);

        // 리뷰 데이터 가져오기
        const reviewRes = await axios.get('/api/reviews');
        setReviews(reviewRes.data);
        console.log("DB 리뷰 데이터 로드 완료:", reviewRes.data);

      } catch (error) {
        console.error("데이터 로딩 실패:", error);
        // 초기 로딩 실패 시 사용자에게 알림 (선택 사항)
        // toast.error('데이터를 불러오는데 실패했습니다.'); 
      }
    };

    fetchData();
  }, []);

  // 6. 인증 및 페이지 라우팅 로직
  useEffect(() => {
    const handleRouting = async () => {
      try {
        const path = window.location.pathname;
        const token = new URLSearchParams(window.location.search).get('token');

        if (path === '/auth/callback' && token) {
          // 소셜 로그인 콜백
          localStorage.setItem('authToken', token);
          await fetchUserWithToken(token);
          setCurrentPage('authCallback');
        } else if (path === '/register-social' && token) {
          // 추가 정보 입력 필요
          setCurrentPage('registerSocial');
        } else {
          // 일반 접속 (자동 로그인 체크)
          const existingToken = localStorage.getItem('authToken');
          if (existingToken) {
            await fetchUserWithToken(existingToken);
          } else {
            setCurrentPage('home');
          }
        }
      } catch (error) {
        console.error("Storage access blocked or Auth error:", error);
        setCurrentPage('home');
      }
    };

    handleRouting();
  }, []);

  // 7. 토큰으로 유저 정보 가져오기
  const fetchUserWithToken = async (token: string) => {
    try {
      // 실제 백엔드 API 호출 (/api/me)
      // 현재는 백엔드 엔드포인트가 없으면 404가 뜰 수 있으므로 주의
      const response = await axios.get('/api/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const userData: User = response.data;
      setCurrentUser(userData);
      
      // 유저 정보 상태 업데이트
      setCompletedCourses(userData.completedCourses || []);
      setBadges(userData.badges || []);
      // setFavorites(userData.favorites || []); // 백엔드 지원 시 추가

      setCurrentPage('home');
      window.history.replaceState({}, '', '/'); // URL 정리

    } catch (error) {
      // 토큰이 만료되었거나 유효하지 않음
      try {
        localStorage.removeItem('authToken');
      } catch (e) { console.error(e); }
      
      setCurrentUser(null);
      setCurrentPage('home');
    }
  };

  // 8. 일반 로그인/회원가입 핸들러 (목업 로직 유지하되 구조 맞춤)
  const handleAuth = (email: string, password: string, nickname?: string, region?: string) => {
    if (authMode === 'signup' && nickname && region) {
      const newUser: User = { 
        id: Date.now(), email, nickname, region, joinDate: new Date().toISOString(), 
        totalDistance: 0, completedCourses: [], badges: [] 
      };
      setCurrentUser(newUser);
      toast.success('회원가입이 완료되었습니다!');
    } else {
      const user: User = { 
        id: 1, email, nickname: nickname || '갈맷길러', region: region || '부산진구', 
        joinDate: '2024-01-01T00:00:00Z', totalDistance: 125.5, 
        completedCourses: [1, 3, 5], badges: [] // ✨ 뱃지 빈 배열로 시작
      };
      setCurrentUser(user);
      setCompletedCourses(user.completedCourses);
      setBadges(user.badges);
      toast.success('로그인되었습니다!');
    }
    setIsAuthModalOpen(false);
  };

  // 9. 로그아웃
  const handleLogout = () => {
    try {
      localStorage.removeItem('authToken');
    } catch (e) { console.error(e); }
    setCurrentUser(null);
    setFavorites([]);
    setCompletedCourses([]);
    setBadges([]);
    setCurrentPage('home');
    toast.success('로그아웃되었습니다.');
  };

  // 10. 리뷰 작성 (DB 연동)
  const handleReviewSubmit = async (rating: number, content: string, photos: File[]) => {
    if (!currentUser || !selectedCourse) return;

    const reviewData = {
      courseId: selectedCourse.id,
      userId: currentUser.id,
      userName: currentUser.nickname,
      rating,
      content,
      // photos: 추후 파일 업로드 로직 구현 필요
    };

    try {
      const response = await axios.post('/api/reviews', reviewData);
      const newReviewFromDB = response.data;
      setReviews(prev => [newReviewFromDB, ...prev]);
      setIsReviewModalOpen(false);
      toast.success('리뷰가 작성되었습니다!');
    } catch (error) {
      console.error("리뷰 작성 실패:", error);
      toast.error('리뷰 작성에 실패했습니다.');
    }
  };

  // 11. 코스 상세 보기 (DB 최신 정보 조회)
  const openCourseDetail = async (course: Course) => {
    setSelectedCourse(course); // 즉시 반응

    try {
      const response = await fetch(`/api/courses/${course.id}`);
      if (response.ok) {
        const detailData = await response.json();
        console.log("상세 정보(섹션 포함) 로드:", detailData);
        setSelectedCourse(detailData);
      }
    } catch (error) {
      console.error("상세 정보 로딩 실패:", error);
    }
  };

  const closeCourseDetail = () => setSelectedCourse(null);

  const toggleFavorite = (courseId: number) => {
    if (!currentUser) { toast.error('로그인이 필요합니다.'); return; }
    setFavorites(prev => prev.includes(courseId) ? prev.filter(id => id !== courseId) : [...prev, courseId]);
    toast.success(!favorites.includes(courseId) ? '찜했습니다!' : '찜 해제했습니다.');
  };

  // 12. 뱃지 및 QR 로직 (mockBadges 활용)
  const handleQRScan = () => {
    if (!currentUser || !selectedCourse) return;
    if (!completedCourses.includes(selectedCourse.id)) {
      const newCompleted = [...completedCourses, selectedCourse.id];
      setCompletedCourses(newCompleted);
      const newTotalDistance = (currentUser.totalDistance || 0) + selectedCourse.distance;
      setCurrentUser({ ...currentUser, totalDistance: newTotalDistance });
      toast.success(`${selectedCourse.name} 완주 인증이 완료되었습니다!`);
      checkForNewBadges(newCompleted.length, newTotalDistance);
    } else {
      toast.info('이미 완주한 코스입니다.');
    }
    setIsQRScanModalOpen(false);
  };

  const checkForNewBadges = (completedCount: number, totalDistance: number) => {
    const newBadgesFound: Badge[] = [];
    // mockBadges 데이터를 참조하여 로직 수행
    if (completedCount === 1) {
      const badge = mockBadges.find(b => b.id === 1);
      if (badge && !badges.find(b => b.id === badge.id)) newBadgesFound.push(badge);
    }
    if (completedCount >= 5) {
      const badge = mockBadges.find(b => b.id === 2);
      if (badge && !badges.find(b => b.id === badge.id)) newBadgesFound.push(badge);
    }
    if (totalDistance >= 50) {
      const badge = mockBadges.find(b => b.id === 3);
      if (badge && !badges.find(b => b.id === badge.id)) newBadgesFound.push(badge);
    }
    if (newBadgesFound.length > 0) {
      setBadges(prev => [...prev, ...newBadgesFound]);
      setNewBadge(newBadgesFound[0]);
      setIsBadgeModalOpen(true);
    }
  };

  const openAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {currentPage !== 'loading' && currentPage !== 'authCallback' && currentPage !== 'registerSocial' && (
        <Header currentUser={currentUser} currentPage={currentPage} onPageChange={setCurrentPage} onAuthClick={openAuth} onLogout={handleLogout} />
      )}
      
      {currentPage === 'loading' && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-16 h-16 border-8 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
        </div>
      )}
      {currentPage === 'authCallback' && <AuthCallback />}
      {currentPage === 'registerSocial' && <RegisterSocial />}

      {currentPage === 'home' && (
        <>
          <Hero onAuthClick={openAuth} />
          <section className="py-16">
            <div className="container mx-auto px-4">
              <h2 className="mb-8 text-center text-3xl font-bold">인기 코스</h2>
              <CourseGrid courses={courses.slice(0, 6)} favorites={favorites} completedCourses={completedCourses} onCourseClick={openCourseDetail} onFavoriteClick={toggleFavorite} currentUser={currentUser} />
            </div>
          </section>
        </>
      )}

      {currentPage === 'courses' && (
        <section className="py-24">
          <div className="container mx-auto px-4">
            <h1 className="mb-8 text-center text-4xl font-bold">전체 갈맷길 코스</h1>
            <CourseGrid courses={courses} favorites={favorites} completedCourses={completedCourses} onCourseClick={openCourseDetail} onFavoriteClick={toggleFavorite} currentUser={currentUser} />
          </div>
        </section>
      )}

      {currentPage === 'map' && ( <MapSection courses={courses} favorites={favorites} completedCourses={completedCourses} onCourseClick={openCourseDetail} onFavoriteClick={toggleFavorite} currentUser={currentUser} /> )}
      {currentPage === 'about' && <About />}
      
      {currentPage === 'community' && (
        <Community
          courses={courses}
          reviews={reviews}
          currentUser={currentUser}
          badges={badges}
          completedCourses={completedCourses}
          courseRankings={emptyCourseRankings}
          globalRanking={emptyGlobalRanking}
          onCourseClick={openCourseDetail}
        />
      )}

      {currentPage === 'mypage' && currentUser && (
        <MyPage user={currentUser} courses={courses} reviews={reviews} badges={badges} favorites={favorites} completedCourses={completedCourses} onCourseClick={openCourseDetail} onUserUpdate={setCurrentUser} />
      )}

      {currentPage === 'admin' && ( <AdminPage courses={courses} onCoursesUpdate={setCourses} /> )}

      {selectedCourse && (
        <CourseDetail
          course={selectedCourse}
          reviews={reviews.filter(r => r.courseId === selectedCourse.id)}
          isFavorited={favorites.includes(selectedCourse.id)}
          isCompleted={completedCourses.includes(selectedCourse.id)}
          currentUser={currentUser}
          onClose={closeCourseDetail}
          onFavoriteClick={() => toggleFavorite(selectedCourse.id)}
          onReviewClick={() => setIsReviewModalOpen(true)}
          onQRScanClick={() => setIsQRScanModalOpen(true)}
        />
      )}

      <AuthModal
        isOpen={isAuthModalOpen}
        mode={authMode}
        onClose={() => setIsAuthModalOpen(false)}
        onSubmit={handleAuth}
        // onSocialLogin={handleSocialLogin} // 오류 제거를 위해 주석 처리 (AuthModal에서 해당 prop을 안 받음)
        onModeChange={setAuthMode}
      />

      <ReviewModal isOpen={isReviewModalOpen} courseName={selectedCourse?.name || ''} onClose={() => setIsReviewModalOpen(false)} onSubmit={handleReviewSubmit} />
      <QRScanModal isOpen={isQRScanModalOpen} courseName={selectedCourse?.name || ''} onClose={() => setIsQRScanModalOpen(false)} onScan={handleQRScan} />
      <BadgeModal isOpen={isBadgeModalOpen} badge={newBadge} onClose={() => setIsBadgeModalOpen(false)} />

      {currentPage !== 'loading' && currentPage !== 'authCallback' && currentPage !== 'registerSocial' && (
        <Footer />
      )}
      <Toaster />
    </div>
  );
}