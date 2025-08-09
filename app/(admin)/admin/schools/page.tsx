"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { db } from "@/lib/mock-db"
import type { School } from "@/lib/types"
import {
  Search,
  Filter,
  Grid3X3,
  List,
  Plus,
  MoreHorizontal,
  Users,
  GraduationCap,
  BookOpen,
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Calendar,
  DollarSign,
  Eye,
  Edit,
  Trash2,
  Download,
  RefreshCw,
  ChevronDown,
  SortAsc,
  SortDesc,
  Settings,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Upload,
} from "lucide-react"

export default function SchoolsPage() {
  const [schools] = useState<School[]>(db.listSchools())
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBrand, setSelectedBrand] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [studentCountRange, setStudentCountRange] = useState<string>("all")
  const [sortField, setSortField] = useState<string>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [selectedSchools, setSelectedSchools] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)

  const brands = ["Acme", "Contoso", "Globex"]
  const studentCountRanges = [
    { label: "All", value: "all" },
    { label: "0-50", value: "0-50" },
    { label: "51-150", value: "51-150" },
    { label: "151-300", value: "151-300" },
    { label: "300+", value: "300+" },
  ]

  const filteredAndSortedSchools = useMemo(() => {
    let filtered = schools.filter((school) => {
      const matchesSearch = school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           school.contactEmail.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesBrand = selectedBrand === "all" || school.brand === selectedBrand
      
      const matchesStatus = selectedStatus === "all" || 
                           (selectedStatus === "active" && school.active) ||
                           (selectedStatus === "inactive" && !school.active)
      
      let matchesStudentCount = true
      if (studentCountRange !== "all") {
        const count = school.currentStudentCount
        switch (studentCountRange) {
          case "0-50": matchesStudentCount = count <= 50; break
          case "51-150": matchesStudentCount = count > 50 && count <= 150; break
          case "151-300": matchesStudentCount = count > 150 && count <= 300; break
          case "300+": matchesStudentCount = count > 300; break
        }
      }

      return matchesSearch && matchesBrand && matchesStatus && matchesStudentCount
    })

    // Sort the filtered results
    filtered.sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (sortField) {
        case "name":
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case "brand":
          aValue = a.brand
          bValue = b.brand
          break
        case "students":
          aValue = a.currentStudentCount
          bValue = b.currentStudentCount
          break
        case "created":
          aValue = new Date(a.createdAt)
          bValue = new Date(b.createdAt)
          break
        default:
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
      }

      if (typeof aValue === "string") {
        return sortDirection === "asc" 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      } else {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue
      }
    })

    return filtered
  }, [schools, searchTerm, selectedBrand, selectedStatus, studentCountRange, sortField, sortDirection])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedSchools(filteredAndSortedSchools.map(school => school.id))
    } else {
      setSelectedSchools([])
    }
  }

  const handleSelectSchool = (schoolId: string, checked: boolean) => {
    if (checked) {
      setSelectedSchools(prev => [...prev, schoolId])
    } else {
      setSelectedSchools(prev => prev.filter(id => id !== schoolId))
    }
  }

  const handleBulkStatusUpdate = async (active: boolean) => {
    console.log(`Updating ${selectedSchools.length} schools to ${active ? 'active' : 'inactive'}`)
    // Implementation for bulk status update
    setSelectedSchools([])
  }

  const handleExportData = () => {
    console.log(`Exporting data for ${selectedSchools.length || filteredAndSortedSchools.length} schools`)
    // Implementation for data export
  }

  const handleBulkEmail = () => {
    console.log(`Sending email to ${selectedSchools.length} school admins`)
    // Implementation for bulk email
  }

  const getStatusBadge = (school: School) => {
    if (school.active) {
      return <Badge variant="default" className="flex items-center gap-1">
        <CheckCircle className="h-3 w-3" />
        Active
      </Badge>
    } else {
      return <Badge variant="secondary" className="flex items-center gap-1">
        <XCircle className="h-3 w-3" />
        Inactive
      </Badge>
    }
  }

  const getPlanBadge = (plan: string) => {
    const variants = {
      "Free": "outline" as const,
      "Basic": "secondary" as const,
      "Pro": "default" as const,
      "Enterprise": "destructive" as const,
    }
    return <Badge variant={variants[plan as keyof typeof variants] || "outline"}>{plan}</Badge>
  }

  const totalStudents = schools.reduce((sum, school) => sum + school.currentStudentCount, 0)
  const totalTeachers = schools.reduce((sum, school) => sum + (school.stats?.teachers || 0), 0)
  const activeSchools = schools.filter(s => s.active).length
  const totalRevenue = schools.reduce((sum, school) => 
    sum + (school.currentBilling?.amount || 0), 0)

  const SchoolGridCard = ({ school }: { school: School }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{school.name}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              {school.brand}
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={selectedSchools.includes(school.id)}
              onCheckedChange={(checked) => handleSelectSchool(school.id, checked as boolean)}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/admin/schools/${school.id}`}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit School
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Mail className="h-4 w-4 mr-2" />
                  Send Message
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete School
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          {getStatusBadge(school)}
          {getPlanBadge(school.plan)}
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{school.currentStudentCount}</div>
            <div className="text-xs text-muted-foreground">Students</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{school.stats?.teachers || 0}</div>
            <div className="text-xs text-muted-foreground">Teachers</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">{school.stats?.classes || 0}</div>
            <div className="text-xs text-muted-foreground">Classes</div>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-3 w-3" />
            {school.contactEmail}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="h-3 w-3" />
            {school.contactPhone}
          </div>
          {school.website && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Globe className="h-3 w-3" />
              <a href={school.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                Website
              </a>
            </div>
          )}
        </div>

        <Separator />

        <div className="flex justify-between items-center">
          <div className="text-xs text-muted-foreground">
            Created {new Date(school.createdAt).toLocaleDateString()}
          </div>
          <div className="flex space-x-1">
            <Link href={`/admin/schools/${school.id}`}>
              <Button variant="outline" size="sm">
                <Eye className="h-3 w-3 mr-1" />
                View
              </Button>
            </Link>
            <Button variant="outline" size="sm">
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const SchoolListRow = ({ school }: { school: School }) => (
    <TableRow>
      <TableCell>
        <Checkbox
          checked={selectedSchools.includes(school.id)}
          onCheckedChange={(checked) => handleSelectSchool(school.id, checked as boolean)}
        />
      </TableCell>
      <TableCell>
        <div>
          <div className="font-medium">{school.name}</div>
          <div className="text-sm text-muted-foreground">
            {school.contactEmail}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="outline">{school.brand}</Badge>
      </TableCell>
      <TableCell>
        <Badge variant="outline">{school.plan}</Badge>
      </TableCell>
      <TableCell>{school.currentStudentCount}</TableCell>
      <TableCell>{school.stats?.teachers || 0}</TableCell>
      <TableCell>{school.stats?.classes || 0}</TableCell>
      <TableCell>
        {getStatusBadge(school)}
      </TableCell>
      <TableCell>
        {school.currentBilling ? (
          <div className="flex items-center gap-1">
            {school.currentBilling.paymentStatus === "Active" ? (
              <CheckCircle className="h-3 w-3 text-green-600" />
            ) : (
              <AlertCircle className="h-3 w-3 text-yellow-600" />
            )}
            ₦{school.currentBilling.amount.toLocaleString()}
          </div>
        ) : (
          <span className="text-muted-foreground">-</span>
        )}
      </TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/admin/schools/${school.id}`}>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="h-4 w-4 mr-2" />
              Edit School
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Mail className="h-4 w-4 mr-2" />
              Send Message
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete School
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">School Management</h1>
          <p className="text-muted-foreground">
            Manage your school partnerships and track performance across all brands
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add School
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Schools</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{schools.length}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">{activeSchools} active</span> • {schools.length - activeSchools} inactive
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Across all schools
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTeachers}</div>
            <p className="text-xs text-muted-foreground">
              Active teaching staff
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{Math.round(totalRevenue / 12).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +12.5% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search schools..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button 
                variant="outline" 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
                <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <Label htmlFor="sort">Sort by:</Label>
                <Select value={sortField} onValueChange={setSortField}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="brand">Brand</SelectItem>
                    <SelectItem value="students">Students</SelectItem>
                    <SelectItem value="created">Created</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
                >
                  {sortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                </Button>
              </div>
              
              <Separator orientation="vertical" className="h-8" />
              
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
              <div>
                <Label htmlFor="brand-filter">Brand</Label>
                <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Brands</SelectItem>
                    {brands.map(brand => (
                      <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="status-filter">Status</Label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="student-count-filter">Student Count</Label>
                <Select value={studentCountRange} onValueChange={setStudentCountRange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {studentCountRanges.map(range => (
                      <SelectItem key={range.value} value={range.value}>{range.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedBrand("all")
                    setSelectedStatus("all")
                    setStudentCountRange("all")
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bulk Operations */}
      {selectedSchools.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={selectedSchools.length === filteredAndSortedSchools.length}
                  onCheckedChange={handleSelectAll}
                />
                <span className="text-sm font-medium">
                  {selectedSchools.length} of {filteredAndSortedSchools.length} selected
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleBulkStatusUpdate(true)}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Activate Selected
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleBulkStatusUpdate(false)}>
                  <XCircle className="h-4 w-4 mr-2" />
                  Deactivate Selected
                </Button>
                <Button variant="outline" size="sm" onClick={handleExportData}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
                <Button variant="outline" size="sm" onClick={handleBulkEmail}>
                  <Mail className="h-4 w-4 mr-2" />
                  Email Admins
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Schools Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Schools ({filteredAndSortedSchools.length})</span>
            {!selectedSchools.length && (
              <Checkbox
                checked={false}
                onCheckedChange={handleSelectAll}
              />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedSchools.map((school) => (
                <SchoolGridCard key={school.id} school={school} />
              ))}
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedSchools.length === filteredAndSortedSchools.length && filteredAndSortedSchools.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>School</TableHead>
                    <TableHead>Brand</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Teachers</TableHead>
                    <TableHead>Classes</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedSchools.map((school) => (
                    <SchoolListRow key={school.id} school={school} />
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          
          {filteredAndSortedSchools.length === 0 && (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No schools found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filter criteria
              </p>
              <Button onClick={() => {
                setSearchTerm("")
                setSelectedBrand("all")
                setSelectedStatus("all")
                setStudentCountRange("all")
              }}>
                Clear Filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
