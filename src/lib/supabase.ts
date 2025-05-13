import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;


export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Department = {
  id: string;
  name: string;
  created_at: string;
};

export type Course = {
  id: string;
  name: string;
  department_id: string;
  description: string;
  created_at: string;
  department?: Department;
};

export type Student = {
  id: string;
  auth_id: string;
  name: string;
  email: string;
  department_id: string;
  created_at: string;
  department?: Department;

};

export type Enrollment = {
  id: string;
  student_id: string;
  course_id: string;
  enrolled_at: string;
  status: 'enrolled' | 'completed' | 'dropped';
  course?: Course;
};

export type Profile = {
  id: string;
  auth_id: string;
  full_name: string;
  avatar_url?: string;
  department_id?: string;
  department?: Department;
};