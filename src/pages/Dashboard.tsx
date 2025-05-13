import  { useEffect, useState } from 'react';
import { BookCheck, Users, Building2 } from 'lucide-react';
import { supabase,  type Enrollment, type Student } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

function Dashboard() {
  const { user } = useAuth();
  const [student, setStudent] = useState<Student | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        if (!user) return;

        const { data: studentData, error: studentError } = await supabase
        .from('students')
        .select('*, department:departments(*)')
        .eq('auth_id', user.id)
        .maybeSingle(); // ✅ prevents crashing on 0 rows

        if (studentError) throw studentError;
        if (!studentData) {
  toast.error('Student profile not found.');
  setLoading(false);
  return;
}
        setStudent(studentData);

        const { data: enrollmentsData, error: enrollmentsError } = await supabase
          .from('enrollments')
          .select('*, course:courses(*)')
          .eq('student_id', studentData.id);

        if (enrollmentsError) throw enrollmentsError;
        setEnrollments(enrollmentsData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-3 gap-6">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Welcome Back, {student?.name}</h2>
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-indigo-50 p-6 rounded-lg">
          <Users className="h-8 w-8 text-indigo-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Your Department</h3>
          <p className="mt-2 text-gray-600">{student?.department?.name || 'Not assigned'}</p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg">
          <BookCheck className="h-8 w-8 text-green-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Enrolled Courses</h3>
          <p className="mt-2 text-gray-600">{enrollments.length} Courses</p>
        </div>
        <div className="bg-purple-50 p-6 rounded-lg">
          <Building2 className="h-8 w-8 text-purple-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Course Status</h3>
          <p className="mt-2 text-gray-600">
            {enrollments.filter(e => e.status === 'completed').length} Completed
          </p>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Enrollments</h3>
        <div className="space-y-4">
          {enrollments.slice(0, 5).map(enrollment => (
            <div
              key={enrollment.id}
              className="border rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <h4 className="text-lg font-medium text-gray-900">
                  {enrollment.course?.name}
                </h4>
                <p className="text-sm text-gray-500">
                  Enrolled: {new Date(enrollment.enrolled_at).toLocaleDateString()}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  enrollment.status === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : enrollment.status === 'dropped'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;