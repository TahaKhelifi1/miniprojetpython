import { useEffect, useState } from 'react';
import { Building2 } from 'lucide-react';
import { supabase, type Department, type Course } from '../lib/supabase';
import toast from 'react-hot-toast';

function Departments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedDeptId, setExpandedDeptId] = useState<string | null>(null);


  useEffect(() => {
    async function loadData() {
      try {
        const [departmentsResponse, coursesResponse] = await Promise.all([
          supabase.from('departments').select('*'),
          supabase.from('courses').select('*')
        ]);

        if (departmentsResponse.error) throw departmentsResponse.error;
        if (coursesResponse.error) throw coursesResponse.error;

        setDepartments(departmentsResponse.data);
        setCourses(coursesResponse.data);
      } catch (error) {
        console.error('Error loading departments:', error);
        toast.error('Failed to load departments');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Academic Departments</h2>
      <div className="grid grid-cols-3 gap-6">
        {departments.map(dept => {
  const isExpanded = expandedDeptId === dept.id;
  const deptCourses = courses.filter(c => c.department_id === dept.id);

  return (
    <div key={dept.id} className="border rounded-lg p-6">
      <Building2 className="h-8 w-8 text-gray-600 mb-4" />
      <h3 className="text-lg font-medium text-gray-900">{dept.name}</h3>
      <p className="mt-2 text-sm text-gray-500">
        {deptCourses.length} course{deptCourses.length !== 1 ? 's' : ''} available
      </p>

      <button
        className="mt-4 text-sm text-indigo-600 hover:text-indigo-700"
        onClick={() =>
          setExpandedDeptId(isExpanded ? null : dept.id)
        }
      >
        {isExpanded ? 'Hide Courses ↑' : 'View Courses →'}
      </button>

      {isExpanded && (
        <ul className="mt-4 space-y-1 text-sm text-gray-700 list-disc list-inside">
          {deptCourses.map(course => (
            <li key={course.id}>{course.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
})}

      </div>
    </div>
  );
}

export default Departments;