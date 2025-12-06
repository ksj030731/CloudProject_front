import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { getBaseDateTime, getWindDirection } from '../utils/weatherConverter';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
// 기상청 초단기실황(Ncst) API
const API_URL = "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst";

// 해운대 지역의 정확한 기상청 격자 좌표
const HAEUNDAE_NX = 98;
const HAEUNDAE_NY = 76;


// API 응답에서 필요한 데이터 필터링 및 타입 정의
export interface WeatherDetails {
    T1H: string; // 기온 (Temperature) - SUMMARY_TEXT에 사용
    RN1: string; // 1시간 강수량 (Rainfall)
    WSD: string; // 풍속 (Wind Speed)
    VEC: string; // 풍향 (각도)
    WIND_DIRECTION_KR: string; // 풍향 (한글)
    SUMMARY_TEXT: string; // Hero의 요약 칸에 표시될 텍스트 (예: 18°C)
}

interface WeatherDisplayProps {
    onDataFetched: (data: WeatherDetails | null, loading: boolean, error: string | null) => void;
}

// 비정상 값(-999 등)을 확인하는 함수
const isInvalidWeatherValue = (value: string | undefined): boolean => {
    return value === undefined || value === '-999' || value === '-998.9';
};


function WeatherDisplay({ onDataFetched }: WeatherDisplayProps) {
    const [weather, setWeather] = useState<WeatherDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchWeather = useCallback(async () => {
        let fetchedData: WeatherDetails | null = null;
        let currentError: string | null = null;

        if (!API_KEY) {
            currentError = "날씨 API 키가 .env 파일에 설정되지 않았습니다.";
            setError(currentError);
            setLoading(false);
            onDataFetched(null, false, currentError);
            return;
        }

        try {
            setLoading(true);
            onDataFetched(null, true, null); // 로딩 시작을 부모에게 알림

            const nx = HAEUNDAE_NX;
            const ny = HAEUNDAE_NY;

            const { baseDate, baseTime } = getBaseDateTime();

            const params = {
                serviceKey: API_KEY,
                numOfRows: 10,
                pageNo: 1,
                dataType: 'JSON',
                base_date: baseDate,
                base_time: baseTime,
                nx: nx,
                ny: ny
            };

            const response = await axios.get(API_URL, { params });

            const items = response.data?.response?.body?.items?.item;

            if (!items || items.length === 0) {
                currentError = "해당 시간에 발표된 날씨 정보가 없습니다.";
                throw new Error(currentError);
            }

            const weatherMap = items.reduce((acc: { [key: string]: string }, item: any) => {
                acc[item.category] = item.obsrValue;
                return acc;
            }, {});

            if (isInvalidWeatherValue(weatherMap.T1H)) {
                currentError = `현재 기온 관측 정보를 가져올 수 없습니다. (T1H 값: ${weatherMap.T1H})`;
                throw new Error(currentError);
            }

            const rn1Value = isInvalidWeatherValue(weatherMap.RN1) ? '0' : weatherMap.RN1;

            fetchedData = {
                T1H: weatherMap.T1H,
                RN1: rn1Value,
                WSD: weatherMap.WSD,
                VEC: weatherMap.VEC,
                WIND_DIRECTION_KR: getWindDirection(parseFloat(weatherMap.VEC)),
                SUMMARY_TEXT: `${weatherMap.T1H}°C`
            };

            setWeather(fetchedData);
            setError(null);

        } catch (err) {
            console.error("Weather API Call Failed:", err);
            if (!currentError) currentError = "날씨 정보를 가져오는 데 실패했습니다.";
            setError(currentError);
            setWeather(null);
        } finally {
            setLoading(false);
            onDataFetched(fetchedData, false, currentError);
        }
    }, [API_KEY, onDataFetched]);


    useEffect(() => {
        fetchWeather();
        // 10분마다 새로고침
        const intervalId = setInterval(fetchWeather, 10 * 60 * 1000);
        return () => clearInterval(intervalId);
    }, [fetchWeather]); // fetchWeather를 의존성 배열에 포함

    // -----------------------------------------------------------------
    // --- 렌더링 영역
    // -----------------------------------------------------------------

    if (loading) {
        return (
            <div className="mt-4 p-3 bg-white/10 rounded-lg text-white text-center animate-pulse">
                날씨 정보 로딩 중...
            </div>
        );
    }

    if (error) {
        return (
            <div className="mt-4 p-3 bg-red-500/20 rounded-lg text-red-400 text-center">
                {error}
            </div>
        );
    }

    return (
        <div className="mt-4 p-3 bg-white/10 rounded-lg">
            {/* 바람 (순서 1) */}
            <div className="flex items-center justify-between">
                <span className="text-white/90 text-sm">바람</span>
                <span className="text-white font-medium">
                    {weather!.WIND_DIRECTION_KR} {weather!.WSD}m/s
                </span>
            </div>

            {/*  강수량 (1시간) (순서 2) */}
            <div className="flex items-center justify-between mt-1">
                <span className="text-white/90 text-sm">강수량 (1시간)</span>
                <span className="text-white font-medium">
                    {weather!.RN1}mm
                </span>
            </div>
        </div>
    );
}

export default WeatherDisplay;