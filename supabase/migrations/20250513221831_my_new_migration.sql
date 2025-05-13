/*
  # Initial Student Portal Schema

  1. New Tables
    - `departments`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `created_at` (timestamp)
    
    - `courses`
      - `id` (uuid, primary key)
      - `name` (text)
      - `department_id` (uuid, foreign key)
      - `description` (text)
      - `created_at` (timestamp)
    
    - `students`
      - `id` (uuid, primary key)
      - `auth_id` (uuid, references auth.users)
      - `name` (text)
      - `email` (text, unique)
      - `department_id` (uuid, foreign key)
      - `created_at` (timestamp)
    
    - `enrollments`
      - `id` (uuid, primary key)
      - `student_id` (uuid, foreign key)
      - `course_id` (uuid, foreign key)
      - `enrolled_at` (timestamp)
      - `status` (text)

  2. Security
    - Enable RLS on all tables
    - Add policies for students to view departments and courses
    - Add policies for students to manage their enrollments
*/

-- Create departments table
CREATE TABLE departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create courses table
CREATE TABLE courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  department_id uuid REFERENCES departments(id) ON DELETE CASCADE,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create students table
CREATE TABLE students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  department_id uuid REFERENCES departments(id),
  created_at timestamptz DEFAULT now()
);

-- Create enrollments table
CREATE TABLE enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at timestamptz DEFAULT now(),
  status text CHECK (status IN ('enrolled', 'completed', 'dropped')) DEFAULT 'enrolled',
  UNIQUE(student_id, course_id)
);

-- Enable Row Level Security
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

-- Policies for departments
CREATE POLICY "Departments are viewable by all users"
  ON departments FOR SELECT
  TO authenticated
  USING (true);

-- Policies for courses
CREATE POLICY "Courses are viewable by all users"
  ON courses FOR SELECT
  TO authenticated
  USING (true);

-- Policies for students
CREATE POLICY "Students can view their own data"
  ON students FOR SELECT
  TO authenticated
  USING (auth.uid() = auth_id);

CREATE POLICY "Authenticated users can insert their own student profile"
  ON students
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = auth_id);


-- Policies for enrollments
CREATE POLICY "Students can view their own enrollments"
  ON enrollments FOR SELECT
  TO authenticated
  USING (student_id IN (
    SELECT id FROM students WHERE auth_id = auth.uid()
  ));

CREATE POLICY "Students can enroll in courses"
  ON enrollments FOR INSERT
  TO authenticated
  WITH CHECK (student_id IN (
    SELECT id FROM students WHERE auth_id = auth.uid()
  ));

-- Insert some sample data
INSERT INTO departments (name) VALUES
  ('Computer Science'),
  ('Mathematics'),
  ('Physics');

INSERT INTO courses (name, department_id, description) VALUES
  ('Introduction to Programming', (SELECT id FROM departments WHERE name = 'Computer Science'), 'Learn the basics of programming'),
  ('Linear Algebra', (SELECT id FROM departments WHERE name = 'Mathematics'), 'Study vectors, matrices and linear transformations'),
  ('Quantum Mechanics', (SELECT id FROM departments WHERE name = 'Physics'), 'Explore the quantum world');