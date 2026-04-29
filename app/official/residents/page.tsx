"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Search, 
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Users,
  Filter,
  Download
} from "lucide-react"

const mockResidents = [
  {
    id: "RES-001",
    name: "Juan Dela Cruz",
    email: "juan@example.com",
    purok: "Purok 3",
    gender: "Male",
    status: "verified",
    documentType: "Valid ID",
    registeredDate: "April 15, 2026"
  },
  {
    id: "RES-002",
    name: "Maria Santos",
    email: "maria@example.com",
    purok: "Purok 1",
    gender: "Female",
    status: "pending",
    documentType: "Birth Certificate",
    registeredDate: "April 25, 2026"
  },
  {
    id: "RES-003",
    name: "Pedro Reyes",
    email: "pedro@example.com",
    purok: "Purok 2",
    gender: "Male",
    status: "pending",
    documentType: "Voter's ID",
    registeredDate: "April 27, 2026"
  },
  {
    id: "RES-004",
    name: "Ana Garcia",
    email: "ana@example.com",
    purok: "Purok 4",
    gender: "Female",
    status: "verified",
    documentType: "Valid ID",
    registeredDate: "March 10, 2026"
  },
  {
    id: "RES-005",
    name: "Carlos Mendoza",
    email: "carlos@example.com",
    purok: "Purok 5",
    gender: "Male",
    status: "rejected",
    documentType: "Birth Certificate",
    remarks: "Invalid document uploaded",
    registeredDate: "April 20, 2026"
  },
]

function getStatusBadge(status: string) {
  switch (status) {
    case "verified":
      return (
        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
          <CheckCircle2 className="mr-1 h-3 w-3" />
          Verified
        </Badge>
      )
    case "pending":
      return (
        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
          <Clock className="mr-1 h-3 w-3" />
          Pending
        </Badge>
      )
    case "rejected":
      return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
          <XCircle className="mr-1 h-3 w-3" />
          Rejected
        </Badge>
      )
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export default function ResidentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedResident, setSelectedResident] = useState<typeof mockResidents[0] | null>(null)

  const filteredResidents = mockResidents.filter(res => 
    res.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    res.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    res.purok.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const pendingCount = mockResidents.filter(r => r.status === "pending").length
  const verifiedCount = mockResidents.filter(r => r.status === "verified").length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Residents Management</h1>
          <p className="text-muted-foreground">Manage and verify resident accounts</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-primary/10 p-2">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockResidents.length}</p>
                <p className="text-sm text-muted-foreground">Total Residents</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-amber-100 p-2">
                <Clock className="h-5 w-5 text-amber-700" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingCount}</p>
                <p className="text-sm text-muted-foreground">Pending Verification</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-emerald-100 p-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-700" />
              </div>
              <div>
                <p className="text-2xl font-bold">{verifiedCount}</p>
                <p className="text-sm text-muted-foreground">Verified Residents</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search residents..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Residents Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Resident List</CardTitle>
          <CardDescription>All registered residents in Barangay Santiago</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All ({mockResidents.length})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({pendingCount})</TabsTrigger>
              <TabsTrigger value="verified">Verified ({verifiedCount})</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Purok</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredResidents.map((resident) => (
                      <TableRow key={resident.id}>
                        <TableCell className="font-medium">{resident.name}</TableCell>
                        <TableCell>{resident.email}</TableCell>
                        <TableCell>{resident.purok}</TableCell>
                        <TableCell>{resident.gender}</TableCell>
                        <TableCell>{getStatusBadge(resident.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedResident(resident)}
                            >
                              <Eye className="mr-1 h-3 w-3" />
                              View
                            </Button>
                            {resident.status === "pending" && (
                              <>
                                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                                  Verify
                                </Button>
                                <Button size="sm" variant="destructive">
                                  Reject
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="pending" className="mt-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Purok</TableHead>
                      <TableHead>Document</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredResidents.filter(r => r.status === "pending").map((resident) => (
                      <TableRow key={resident.id}>
                        <TableCell className="font-medium">{resident.name}</TableCell>
                        <TableCell>{resident.email}</TableCell>
                        <TableCell>{resident.purok}</TableCell>
                        <TableCell>{resident.documentType}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedResident(resident)}
                            >
                              View
                            </Button>
                            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                              Verify
                            </Button>
                            <Button size="sm" variant="destructive">
                              Reject
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="verified" className="mt-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Purok</TableHead>
                      <TableHead>Registered</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredResidents.filter(r => r.status === "verified").map((resident) => (
                      <TableRow key={resident.id}>
                        <TableCell className="font-medium">{resident.name}</TableCell>
                        <TableCell>{resident.email}</TableCell>
                        <TableCell>{resident.purok}</TableCell>
                        <TableCell>{resident.registeredDate}</TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedResident(resident)}
                          >
                            View Profile
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Resident Details Modal */}
      <Dialog open={!!selectedResident} onOpenChange={() => setSelectedResident(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Resident Details</DialogTitle>
            <DialogDescription>
              View resident information and verification status
            </DialogDescription>
          </DialogHeader>
          {selectedResident && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                {getStatusBadge(selectedResident.status)}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="font-medium">{selectedResident.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedResident.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Purok</p>
                  <p className="font-medium">{selectedResident.purok}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Gender</p>
                  <p className="font-medium">{selectedResident.gender}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Document Type</p>
                  <p className="font-medium">{selectedResident.documentType}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Registered Date</p>
                  <p className="font-medium">{selectedResident.registeredDate}</p>
                </div>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground mb-2">Uploaded Document</p>
                <div className="aspect-video rounded bg-muted flex items-center justify-center">
                  <span className="text-sm text-muted-foreground">Document Preview</span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedResident(null)}>Close</Button>
            {selectedResident?.status === "pending" && (
              <>
                <Button variant="destructive">Reject</Button>
                <Button className="bg-emerald-600 hover:bg-emerald-700">Verify</Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
