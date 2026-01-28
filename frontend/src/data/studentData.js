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
    category: 'General',
    preview: 'Submit your team names to the class teacher before 28 Jan.',
    body:
      'Students participating in the science fair should form teams of 2-3 members. Submit your project title, mentor name, and required lab materials to the class teacher by 28 Jan.',
    attachments: ['ScienceFairGuidelines.pdf'],
  },
  {
    title: 'Semester Final Schedule',
    date: '22 Jan 2026',
    category: 'Exam',
    preview: 'Final exams begin from 5 Feb. See the full routine for details.',
    body:
      'The semester finals will begin from 5 Feb. Please review the exam routine, arrive 20 minutes early, and bring your admit card.',
    attachments: ['FinalExamRoutine.pdf'],
  },
  {
    title: 'Library Day',
    date: '21 Jan 2026',
    category: 'Event',
    preview: 'Return overdue books by this Thursday to avoid late fees.',
    body:
      'Library day will be held this Thursday. Please return overdue books by 3 PM to avoid late fees.',
    attachments: [],
  },
]

export const exams = [
  {
    name: 'Class Test - 1',
    type: 'Class Test',
    code: 'MATH-701',
    date: '30 Jan 2026',
    time: '09:00 AM',
    subject: 'Mathematics',
    syllabus: 'Algebra Basics',
    room: 'Room B-204',
    status: 'Upcoming',
  },
  {
    name: 'Quiz - 2',
    type: 'Quiz',
    code: 'SCI-702',
    date: '02 Feb 2026',
    time: '11:00 AM',
    subject: 'Science',
    syllabus: 'Forces & Motion',
    room: 'Lab 1',
    status: 'Upcoming',
  },
  {
    name: 'Semester Final',
    type: 'Semester Final',
    code: 'ENG-703',
    date: '05 Feb 2026',
    time: '09:00 AM',
    subject: 'English',
    syllabus: 'Full Syllabus',
    room: 'Hall A',
    status: 'Upcoming',
  },
]

export const attendanceBySemester = {
  'Jan-Jun': {
    present: 86,
    absent: 6,
    total: 92,
    percent: 93,
  },
  'Jul-Dec': {
    present: 78,
    absent: 10,
    total: 88,
    percent: 89,
  },
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

export const alumni = [
  {
    name: 'Nusrat Karim',
    gradYear: 2022,
    major: 'Computer Science',
    currentRole: 'Software Engineer',
    organization: 'Vertex Labs',
    location: 'Dhaka, BD',
    email: 'nusrat.karim@vertexlabs.com',
  },
  {
    name: 'Raihan Chowdhury',
    gradYear: 2021,
    major: 'Business Administration',
    currentRole: 'Marketing Analyst',
    organization: 'Northwind Trading',
    location: 'Chattogram, BD',
    email: 'raihan.c@northwind.com',
  },
  {
    name: 'Samira Farhan',
    gradYear: 2020,
    major: 'Biomedical Science',
    currentRole: 'Research Associate',
    organization: 'Apollo Research Center',
    location: 'Khulna, BD',
    email: 'samira.farhan@apollo.org',
  },
]

export const faculty = [
  {
    name: 'Dr. Rashed Mahmud',
    department: 'Mathematics',
    role: 'Senior Lecturer',
    email: 'r.mahmud@springfield.edu',
    phone: '+880 1712-345-678',
    education: 'PhD in Applied Mathematics, BUET',
    photo: '/faculty-rashed.svg',
  },
  {
    name: 'Ms. Safa Ali',
    department: 'English',
    role: 'Assistant Professor',
    email: 's.ali@springfield.edu',
    phone: '+880 1811-221-445',
    education: 'MA in English Literature, DU',
    photo: '/faculty-safa.svg',
  },
  {
    name: 'Mr. Hasan Rafi',
    department: 'Science',
    role: 'Lab Instructor',
    email: 'h.rafi@springfield.edu',
    phone: '+880 1915-789-302',
    education: 'BSc in Chemistry, CU',
    photo: '/faculty-hasan.svg',
  },
]
