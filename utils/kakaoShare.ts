import { Course } from '../types';

export const shareKakao = (course: Course) => {
  // 1. 카카오 SDK 로드 확인
  if (!window.Kakao) {
    console.error('Kakao SDK가 로드되지 않았습니다.');
    return;
  }

  const kakaoKey = import.meta.env.VITE_KAKAO_JS_KEY;

  // 2. 초기화 확인 및 수행
  if (!window.Kakao.isInitialized()) {
    window.Kakao.init(kakaoKey);
  }

  // 3. 공유 메시지 구성 (검색어 최적화)
  
  // [핵심 1] 지도 핀 위치 설정
  // 코스의 첫 번째 구간 시작점 주소가 있으면 사용하고, 없으면 지역명 사용
  const startAddress = (course.sections && course.sections.length > 0) 
    ? course.sections[0].startPoint 
    : (course.region || "부산광역시");

  // [핵심 2] 지도 타이틀 (검색어) 설정
  // 예: "갈맷길 1-1구간" -> 카카오맵에서 이 이름으로 경로를 찾아줍니다.
  const mapSearchQuery = `갈맷길 ${course.name}`; 

  // [핵심 3] 이동 링크 (딥링크)
  // 클릭 시 해당 코스 모달을 바로 띄우기 위해 파라미터 추가
  const domain = window.location.origin; // 예: https://my-cloud...
  const shareUrl = `${domain}/?courseId=${course.id}`;

  // 4. 카카오톡 전송
  window.Kakao.Share.sendDefault({
    objectType: 'location', // 지도(위치) 템플릿 사용
    
    address: startAddress,        // 핀이 꽂힐 대략적인 주소
    addressTitle: mapSearchQuery, // 지도의 이름 (클릭 시 검색어로 사용됨)
    
    content: {
      title: `[부산 갈맷길] ${course.name} 같이 걸을래?`,
      description: `${course.description?.substring(0, 40)}... \n📏 거리: ${course.distance}km | ⏱ 소요: ${course.duration}`,
      imageUrl: course.image || 'https://via.placeholder.com/300?text=Galmaetgil',
      link: {
        mobileWebUrl: shareUrl,
        webUrl: shareUrl,
      },
    },
    
    buttons: [
      {
        title: '코스 자세히 보기',
        link: {
          mobileWebUrl: shareUrl,
          webUrl: shareUrl,
        },
      },
    ],
  });
};