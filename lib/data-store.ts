// Simple in-memory data store for development
// In production, this would be replaced with a real database

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  username: string
  password: string
  role: string
  schoolId: string
  schoolName?: string
  schoolAddress?: string
  schoolType?: string
  studentId?: string
  employeeId?: string
  department?: string
  status: string
  emailVerified: boolean
  verificationToken: string | null
  createdAt: string
  lastLoginAt: string | null
  verifiedAt?: string
  acceptedTermsAt: string
  acceptedPrivacyAt: string
  subscribeNewsletter: boolean
}

export interface School {
  id: string
  name: string
  type: string
  address: string
  adminId: string
  status: string
  createdAt: string
  settings: {
    allowSelfRegistration: boolean
    requireEmailVerification: boolean
    maxStudents: number
  }
}

// In-memory storage
const registeredUsers: User[] = []
const registeredSchools: School[] = []

export { registeredUsers, registeredSchools }

// Helper functions
export function findUserByEmail(email: string): User | undefined {
  return registeredUsers.find(user => user.email === email)
}

export function findUserByUsername(username: string): User | undefined {
  return registeredUsers.find(user => user.username === username)
}

export function findUserByToken(token: string): User | undefined {
  return registeredUsers.find(user => user.verificationToken === token)
}

export function addUser(user: User): void {
  registeredUsers.push(user)
}

export function updateUser(userId: string, updates: Partial<User>): boolean {
  const userIndex = registeredUsers.findIndex(user => user.id === userId)
  if (userIndex !== -1) {
    registeredUsers[userIndex] = { ...registeredUsers[userIndex], ...updates }
    return true
  }
  return false
}

export function addSchool(school: School): void {
  registeredSchools.push(school)
}

export function getAllUsers(): User[] {
  return [...registeredUsers]
}

export function getAllSchools(): School[] {
  return [...registeredSchools]
}
