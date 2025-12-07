import { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { restroomCoordinates, AmenityMarker } from '../data/restroomData.ts';
import { NaverMap } from './NaverMap';

import {
  Eye,
  EyeOff,
  Layers
} from 'lucide-react';
import { Course, User } from '../types';

// ------------------------------------------------------------------

interface AmenityData {
  restroom: AmenityMarker[];
  viewpoint: AmenityMarker[];
  drinkingWater: AmenityMarker[];
  parking: AmenityMarker[];
}

interface MapSectionProps {
  courses: Course[];
  favorites: number[];
  completedCourses: number[];
  onCourseClick: (course: Course) => void;
  onFavoriteClick: (courseId: number) => void;
  currentUser: User | null;
}

// 임시 좌표 데이터
const staticAmenities: Pick<AmenityData, 'viewpoint' | 'drinkingWater' | 'parking'> = {
  drinkingWater: [
    { lat: 35.140, lng: 129.140, label: '🚰', color: '#06b6d4', name: '임시 식수대 1' },
    { lat: 35.200, lng: 129.200, label: '🚰', color: '#06b6d4', name: '임시 식수대 2' },
  ] as AmenityMarker[],
  viewpoint: [
    { lat: 35.150, lng: 129.100, label: '📸', color: '#9333ea', name: '임시 포토존 1' },
    { lat: 35.120, lng: 129.080, label: '📸', color: '#9333ea', name: '임시 포토존 2' },
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
                             currentUser
                           }: MapSectionProps) {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showFilters, setShowFilters] = useState({
    restroom: true,
    drinkingWater: true,
    viewpoint: true,
    parking: true
  });

  const [apiAmenities] = useState<AmenityData>({
    restroom: restroomCoordinates,
    viewpoint: staticAmenities.viewpoint,
    drinkingWater: staticAmenities.drinkingWater,
    parking: staticAmenities.parking,
  });

  // 지도 인스턴스 Ref: NaverMap 컴포넌트와 줌 컨트롤을 위해 공유
  const mapInstanceRef = useRef<any>(null);

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
  };

  const toggleFilter = (filter: keyof typeof showFilters) => {
    setShowFilters(prev => ({
      ...prev,
      [filter]: !prev[filter]
    }));
  };

  const getCourseColor = (courseId: number) => {
    const courseColors: { [key: number]: string } = {
      1: 'bg-blue-500', 2: 'bg-emerald-500', 3: 'bg-purple-500',
      4: 'bg-orange-500', 5: 'bg-red-500', 6: 'bg-green-500',
      7: 'bg-yellow-500', 8: 'bg-indigo-500', 9: 'bg-pink-500'
    };
    return courseColors[courseId] || 'bg-gray-500';
  };


  // --- [렌더링 영역] ------------------------------------------------------------------

  return (
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <h1 className="mb-10 text-4xl font-bold text-gray-900 text-center">갈맷길 지도</h1>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* 왼쪽 사이드바 (필터 및 코스 목록)  */}
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
                          <span>{key === 'restroom' ? '화장실' : key === 'drinkingWater' ? '식수대' : key === 'viewpoint' ? '포토존' : '주차장'}</span>
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

              {/* 코스 목록 */}
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
                                <span className="w-4 h-4 text-green-500">✅</span>
                            )}
                            {currentUser && favorites.includes(course.id) && (
                                <span className="w-4 h-4 fill-red-500 text-red-500">❤️</span>
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

                    {/* NaverMap 컴포넌트를 호출하고 지도 인스턴스 Ref와 데이터 props를 전달 */}
                    <NaverMap
                        mapInstanceRef={mapInstanceRef}
                        courses={courses}
                        completedCourses={completedCourses}
                        apiAmenities={apiAmenities}
                        showFilters={showFilters}
                        onCourseSelect={handleCourseSelect}
                    />

                    {/* 범례 */}
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
                            <span className="w-4 h-4 text-green-500">✅</span>
                            <span>완주</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 줌 컨트롤 버튼 */}
                    <div className="absolute top-4 right-4 flex flex-col space-y-2 z-10">
                      <Button variant="secondary" size="sm" className="bg-white/90 backdrop-blur-sm"
                              onClick={() => mapInstanceRef.current?.setZoom(mapInstanceRef.current.getZoom() + 1)}>
                        +
                      </Button>
                      <Button variant="secondary" size="sm" className="bg-white/90 backdrop-blur-sm"
                              onClick={() => mapInstanceRef.current?.setZoom(mapInstanceRef.current.getZoom() - 1)}>
                        -
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 선택된 코스 정보  */}
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