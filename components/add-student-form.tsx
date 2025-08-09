"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { db } from "@/lib/mock-db"
import { School, ClassRoom } from "@/lib/types"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building2,
  GraduationCap,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react"

interface AddStudentFormProps {
  schools: School[]
  classes: ClassRoom[]
}

export function AddStudentForm({ schools, classes }: AddStudentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [studentId, setStudentId] = useState("")
  const [formData, setFormData] = useState({
    // Basic Information
    name: "",
    email: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    
    // Academic Information
    schoolId: "",
    classId: "",
    
    // Parent/Guardian Information
    parentName: "",
    parentEmail: "",
    parentPhone: "",
    secondaryParentName: "",
    secondaryParentEmail: "",
    secondaryParentPhone: "",
    
    // Medical Information (optional)
    allergies: "",
    medications: "",
    emergencyContact: "",
    bloodGroup: "",
  })

  // Generate student ID based on school and class
  const generateStudentId = (schoolId: string, classId: string) => {
    if (!schoolId || !classId) return ""
    
    const school = schools.find(s => s.id === schoolId)
    const studentClass = classes.find(c => c.id === classId)
    
    if (!school || !studentClass) return ""
    
    const schoolCode = school.name.substring(0, 3).toUpperCase()
    const year = new Date().getFullYear().toString().slice(-2)
    const classCode = studentClass.name.replace(/\s+/g, '').toUpperCase()
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    
    return `${schoolCode}${year}${classCode}${randomNum}`
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Auto-generate student ID when school and class are selected
    if (field === "schoolId" || field === "classId") {
      const newSchoolId = field === "schoolId" ? value : formData.schoolId
      const newClassId = field === "classId" ? value : formData.classId
      
      if (newSchoolId && newClassId) {
        const newStudentId = generateStudentId(newSchoolId, newClassId)
        setStudentId(newStudentId)
      }
    }
  }

  const validateForm = () => {
    const errors = []
    
    if (!formData.name.trim()) errors.push("Student name is required")
    if (!formData.schoolId) errors.push("School selection is required")
    if (!formData.classId) errors.push("Class selection is required")
    if (!formData.parentName.trim()) errors.push("Parent/Guardian name is required")
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push("Invalid email format")
    }
    if (formData.parentEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.parentEmail)) {
      errors.push("Invalid parent email format")
    }
    
    return errors
  }

  const handleSubmit = async () => {
    const errors = validateForm()
    if (errors.length > 0) {
      alert("Please fix the following errors:\n" + errors.join("\n"))
      return
    }

    setIsSubmitting(true)
    
    try {
      // Create student object
      const newStudent = {
        id: `student_${Date.now()}`,
        studentId: studentId,
        name: formData.name,
        email: formData.email || undefined,
        dateOfBirth: formData.dateOfBirth || undefined,
        gender: formData.gender as "Male" | "Female" | undefined,
        schoolId: formData.schoolId,
        classId: formData.classId,
        parentName: formData.parentName || undefined,
        parentEmail: formData.parentEmail || undefined,
        parentPhone: formData.parentPhone || undefined,
        secondaryParentName: formData.secondaryParentName || undefined,
        secondaryParentEmail: formData.secondaryParentEmail || undefined,
        secondaryParentPhone: formData.secondaryParentPhone || undefined,
        address: formData.address || undefined,
        enrollmentDate: new Date().toISOString(),
        active: true,
        performanceLevel: "Average" as const,
        currentGPA: 0,
        medicalInfo: {
          allergies: formData.allergies ? formData.allergies.split(',').map(a => a.trim()) : undefined,
          medications: formData.medications ? formData.medications.split(',').map(m => m.trim()) : undefined,
          emergencyContact: formData.emergencyContact || undefined,
          bloodGroup: formData.bloodGroup || undefined,
        }
      }

      // Save student (in real app, this would be an API call)
      const result = db.addStudent(newStudent)
      
      if (result.success) {
        alert("Student created successfully!")
        // Reset form
        setFormData({
          name: "", email: "", dateOfBirth: "", gender: "", address: "",
          schoolId: "", classId: "", parentName: "", parentEmail: "", parentPhone: "",
          secondaryParentName: "", secondaryParentEmail: "", secondaryParentPhone: "",
          allergies: "", medications: "", emergencyContact: "", bloodGroup: "",
        })
        setStudentId("")
      } else {
        throw new Error(result.error || "Failed to create student")
      }
    } catch (error) {
      console.error("Error creating student:", error)
      alert("Failed to create student. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredClasses = classes.filter(cls => 
    !formData.schoolId || cls.schoolId === formData.schoolId
  )

  return (
    <div className="space-y-6">
      {/* Student ID Preview */}
      {studentId && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Generated Student ID:</strong> {studentId}
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="basic" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="academic">Academic</TabsTrigger>
          <TabsTrigger value="parent">Parent/Guardian</TabsTrigger>
          <TabsTrigger value="medical">Medical Info</TabsTrigger>
        </TabsList>

        {/* Basic Information */}
        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Basic student details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter student's full name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="student@example.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Home Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Enter home address"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Academic Information */}
        <TabsContent value="academic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Academic Details
              </CardTitle>
              <CardDescription>
                School enrollment and class assignment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="school">School *</Label>
                  <Select value={formData.schoolId} onValueChange={(value) => handleInputChange("schoolId", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select school" />
                    </SelectTrigger>
                    <SelectContent>
                      {schools.map(school => (
                        <SelectItem key={school.id} value={school.id}>
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            {school.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="class">Class *</Label>
                  <Select 
                    value={formData.classId} 
                    onValueChange={(value) => handleInputChange("classId", value)}
                    disabled={!formData.schoolId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={formData.schoolId ? "Select class" : "Select school first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredClasses.map(cls => (
                        <SelectItem key={cls.id} value={cls.id}>
                          <div className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4" />
                            {cls.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {studentId && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-green-800">
                    <CheckCircle className="h-4 w-4" />
                    <span className="font-medium">Student ID Preview</span>
                  </div>
                  <div className="text-2xl font-mono font-bold text-green-900 mt-2">
                    {studentId}
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    This ID will be automatically assigned to the student
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Parent/Guardian Information */}
        <TabsContent value="parent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Primary Parent/Guardian
              </CardTitle>
              <CardDescription>
                Primary contact information for the student
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="parentName">Parent/Guardian Name *</Label>
                  <Input
                    id="parentName"
                    value={formData.parentName}
                    onChange={(e) => handleInputChange("parentName", e.target.value)}
                    placeholder="Enter parent/guardian name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="parentEmail">Email Address</Label>
                  <Input
                    id="parentEmail"
                    type="email"
                    value={formData.parentEmail}
                    onChange={(e) => handleInputChange("parentEmail", e.target.value)}
                    placeholder="parent@example.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="parentPhone">Phone Number</Label>
                  <Input
                    id="parentPhone"
                    type="tel"
                    value={formData.parentPhone}
                    onChange={(e) => handleInputChange("parentPhone", e.target.value)}
                    placeholder="+234 XXX XXX XXXX"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Secondary Parent/Guardian</CardTitle>
              <CardDescription>
                Optional secondary contact (spouse, relative, etc.)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="secondaryParentName">Name</Label>
                  <Input
                    id="secondaryParentName"
                    value={formData.secondaryParentName}
                    onChange={(e) => handleInputChange("secondaryParentName", e.target.value)}
                    placeholder="Enter secondary contact name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="secondaryParentEmail">Email Address</Label>
                  <Input
                    id="secondaryParentEmail"
                    type="email"
                    value={formData.secondaryParentEmail}
                    onChange={(e) => handleInputChange("secondaryParentEmail", e.target.value)}
                    placeholder="secondary@example.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="secondaryParentPhone">Phone Number</Label>
                  <Input
                    id="secondaryParentPhone"
                    type="tel"
                    value={formData.secondaryParentPhone}
                    onChange={(e) => handleInputChange("secondaryParentPhone", e.target.value)}
                    placeholder="+234 XXX XXX XXXX"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Medical Information */}
        <TabsContent value="medical" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Medical Information
              </CardTitle>
              <CardDescription>
                Optional health and emergency information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bloodGroup">Blood Group</Label>
                  <Select value={formData.bloodGroup} onValueChange={(value) => handleInputChange("bloodGroup", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">Emergency Contact</Label>
                  <Input
                    id="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                    placeholder="Emergency contact number"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="allergies">Allergies</Label>
                <Textarea
                  id="allergies"
                  value={formData.allergies}
                  onChange={(e) => handleInputChange("allergies", e.target.value)}
                  placeholder="List any known allergies (comma-separated)"
                  rows={2}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="medications">Current Medications</Label>
                <Textarea
                  id="medications"
                  value={formData.medications}
                  onChange={(e) => handleInputChange("medications", e.target.value)}
                  placeholder="List any current medications (comma-separated)"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Form Actions */}
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" disabled={isSubmitting}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Creating Student...
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Create Student
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
