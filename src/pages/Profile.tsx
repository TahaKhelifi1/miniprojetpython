import React, { useEffect, useState } from 'react';
import { supabase, type Department } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

function Profile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department_id: '',
  });

  useEffect(() => {
    async function loadData() {
      try {
        if (!user) return;

        const [studentResponse, departmentsResponse] = await Promise.all([
          supabase
            .from('students')
            .select('*')
            .eq('auth_id', user.id)
            .single(),
          supabase
            .from('departments')
            .select('*')
        ]);

        if (studentResponse.error) throw studentResponse.error;
        if (departmentsResponse.error) throw departmentsResponse.error;

        setFormData({
          name: studentResponse.data.name,
          email: studentResponse.data.email,
          department_id: studentResponse.data.department_id || '',
        });
        setDepartments(departmentsResponse.data);
      } catch (error) {
        console.error('Error loading profile:', error);
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const { error } = await supabase
        .from('students')
        .update({
          name: formData.name,
          department_id: formData.department_id || null,
        })
        .eq('auth_id', user?.id);

      if (error) throw error;
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Profile Settings</h2>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            disabled
            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

            <div>
      <label htmlFor="department" className="block text-sm font-medium text-gray-700">
        Department
      </label>
      <select
        id="department"
        value={formData.department_id}
        onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        disabled={!!formData.department_id} // 🔒 Lock after selection
      >
        <option value="">Select a department</option>
        {departments.map((dept) => (
          <option key={dept.id} value={dept.id}>
            {dept.name}
          </option>
        ))}
      </select>
      {formData.department_id && (
        <p className="text-xs text-gray-500 mt-1">You cannot change your department once selected.</p>
      )}
    </div>


        <div>
          <button
            type="submit"
            disabled={updating}
            className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {updating ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Profile;