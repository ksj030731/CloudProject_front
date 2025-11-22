import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
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
import galmaetgilMapImage from '../img/map.png';

interface MapSectionProps {
  courses: Course[];
  favorites: number[];
  completedCourses: number[];
  onCourseClick: (course: Course) => void;
  onFavoriteClick: (courseId: number) => void;
  currentUser: User | null;
}

export function MapSection({ 
  courses, 
  favorites, 
  completedCourses, 
  onCourseClick, 
  onFavoriteClick,
  currentUser 
}: MapSectionProps) {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showFilters, setShowFilters] = useState({
    restroom: true,
    drinkingWater: true,
    viewpoint: true,
    parking: true
  });

  // 네이버 지도 관련 Hooks 추가
  const mapElement = useRef<HTMLDivElement>(null);

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
  };

  const toggleFilter = (filter: keyof typeof showFilters) => {
    setShowFilters(prev => ({
      ...prev,
      [filter]: !prev[filter]
    }));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case '쉬움': return 'bg-green-500';
      case '보통': return 'bg-yellow-500';
      case '어려움': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getCourseColor = (courseId: number) => {
    const courseColors : { [key: number]: string }= {
      1: 'bg-blue-500',      // 1코스 - 기장 해안 (파란색)
      2: 'bg-emerald-500',   // 2코스 - 해운대-광안리 (에메랄드)
      3: 'bg-purple-500',    // 3코스 - 광안리-태종대 (보라색)
      4: 'bg-orange-500',    // 4코스 - 태종대-다대포 (주황색)
      5: 'bg-red-500',       // 5코스 - 가덕도 (빨간색)
      6: 'bg-green-500',     // 6코스 - 강서-금정 (초록색)
      7: 'bg-yellow-500',    // 7코스 - 금정산 (노란색)
      8: 'bg-indigo-500',    // 8코스 - 동래-수영 (남색)
      9: 'bg-pink-500'       // 9코스 - 기장 순환 (분홍색)
    };
    return courseColors[courseId] || 'bg-gray-500';
  };

  // --- 네이버 지도 초기화 로직 ---
  useEffect(() => {
    if (!mapElement.current || !window.naver || !window.naver.maps) {
      console.warn("Naver Map script not loaded yet.");
      return; 
    }

    const center = new window.naver.maps.LatLng(35.1796, 129.0756); // 부산 중심
    const mapOptions: naver.maps.MapOptions = {
      center: center,
      zoom: 11,
      minZoom: 9,
      // [참고] 기존 CSS 컨트롤과 겹치므로 API 컨트롤은 끕니다.
      zoomControl: false,
      mapDataControl: false,
      scaleControl: false,
    };

    new window.naver.maps.Map(mapElement.current, mapOptions);

  }, []); // 최초 1회만 실행

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-center mb-4 text-4xl font-bold">갈맷길 통합 지도</h1>
          <p className="text-center text-gray-600 max-w-2xl mx-auto">
            부산 전체 갈맷길 코스와 편의시설을 한눈에 확인하세요. 
            필터를 사용해 원하는 정보만 표시할 수 있습니다.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* 왼쪽 사이드바 */}
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span>🚻</span>
                    <span>화장실</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFilter('restroom')}
                    className="p-1"
                  >
                    {showFilters.restroom ? 
                      <Eye className="w-4 h-4 text-green-600" /> : 
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    }
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span>🚰</span>
                    <span>식수대</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFilter('drinkingWater')}
                    className="p-1"
                  >
                    {showFilters.drinkingWater ? 
                      <Eye className="w-4 h-4 text-green-600" /> : 
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    }
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span>📸</span>
                    <span>전망대</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFilter('viewpoint')}
                    className="p-1"
                  >
                    {showFilters.viewpoint ? 
                      <Eye className="w-4 h-4 text-green-600" /> : 
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    }
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span>🅿️</span>
                    <span>주차장</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFilter('parking')}
                    className="p-1"
                  >
                    {showFilters.parking ? 
                      <Eye className="w-4 h-4 text-green-600" /> : 
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    }
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 코스 목록 */}
            <Card>
              <CardHeader>
                <CardTitle className="font-bold">전체 코스</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 max-h-96 overflow-y-auto">
                {courses.map(course => (
                  <div
                    key={course.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedCourse?.id === course.id 
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
                  {/* 갈맷길 전체지도 */}
                  <div 
                  ref={mapElement}
                  className="w-full h-full absolute top-0 left-0" // 3. 다른 UI에 겹치도록 absolute 추가 
                  />

                  {/* 클릭 가능한 투명 영역들 - 갈맷길 코스별 위치 */}
                  {courses.map((course) => {
                    // 새로운 갈맷길 지도상의 각 코스 위치에 맞춘 좌표
                    const getCoordinates = (courseId: number) => {
                      const positions : { [key: number]: { left: string; top: string } } = {
                        1: { left: '78%', top: '55%' },    // 1코스 (기장 해안 - 오른쪽 상단)
                        2: { left: '75%', top: '45%' },    // 2코스 (해운대-광안리)
                        3: { left: '65%', top: '60%' },    // 3코스 (광안리-용호만)
                        4: { left: '50%', top: '75%' },    // 4코스 (용호만-다대포)
                        5: { left: '30%', top: '80%' },    // 5코스 (다대포-가덕도 - 왼쪽 하단)
                        6: { left: '45%', top: '65%' },    // 6코스 (사하-을숙도)
                        7: { left: '55%', top: '25%' },    // 7코스 (금정산 - 상단 중앙)
                        8: { left: '68%', top: '15%' },    // 8코스 (동래-기장 - 상단 우측)
                        9: { left: '58%', top: '8%' }      // 9코스 (금정산 순환 - 최상단)
                      };
                      return positions[courseId] || { left: '50%', top: '50%' };
                    };
                    
                    const coords = getCoordinates(course.id);
                    
                    return (
                      <div
                        key={course.id}
                        className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 ${
                          selectedCourse?.id === course.id ? 'scale-125 z-10' : 'hover:scale-110'
                        }`}
                        style={coords}
                        onClick={() => handleCourseSelect(course)}
                      >
                        <div className={`w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center ${
                          completedCourses.includes(course.id) 
                            ? 'bg-green-500 text-white'
                            : getCourseColor(course.id) + ' text-white'
                        }`}>
                          {completedCourses.includes(course.id) ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            <span className="font-bold text-xs">{course.id}</span>
                          )}
                        </div>
                        
                        {/* 코스 정보 팝업 */}
                        {selectedCourse?.id === course.id && (
                          <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-3 min-w-48 z-20">
                            <h4 className="font-medium mb-1">{course.name}</h4>
                            <p className="text-xs text-gray-600 mb-2">{course.distance}km · {course.duration}</p>
                            <div className="flex justify-between items-center">
                              <Badge className={`text-xs ${getCourseColor(course.id)} text-white`}>
                                {course.name}
                              </Badge>
                              <div className="flex space-x-1">
                                {currentUser && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e: React.MouseEvent) => {
                                      e.stopPropagation();
                                      onFavoriteClick(course.id);
                                    }}
                                    className="p-1 h-auto"
                                  >
                                    <Heart 
                                      className={`w-4 h-4 ${
                                        favorites.includes(course.id) 
                                          ? 'fill-red-500 text-red-500' 
                                          : 'text-gray-600'
                                      }`} 
                                    />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e: React.MouseEvent) => {
                                    e.stopPropagation();
                                    onCourseClick(course);
                                  }}
                                  className="p-1 h-auto"
                                >
                                  <Navigation className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* 편의시설 마커들 - 코스 마커와 겹치지 않게 조정된 위치 */}
                  {showFilters.restroom && (
                    <>
                      <div className="absolute w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs cursor-pointer shadow-lg" style={{left: '82%', top: '58%'}}>
                        🚻
                      </div>
                      <div className="absolute w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs cursor-pointer shadow-lg" style={{left: '53%', top: '78%'}}>
                        🚻
                      </div>
                      <div className="absolute w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs cursor-pointer shadow-lg" style={{left: '25%', top: '85%'}}>
                        🚻
                      </div>
                    </>
                  )}
                  {showFilters.drinkingWater && (
                    <>
                      <div className="absolute w-5 h-5 bg-cyan-500 rounded-full flex items-center justify-center text-white text-xs cursor-pointer shadow-lg" style={{left: '70%', top: '68%'}}>
                        🚰
                      </div>
                      <div className="absolute w-5 h-5 bg-cyan-500 rounded-full flex items-center justify-center text-white text-xs cursor-pointer shadow-lg" style={{left: '62%', top: '32%'}}>
                        🚰
                      </div>
                      <div className="absolute w-5 h-5 bg-cyan-500 rounded-full flex items-center justify-center text-white text-xs cursor-pointer shadow-lg" style={{left: '38%', top: '88%'}}>
                        🚰
                      </div>
                    </>
                  )}
                  {showFilters.viewpoint && (
                    <>
                      <div className="absolute w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs cursor-pointer shadow-lg" style={{left: '85%', top: '52%'}}>
                        📸
                      </div>
                      <div className="absolute w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs cursor-pointer shadow-lg" style={{left: '62%', top: '12%'}}>
                        📸
                      </div>
                      <div className="absolute w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs cursor-pointer shadow-lg" style={{left: '48%', top: '52%'}}>
                        📸
                      </div>
                    </>
                  )}
                  {showFilters.parking && (
                    <>
                      <div className="absolute w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs cursor-pointer shadow-lg" style={{left: '72%', top: '38%'}}>
                        🅿️
                      </div>
                      <div className="absolute w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs cursor-pointer shadow-lg" style={{left: '40%', top: '68%'}}>
                        🅿️
                      </div>
                      <div className="absolute w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs cursor-pointer shadow-lg" style={{left: '22%', top: '82%'}}>
                        🅿️
                      </div>
                    </>
                  )}

                  {/* 범례 */}
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg max-h-48 overflow-y-auto">
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

                  {/* 지도 컨트롤 */}
                  <div className="absolute top-4 right-4 flex flex-col space-y-2">
                    <Button variant="secondary" size="sm" className="bg-white/90 backdrop-blur-sm">
                      +
                    </Button>
                    <Button variant="secondary" size="sm" className="bg-white/90 backdrop-blur-sm">
                      -
                    </Button>
                    <Button variant="secondary" size="sm" className="bg-white/90 backdrop-blur-sm p-2">
                      <Navigation className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 선택된 코스 정보 */}
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