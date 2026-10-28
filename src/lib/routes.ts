export const ROUTES = {
  home: '/',
  students: '/estudiantes',
  studentDetail: (studentId: string) => `/estudiantes/${studentId}`,
} as const
