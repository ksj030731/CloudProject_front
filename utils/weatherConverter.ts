// src/utils/weatherConverter.ts (정리된 최종 버전)

// API 요청에 필요한 타입 정의
export interface BaseDateTime {
    baseDate: string;
    baseTime: string;
}

// =================================================================
// 🌟 초단기실황(Ncst) API 요청을 위한 Base Date/Time 계산 함수 (유지)
// API가 45분부터 직전 30분 발표 자료를 조회 가능하도록 규칙을 반영합니다.
// =================================================================
export function getBaseDateTime(): BaseDateTime {
    const now = new Date();
    let hour = now.getHours();
    const minute = now.getMinutes();

    // 45분 미만이면 직전 시간의 30분 발표를 사용해야 함.
    if (minute < 45) {
        hour = hour - 1;

        // 0시 미만으로 내려가면, 날짜를 하루 전으로 변경하고 시간은 23시로 설정
        if (hour < 0) {
            hour = 23;
            now.setDate(now.getDate() - 1); // 날짜를 하루 전으로
        }
    }

    // baseDate (YYYYMMDD) 계산
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const date = String(now.getDate()).padStart(2, '0');
    const baseDate = `${year}${month}${date}`;

    // baseTime (HHMM) 계산 (분은 초단기실황 발표 시각인 30분으로 고정)
    const baseTime = String(hour).padStart(2, '0') + '30';

    return { baseDate, baseTime };
}


// 풍향 각도(degree)를 문자열로 변환하는 함수 (유지)
export function getWindDirection(deg: number): string {
    if (deg > 337.5 || deg <= 22.5) return '북풍';
    if (deg > 22.5 && deg <= 67.5) return '북동풍';
    if (deg > 67.5 && deg <= 112.5) return '동풍';
    if (deg > 112.5 && deg <= 157.5) return '남동풍';
    if (deg > 157.5 && deg <= 202.5) return '남풍';
    if (deg > 202.5 && deg <= 247.5) return '남서풍';
    if (deg > 247.5 && deg <= 292.5) return '서풍';
    if (deg > 292.5 && deg <= 337.5) return '북서풍';
    return '정보 없음';
}