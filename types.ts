export interface CourseSection {
  id: string;
  name: string;
  distance: number;
  duration: string;
  difficulty: '하' | '중' | '상';
  start: string;
  end: string;
  checkpoints: string[];
}

export interface Course {
  id: number;
  name: string;
  description: string;
  distance: number;
  duration: string;
  difficulty: '하' | '중' | '상';
  region: string;
  image: string;
  sections: CourseSection[];
  route: {
    start: string;
    end: string;
    checkpoints: string[];
  };

  facilities: {
    restroom: boolean;
    drinkingWater: boolean;
    viewpoint: boolean;
    parking: boolean;
  };

  transportation: string;
  highlights: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  completedCount: number;
  lat: number;
  lng: number;
}

export interface User {
  id: number;
  email: string;
  nickname: string;
  region: string;
  joinDate: string;
  totalDistance: number;
  completedCourses: number[];
  badges: Badge[];
}

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

export interface Badge {
  id: number;
  name: string;
  description: string;
  icon: string;
  condition: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface Comment {
  id: number;
  reviewId: number;
  userId: number;
  userName: string;
  content: string;
  date: string;
}

export interface Announcement {
  id: number;
  title: string;
  content: string;
  date: string;
  author: string;
  category: 'notice' | 'event' | 'maintenance';
}

export interface CourseCompletion {
  id: number;
  userId: number;
  courseId: number;
  completionTime: string; // HH:MM:SS 형식
  date: string;
  completionCount: number; // 해당 코스 완주 횟수
}

export interface RankingEntry {
  rank: number;
  userId: number;
  userName: string;
  avatar?: string;
  completionCount: number;
  bestTime?: string;
  lastCompletionDate: string;
  totalDistance: number;
  badges: Badge[];
}

export interface CourseRanking {
  courseId: number;
  courseName: string;
  period: 'weekly' | 'monthly' | 'all-time';
  rankings: RankingEntry[];
  lastUpdated: string;
}

export interface GlobalRanking {
  period: 'weekly' | 'monthly' | 'all-time';
  rankings: {
    rank: number;
    userId: number;
    userName: string;
    avatar?: string;
    totalCompletions: number;
    totalDistance: number;
    favoriteCourseName: string;
    specialBadges: Badge[];
    lastActivityDate: string;
  }[];
  lastUpdated: string;
}