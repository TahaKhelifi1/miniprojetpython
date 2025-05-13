import { useEffect, useState } from 'react';
import { supabase, type Course, type Enrollment } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

function Courses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [, setDepartmentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        if (!user) return;

        const { data: student, error: studentError } = await supabase
          .from('students')
          .select('id, department_id')
          .eq('auth_id', user.id)
          .single();

        if (studentError || !student) throw studentError;
        setStudentId(student.id);
        setDepartmentId(student.department_id);

        const [coursesResponse, enrollmentsResponse] = await Promise.all([
          supabase
            .from('courses')
            .select('*, department:departments(*)')
            .eq('department_id', student.department_id),
          supabase
            .from('enrollments')
            .select('*')
            .eq('student_id', student.id)
        ]);

        if (coursesResponse.error) throw coursesResponse.error;
        if (enrollmentsResponse.error) throw enrollmentsResponse.error;

        setCourses(coursesResponse.data);
        setEnrollments(enrollmentsResponse.data);
      } catch (error) {
        console.error('Error loading courses:', error);
        toast.error('Failed to load courses');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user]);

  const handleEnroll = async (courseId: string) => {
    if (!studentId) {
      toast.error('Student profile not found');
      return;
    }

    setEnrolling(true);
    try {
      const { error } = await supabase
        .from('enrollments')
        .insert([{ course_id: courseId, student_id: studentId }]);

      if (error) throw error;

      toast.success('Successfully enrolled in course');

      const { data, error: fetchError } = await supabase
        .from('enrollments')
        .select('*')
        .eq('student_id', studentId);

      if (fetchError) throw fetchError;
      setEnrollments(data || []);
    } catch (error) {
      console.error('Error enrolling in course:', error);
      toast.error('Failed to enroll in course');
    } finally {
      setEnrolling(false);
    }
  };
  

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Available Courses</h2>
      <div className="space-y-4">
        {courses.map(course => {
          const isEnrolled = enrollments.some(e => e.course_id === course.id);
          return (
            <div
              key={course.id}
              className="border rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-medium text-gray-900">{course.name}</h3>
                <p className="text-sm text-gray-500">
                  Department: {course.department?.name}
                </p>
                {course.description && (
                  <p className="text-sm text-gray-500 mt-1">{course.description}</p>
                )}
              </div>
              <button
                onClick={() => !isEnrolled && !enrolling && handleEnroll(course.id)}
                disabled={isEnrolled || enrolling}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  isEnrolled
                    ? 'bg-green-50 text-green-700'
                    : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                }`}
              >
                {isEnrolled ? 'Enrolled' : enrolling ? 'Enrolling...' : 'Enroll Now'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Courses;
