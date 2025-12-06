// src/utils/galmaetgilApi.ts (수정)

import axios from 'axios';
// XML 파싱을 위한 DOMParser 로직이 현재 파일에 있다고 가정합니다.

// 화장실 API 응답 객체의 타입 정의 (필요한 최소 정보)
export interface RestroomApiItem {
    lat: string;
    lng: string;
    name: string;
}

// 지도에 표시될 마커 객체의 타입 정의
export interface AmenityMarker {
    lat: number;
    lng: number;
    label: string; // 마커에 표시될 아이콘 또는 이름
    color: string;
    name: string; // 화장실 이름
}

// ⚠️ API_KEY는 .env 파일에서 가져오거나, 실제 API 호출 시 필요한 Service Key로 대체하세요.
const GALMAETGIL_SERVICE_KEY = import.meta.env.VITE_GALMAETGIL_API_KEY;

// ⭐️⭐️⭐️ 수정: CORS 우회를 위해 프록시 경로를 사용하도록 변경합니다. ⭐️⭐️⭐️
// (vite.config.ts에 /galmaetgil-api가 http://apis.data.go.kr로 연결되어야 함)
const RESTROOM_API_PATH = "/galmaetgil-api/6260000/fbussangmgadvanti.../getgmgrrestroominfo";


/**
 * 갈맷길 화장실 API에서 데이터를 가져와 지도 마커 형식으로 변환합니다.
 * XML 파싱 로직은 사용 중인 라이브러리에 맞게 조정해야 합니다.
 */
export async function fetchGalmaetgilRestrooms(): Promise<AmenityMarker[]> {
    if (!GALMAETGIL_SERVICE_KEY) {
        console.error("❌ 갈맷길 API 키가 .env 파일에 설정되지 않았습니다.");
        return [];
    }

    try {
        // ⭐️⭐️⭐️ 프록시 경로를 사용하도록 수정 ⭐️⭐️⭐️
        const response = await axios.get(RESTROOM_API_PATH, {
            params: {
                ServiceKey: GALMAETGIL_SERVICE_KEY,
                numOfRows: 100, // 충분한 개수 요청
                pageNo: 1,
            },
            // XML 응답을 문자열로 받습니다.
            responseType: 'text'
        });

        // ... (파싱 로직은 유지)
        const xmlString = response.data;
        const items = parseXmlToRestroomItems(xmlString);

        // 지도 마커 형식으로 변환
        return items.map(item => ({
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lng),
            label: '🚻', // 화장실 아이콘
            color: '#3b82f6', // 파란색 계열
            name: item.name
        }));

    } catch (error) {
        // ❌ CORS 오류 대신 상세한 HTTP 상태 코드를 출력하도록 catch 블록을 수정합니다.
        if (axios.isAxiosError(error) && error.response) {
            console.error(
                `❌ 화장실 API 호출 실패. HTTP 상태 코드: ${error.response.status}`,
                '응답 데이터:', error.response.data
            );
        } else {
            // 네트워크 오류(CORS 우회 실패) 또는 기타 오류 시 출력
            console.error("❌ 화장실 API 호출 실패 (프록시 설정 또는 키 오류 가능성):", error);
        }
        return [];
    }
}

/**
 * ⚠️ XML 문자열에서 <lat>, <lng>, <name> 태그를 추출하는 임시 파서 함수
 * 이 코드는 DOMParser 또는 xml2js로 교체하는 것이 안정적입니다.
 */
function parseXmlToRestroomItems(xml: string): RestroomApiItem[] {
    const items: RestroomApiItem[] = [];
    const itemRegex = /<item>[\s\S]*?<\/item>/g;
    const latRegex = /<lat>(.*?)<\/lat>/;
    const lngRegex = /<lng>(.*?)<\/lng>/;
    const nameRegex = /<name>(.*?)<\/name>/;

    let match;
    while ((match = itemRegex.exec(xml)) !== null) {
        const itemXml = match[0];
        const latMatch = itemXml.match(latRegex);
        const lngMatch = itemXml.match(lngRegex);
        const nameMatch = itemXml.match(nameRegex);

        if (latMatch && lngMatch && nameMatch) {
            items.push({
                lat: latMatch[1].trim(),
                lng: lngMatch[1].trim(),
                name: nameMatch[1].trim()
            });
        }
    }
    return items;
}