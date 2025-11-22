import { Course, Review, Badge, Announcement, CourseCompletion, CourseRanking, GlobalRanking } from '../types';

export const mockCourses: Course[] = [
  {
    id: 1,
    name: "1코스",
    description: "기장 갈맷길로 임랑해수욕장에서 송정해수욕장까지 이어지는 해안 코스입니다. 수산과학연구소, 일광해수욕장, 해동용궁사 등을 지나며 부산의 동쪽 바다를 감상할 수 있습니다.",
    distance: 27.5,
    duration: "9시간",
    difficulty: "중",
    region: "기장군",
    image: "https://images.unsplash.com/photo-1703768516086-45eb97f36ce7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBiZWFjaCUyMGNvYXN0bGluZXxlbnwxfHx8fDE3NTkwMjE4ODJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    lat: 35.2447,
    lng: 129.2224,
    sections: [
      {
        id: "1-1",
        name: "1-1구간",
        distance: 11.5,
        duration: "4시간",
        difficulty: "하",
        start: "임랑해수욕장",
        end: "기장군청",
        checkpoints: ["칠암항", "수산과학연구소", "일광해수욕장"]
      },
      {
        id: "1-2",
        name: "1-2구간",
        distance: 16.0,
        duration: "5시간",
        difficulty: "중",
        start: "기장군청",
        end: "송정해수욕장",
        checkpoints: ["월전마을", "대변항", "오랑대", "해동용궁사"]
      }
    ],
    route: {
      start: "임랑해수욕장",
      end: "송정해수욕장",
      checkpoints: ["칠암항", "수산과학연구소", "일광해수욕장", "기장군청", "월전마을", "대변항", "오랑대", "해동용궁사"]
    },
    facilities: {
      restroom: true,
      drinkingWater: true,
      viewpoint: true,
      parking: true
    },
    transportation: "버스 181번, 185번 이용 가능",
    highlights: ["일광해변 해돋이", "해동용궁사", "기장 해안절경"],
    coordinates: { lat: 35.2447, lng: 129.2224 },
    completedCount: 1247
  },
  {
    id: 2,
    name: "2코스",
    description: "송정해수욕장에서 오륙도까지 이어지는 해운대와 수영구의 대표적인 해안 코스입니다. 해운대해수욕장, 동백섬, 광안리해수욕장을 거쳐 이기대까지 부산의 명소를 연결합니다.",
    distance: 23.4,
    duration: "8시간",
    difficulty: "중",
    region: "해운대구/수영구",
    image: "https://images.unsplash.com/photo-1647767444107-8f383924382d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYWV1bmRhZSUyMGJlYWNoJTIwYnVzYW58ZW58MXx8fHwxNzU5MDIxOTYxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    lat: 35.1595,
    lng: 129.1603,
    sections: [
      {
        id: "2-1",
        name: "2-1구간",
        distance: 12.0,
        duration: "4시간",
        difficulty: "하",
        start: "송정해수욕장",
        end: "민락교(수영구방면)",
        checkpoints: ["청사포", "해운대해수욕장", "동백섬(누리마루)"]
      },
      {
        id: "2-2",
        name: "2-2구간",
        distance: 11.4,
        duration: "4시간",
        difficulty: "중",
        start: "민락교",
        end: "오륙도 진입데크",
        checkpoints: ["광안리해수욕장", "동생말", "이기대 어울마당"]
      }
    ],
    route: {
      start: "송정해수욕장",
      end: "오륙도 진입데크",
      checkpoints: ["청사포", "해운대해수욕장", "동백섬", "민락교", "광안리해수욕장", "이기대"]
    },
    facilities: {
      restroom: true,
      drinkingWater: true,
      viewpoint: true,
      parking: true
    },
    transportation: "지하철 2호선 해운대역, 금련산역, 버스 20번, 83번 이용 가능",
    highlights: ["해운대 해변", "동백섬 누리마루", "광안대교 야경", "이기대 절벽"],
    coordinates: { lat: 35.1595, lng: 129.1603 },
    completedCount: 891
  },
  {
    id: 3,
    name: "3코스",
    description: "오륙도에서 태종대까지 이어지는 부산의 중심부를 가로지르는 긴 코스입니다. UN기념공원, 용두산공원, 영도를 거쳐 태종대에 이르는 부산의 역사와 문화를 체험할 수 있습니다.",
    distance: 42.0,
    duration: "14시간",
    difficulty: "중",
    region: "남구/중구/영도구",
    image: "https://images.unsplash.com/photo-1591366152219-48d643eb3aac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNhbiUyMHRvd2VyJTIwY2l0eSUyMHZpZXd8ZW58MXx8fHwxNzU5MDIxOTYxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    lat: 35.0512,
    lng: 129.0867,
    sections: [
      {
        id: "3-1",
        name: "3-1구간",
        distance: 12.5,
        duration: "4시간",
        difficulty: "중",
        start: "오륙도 진입데크",
        end: "부산진시장",
        checkpoints: ["신선대", "UN기념공원", "우암소막마을"]
      },
      {
        id: "3-2",
        name: "3-2구간",
        distance: 14.6,
        duration: "5시간",
        difficulty: "중",
        start: "부산진시장",
        end: "절영해안산책로관리센터",
        checkpoints: ["증산공원", "초량성당", "용두산공원"]
      },
      {
        id: "3-3",
        name: "3-3구간",
        distance: 14.9,
        duration: "5시간",
        difficulty: "중",
        start: "절영해안산책로관리센터",
        end: "아미르공원",
        checkpoints: ["75광장", "영도해녀문화전시관", "태종대"]
      }
    ],
    route: {
      start: "오륙도 진입데크",
      end: "아미르공원",
      checkpoints: ["신선대", "UN기념공원", "부산진시장", "용두산공원", "75광장", "태종대"]
    },
    facilities: {
      restroom: true,
      drinkingWater: true,
      viewpoint: true,
      parking: true
    },
    transportation: "지하철 1호선 남포역, 버스 8번, 30번, 88번 이용 가능",
    highlights: ["UN기념공원", "용두산공원 부산타워", "태종대 절벽", "영도 해안절경"],
    coordinates: { lat: 35.0512, lng: 129.0867 },
    completedCount: 387
  },
  {
    id: 4,
    name: "4코스",
    description: "절영해안산책로에서 낙동강하굿둑까지 서부산의 해안을 따라 이어지는 코스입니다. 송도해수욕장, 감천항, 몰운대, 다대포해수욕장을 거쳐 낙동강에 이르는 긴 여정입니다.",
    distance: 36.7,
    duration: "12시간",
    difficulty: "중",
    region: "영도구/서구/사하구/강서구",
    image: "https://images.unsplash.com/photo-1754195451576-9c034bbf4ab2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb25nZG8lMjBiZWFjaCUyMGJ1c2FufGVufDF8fHx8MTc1OTAyMTk2Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    lat: 35.0977,
    lng: 129.0104,
    sections: [
      {
        id: "4-1",
        name: "4-1구간",
        distance: 12.9,
        duration: "4시간",
        difficulty: "중",
        start: "절영해안산책로관리센터",
        end: "감천항",
        checkpoints: ["송도해수욕장", "암남공원"]
      },
      {
        id: "4-2",
        name: "4-2구간",
        distance: 13.0,
        duration: "4시간",
        difficulty: "중",
        start: "감천항",
        end: "몰운대",
        checkpoints: ["두송반도전망대"]
      },
      {
        id: "4-3",
        name: "4-3구간",
        distance: 10.8,
        duration: "4시간",
        difficulty: "중",
        start: "몰운대",
        end: "낙동강하굿둑",
        checkpoints: ["다대포해수욕장", "응봉봉수대 입구"]
      }
    ],
    route: {
      start: "절영해안산책로관리센터",
      end: "낙동강하굿둑",
      checkpoints: ["송도해수욕장", "감천항", "몰운대", "다대포해수욕장"]
    },
    facilities: {
      restroom: true,
      drinkingWater: true,
      viewpoint: true,
      parking: true
    },
    transportation: "지하철 1호선 토성역, 다대포해수욕장역, 버스 2번, 7번 이용 가능",
    highlights: ["송도 스카이워크", "감천문화마을", "몰운대 일몰", "다대포 낙조분수"],
    coordinates: { lat: 35.0977, lng: 129.0104 },
    completedCount: 542
  },
  {
    id: 5,
    name: "5코스",
    description: "낙동강하굿둑에서 시작해 신항과 가덕도를 연결하는 서남단 해안 코스입니다. 명지오션시티, 신호항, 부산신항을 거쳐 가덕도의 아름다운 자연을 체험할 수 있습니다.",
    distance: 44.2,
    duration: "15시간",
    difficulty: "상",
    region: "강서구",
    image: "https://images.unsplash.com/photo-1730825963012-579d146bd11a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYWRlb2tkbyUyMGlzbGFuZCUyMGtvcmVhfGVufDF8fHx8MTc1OTAyMTk2Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    lat: 35.0154,
    lng: 128.9021,
    sections: [
      {
        id: "5-1",
        name: "5-1구간",
        distance: 14.1,
        duration: "5시간",
        difficulty: "중",
        start: "낙동강하굿둑",
        end: "신호항",
        checkpoints: ["명지오션시티", "신호대교"]
      },
      {
        id: "5-2",
        name: "5-2구간",
        distance: 15.0,
        duration: "5시간",
        difficulty: "상",
        start: "신호항",
        end: "지양곡",
        checkpoints: ["부산신항", "천가교", "연대봉"]
      },
      {
        id: "5-3",
        name: "5-3구간",
        distance: 15.1,
        duration: "5시간",
        difficulty: "상",
        start: "지양곡",
        end: "천가교",
        checkpoints: ["대항어촌체험마을", "어음포", "동선방조제", "정거생태마을"]
      }
    ],
    route: {
      start: "낙동강하굿둑",
      end: "천가교",
      checkpoints: ["명지오션시티", "신호항", "부산신항", "연대봉", "대항어촌체험마을"]
    },
    facilities: {
      restroom: false,
      drinkingWater: false,
      viewpoint: true,
      parking: true
    },
    transportation: "버스 김해 123번, 1008번 이용 가능",
    highlights: ["명지 해수욕장", "신항 전망", "가덕도 자연경관", "연대봉 등반"],
    coordinates: { lat: 35.0154, lng: 128.9021 },
    completedCount: 76
  },
  {
    id: 6,
    name: "6코스",
    description: "낙동강하굿둑에서 북쪽으로 이어지는 강서구와 북구의 내륙 산악 코스입니다. 삼락생태공원, 금정산성을 거쳐 부산의 북부 산악지대를 탐험할 수 있습니다.",
    distance: 44.9,
    duration: "13시간",
    difficulty: "상",
    region: "강서구/북구/금정구",
    image: "https://images.unsplash.com/photo-1617286243498-dff5d6fac156?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjByaXZlciUyMHBhcmt8ZW58MXx8fHwxNzU5MDIxOTY2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    lat: 35.2364,
    lng: 129.0319,
    sections: [
      {
        id: "6-1",
        name: "6-1구간",
        distance: 13.3,
        duration: "4시간",
        difficulty: "하",
        start: "낙동강하굿둑",
        end: "도시철도 구포역",
        checkpoints: ["삼락생태공원", "삼락IC"]
      },
      {
        id: "6-2",
        name: "6-2구간",
        distance: 12.8,
        duration: "4시간",
        difficulty: "상",
        start: "도시철도 구포역",
        end: "주례정",
        checkpoints: ["구포무장애숲길", "운수사"]
      },
      {
        id: "6-3",
        name: "6-3구간",
        distance: 8.1,
        duration: "2시간",
        difficulty: "중",
        start: "주례정",
        end: "어린이대공원",
        checkpoints: ["선암사"]
      },
      {
        id: "6-4",
        name: "6-4구간",
        distance: 11.3,
        duration: "3시간",
        difficulty: "중",
        start: "도시철도 구포역",
        end: "금정산성 동문",
        checkpoints: ["화명생태공원", "화명운동장", "화명수목원", "금정산성 서문"]
      }
    ],
    route: {
      start: "낙동강하굿둑",
      end: "어린이대공원",
      checkpoints: ["삼락생태공원", "구포역", "운수사", "선암사", "화명생태공원", "금정산성"]
    },
    facilities: {
      restroom: true,
      drinkingWater: true,
      viewpoint: true,
      parking: true
    },
    transportation: "지하철 3호선 구포역, 화명역, 버스 90번 이용 가능",
    highlights: ["삼락생태공원", "운수사", "금정산성", "화명수목원"],
    coordinates: { lat: 35.2364, lng: 129.0319 },
    completedCount: 198
  },
  {
    id: 7,
    name: "7코스",
    description: "어린이대공원에서 금정산을 거쳐 노포동까지 이어지는 금정구의 대표적인 산악 코스입니다. 금정산성과 범어사를 지나며 부산의 진산을 체험할 수 있습니다.",
    distance: 22.0,
    duration: "7시간",
    difficulty: "중",
    region: "동래구/금정구",
    image: "https://images.unsplash.com/photo-1662527984434-8a3d93dfac33?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBtb3VudGFpbiUyMHRlbXBsZXxlbnwxfHx8fDE3NTkwMjE5NjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    lat: 35.2364,
    lng: 129.0319,
    sections: [
      {
        id: "7-1",
        name: "7-1구간",
        distance: 9.0,
        duration: "3시간",
        difficulty: "중",
        start: "어린이대공원",
        end: "금정산성 동문",
        checkpoints: ["만덕고개", "금정산성 남문"]
      },
      {
        id: "7-2",
        name: "7-2구간",
        distance: 13.0,
        duration: "4시간",
        difficulty: "중",
        start: "금정산성 동문",
        end: "상현마을",
        checkpoints: ["금정산성 북문", "범어사", "노포동 고속버스터미널", "스포원"]
      }
    ],
    route: {
      start: "어린이대공원",
      end: "상현마을",
      checkpoints: ["만덕고개", "금정산성", "범어사", "노포동"]
    },
    facilities: {
      restroom: true,
      drinkingWater: false,
      viewpoint: true,
      parking: true
    },
    transportation: "지하철 1호선 범어사역, 노포역, 버스 90번 이용 가능",
    highlights: ["금정산성", "범어사 고찰", "부산 도심 전망", "산악 트레킹"],
    coordinates: { lat: 35.2364, lng: 129.0319 },
    completedCount: 324
  },
  {
    id: 8,
    name: "8코스",
    description: "상현마을에서 시작해 동래와 연제를 거쳐 수영까지 이어지는 부산 동부의 도심 통과 코스입니다. 동천을 따라 걸으며 부산의 도심 풍경을 감상할 수 있습니다.",
    distance: 18.3,
    duration: "6시간",
    difficulty: "중",
    region: "금정구/동래구/연제구/수영구",
    image: "https://images.unsplash.com/photo-1617286243498-dff5d6fac156?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjByaXZlciUyMHBhcmt8ZW58MXx8fHwxNzU5MDIxOTY2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    lat: 35.2047,
    lng: 129.0842,
    sections: [
      {
        id: "8-1",
        name: "8-1구간",
        distance: 10.7,
        duration: "4시간",
        difficulty: "중",
        start: "상현마을",
        end: "동천교(석대다리)",
        checkpoints: ["땅뫼산", "명장정수사업소(회동지소)", "동대교"]
      },
      {
        id: "8-2",
        name: "8-2구간",
        distance: 7.6,
        duration: "2시간",
        difficulty: "하",
        start: "동천교(석대다리)",
        end: "민락교(수영구 방면)",
        checkpoints: ["원동교", "수영4호교", "좌수영교", "APEC 나루공원"]
      }
    ],
    route: {
      start: "상현마을",
      end: "민락교",
      checkpoints: ["땅뫼산", "명장정수사업소", "동천교", "APEC 나루공원"]
    },
    facilities: {
      restroom: true,
      drinkingWater: true,
      viewpoint: false,
      parking: true
    },
    transportation: "지하철 1호선 동래역, 2호선 수영역, 버스 다수 노선 이용 가능",
    highlights: ["동천 산책로", "동래 온천", "APEC 나루공원", "수영강 풍경"],
    coordinates: { lat: 35.2047, lng: 129.0842 },
    completedCount: 156
  },
  {
    id: 9,
    name: "9코스",
    description: "상현마을에서 시작해 기장군으로 돌아가는 순환형 코스입니다. 장전, 철마를 거쳐 기장군청에 이르는 부산 동북부의 내륙 산간 지역을 탐험할 수 있습니다.",
    distance: 19.8,
    duration: "7시간",
    difficulty: "중",
    region: "금정구/기장군",
    image: "https://images.unsplash.com/photo-1663030993965-f5f16d2ddf45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBtb3VudGFpbiUyMGhpa2luZ3xlbnwxfHx8fDE3NTg5NDM1MDl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    lat: 35.2447,
    lng: 129.2224,
    sections: [
      {
        id: "9-1",
        name: "9-1구간",
        distance: 9.0,
        duration: "3시간",
        difficulty: "중",
        start: "상현마을",
        end: "이곡마을",
        checkpoints: ["장전2교", "장전마을(철마교)", "보림교"]
      },
      {
        id: "9-2",
        name: "9-2구간",
        distance: 10.8,
        duration: "4시간",
        difficulty: "중",
        start: "이곡마을",
        end: "기장군청",
        checkpoints: ["모연정"]
      }
    ],
    route: {
      start: "상현마을",
      end: "기장군청",
      checkpoints: ["장전2교", "장전마을", "보림교", "이곡마을", "모연정"]
    },
    facilities: {
      restroom: false,
      drinkingWater: false,
      viewpoint: true,
      parking: false
    },
    transportation: "버스 181번, 185번 이용 가능",
    highlights: ["장전 계곡", "철마 농촌 풍경", "모연정", "기장 내륙 산간"],
    coordinates: { lat: 35.2447, lng: 129.2224 },
    completedCount: 89
  }
];

export const mockReviews: Review[] = [
  {
    id: 1,
    courseId: 1,
    userId: 1,
    userName: "갈맷길러버",
    rating: 5,
    content: "1코스 정말 아름다운 코스였습니다! 특히 해동용궁사에서 보는 바다가 환상적이었어요. 다음에 또 오고 싶습니다.",
    photos: ["review1-1.jpg", "review1-2.jpg"],
    date: "2024-03-15T10:30:00Z",
    likes: 12
  },
  {
    id: 2,
    courseId: 2,
    userId: 2,
    userName: "걷기좋아",
    rating: 4,
    content: "해운대에서 광안리까지 걷는 코스가 정말 인상적이었어요. 다만 중간에 조금 힘든 구간이 있어서 4점 드립니다.",
    photos: ["review2-1.jpg"],
    date: "2024-03-10T14:20:00Z",
    likes: 8
  },
  {
    id: 3,
    courseId: 3,
    userId: 3,
    userName: "부산사랑",
    rating: 5,
    content: "태종대까지 이어지는 긴 코스지만 부산의 다양한 모습을 볼 수 있어서 좋았습니다. 가족과 함께 완주했어요!",
    photos: [],
    date: "2024-03-08T16:45:00Z",
    likes: 15
  }
];

export const mockBadges: Badge[] = [
  {
    id: 1,
    name: "첫 걸음",
    description: "첫 번째 코스를 완주했습니다",
    icon: "🥾",
    condition: "코스 1개 완주",
    rarity: "common"
  },
  {
    id: 2,
    name: "갈맷길 마니아",
    description: "5개의 코스를 완주했습니다",
    icon: "🏃‍♂️",
    condition: "코스 5개 완주",
    rarity: "rare"
  },
  {
    id: 3,
    name: "장거리 트래커",
    description: "총 100km 이상을 완주했습니다",
    icon: "🎯",
    condition: "누적 100km 완주",
    rarity: "epic"
  },
  {
    id: 4,
    name: "리뷰어",
    description: "첫 번째 리뷰를 작성했습니다",
    icon: "✍️",
    condition: "리뷰 1개 작성",
    rarity: "common"
  },
  {
    id: 5,
    name: "갈맷길 정복자",
    description: "모든 갈맷길 코스를 완주했습니다",
    icon: "👑",
    condition: "전체 9개 코스 완주",
    rarity: "legendary"
  },
  {
    id: 6,
    name: "해안길 마스터",
    description: "1~4코스 해안길을 모두 완주했습니다",
    icon: "🌊",
    condition: "해안 코스 완주",
    rarity: "rare"
  },
  {
    id: 7,
    name: "산악길 정복자",
    description: "6~7코스 산악길을 모두 완주했습니다",
    icon: "⛰️",
    condition: "산악 코스 완주",
    rarity: "rare"
  }
];

export const mockAnnouncements: Announcement[] = [
  {
    id: 1,
    title: "부산 갈맷길 체험 행사 안내",
    content: "2024년 4월 부산 갈맷길 체험 행사가 개최됩니다. 많은 참여 바랍니다.",
    date: "2024-03-20T09:00:00Z",
    author: "관리자",
    category: "event"
  },
  {
    id: 2,
    title: "3코스 일부 구간 보수공사 안내",
    content: "영도 갈맷길 3코스 일부 구간에서 보수공사가 진행됩니다. 우회 경로를 이용해 주세요.",
    date: "2024-03-18T14:30:00Z",
    author: "관리자",
    category: "maintenance"
  },
  {
    id: 3,
    title: "새로운 편의시설 설치 완료",
    content: "1코스와 5코스에 새로운 휴게시설과 안내판이 설치되었습니다.",
    date: "2024-03-15T11:00:00Z",
    author: "관리자",
    category: "notice"
  }
];

// 랭킹 특별 뱃지 (SFR-13 등)
export const mockRankingBadges: Badge[] = [
  {
    id: 13,
    name: "월간 챔피언",
    description: "월간 랭킹 1위를 달성했습니다",
    icon: "🏆",
    condition: "월간 랭킹 1위",
    rarity: "legendary"
  },
  {
    id: 14,
    name: "주간 킹",
    description: "주간 랭킹 1위를 달성했습니다",
    icon: "👑",
    condition: "주간 랭킹 1위",
    rarity: "epic"
  },
  {
    id: 15,
    name: "연속 완주왕",
    description: "동일 코스 10회 연속 완주",
    icon: "🔥",
    condition: "동일 코스 10회 완주",
    rarity: "rare"
  },
  {
    id: 16,
    name: "스피드러너",
    description: "코스 최단 기록 보유자",
    icon: "⚡",
    condition: "코스 최단 기록",
    rarity: "epic"
  }
];

// 코스 완주 기록
export const mockCompletions: CourseCompletion[] = [
  { id: 1, userId: 1, courseId: 1, completionTime: "02:45:30", date: "2024-03-20", completionCount: 15 },
  { id: 2, userId: 2, courseId: 1, completionTime: "02:52:15", date: "2024-03-19", completionCount: 12 },
  { id: 3, userId: 3, courseId: 1, completionTime: "03:10:45", date: "2024-03-18", completionCount: 8 },
  { id: 4, userId: 4, courseId: 1, completionTime: "02:38:22", date: "2024-03-17", completionCount: 22 },
  { id: 5, userId: 5, courseId: 1, completionTime: "03:05:10", date: "2024-03-16", completionCount: 6 },
  
  { id: 6, userId: 1, courseId: 2, completionTime: "03:20:15", date: "2024-03-15", completionCount: 10 },
  { id: 7, userId: 2, courseId: 2, completionTime: "03:15:30", date: "2024-03-14", completionCount: 14 },
  { id: 8, userId: 6, courseId: 2, completionTime: "02:58:45", date: "2024-03-13", completionCount: 18 },
  { id: 9, userId: 7, courseId: 2, completionTime: "03:25:20", date: "2024-03-12", completionCount: 7 },
  
  { id: 10, userId: 8, courseId: 3, completionTime: "05:45:30", date: "2024-03-11", completionCount: 9 },
  { id: 11, userId: 9, courseId: 3, completionTime: "05:32:15", date: "2024-03-10", completionCount: 13 },
  { id: 12, userId: 10, courseId: 3, completionTime: "06:10:45", date: "2024-03-09", completionCount: 5 },
];

// 코스별 랭킹
export const mockCourseRankings: CourseRanking[] = [
  {
    courseId: 1,
    courseName: "1코스",
    period: "all-time",
    rankings: [
      {
        rank: 1,
        userId: 4,
        userName: "갈맷길킹",
        completionCount: 22,
        bestTime: "02:38:22",
        lastCompletionDate: "2024-03-17",
        totalDistance: 605.0,
        badges: [mockRankingBadges[0], mockRankingBadges[3]]
      },
      {
        rank: 2,
        userId: 1,
        userName: "갈맷길러버",
        completionCount: 15,
        bestTime: "02:45:30",
        lastCompletionDate: "2024-03-20",
        totalDistance: 412.5,
        badges: [mockRankingBadges[1]]
      },
      {
        rank: 3,
        userId: 2,
        userName: "부산트래커",
        completionCount: 12,
        bestTime: "02:52:15",
        lastCompletionDate: "2024-03-19",
        totalDistance: 330.0,
        badges: [mockRankingBadges[2]]
      },
      {
        rank: 4,
        userId: 3,
        userName: "해안길워커",
        completionCount: 8,
        bestTime: "03:10:45",
        lastCompletionDate: "2024-03-18",
        totalDistance: 220.0,
        badges: []
      },
      {
        rank: 5,
        userId: 5,
        userName: "기장러버",
        completionCount: 6,
        bestTime: "03:05:10",
        lastCompletionDate: "2024-03-16",
        totalDistance: 165.0,
        badges: []
      }
    ],
    lastUpdated: "2025-09-29T00:00:00Z"
  },
  {
    courseId: 2,
    courseName: "2코스",
    period: "all-time",
    rankings: [
      {
        rank: 1,
        userId: 6,
        userName: "해운대마스터",
        completionCount: 18,
        bestTime: "02:58:45",
        lastCompletionDate: "2024-03-13",
        totalDistance: 421.2,
        badges: [mockRankingBadges[0], mockRankingBadges[3]]
      },
      {
        rank: 2,
        userId: 2,
        userName: "부산트래커",
        completionCount: 14,
        bestTime: "03:15:30",
        lastCompletionDate: "2024-03-14",
        totalDistance: 327.6,
        badges: [mockRankingBadges[1]]
      },
      {
        rank: 3,
        userId: 1,
        userName: "갈맷길러버",
        completionCount: 10,
        bestTime: "03:20:15",
        lastCompletionDate: "2024-03-15",
        totalDistance: 234.0,
        badges: []
      },
      {
        rank: 4,
        userId: 7,
        userName: "광안리걸어",
        completionCount: 7,
        bestTime: "03:25:20",
        lastCompletionDate: "2024-03-12",
        totalDistance: 163.8,
        badges: []
      }
    ],
    lastUpdated: "2025-09-29T00:00:00Z"
  },
  {
    courseId: 3,
    courseName: "3코스",
    period: "all-time",
    rankings: [
      {
        rank: 1,
        userId: 9,
        userName: "태종대챔피언",
        completionCount: 13,
        bestTime: "05:32:15",
        lastCompletionDate: "2024-03-10",
        totalDistance: 546.0,
        badges: [mockRankingBadges[0]]
      },
      {
        rank: 2,
        userId: 8,
        userName: "영도워커",
        completionCount: 9,
        bestTime: "05:45:30",
        lastCompletionDate: "2024-03-11",
        totalDistance: 378.0,
        badges: [mockRankingBadges[1]]
      },
      {
        rank: 3,
        userId: 10,
        userName: "중구탐험가",
        completionCount: 5,
        bestTime: "06:10:45",
        lastCompletionDate: "2024-03-09",
        totalDistance: 210.0,
        badges: []
      }
    ],
    lastUpdated: "2025-09-29T00:00:00Z"
  }
];

// 전체 통합 랭킹
export const mockGlobalRanking: GlobalRanking = {
  period: "all-time",
  rankings: [
    {
      rank: 1,
      userId: 4,
      userName: "갈맷길킹",
      totalCompletions: 47,
      totalDistance: 1247.8,
      favoriteCourseName: "1코스",
      specialBadges: [mockRankingBadges[0], mockRankingBadges[3], mockRankingBadges[2]],
      lastActivityDate: "2025-09-28"
    },
    {
      rank: 2,
      userId: 6,
      userName: "해운대마스터",
      totalCompletions: 42,
      totalDistance: 1156.4,
      favoriteCourseName: "2코스",
      specialBadges: [mockRankingBadges[0], mockRankingBadges[3]],
      lastActivityDate: "2025-09-25"
    },
    {
      rank: 3,
      userId: 2,
      userName: "부산트래커",
      totalCompletions: 38,
      totalDistance: 1089.2,
      favoriteCourseName: "2코스",
      specialBadges: [mockRankingBadges[1], mockRankingBadges[2]],
      lastActivityDate: "2025-09-22"
    },
    {
      rank: 4,
      userId: 1,
      userName: "갈맷길러버",
      totalCompletions: 35,
      totalDistance: 967.5,
      favoriteCourseName: "1코스",
      specialBadges: [mockRankingBadges[1]],
      lastActivityDate: "2025-09-18"
    },
    {
      rank: 5,
      userId: 9,
      userName: "태종대챔피언",
      totalCompletions: 28,
      totalDistance: 845.6,
      favoriteCourseName: "3코스",
      specialBadges: [mockRankingBadges[0]],
      lastActivityDate: "2025-09-15"
    },
    {
      rank: 6,
      userId: 8,
      userName: "영도워커",
      totalCompletions: 23,
      totalDistance: 698.4,
      favoriteCourseName: "3코스",
      specialBadges: [mockRankingBadges[1]],
      lastActivityDate: "2025-09-12"
    },
    {
      rank: 7,
      userId: 3,
      userName: "해안길워커",
      totalCompletions: 19,
      totalDistance: 534.2,
      favoriteCourseName: "1코스",
      specialBadges: [],
      lastActivityDate: "2025-08-28"
    },
    {
      rank: 8,
      userId: 7,
      userName: "광안리걸어",
      totalCompletions: 15,
      totalDistance: 421.8,
      favoriteCourseName: "2코스",
      specialBadges: [],
      lastActivityDate: "2025-08-15"
    },
    {
      rank: 9,
      userId: 10,
      userName: "중구탐험가",
      totalCompletions: 12,
      totalDistance: 356.4,
      favoriteCourseName: "3코스",
      specialBadges: [],
      lastActivityDate: "2025-07-22"
    },
    {
      rank: 10,
      userId: 5,
      userName: "기장러버",
      totalCompletions: 10,
      totalDistance: 298.5,
      favoriteCourseName: "1코스",
      specialBadges: [],
      lastActivityDate: "2025-06-18"
    }
  ],
  lastUpdated: "2025-09-29T00:00:00Z"
};