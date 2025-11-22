import React, { useEffect, useRef } from 'react';

const NaverMap = () => {
    const mapElement = useRef<HTMLDivElement>(null);
    useEffect(() => {
    // 2. useEffect에서 지도 객체 생성
    // mapElement.current가 null이거나 window.naver.maps가 로드되지 않았다면 실행 중단
    if (!mapElement.current || !window.naver.maps) return;

    // 지도의 중심 좌표 (예: 갈맷길 1코스 시작점 부근)
    const location = new window.naver.maps.LatLng(35.1931, 129.1245);

    // 지도 옵션 설정
    const mapOptions: naver.maps.MapOptions = {
      center: location,
      zoom: 15, // 확대 레벨
      zoomControl: true,
      zoomControlOptions: {
        position: naver.maps.Position.TOP_RIGHT,
      },
    };

    // 3. 지도 객체 생성
    // new naver.maps.Map(참조할 DOM 요소, 지도 옵션)
    const map = new window.naver.maps.Map(mapElement.current, mapOptions);

    // (선택 사항) 지도 위에 마커 표시하기
    new window.naver.maps.Marker({
      position: location,
      map: map,
    });

    // 참고: 컴포넌트가 언마운트될 때 지도 객체를 파괴하는 로직을
    // return 함수에 추가할 수 있습니다. (예: map.destroy())
    // return () => {
    //   map.destroy();
    // };

  }, []); // 빈 배열을 전달하여 컴포넌트가 마운트될 때 한 번만 실행

  // 4. 지도를 렌더링할 div 요소를 반환
  return (
    <div 
      ref={mapElement} 
      style={{ width: '100%', height: '600px' }} 
    />
  );
};

export default NaverMap;