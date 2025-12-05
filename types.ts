// 1. 사용자 정보 (User)
export interface User {
  id: number;
  email: string;
  nickname: string;
  region: string;
  joinDate: string;
  totalDistance: number;
  completedCourses: number[];
  badges: Badge[];
  picture?: string;
  favorites?: number[];
}

// 2. 뱃지 정보 (Badge)
export interface Badge {
  id: number;
  name: string;
  description: string;
  icon?: string;
  image?: string; 
  condition?: string;
  rarity?: string;
  acquiredDate?: string;
}

// 3. 리뷰 정보 (Review)
export interface Review {
  id: number;
  courseId: number;
  userId: number;
  userName: string;
  rating: number;
  content: string;
  photos: string[];
  date: string;
  likes: number;
}

// 4. 공지사항 정보 (Announcement) ✨ [추가됨]
export interface Announcement {
  id: number;
  title: string;
  content: string;
  date: string;
  author: string;
  category: string;
}

// 5. 코스 구간 정보 (CourseSection)
export interface CourseSection {
  sectionCode: string;
  name: string;
  distance: number;
  duration: string;
  difficulty: string;
  startPoint: string; 
  endPoint: string;
  checkpoints: string[];
  id?: string | number;
  start?: string;
  end?: string;
}

// 6. 코스 정보 (Course)
export interface Course {
  id: number;
  name: string;
  description: string;
  distance: number;
  duration: string;
  difficulty: string;
  region: string;
  image: string;
  transportation: string;
  facilities: {
    restroom: boolean;
    drinkingWater: boolean;
    viewpoint: boolean;
    parking: boolean;
  };
  highlights: string[];
  sections: CourseSection[];
  completedCount: number;
  route?: {
    start: string;
    end: string;
    checkpoints: string[];
  };
  coordinates?: { lat: number; lng: number };
}

// 7. 랭킹 관련 타입
export interface UserRanking {
  userId: number;
  userName: string;
  nickname?: string;
  time?: string;
  date?: string;
  bestTime?: string;
  lastCompletionDate?: string;
  totalDistance?: number;
  totalCompletions?: number;
  completionCount?: number;
  completedCount?: number;
  favoriteCourseName?: string;
  specialBadges?: Badge[];
  rank?: number;
}

export interface CourseRanking {
  courseId: number;
  courseName: string;
  period?: string;
  rankings?: UserRanking[]; 
  topUsers?: UserRanking[];
  lastUpdated?: string;
}

export interface GlobalRanking {
  period: string;
  rankings: UserRanking[];
  lastUpdated: string;
}