import { useEffect, useState } from 'react';
import { supabase, type Student, type Department } from '../../lib/supabase';
import { Pencil, Trash2, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

function AdminStudents() {
  const [students, setStudents] = useState<(Student & { department?: Department })[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    department_id: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [studentsResponse, departmentsResponse] = await Promise.all([
        supabase
          .from('students')
          .select('*, department:departments(*)'),
        supabase
          .from('departments')
          .select('*'),
      ]);

      if (studentsResponse.error) throw studentsResponse.error;
      if (departmentsResponse.error) throw departmentsResponse.error;

      setStudents(studentsResponse.data);
      setDepartments(departmentsResponse.data);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  }

  const handleEdit = (student: Student) => {
    setEditingId(student.id);
    setEditForm({
      name: student.name,
      email: student.email,
      department_id: student.department_id || '',
    });
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('students')
        .update({
          name: editForm.name,
          department_id: editForm.department_id || null,
        })
        .eq('id', editingId);

      if (error) throw error;

      toast.success('Student updated successfully');
      setEditingId(null);
      loadData();
    } catch (error) {
      console.error('Error updating student:', error);
      toast.error('Failed to update student');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this student?')) return;

    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Student deleted successfully');
      loadData();
    } catch (error) {
      console.error('Error deleting student:', error);
      toast.error('Failed to delete student');
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Manage Students</h2>
      <div className="bg-white rounded-lg shadow-sm border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map((student) => (
              <tr key={student.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === student.id ? (
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  ) : (
                    <div className="text-sm font-medium text-gray-900">{student.name}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{student.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === student.id ? (
                    <select
                      value={editForm.department_id}
                      onChange={(e) => setEditForm({ ...editForm, department_id: e.target.value })}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="">No Department</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="text-sm text-gray-500">
                      {student.department?.name || 'No Department'}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  {editingId === student.id ? (
                    <>
                      <button
                        onClick={handleSave}
                        className="text-green-600 hover:text-green-900"
                      >
                        <Check className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(student)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Pencil className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(student.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminStudents;