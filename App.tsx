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
import { Course, User, Review, Badge, CourseRanking, GlobalRanking, Announcement } from './types';

// 2. Mock Data Import (뱃지 데이터 확인용)
import { mockBadges } from './data/mockData';

import './styles/globals.css';

// 3. 리디렉션 페이지 컴포넌트
import { AuthCallback } from './components/AuthCallback';
import { RegisterSocial } from './components/RegisterSocial';

// 4. 초기값 정의
const emptyGlobalRanking: GlobalRanking = {
  period: 'all-time',
  rankings: [],
  lastUpdated: new Date().toISOString()
};

export default function App() {
  
  type PageName = 'home' | 'courses' | 'map' | 'about' | 'community' | 'mypage' | 'admin' 
                | 'authCallback' | 'registerSocial' | 'loading';

  const [currentPage, setCurrentPage] = useState<PageName>('loading');

  // UI 상태
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isQRScanModalOpen, setIsQRScanModalOpen] = useState(false);
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);
  const [newBadge, setNewBadge] = useState<Badge | null>(null);
  
  // ✨ [데이터 상태]
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]); 
  const [reviews, setReviews] = useState<Review[]>([]); 
  const [announcements, setAnnouncements] = useState<Announcement[]>([]); 
  const [courseRankings, setCourseRankings] = useState<CourseRanking[]>([]); 
  const [globalRanking, setGlobalRanking] = useState<GlobalRanking>(emptyGlobalRanking); 
  const [allBadges, setAllBadges] = useState<Badge[]>([]); 
  
  const [favorites, setFavorites] = useState<number[]>([]);
  const [completedCourses, setCompletedCourses] = useState<number[]>([]);
  const [myBadges, setMyBadges] = useState<Badge[]>([]); 

  // 5. 데이터 페칭
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [coursesRes, reviewsRes, announcementsRes, badgesRes, courseRankingRes, globalRankingRes] = await Promise.all([
          axios.get('/api/courses'),
          axios.get('/api/reviews'),
          axios.get('/api/announcements'),
          axios.get('/api/badges'),
          axios.get('/api/rankings/courses'),
          axios.get('/api/rankings/global')
        ]);

        setCourses(coursesRes.data);
        setReviews(reviewsRes.data);
        setAnnouncements(announcementsRes.data);
        setAllBadges(badgesRes.data);
        setCourseRankings(courseRankingRes.data);
        setGlobalRanking(globalRankingRes.data);

      } catch (error) {
        console.error("데이터 로딩 실패:", error);
      }
    };

    fetchAllData();
  }, []);

  // 6. 인증 및 라우팅
  useEffect(() => {
    const handleRouting = async () => {
      try {
        const path = window.location.pathname;
        const token = new URLSearchParams(window.location.search).get('token');

        if (path === '/auth/callback' && token) {
          setCurrentPage('authCallback');
          localStorage.setItem('authToken', token);
          await fetchUserWithToken(token);
        } else if (path === '/register-social' && token) {
          setCurrentPage('registerSocial');
        } else {
          const existingToken = localStorage.getItem('authToken');
          if (existingToken) {
            await fetchUserWithToken(existingToken);
          } else {
            setCurrentPage('home');
          }
        }
      } catch (error) {
        setCurrentPage('home');
      }
    };
    handleRouting();
  }, []);

  const fetchUserWithToken = async (token: string) => {
    try {
      const response = await axios.get('/api/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const userData: User = response.data;
      setCurrentUser(userData);
      setCompletedCourses(userData.completedCourses || []);
      setMyBadges(userData.badges || []);
      setCurrentPage('home');
      window.history.replaceState({}, '', '/'); 
    } catch (error) {
      localStorage.removeItem('authToken');
      setCurrentUser(null);
      setCurrentPage('home');
    }
  };

  const handleAuth = (email: string, password: string, nickname?: string, region?: string) => {
    if (authMode === 'signup' && nickname && region) {
      toast.success('회원가입이 완료되었습니다!');
    } else {
      const user: User = { 
        id: 1, email, nickname: nickname || '갈맷길러', region: region || '부산진구', 
        joinDate: '2024-01-01T00:00:00Z', totalDistance: 125.5, 
        completedCourses: [1, 3, 5], badges: [] 
      };
      setCurrentUser(user);
      setCompletedCourses(user.completedCourses);
      setMyBadges(user.badges);
      toast.success('로그인되었습니다!');
    }
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setCurrentUser(null);
    setFavorites([]);
    setCompletedCourses([]);
    setMyBadges([]);
    setCurrentPage('home');
    toast.success('로그아웃되었습니다.');
  };

  const handleReviewSubmit = async (rating: number, content: string, photos: File[]) => {
    if (!currentUser || !selectedCourse) return;
    const reviewData = {
      courseId: selectedCourse.id,
      userId: currentUser.id,
      userName: currentUser.nickname,
      rating,
      content,
    };
    try {
      const response = await axios.post('/api/reviews', reviewData);
      setReviews(prev => [response.data, ...prev]);
      setIsReviewModalOpen(false);
      toast.success('리뷰가 작성되었습니다!');
    } catch (error) {
      toast.error('리뷰 작성에 실패했습니다.');
    }
  };

  const openCourseDetail = async (course: Course) => {
    setSelectedCourse(course); 
    try {
      const response = await fetch(`/api/courses/${course.id}`);
      if (response.ok) {
        const detailData = await response.json();
        setSelectedCourse(detailData);
      }
    } catch (error) {
      console.error("상세 정보 로딩 실패");
    }
  };

  const closeCourseDetail = () => setSelectedCourse(null);

  const toggleFavorite = (courseId: number) => {
    if (!currentUser) { toast.error('로그인이 필요합니다.'); return; }
    setFavorites(prev => prev.includes(courseId) ? prev.filter(id => id !== courseId) : [...prev, courseId]);
    toast.success(!favorites.includes(courseId) ? '찜했습니다!' : '찜 해제했습니다.');
  };

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
    if (completedCount === 1) {
      const badge = mockBadges.find(b => b.id === 1);
      if (badge && !myBadges.find(b => b.id === badge.id)) newBadgesFound.push(badge);
    }
    if (newBadgesFound.length > 0) {
      setMyBadges(prev => [...prev, ...newBadgesFound]);
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
        <div className="flex items-center justify-center min-h-screen flex-col gap-4">
          <div className="w-16 h-16 border-8 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
          <p className="text-gray-500">데이터를 불러오는 중입니다...</p>
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
      
      {/* ✨ [수정됨] Community에 필요한 모든 데이터를 넘겨줌 (에러 해결) */}
      {currentPage === 'community' && (
        <Community
          courses={courses}
          reviews={reviews}
          currentUser={currentUser}
          badges={myBadges}
          completedCourses={completedCourses}
          onCourseClick={openCourseDetail}
          // 👇 아래 3개가 추가되어야 ts(2741) 에러가 사라짐
          announcements={announcements} 
          courseRankings={courseRankings}
          globalRanking={globalRanking}
        />
      )}

      {currentPage === 'mypage' && currentUser && (
        <MyPage user={currentUser} courses={courses} reviews={reviews} badges={myBadges} favorites={favorites} completedCourses={completedCourses} onCourseClick={openCourseDetail} onUserUpdate={setCurrentUser} allBadges={allBadges} />
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

      <AuthModal isOpen={isAuthModalOpen} mode={authMode} onClose={() => setIsAuthModalOpen(false)} onSubmit={handleAuth} onModeChange={setAuthMode} />
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