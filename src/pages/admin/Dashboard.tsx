import { useEffect, useState } from 'react';
import { BarChart3, Users, GraduationCap, Building2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

type Stats = {
  totalStudents: number;
  totalCourses: number;
  totalDepartments: number;
  enrollmentsByDepartment: {
    department: string;
    count: number;
  }[];
};

function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalStudents: 0,
    totalCourses: 0,
    totalDepartments: 0,
    enrollmentsByDepartment: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [
          studentsResponse,
          coursesResponse,
          departmentsResponse,
          enrollmentsResponse
        ] = await Promise.all([
          supabase.from('students').select('*'),
          supabase.from('courses').select('*'),
          supabase.from('departments').select('*'),
          supabase.from('enrollments')
            .select(`
              course:courses!inner(
                department:departments!inner(
                  name
                )
              )
            `)
        ]);

        if (studentsResponse.error) throw studentsResponse.error;
        if (coursesResponse.error) throw coursesResponse.error;
        if (departmentsResponse.error) throw departmentsResponse.error;
        if (enrollmentsResponse.error) throw enrollmentsResponse.error;

        // Process enrollments by department
        const enrollmentsByDept = enrollmentsResponse.data.reduce((acc: Record<string, number>, curr) => {
          // @ts-expect-error: Suppressing error due to lacking type definition for nested properties in the API response
          const deptName = curr.course?.department?.name || 'Unknown';
          acc[deptName] = (acc[deptName] || 0) + 1;
          return acc;
        }, {});

        setStats({
          totalStudents: studentsResponse.data.length,
          totalCourses: coursesResponse.data.length,
          totalDepartments: departmentsResponse.data.length,
          enrollmentsByDepartment: Object.entries(enrollmentsByDept).map(([department, count]) => ({
            department,
            count,
          })),
        });
      } catch (error) {
        console.error('Error loading stats:', error);
        toast.error('Failed to load statistics');
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Admin Dashboard</h2>
        <BarChart3 className="h-8 w-8 text-gray-400" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <Users className="h-8 w-8 text-blue-500" />
            <span className="text-2xl font-semibold">{stats.totalStudents}</span>
          </div>
          <p className="mt-2 text-gray-600">Total Students</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <GraduationCap className="h-8 w-8 text-green-500" />
            <span className="text-2xl font-semibold">{stats.totalCourses}</span>
          </div>
          <p className="mt-2 text-gray-600">Total Courses</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <Building2 className="h-8 w-8 text-purple-500" />
            <span className="text-2xl font-semibold">{stats.totalDepartments}</span>
          </div>
          <p className="mt-2 text-gray-600">Departments</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-medium mb-4">Enrollments by Department</h3>
        <div className="space-y-4">
          {stats.enrollmentsByDepartment.map((stat, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-gray-600">{stat.department}</span>
              <div className="flex items-center">
                <div className="w-48 h-2 bg-gray-200 rounded-full mr-3">
                  <div
                    className="h-2 bg-blue-500 rounded-full"
                    style={{
                      width: `${(stat.count / Math.max(...stats.enrollmentsByDepartment.map(s => s.count))) * 100}%`,
                    }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{stat.count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;