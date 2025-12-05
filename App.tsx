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
   //QR찍으면 코스 세부 정보 가져오는 변수 
  const [completedSections, setCompletedSections] = useState<string[]>([]);

  // 5. 유저 정보 가져오기 (토큰 기반) 
  const fetchUserWithToken = async (token?: string) => {
    // 로컬 스토리지에 토큰 글자가 없어도 일단 진행합니다. (쿠키를 믿습니다!)
    const authToken = token || localStorage.getItem('authToken');

    try {
      // 👇 authToken이 없어도 요청을 보냅니다. (쿠키가 있으면 성공할 것이므로)
      const response = await axios.get('/api/user/me', {
        headers: authToken ? { 'Authorization': `Bearer ${authToken}` } : {}, // 있으면 보내고, 없으면 맘
        withCredentials: true
      });

      const userData: User = response.data;
      setCurrentUser(userData);
      setCompletedCourses(userData.completedCourses || []);
      setMyBadges(userData.badges || []);
      setFavorites(userData.favorites || []);

      // 만약 로컬 스토리지가 비어있었다면, 다시 채워주는 센스 (선택 사항)
      if (!localStorage.getItem('authToken')) {
        localStorage.setItem('authToken', 'logged-in');
      }

      if (window.location.pathname === '/auth/callback') {
        window.history.replaceState({}, '', '/');
      }

    } catch (error) {
      // 진짜로 실패했을 때만 로그아웃 처리
      console.error("유저 정보 로드 실패 (로그인 안 된 상태):", error);
      localStorage.removeItem('authToken');
      setCurrentUser(null);
    }
  };

  // 6. [통합] 초기화 로직 (데이터 페칭 + 인증 및 라우팅)
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // --- [단계 1] 인증 체크 (로그인 시도) ---
        const urlToken = new URLSearchParams(window.location.search).get('token');
        const localToken = localStorage.getItem('authToken');

        if (urlToken) {
          // 소셜 로그인 직후: URL 토큰 우선 사용
          localStorage.setItem('authToken', urlToken);
          await fetchUserWithToken(urlToken);
        } else if (localToken) {
          // 일반 접속: 로컬 스토리지 토큰 사용
          await fetchUserWithToken(localToken);
        }

        // --- [단계 2] 공통 데이터 로드 (병렬 처리) ---
        // 로그인이 안 되어도 데이터는 보여야 하므로, 인증 실패 여부와 상관없이 실행합니다.
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
        console.error("초기 데이터 로딩 실패:", error);
        // 필요시 에러 토스트 메시지 추가
      } finally {
        // --- [단계 3] 모든 로딩 종료 후 화면 결정 ---
        const path = window.location.pathname;

        if (path === '/auth/callback') {
          setCurrentPage('home'); // 인증 처리 끝났으니 홈으로
        } else if (path === '/register-social') {
          setCurrentPage('registerSocial');
        } else {
          // 기존 페이지 유지 (새로고침 시) 또는 홈으로
          setCurrentPage('home');
        }

        // 여기서 로딩 상태를 풀어줍니다. (이제 데이터와 유저 정보가 다 있음)
        // setCurrentPage가 'loading'이 아니게 되므로 화면이 렌더링됨
      }
    };

    initializeApp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- 핸들러 함수들 ---

  const openAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

 const openCourseDetail = async (course: Course) => {
    setSelectedCourse(course); // 일단 리스트 정보로 빨리 띄우고
    try {
      // 상세 정보를 서버에서 최신으로 다시 가져옴 (이 부분이 빠짐!)
      const response = await axios.get(`/api/courses/${course.id}`);
      if (response.status === 200) {
        setSelectedCourse(response.data);
      }
    } catch (error) {
      console.error("상세 정보 로딩 실패", error);
    }
 };

  const closeCourseDetail = () => {
    setSelectedCourse(null);
  };

  const toggleFavorite = async (courseId: number) => {
    if (!currentUser) {
      toast.error('로그인이 필요합니다.');
      openAuth('login'); // 로그인 모달 띄우기
      return;
    }

    //낙관적 업데이트()
    setFavorites(prev =>
      prev.includes(courseId)
        ? prev.filter(id => id != courseId) // 이미 있으면 뻄
        : [...prev, courseId] //없으면 추가 
    );
    try {
      //api 요청 찜 이미 있으면 삭제 , 없으면 추가 
      await axios.post(`/api/courses/${courseId}/favorite`, {}, {
        withCredentials: true
      });

      const isNowFavorited = !favorites.includes(courseId); //state는 비동기라 반대로 계산

    } catch (error) {
      console.error("찜하기 실패", error);
      toast.error("요청 처리에 실패했습니다.");

      // 3. 실패 시 롤백 (화면 다시 원래대로)
      setFavorites(prev =>
        prev.includes(courseId)
          ? prev.filter(id => id !== courseId)
          : [...prev, courseId]
      );
    }

  };

  /*
  * QR코드 찎으면 데이터 파싱하고 코스 ID와 일치하는지 확인함 
  * 구간별 인증 처리하고 , 그다음 상태를 이어서 작성하면 됨
  */
  const handleQRScan = (scannedData: string) => {
    if (!currentUser || !selectedCourse) return;

    //  데이터 파싱
    const codeBody = scannedData.replace("GALMAETGIL_", "");
    const [courseIdStr, sectionIdStr] = codeBody.split("-");
    
    const scannedCourseId = parseInt(courseIdStr);
    const scannedSectionId = parseInt(sectionIdStr);

    //  코스 ID 일치 여부 확인 (기본 검사)
    if (scannedCourseId !== selectedCourse.id) {
        toast.error(`잘못된 코스입니다. 현재 ${selectedCourse.id}코스 페이지입니다.`);
        setIsQRScanModalOpen(false);
        return;
    }

    //.  구간별 인증 처리
    const sectionKey = `${scannedCourseId}-${scannedSectionId}`; // "1-1" 같은 고유 키 생성

    if (completedSections.includes(sectionKey)) {
        toast.info(`이미 인증된 구간입니다 (${scannedSectionId}구간).`);
    } else {
        // 새로운 구간 인증
        const newSections = [...completedSections, sectionKey];
        setCompletedSections(newSections);
        
        toast.success(`${selectedCourse.name}의 ${scannedSectionId}구간 인증 성공! 🎉`);

        // TODO: 만약 1코스의 모든 구간(예: 1-1, 1-2, 1-3)을 다 모았다면?
        // 그때 setCompletedCourses([...completedCourses, selectedCourse.id]) 를 실행해서
        // '최종 완주' 배지를 주는 로직을 여기에 추가하면 됨
    }

    setIsQRScanModalOpen(false);
 };
 const checkForNewBadges = (completedCount: number, totalDistance: number) => {
    const newBadgesFound: Badge[] = [];
    // 예시 로직: 첫 완주 뱃지
    if (completedCount === 1) {
      const badge = mockBadges.find(b => b.id === 1);
      if (badge && !myBadges.find(b => b.id === badge.id)) newBadgesFound.push(badge);
    }
    // 뱃지 획득 시 모달 표시
    if (newBadgesFound.length > 0) {
      setMyBadges(prev => [...prev, ...newBadgesFound]);
      setNewBadge(newBadgesFound[0]);
      setIsBadgeModalOpen(true);
    }
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
      userName: currentUser.nickname, // 백엔드에서 User정보로 처리하지만 DTO 맞춤
      rating,
      content,
    };

    try {
      const response = await axios.post('/api/reviews', reviewData);
      setReviews(prev => [response.data, ...prev]); // 새 리뷰를 맨 앞에 추가 (최신순)
      setIsReviewModalOpen(false);
      toast.success('리뷰가 작성되었습니다!');
    } catch (error) {
      console.error(error);
      toast.error('리뷰 작성에 실패했습니다.');
    }
  };

  // --- 렌더링 ---

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 (로딩중이거나 소셜 처리중일 땐 숨김 가능) */}
      {currentPage !== 'loading' && currentPage !== 'authCallback' && currentPage !== 'registerSocial' && (
        <Header currentUser={currentUser} currentPage={currentPage} onPageChange={setCurrentPage} onAuthClick={openAuth} onLogout={handleLogout} />
      )}

      {/* 로딩 화면 */}
      {currentPage === 'loading' && (
        <div className="flex items-center justify-center min-h-screen flex-col gap-4">
          <div className="w-16 h-16 border-8 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
          <p className="text-gray-500">데이터를 불러오는 중입니다...</p>
        </div>
      )}

      {/* 소셜 로그인 처리 페이지 */}
      {currentPage === 'authCallback' && <AuthCallback />}
      {currentPage === 'registerSocial' && <RegisterSocial />}

      {/* 메인 페이지들 */}
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

      {currentPage === 'map' && (<MapSection courses={courses} favorites={favorites} completedCourses={completedCourses} onCourseClick={openCourseDetail} onFavoriteClick={toggleFavorite} currentUser={currentUser} />)}
      {currentPage === 'about' && <About />}

      {currentPage === 'community' && (
        <Community
          courses={courses}
          reviews={reviews}
          currentUser={currentUser}
          badges={myBadges}
          completedCourses={completedCourses}
          onCourseClick={openCourseDetail}
          announcements={announcements}
          courseRankings={courseRankings}
          globalRanking={globalRanking}
        />
      )}

      {currentPage === 'mypage' && currentUser && (
        <MyPage user={currentUser} courses={courses} reviews={reviews} badges={myBadges} favorites={favorites} completedCourses={completedCourses} onCourseClick={openCourseDetail} onUserUpdate={setCurrentUser} allBadges={allBadges} />
      )}

      {currentPage === 'admin' && (<AdminPage courses={courses} onCoursesUpdate={setCourses} />)}

      {/* 모달 컴포넌트들 */}
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

      {/* ✨ [중요] AuthModal 연결 수정 
        - onSubmit 제거
        - onLoginSuccess 추가: 로그인 성공 시 fetchUserWithToken 호출하여 유저 상태 갱신
      */}
      <AuthModal
        isOpen={isAuthModalOpen}
        mode={authMode}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={() => fetchUserWithToken()} // 인자 없이 호출하면 localStorage 토큰 사용
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