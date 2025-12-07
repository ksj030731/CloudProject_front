import React, { useRef, useEffect } from 'react';
import coursePaths, { PathCoordinate } from '../data/coursePaths';
import { AmenityMarker } from '../data/restroomData.ts';
import { Course } from '../types';

// 네이버 지도 API 전역 객체 타입 정의
declare global {
    interface Window {
        naver: any;
    }
}

interface NaverMapProps {
    mapInstanceRef: React.MutableRefObject<any>;
    courses: Course[];
    completedCourses: number[];
    apiAmenities: {
        restroom: AmenityMarker[];
        viewpoint: AmenityMarker[];
        drinkingWater: AmenityMarker[];
        parking: AmenityMarker[];
    };
    showFilters: { [key: string]: boolean };
    onCourseSelect: (course: Course) => void;
}

// --- [지도 상수 및 유틸리티] ----------------------------------------------------

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

const getCourseHexColor = (courseId: number): string => {
    const courseColors: { [key: number]: string } = {
        1: '#3b82f6', 2: '#10b981', 3: '#a855f7',
        4: '#f97316', 5: '#ef4444', 6: '#22c55e',
        7: '#f59e0b', 8: '#6366f1', 9: '#ec4899',
    };
    return courseColors[courseId] || '#6b7280';
};

const getCourseColor = (courseId: number) => {
    const courseColors: { [key: number]: string } = {
        1: 'bg-blue-500', 2: 'bg-emerald-500', 3: 'bg-purple-500',
        4: 'bg-orange-500', 5: 'bg-red-500', 6: 'bg-green-500',
        7: 'bg-yellow-500', 8: 'bg-indigo-500', 9: 'bg-pink-500'
    };
    return courseColors[courseId] || 'bg-gray-500';
};

const createMarkerContent = (course: Course, isCompleted: boolean, colorClass: string) => {
    const checkCircleSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>`;

    return `
    <div 
      class="w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center cursor-pointer 
      ${isCompleted ? 'bg-green-500 text-white' : colorClass + ' text-white'}"
      style="transform: translate(-50%, -50%); display: flex; align-items: center; justify-content: center; font-family: sans-serif; font-weight: bold;"
    >
      ${isCompleted ?
        checkCircleSvg :
        `<span class="text-xs">${course.id}</span>`
    }
    </div>
  `;
};

const createAmenityMarkerContent = (label: string, bgColor: string) => {
    return `
    <div 
      class="w-6 h-6 rounded-full border border-white shadow-lg flex items-center justify-center cursor-pointer"
      style="background-color: ${bgColor}; color: white; font-size: 14px; transform: translate(-50%, -50%); font-family: sans-serif;"
    >
      ${label}
    </div>
  `;
};


export function NaverMap({
                             mapInstanceRef,
                             courses,
                             completedCourses,
                             apiAmenities,
                             showFilters,
                             onCourseSelect
                         }: NaverMapProps) {

    const mapElement = useRef<HTMLDivElement>(null);
    const courseMarkers = useRef<naver.maps.Marker[]>([]);
    const amenityMarkers = useRef<naver.maps.Marker[]>([]);
    const coursePolylines = useRef<naver.maps.Polyline[]>([]);
    const courseMapDataRef = useRef<Record<number, naver.maps.LatLng>>({});

    useEffect(() => {
        const initMap = () => {
            if (!mapElement.current || typeof window.naver === 'undefined' || !window.naver.maps) {
                console.warn("Naver Map script not loaded yet or DOM ref is null.");
                return;
            }

            let map: naver.maps.Map;

            // 지도 인스턴스 생성 또는 재사용
            if (!mapInstanceRef.current) {
                const center = new window.naver.maps.LatLng(35.1796, 129.0756);
                const mapOptions: naver.maps.MapOptions = {
                    center: center,
                    zoom: 11,
                    minZoom: 9,
                    zoomControl: false, // MapSection에서 커스텀 버튼으로 제어
                    mapDataControl: false,
                    scaleControl: false,
                };
                // @ts-ignore
                map = new window.naver.maps.Map(mapElement.current, mapOptions);
                mapInstanceRef.current = map;
            } else {
                map = mapInstanceRef.current;
                // 마커와 폴리라인 재표시를 위해 기존 객체 제거
                amenityMarkers.current.forEach(marker => marker.setMap(null));
                amenityMarkers.current = [];
            }

            // LatLng 객체 생성 (마커 위치 데이터)
            courseMapDataRef.current = courses.reduce((acc, course) => {
                const coords = courseCoordinates[course.id];
                if (coords) {
                    // @ts-ignore
                    acc[course.id] = new window.naver.maps.LatLng(coords.lat, coords.lng);
                }
                return acc;
            }, {} as Record<number, naver.maps.LatLng>);


            // 기존 코스 객체 제거 및 배열 초기화
            courseMarkers.current.forEach(marker => marker.setMap(null));
            coursePolylines.current.forEach(polyline => polyline.setMap(null));

            courseMarkers.current = [];
            coursePolylines.current = [];

            // 코스 마커 재생성 및 이벤트 연결
            courses.forEach(course => {
                const position = courseMapDataRef.current[course.id];
                if (!position) return;

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
                    onCourseSelect(course);
                });

                courseMarkers.current.push(marker);
            });

            // 코스 폴리라인 생성 및 지도에 추가
            courses.forEach(course => {
                const pathData: PathCoordinate[] = coursePaths[course.id] || [];

                if (!pathData || pathData.length < 2) {
                    return;
                }

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

                window.naver.maps.Event.addListener(polyline, 'click', () => {
                    onCourseSelect(course);
                });

                coursePolylines.current.push(polyline);
            });

            // 편의시설 마커 생성 및 지도에 직접 추가
            const finalAmenities = apiAmenities;

            Object.entries(finalAmenities).forEach(([key, amenities]) => {
                const currentAmenities = amenities as AmenityMarker[];

                if (showFilters[key as keyof typeof showFilters]) {
                    currentAmenities.forEach(amenity => {
                        // @ts-ignore
                        const position = new window.naver.maps.LatLng(amenity.lat, amenity.lng);

                        const amenityMarkerContent = createAmenityMarkerContent(amenity.label, amenity.color);

                        // @ts-ignore
                        const marker = new window.naver.maps.Marker({
                            position: position,
                            map: map,
                            title: amenity.name,
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

            // 지도 중앙 재설정
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
                if (window.naver && window.naver.maps) {
                    initMap();
                }
            }
        }

    }, [courses, completedCourses, showFilters, apiAmenities]);

    return (
        <div
            ref={mapElement}
            className="w-full h-full"
        />
    );
}