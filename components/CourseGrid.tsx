import React from 'react';
import { CourseCard } from './CourseCard';
import { Course, User } from '../types';

interface CourseGridProps {
  courses: Course[];
  favorites: number[];
  completedCourses: number[];
  onCourseClick: (course: Course) => void;
  onFavoriteClick: (courseId: number) => void;
  currentUser: User | null;
}

export function CourseGrid({ 
  courses, 
  favorites, 
  completedCourses, 
  onCourseClick, 
  onFavoriteClick,
  currentUser 
}: CourseGridProps) {

    //courses가 배열일 때만 받기 (계속 로딩 중으로 나오면 삭제하면 됨)
    if(!courses || !Array.isArray(courses)){
        return <div className="p-4 text-center">로딩 중</div>;
    }
    if(courses.length === 0){
        return <div className="p-4 text-center">빈 배열</div>;
    }

    return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map(course => (
        <CourseCard
          key={course.id}
          course={course}
          isFavorited={favorites.includes(course.id)}
          isCompleted={completedCourses.includes(course.id)}
          onClick={() => onCourseClick(course)}
          onFavoriteClick={() => onFavoriteClick(course.id)}
          currentUser={currentUser}
        />
      ))}
    </div>
  );
}