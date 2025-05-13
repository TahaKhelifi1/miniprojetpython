
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { BarChart3, Users, GraduationCap, Building2, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
      toast.success('Successfully signed out');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Error signing out');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-semibold">Admin Portal</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleSignOut}
                className="flex items-center text-gray-700 hover:text-gray-900"
              >
                <LogOut className="h-5 w-5 mr-1" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-3">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="space-y-4">
                <Link
                  to="/admin"
                  className={`w-full flex items-center px-4 py-2 text-sm rounded-md ${
                    location.pathname === '/admin'
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Dashboard
                </Link>
                <Link
                  to="/admin/students"
                  className={`w-full flex items-center px-4 py-2 text-sm rounded-md ${
                    location.pathname === '/admin/students'
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Users className="h-5 w-5 mr-2" />
                  Students
                </Link>
                <Link
                  to="/admin/courses"
                  className={`w-full flex items-center px-4 py-2 text-sm rounded-md ${
                    location.pathname === '/admin/courses'
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <GraduationCap className="h-5 w-5 mr-2" />
                  Courses
                </Link>
                <Link
                  to="/admin/departments"
                  className={`w-full flex items-center px-4 py-2 text-sm rounded-md ${
                    location.pathname === '/admin/departments'
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Building2 className="h-5 w-5 mr-2" />
                  Departments
                </Link>
              </div>
            </div>
          </div>

          <div className="col-span-9">
            <div className="bg-white rounded-lg shadow">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;