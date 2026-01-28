export const student = {
  name: 'Ariana Khan',
  classLevel: 7,
  section: 'Boys',
  roll: '12',
  id: 'STU-2026-0712',
}

export const routineItems = [
  { time: '08:30 - 09:15', subject: 'Mathematics', teacher: 'Ms. Rahman', room: 'B-204' },
  { time: '09:25 - 10:10', subject: 'Science', teacher: 'Mr. Alam', room: 'Lab 1' },
  { time: '10:20 - 11:05', subject: 'English', teacher: 'Ms. Silva', room: 'A-301' },
]

export const weeklyRoutine = [
  { period: 'Period 1', Sun: 'Math', Mon: 'Science', Tue: 'Bangla', Wed: 'Math', Thu: 'English' },
  { period: 'Period 2', Sun: 'ICT', Mon: 'Math', Tue: 'Science', Wed: 'History', Thu: 'Bangla' },
  { period: 'Period 3', Sun: 'English', Mon: 'Bangla', Tue: 'Math', Wed: 'Science', Thu: 'ICT' },
  { period: 'Period 4', Sun: 'History', Mon: 'English', Tue: 'ICT', Wed: 'Bangla', Thu: 'Math' },
  { period: 'Period 5', Sun: 'Art', Mon: 'Bangla', Tue: 'Math', Wed: 'Science', Thu: 'ICT' },
  { period: 'Period 6', Sun: 'Math', Mon: 'ICT', Tue: 'English', Wed: 'History', Thu: 'Bangla' },
  { period: 'Period 7', Sun: 'Science', Mon: 'Math', Tue: 'Bangla', Wed: 'English', Thu: 'Math' },
]

export const notices = [
  {
    title: 'Science Fair Registration',
    date: '24 Jan 2026',
    preview: 'Submit your team names to the class teacher before 28 Jan.',
  },
  {
    title: 'Semester Final Schedule',
    date: '22 Jan 2026',
    preview: 'Final exams begin from 5 Feb. See the full routine for details.',
  },
  {
    title: 'Library Day',
    date: '21 Jan 2026',
    preview: 'Return overdue books by this Thursday to avoid late fees.',
  },
]

export const exams = [
  {
    name: 'Class Test - 1',
    type: 'Class Test',
    date: '30 Jan 2026',
    time: '09:00 AM',
    subject: 'Mathematics',
    chapter: 'Algebra Basics',
    room: 'Room B-204',
    status: 'Upcoming',
  },
  {
    name: 'Quiz - 2',
    type: 'Quiz',
    date: '02 Feb 2026',
    time: '11:00 AM',
    subject: 'Science',
    chapter: 'Forces & Motion',
    room: 'Lab 1',
    status: 'Upcoming',
  },
  {
    name: 'Semester Final',
    type: 'Semester Final',
    date: '05 Feb 2026',
    time: '09:00 AM',
    subject: 'English',
    chapter: 'Full Syllabus',
    room: 'Hall A',
    status: 'Upcoming',
  },
]

export const attendanceStats = {
  present: 18,
  absent: 2,
  total: 20,
  percent: 92,
}

export const results = {
  exam: 'Quiz-2',
  total: 87,
  grade: 'A',
  publishDate: '18 Jan 2026',
  gpa: '4.0',
  position: 6,
  marks: [
    { subject: 'Mathematics', marks: 28, highest: 30, pass: 12, grade: 'A+' },
    { subject: 'Science', marks: 27, highest: 30, pass: 12, grade: 'A' },
    { subject: 'English', marks: 18, highest: 20, pass: 8, grade: 'A' },
    { subject: 'History', marks: 14, highest: 20, pass: 8, grade: 'B+' },
  ],
}
