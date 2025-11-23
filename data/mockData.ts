// ⚠️ [삭제됨] mockCourses는 이제 DB에서 가져오므로 삭제했습니다.

export const mockReviews = [
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

export const mockBadges = [
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

export const mockAnnouncements = [
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
export const mockRankingBadges = [
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
export const mockCompletions = [
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
export const mockCourseRankings = [
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
export const mockGlobalRanking = {
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