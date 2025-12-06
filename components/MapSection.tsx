/// <reference types="navermaps" />
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { fetchGalmaetgilRestrooms, AmenityMarker } from '../utils/galmaetgilApi'; // ✅ API 함수와 타입 import
import coursePaths, { PathCoordinate } from '../data/coursePaths'; // ✅ 경로 데이터 import

import {
  Map,
  MapPin,
  Eye,
  EyeOff,
  Navigation,
  Heart,
  CheckCircle,
  Layers
} from 'lucide-react';
import { Course, User } from '../types';

// 네이버 지도 API의 전역 객체 naver.maps에 대한 타입 정의를 사용합니다.
declare global {
  interface Window {
    naver: any; // @types/navermaps 설치 시 naver.maps가 정의됨
  }
}

interface MapSectionProps {
  courses: Course[];
  favorites: number[];
  completedCourses: number[];
  onCourseClick: (course: Course) => void;
  onFavoriteClick: (courseId: number) => void;
  currentUser: User | null;
}

// --- [데이터 정의 영역] ------------------------------------------------------------------

// ⚠️ 코스별 대표 위도/경도 데이터 (마커 중앙 위치용)
const courseCoordinates: { [key: number]: { lat: number; lng: number } } = {
  1: { lat: 35.2618, lng: 129.2370 },
  2: { lat: 35.1503, lng: 129.1500 },
  3: { lat: 35.1150, lng: 129.0700 },
  4: { lat: 35.0837, lng: 129.0040 },
  5: { lat: 35.0915, lng: 128.8850 },
  6: { lat: 35.1474, lng: 129.0010 },
  7: { lat: 35.2255, lng: 129.0820 },
  8: { lat: 35.2217, lng: 129.0970 },
  9: { lat: 35.2604, lng: 129.1640 },
};


// ⚠️ 편의시설 임시 좌표 데이터 (AmenityMarker 타입으로 명시)
const amenityCoordinates = {
  restroom: [
    { lat: 35.185, lng: 129.170, label: '🚻', color: '#3b82f6', name: '임시 화장실 1' },
    { lat: 35.100, lng: 129.000, label: '🚻', color: '#3b82f6', name: '임시 화장실 2' },
    { lat: 35.280, lng: 129.000, label: '🚻', color: '#3b82f6', name: '임시 화장실 3' },
  ] as AmenityMarker[],
  drinkingWater: [
    { lat: 35.140, lng: 129.140, label: '🚰', color: '#06b6d4', name: '임시 식수대 1' },
    { lat: 35.200, lng: 129.200, label: '🚰', color: '#06b6d4', name: '임시 식수대 2' },
  ] as AmenityMarker[],
  viewpoint: [
    { lat: 35.150, lng: 129.100, label: '📸', color: '#9333ea', name: '임시 전망대 1' },
    { lat: 35.120, lng: 129.080, label: '📸', color: '#9333ea', name: '임시 전망대 2' },
  ] as AmenityMarker[],
  parking: [
    { lat: 35.170, lng: 129.150, label: '🅿️', color: '#f97316', name: '임시 주차장 1' },
    { lat: 35.090, lng: 128.950, label: '🅿️', color: '#f97316', name: '임시 주차장 2' },
  ] as AmenityMarker[],
};


export function MapSection({
                             courses,
                             favorites,
                             completedCourses,
                             onCourseClick,
                             onFavoriteClick,
                             currentUser
                           }: MapSectionProps) {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null); // ✅ 초기화 오류 수정
  const [showFilters, setShowFilters] = useState({
    restroom: true,
    drinkingWater: true,
    viewpoint: true,
    parking: true
  });

  // ⭐️ API에서 가져온 화장실 마커 데이터를 저장할 State ⭐️
  const [restroomMarkers, setRestroomMarkers] = useState<AmenityMarker[]>([]);


  // 지도 인스턴스 관련 Ref
  const mapElement = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<naver.maps.Map | null>(null);
  const courseMarkers = useRef<naver.maps.Marker[]>([]);
  const amenityMarkers = useRef<naver.maps.Marker[]>([]);
  const coursePolylines = useRef<naver.maps.Polyline[]>([]);
  // ⭐️ courseMapData useMemo 제거 후, Ref로 대체하여 initMap 내에서 사용 ⭐️
  const courseMapDataRef = useRef<Record<number, naver.maps.LatLng>>({});


  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
  };

  const toggleFilter = (filter: keyof typeof showFilters) => {
    setShowFilters(prev => ({
      ...prev,
      [filter]: !prev[filter]
    }));
  };

  // Tailwind CSS 클래스 반환 함수 (UI 용) - 유지
  const getCourseColor = (courseId: number) => {
    const courseColors: { [key: number]: string } = {
      1: 'bg-blue-500',
      2: 'bg-emerald-500',
      3: 'bg-purple-500',
      4: 'bg-orange-500',
      5: 'bg-red-500',
      6: 'bg-green-500',
      7: 'bg-yellow-500',
      8: 'bg-indigo-500',
      9: 'bg-pink-500'
    };
    return courseColors[courseId] || 'bg-gray-500';
  };

  // 지도 폴리라인에 사용할 16진수 색상 코드 반환 함수 - 유지
  const getCourseHexColor = (courseId: number): string => {
    const courseColors: { [key: number]: string } = {
      1: '#3b82f6', // blue-500
      2: '#10b981', // emerald-500
      3: '#a855f7', // purple-500
      4: '#f97316', // orange-500
      5: '#ef4444', // red-500
      6: '#22c55e', // green-500
      7: '#f59e0b', // yellow-500
      8: '#6366f1', // indigo-500
      9: '#ec4899', // pink-500
    };
    return courseColors[courseId] || '#6b7280';
  };

  // 마커 HTML 생성 함수 - 유지
  const createMarkerContent = (course: Course, isCompleted: boolean, colorClass: string) => {
    return `
      <div 
        class="w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center cursor-pointer 
        ${isCompleted ? 'bg-green-500 text-white' : colorClass + ' text-white'}
        "
        style="
          transform: translate(-50%, -50%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: sans-serif;
          font-weight: bold;
        "
      >
        ${isCompleted ?
        '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>' :
        `<span class="text-xs">${course.id}</span>`
    }
      </div>
    `;
  };

  // 편의시설 마커 HTML 생성 - 유지
  const createAmenityMarkerContent = (label: string, bgColor: string) => {
    return `
      <div 
        class="w-6 h-6 rounded-full border border-white shadow-lg flex items-center justify-center cursor-pointer"
        style="
          background-color: ${bgColor};
          color: white;
          font-size: 14px;
          transform: translate(-50%, -50%);
          font-family: sans-serif;
        "
      >
        ${label}
      </div>
    `;
  };

  // ❌ courseMapData useMemo 블록 제거됨


  // ⭐️ 1. API에서 화장실 데이터를 한 번만 가져오는 useEffect (로직 복구) ⭐️
  useEffect(() => {
    const loadRestrooms = async () => {
      try {
        const data = await fetchGalmaetgilRestrooms();
        setRestroomMarkers(data);
      } catch (error) {
        console.error("화장실 마커 로딩 실패", error);
      }
    };
    // 컴포넌트 마운트 시 한 번만 API 호출
    loadRestrooms();
  }, []);


  // ⭐️ 지도 초기화 및 마커/폴리라인 생성/갱신 로직 (useEffect)
  useEffect(() => {
    const initMap = () => {
      // 1. 네이버 지도 객체 로드 및 DOM 확인
      if (!mapElement.current || typeof window.naver === 'undefined' || !window.naver.maps) {
        console.warn("Naver Map script not loaded yet or DOM ref is null.");
        return;
      }

      let map: naver.maps.Map;

      // 2. 지도 인스턴스 생성 또는 재사용
      if (!mapInstance.current) {
        const center = new window.naver.maps.LatLng(35.1796, 129.0756); // 부산 중심
        const mapOptions: naver.maps.MapOptions = {
          center: center,
          zoom: 11,
          minZoom: 9,
          zoomControl: false,
          mapDataControl: false,
          scaleControl: false,
        };
        // @ts-ignore
        map = new window.naver.maps.Map(mapElement.current, mapOptions);
        mapInstance.current = map;
      } else {
        map = mapInstance.current;
      }

      // ⭐️⭐️⭐️ 3. LatLng 객체 생성 로직을 여기서 실행 (마커 문제 해결) ⭐️⭐️⭐️
      courseMapDataRef.current = courses.reduce((acc, course) => {
        const coords = courseCoordinates[course.id];
        if (coords) {
          // @ts-ignore
          acc[course.id] = new window.naver.maps.LatLng(coords.lat, coords.lng);
        }
        return acc;
      }, {} as Record<number, naver.maps.LatLng>);
      // ⭐️⭐️⭐️ ------------------------------------------- ⭐️⭐️⭐️


      // 4. 기존 객체 모두 제거 (갱신을 위해)
      courseMarkers.current.forEach(marker => marker.setMap(null));
      amenityMarkers.current.forEach(marker => marker.setMap(null));
      coursePolylines.current.forEach(polyline => polyline.setMap(null));

      courseMarkers.current = [];
      amenityMarkers.current = [];
      coursePolylines.current = [];

      // 5. 코스 마커 재생성 및 이벤트 연결 - 수정
      courses.forEach(course => {
        const position = courseMapDataRef.current[course.id]; // ⭐️ Ref에서 위치를 가져옴
        if (!position) return; // ⭐️ position이 유효하지 않으면 생성 건너뜀

        const isCompleted = completedCourses.includes(course.id);
        const colorClass = getCourseColor(course.id);

        const markerContent = createMarkerContent(course, isCompleted, colorClass);

        // @ts-ignore
        const marker = new window.naver.maps.Marker({
          position: position,
          map: map,
          icon: {
            content: markerContent,
            size: new window.naver.maps.Size(32, 32),
            anchor: new window.naver.maps.Point(16, 16),
          }
        });

        window.naver.maps.Event.addListener(marker, 'click', () => {
          handleCourseSelect(course);
        });

        courseMarkers.current.push(marker);
      });

      // ⭐️ 6. 코스 폴리라인 생성 및 지도에 추가 (coursePaths 데이터 사용)
      courses.forEach(course => {
        const pathData: PathCoordinate[] = coursePaths[course.id] || []; // ✅ coursePaths 사용

        if (!pathData || pathData.length < 2) {
          return;
        }

        // 배열의 모든 좌표 객체를 naver.maps.LatLng 객체 배열로 변환합니다.
        // @ts-ignore
        const path: naver.maps.LatLng[] = pathData.map(coord =>
            new window.naver.maps.LatLng(coord.lat, coord.lng)
        );

        const hexColor = getCourseHexColor(course.id);

        // @ts-ignore
        const polyline = new window.naver.maps.Polyline({
          map: map,
          path: path,
          strokeColor: hexColor,
          strokeOpacity: 0.8,
          strokeWeight: 6,
          clickable: true
        });

        // 폴리라인 클릭 이벤트 추가 (코스 선택 기능)
        window.naver.maps.Event.addListener(polyline, 'click', () => {
          handleCourseSelect(course);
        });

        coursePolylines.current.push(polyline);
      });


      // ⭐️ 7. 편의시설 마커 생성 및 지도에 추가 (API 데이터 통합) ⭐️
      // API에서 가져온 restroomMarkers가 있으면 사용하고, 없으면 임시 데이터를 사용합니다.
      const finalAmenities = {
        restroom: restroomMarkers.length > 0 ? restroomMarkers : amenityCoordinates.restroom,
        drinkingWater: amenityCoordinates.drinkingWater,
        viewpoint: amenityCoordinates.viewpoint,
        parking: amenityCoordinates.parking,
      };

      Object.entries(finalAmenities).forEach(([key, amenities]) => {
        // amenities가 AmenityMarker[] 타입임을 명시
        const currentAmenities = amenities as AmenityMarker[];

        if (showFilters[key as keyof typeof showFilters]) {
          currentAmenities.forEach(amenity => {
            // @ts-ignore
            const position = new window.naver.maps.LatLng(amenity.lat, amenity.lng);

            // amenity.label (예: '🚻')과 amenity.color (예: '#3b82f6') 사용
            const amenityMarkerContent = createAmenityMarkerContent(amenity.label, amenity.color);

            // @ts-ignore
            const marker = new window.naver.maps.Marker({
              position: position,
              map: map,
              icon: {
                content: amenityMarkerContent,
                size: new window.naver.maps.Size(24, 24),
                anchor: new window.naver.maps.Point(12, 12),
              }
            });
            amenityMarkers.current.push(marker);
          });
        }
      });
      // ⭐️ ------------------------------------------------------------- ⭐️

      // ⭐️ 8. 지도 중앙 재설정 (마커 위치를 강제로 화면에 보이게 함) ⭐️
      const initialCoords = courseCoordinates[1] || { lat: 35.1796, lng: 129.0756 };
      const center = new window.naver.maps.LatLng(initialCoords.lat, initialCoords.lng);

      map.setCenter(center);
      map.setZoom(11);

    };

    if (typeof window.naver !== 'undefined' && window.naver.maps) {
      initMap();
    } else {
      const scriptId = 'naver-map-script';
      const clientId = import.meta.env.VITE_NAVER_CLIENT_ID;

      if (!clientId) {
        console.error("VITE_NAVER_CLIENT_ID is not defined");
        return;
      }

      let script = document.getElementById(scriptId) as HTMLScriptElement;
      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}`;
        script.onload = () => initMap();
        document.head.appendChild(script);
      } else {
        script.addEventListener('load', initMap);
      }
    }

  }, [courses, completedCourses, showFilters, restroomMarkers]); // ⭐️ 의존성 배열에 courseMapDataRef 대신 restroomMarkers 유지 ⭐️

  // --- [렌더링 영역] ------------------------------------------------------------------

  return (
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* ⭐️⭐️⭐️ 추가된 부분: '갈맷길 지도' 제목 ⭐️⭐️⭐️ */}
          <h1 className="mb-10 text-4xl font-bold text-gray-900 text-center">갈맷길 지도</h1>
          {/* ⭐️⭐️⭐️ --------------------------------- ⭐️⭐️⭐️ */}

          <div className="grid lg:grid-cols-4 gap-6">
            {/* 왼쪽 사이드바 (필터 및 코스 목록) - 유지 */}
            <div className="lg:col-span-1 space-y-6">
              {/* 편의시설 필터 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center font-bold">
                    <Layers className="w-5 h-5 mr-2" />
                    편의시설 필터
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(showFilters).map(([key, isVisible]) => (
                      <div key={key} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span>{key === 'restroom' ? '🚻' : key === 'drinkingWater' ? '🚰' : key === 'viewpoint' ? '📸' : '🅿️'}</span>
                          <span>{key === 'restroom' ? '화장실' : key === 'drinkingWater' ? '식수대' : key === 'viewpoint' ? '전망대' : '주차장'}</span>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleFilter(key as keyof typeof showFilters)}
                            className="p-1"
                        >
                          {isVisible ?
                              <Eye className="w-4 h-4 text-green-600" /> :
                              <EyeOff className="w-4 h-4 text-gray-400" />
                          }
                        </Button>
                      </div>
                  ))}
                </CardContent>
              </Card>

              {/* 코스 목록 (유지) */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-bold">전체 코스</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 max-h-96 overflow-y-auto">
                  {courses.map(course => (
                      <div
                          key={course.id}
                          className={`p-3 rounded-lg border cursor-pointer transition-colors ${selectedCourse?.id === course.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => handleCourseSelect(course)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{course.name}</h4>
                            <p className="text-xs text-gray-600">{course.distance}km · {course.duration}</p>
                          </div>
                          <div className="flex space-x-1">
                            {completedCourses.includes(course.id) && (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                            )}
                            {currentUser && favorites.includes(course.id) && (
                                <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <Badge
                              className={`text-xs ${getCourseColor(course.id)} text-white`}
                          >
                            {course.name}
                          </Badge>
                          <span className="text-xs text-gray-500">{course.region}</span>
                        </div>
                      </div>
                  ))}
                </CardContent>
              </Card>

            </div>

            {/* 지도 영역 */}
            <div className="lg:col-span-3">
              <Card className="h-[600px]">
                <CardContent className="p-0 h-full">
                  <div className="h-full rounded-lg relative overflow-hidden">

                    {/* ⭐️ 1. 지도 API가 마운트될 DOM 요소 ⭐️ */}
                    <div
                        ref={mapElement}
                        className="w-full h-full"
                    />

                    {/* 3. 범례 (유지) */}
                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg max-h-48 overflow-y-auto z-10">
                      <h4 className="font-medium mb-2 text-sm">코스 범례</h4>
                      <div className="space-y-1 text-xs">
                        {courses.slice(0, 5).map(course => (
                            <div key={course.id} className="flex items-center space-x-2">
                              <div className={`w-4 h-4 rounded-full ${getCourseColor(course.id)}`}></div>
                              <span>{course.name}</span>
                            </div>
                        ))}
                        <div className="border-t pt-1 mt-2">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>완주</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 4. 지도 컨트롤 (유지) */}
                    <div className="absolute top-4 right-4 flex flex-col space-y-2 z-10">
                      <Button variant="secondary" size="sm" className="bg-white/90 backdrop-blur-sm"
                              onClick={() => mapInstance.current?.setZoom(mapInstance.current.getZoom() + 1)}>
                        +
                      </Button>
                      <Button variant="secondary" size="sm" className="bg-white/90 backdrop-blur-sm"
                              onClick={() => mapInstance.current?.setZoom(mapInstance.current.getZoom() - 1)}>
                        -
                      </Button>
                      <Button variant="secondary" size="sm" className="bg-white/90 backdrop-blur-sm p-2">
                        <Navigation className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 선택된 코스 정보 (유지) */}
              {selectedCourse && (
                  <Card className="mt-4">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{selectedCourse.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{selectedCourse.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>{selectedCourse.distance}km</span>
                            <span>{selectedCourse.duration}</span>
                            <span>{selectedCourse.difficulty}</span>
                          </div>
                        </div>
                        <Button onClick={() => onCourseClick(selectedCourse)}>
                          상세보기
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
              )}
            </div>
          </div>
        </div>
      </section>
  );
}