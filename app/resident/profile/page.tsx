"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit2, 
  Save, 
  X,
  CheckCircle2,
  Shield,
  FileText,
  AlertTriangle
} from "lucide-react"

// Mock user data
const mockUser = {
  id: "resident-001",
  firstName: "Juan",
  middleName: "Santos",
  lastName: "Dela Cruz",
  suffix: "",
  birthDate: "1990-05-15",
  gender: "Male",
  civilStatus: "Married",
  email: "juan.delacruz@email.com",
  phone: "09123456789",
  address: "Purok 3, Barangay Santiago",
  municipality: "San Antonio",
  province: "Zambales",
  zipCode: "2206",
  occupation: "Teacher",
  employer: "San Antonio National High School",
  registrationDate: "January 15, 2024",
  verificationStatus: "verified",
  avatar: "/placeholder-avatar.jpg"
}

const mockStats = {
  documentsRequested: 5,
  documentsApproved: 3,
  blottersFiled: 2,
  blottersResolved: 1
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(mockUser)

  const handleSave = () => {
    // Save logic here
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData(mockUser)
    setIsEditing(false)
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">My Profile</h1>
          <p className="text-sm text-muted-foreground">Manage your personal information</p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} className="w-full sm:w-auto">
            <Edit2 className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" onClick={handleCancel} className="flex-1 sm:flex-none">
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1 sm:flex-none">
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
          </div>
        )}
      </div>

      {/* Profile Header Card */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <div className="relative">
              <Avatar className="h-20 w-20 sm:h-24 sm:w-24 ring-4 ring-primary/20">
                <AvatarImage src={formData.avatar} alt="Profile" />
                <AvatarFallback className="bg-primary text-primary-foreground text-xl sm:text-2xl">
                  {formData.firstName[0]}{formData.lastName[0]}
                </AvatarFallback>
              </Avatar>
              {formData.verificationStatus === "verified" && (
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              )}
            </div>
            <div className="text-center sm:text-left flex-1">
              <h2 className="text-xl sm:text-2xl font-bold">
                {formData.firstName} {formData.middleName} {formData.lastName} {formData.suffix}
              </h2>
              <p className="text-sm text-muted-foreground flex items-center justify-center sm:justify-start gap-1 mt-1">
                <MapPin className="h-4 w-4" />
                {formData.address}, {formData.municipality}, {formData.province}
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
                <Badge className="bg-emerald-100 text-emerald-700">
                  <Shield className="mr-1 h-3 w-3" />
                  Verified Resident
                </Badge>
                <Badge variant="outline">
                  Since {formData.registrationDate}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-3 sm:p-4 text-center">
            <FileText className="h-5 w-5 sm:h-6 sm:w-6 mx-auto text-primary" />
            <p className="text-lg sm:text-2xl font-bold mt-1 sm:mt-2">{mockStats.documentsRequested}</p>
            <p className="text-xs text-muted-foreground">Documents Requested</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4 text-center">
            <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 mx-auto text-emerald-600" />
            <p className="text-lg sm:text-2xl font-bold mt-1 sm:mt-2">{mockStats.documentsApproved}</p>
            <p className="text-xs text-muted-foreground">Documents Approved</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4 text-center">
            <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 mx-auto text-amber-600" />
            <p className="text-lg sm:text-2xl font-bold mt-1 sm:mt-2">{mockStats.blottersFiled}</p>
            <p className="text-xs text-muted-foreground">Blotters Filed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4 text-center">
            <Shield className="h-5 w-5 sm:h-6 sm:w-6 mx-auto text-blue-600" />
            <p className="text-lg sm:text-2xl font-bold mt-1 sm:mt-2">{mockStats.blottersResolved}</p>
            <p className="text-xs text-muted-foreground">Blotters Resolved</p>
          </CardContent>
        </Card>
      </div>

      {/* Profile Details */}
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="personal" className="text-xs sm:text-sm">Personal</TabsTrigger>
          <TabsTrigger value="contact" className="text-xs sm:text-sm">Contact</TabsTrigger>
          <TabsTrigger value="employment" className="text-xs sm:text-sm">Employment</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="mt-4">
          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <User className="h-4 w-4 sm:h-5 sm:w-5" />
                Personal Information
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">Your basic personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm">First Name</Label>
                  {isEditing ? (
                    <Input 
                      value={formData.firstName}
                      onChange={(e) => handleChange('firstName', e.target.value)}
                    />
                  ) : (
                    <p className="text-sm font-medium p-2 bg-muted rounded-md">{formData.firstName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm">Middle Name</Label>
                  {isEditing ? (
                    <Input 
                      value={formData.middleName}
                      onChange={(e) => handleChange('middleName', e.target.value)}
                    />
                  ) : (
                    <p className="text-sm font-medium p-2 bg-muted rounded-md">{formData.middleName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm">Last Name</Label>
                  {isEditing ? (
                    <Input 
                      value={formData.lastName}
                      onChange={(e) => handleChange('lastName', e.target.value)}
                    />
                  ) : (
                    <p className="text-sm font-medium p-2 bg-muted rounded-md">{formData.lastName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm">Suffix</Label>
                  {isEditing ? (
                    <Input 
                      value={formData.suffix}
                      onChange={(e) => handleChange('suffix', e.target.value)}
                      placeholder="Jr., Sr., III, etc."
                    />
                  ) : (
                    <p className="text-sm font-medium p-2 bg-muted rounded-md">{formData.suffix || "N/A"}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm">Birth Date</Label>
                  {isEditing ? (
                    <Input 
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => handleChange('birthDate', e.target.value)}
                    />
                  ) : (
                    <p className="text-sm font-medium p-2 bg-muted rounded-md flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {new Date(formData.birthDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm">Gender</Label>
                  {isEditing ? (
                    <Select value={formData.gender} onValueChange={(value) => handleChange('gender', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-sm font-medium p-2 bg-muted rounded-md">{formData.gender}</p>
                  )}
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label className="text-xs sm:text-sm">Civil Status</Label>
                  {isEditing ? (
                    <Select value={formData.civilStatus} onValueChange={(value) => handleChange('civilStatus', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Single">Single</SelectItem>
                        <SelectItem value="Married">Married</SelectItem>
                        <SelectItem value="Widowed">Widowed</SelectItem>
                        <SelectItem value="Separated">Separated</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-sm font-medium p-2 bg-muted rounded-md">{formData.civilStatus}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="mt-4">
          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5" />
                Contact Information
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">Your contact details and address</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm">Email Address</Label>
                  {isEditing ? (
                    <Input 
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                    />
                  ) : (
                    <p className="text-sm font-medium p-2 bg-muted rounded-md flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      {formData.email}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm">Phone Number</Label>
                  {isEditing ? (
                    <Input 
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                    />
                  ) : (
                    <p className="text-sm font-medium p-2 bg-muted rounded-md flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      {formData.phone}
                    </p>
                  )}
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label className="text-xs sm:text-sm">Complete Address</Label>
                  {isEditing ? (
                    <Textarea 
                      value={formData.address}
                      onChange={(e) => handleChange('address', e.target.value)}
                    />
                  ) : (
                    <p className="text-sm font-medium p-2 bg-muted rounded-md flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      {formData.address}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm">Municipality</Label>
                  {isEditing ? (
                    <Input 
                      value={formData.municipality}
                      onChange={(e) => handleChange('municipality', e.target.value)}
                    />
                  ) : (
                    <p className="text-sm font-medium p-2 bg-muted rounded-md">{formData.municipality}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm">Province</Label>
                  {isEditing ? (
                    <Input 
                      value={formData.province}
                      onChange={(e) => handleChange('province', e.target.value)}
                    />
                  ) : (
                    <p className="text-sm font-medium p-2 bg-muted rounded-md">{formData.province}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm">Zip Code</Label>
                  {isEditing ? (
                    <Input 
                      value={formData.zipCode}
                      onChange={(e) => handleChange('zipCode', e.target.value)}
                    />
                  ) : (
                    <p className="text-sm font-medium p-2 bg-muted rounded-md">{formData.zipCode}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="employment" className="mt-4">
          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
                Employment Information
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">Your work and occupation details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm">Occupation</Label>
                  {isEditing ? (
                    <Input 
                      value={formData.occupation}
                      onChange={(e) => handleChange('occupation', e.target.value)}
                    />
                  ) : (
                    <p className="text-sm font-medium p-2 bg-muted rounded-md">{formData.occupation}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm">Employer / Company</Label>
                  {isEditing ? (
                    <Input 
                      value={formData.employer}
                      onChange={(e) => handleChange('employer', e.target.value)}
                    />
                  ) : (
                    <p className="text-sm font-medium p-2 bg-muted rounded-md">{formData.employer}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
