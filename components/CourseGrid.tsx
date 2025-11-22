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