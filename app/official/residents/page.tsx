"use client"

import { useState } from "react"
import { motion } from "framer-motion"
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
  Download,
  Bell,
  Send,
  FileText,
  Trash2,
  Plus
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
        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 text-[10px] md:text-xs">
          <CheckCircle2 className="mr-1 h-2.5 w-2.5 md:h-3 md:w-3" />
          <span className="hidden sm:inline">Verified</span>
          <span className="sm:hidden">OK</span>
        </Badge>
      )
    case "pending":
      return (
        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 text-[10px] md:text-xs">
          <Clock className="mr-1 h-2.5 w-2.5 md:h-3 md:w-3" />
          <span className="hidden sm:inline">Pending</span>
          <span className="sm:hidden">Wait</span>
        </Badge>
      )
    case "rejected":
      return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-100 text-[10px] md:text-xs">
          <XCircle className="mr-1 h-2.5 w-2.5 md:h-3 md:w-3" />
          <span className="hidden sm:inline">Rejected</span>
          <span className="sm:hidden">No</span>
        </Badge>
      )
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export default function ResidentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedResident, setSelectedResident] = useState<typeof mockResidents[0] | null>(null)
  const [purokFilter, setPurokFilter] = useState("all")

  const filteredResidents = mockResidents.filter(res => {
    const matchesSearch = res.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.purok.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesPurok = purokFilter === "all" || res.purok === purokFilter
    
    return matchesSearch && matchesPurok
  })

  const pendingCount = mockResidents.filter(r => r.status === "pending").length
  const verifiedCount = mockResidents.filter(r => r.status === "verified").length

  const exportToCSV = () => {
    const headers = ["ID", "Name", "Email", "Purok", "Gender", "Status", "Document Type", "Registered Date"]
    const rows = filteredResidents.map(resident => [
      resident.id,
      resident.name,
      resident.email,
      resident.purok,
      resident.gender,
      resident.status,
      resident.documentType,
      resident.registeredDate
    ])

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `residents-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4 md:space-y-6"
    >
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">Residents Management</h1>
          <p className="text-xs md:text-sm text-muted-foreground">Manage and verify resident accounts</p>
        </div>
        <Button variant="outline" size="sm" className="w-fit h-8 md:h-9 text-xs md:text-sm" onClick={exportToCSV}>
          <Download className="h-3 w-3 md:h-4 md:w-4 md:mr-2" />
          <span className="hidden md:inline">Export CSV</span>
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-3 gap-2 md:gap-4">
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2 md:gap-4">
              <div className="rounded-lg bg-primary/10 p-1.5 md:p-2">
                <Users className="h-4 w-4 md:h-5 md:w-5 text-primary" />
              </div>
              <div>
                <p className="text-lg md:text-2xl font-bold">{mockResidents.length}</p>
                <p className="text-[10px] md:text-sm text-muted-foreground">Total Residents</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2 md:gap-4">
              <div className="rounded-lg bg-amber-100 p-1.5 md:p-2">
                <Clock className="h-4 w-4 md:h-5 md:w-5 text-amber-700" />
              </div>
              <div>
                <p className="text-lg md:text-2xl font-bold">{pendingCount}</p>
                <p className="text-[10px] md:text-sm text-muted-foreground">Pending Verification</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2 md:gap-4">
              <div className="rounded-lg bg-emerald-100 p-1.5 md:p-2">
                <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 text-emerald-700" />
              </div>
              <div>
                <p className="text-lg md:text-2xl font-bold">{verifiedCount}</p>
                <p className="text-[10px] md:text-sm text-muted-foreground">Verified</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Search and Filters */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search residents..." 
            className="pl-10 h-9 md:h-10 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          value={purokFilter}
          onChange={(e) => setPurokFilter(e.target.value)}
          className="h-9 md:h-10 px-3 text-sm border border-input rounded-md bg-background text-foreground dark:border-slate-700 dark:bg-slate-950 w-full sm:w-auto"
        >
          <option value="all">All Puroks</option>
          <option value="Purok 1">Purok 1</option>
          <option value="Purok 2">Purok 2</option>
          <option value="Purok 3">Purok 3</option>
          <option value="Purok 4">Purok 4</option>
          <option value="Purok 5">Purok 5</option>
          <option value="Purok 6">Purok 6</option>
          <option value="Purok 7">Purok 7</option>
        </select>
      </motion.div>

      {/* Residents Table */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="p-3 md:p-6 pb-2 md:pb-4">
            <CardTitle className="text-base md:text-lg">Resident List</CardTitle>
            <CardDescription className="text-xs md:text-sm">All registered residents in Barangay Santiago</CardDescription>
          </CardHeader>
          <CardContent className="p-3 md:p-6 pt-0 md:pt-0">
            <Tabs defaultValue="all">
              <TabsList className="h-8 md:h-9 text-xs md:text-sm w-full justify-start overflow-x-auto">
                <TabsTrigger value="all" className="text-xs md:text-sm px-2 md:px-3">All ({mockResidents.length})</TabsTrigger>
                <TabsTrigger value="pending" className="text-xs md:text-sm px-2 md:px-3">Pending ({pendingCount})</TabsTrigger>
                <TabsTrigger value="verified" className="text-xs md:text-sm px-2 md:px-3">Verified ({verifiedCount})</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="mt-3 md:mt-4">
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs md:text-sm">Name</TableHead>
                        <TableHead className="text-xs md:text-sm hidden sm:table-cell">Email</TableHead>
                        <TableHead className="text-xs md:text-sm hidden md:table-cell">Purok</TableHead>
                        <TableHead className="text-xs md:text-sm">Status</TableHead>
                        <TableHead className="text-xs md:text-sm">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredResidents.map((resident) => (
                        <TableRow key={resident.id}>
                          <TableCell className="font-medium text-xs md:text-sm py-2 md:py-4">{resident.name}</TableCell>
                          <TableCell className="text-xs md:text-sm py-2 md:py-4 hidden sm:table-cell">{resident.email}</TableCell>
                          <TableCell className="text-xs md:text-sm py-2 md:py-4 hidden md:table-cell">{resident.purok}</TableCell>
                          <TableCell className="py-2 md:py-4">{getStatusBadge(resident.status)}</TableCell>
                          <TableCell className="py-2 md:py-4">
                            <div className="flex gap-1 md:gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="h-7 md:h-8 px-2 md:px-3 text-xs"
                                onClick={() => setSelectedResident(resident)}
                              >
                                <Eye className="h-3 w-3 md:mr-1" />
                                <span className="hidden md:inline">View</span>
                              </Button>
                              {resident.status === "pending" && (
                                <>
                                  <Button size="sm" className="h-7 md:h-8 px-2 md:px-3 text-xs bg-emerald-600 hover:bg-emerald-700">
                                    <CheckCircle2 className="h-3 w-3 md:mr-1" />
                                    <span className="hidden md:inline">Verify</span>
                                  </Button>
                                  <Button size="sm" variant="destructive" className="h-7 md:h-8 px-2 md:px-3 text-xs">
                                    <XCircle className="h-3 w-3 md:mr-1" />
                                    <span className="hidden lg:inline">Reject</span>
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
              <TabsContent value="pending" className="mt-3 md:mt-4">
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs md:text-sm">Name</TableHead>
                        <TableHead className="text-xs md:text-sm hidden sm:table-cell">Email</TableHead>
                        <TableHead className="text-xs md:text-sm hidden md:table-cell">Document</TableHead>
                        <TableHead className="text-xs md:text-sm">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredResidents.filter(r => r.status === "pending").map((resident) => (
                        <TableRow key={resident.id}>
                          <TableCell className="font-medium text-xs md:text-sm py-2 md:py-4">{resident.name}</TableCell>
                          <TableCell className="text-xs md:text-sm py-2 md:py-4 hidden sm:table-cell">{resident.email}</TableCell>
                          <TableCell className="text-xs md:text-sm py-2 md:py-4 hidden md:table-cell">{resident.documentType}</TableCell>
                          <TableCell className="py-2 md:py-4">
                            <div className="flex gap-1 md:gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="h-7 md:h-8 px-2 md:px-3 text-xs"
                                onClick={() => setSelectedResident(resident)}
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button size="sm" className="h-7 md:h-8 px-2 md:px-3 text-xs bg-emerald-600 hover:bg-emerald-700">
                                <CheckCircle2 className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="destructive" className="h-7 md:h-8 px-2 md:px-3 text-xs">
                                <XCircle className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              <TabsContent value="verified" className="mt-3 md:mt-4">
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs md:text-sm">Name</TableHead>
                        <TableHead className="text-xs md:text-sm hidden sm:table-cell">Email</TableHead>
                        <TableHead className="text-xs md:text-sm hidden md:table-cell">Registered</TableHead>
                        <TableHead className="text-xs md:text-sm">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredResidents.filter(r => r.status === "verified").map((resident) => (
                        <TableRow key={resident.id}>
                          <TableCell className="font-medium text-xs md:text-sm py-2 md:py-4">{resident.name}</TableCell>
                          <TableCell className="text-xs md:text-sm py-2 md:py-4 hidden sm:table-cell">{resident.email}</TableCell>
                          <TableCell className="text-xs md:text-sm py-2 md:py-4 hidden md:table-cell">{resident.registeredDate}</TableCell>
                          <TableCell className="py-2 md:py-4">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="h-7 md:h-8 px-2 md:px-3 text-xs"
                              onClick={() => setSelectedResident(resident)}
                            >
                              <Eye className="h-3 w-3 md:mr-1" />
                              <span className="hidden md:inline">View Profile</span>
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
      </motion.div>

      {/* Resident Details Modal */}
      <Dialog open={!!selectedResident} onOpenChange={() => setSelectedResident(null)}>
        <DialogContent className="w-[95vw] sm:w-full max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-base md:text-lg">Resident Details</DialogTitle>
            <DialogDescription className="text-xs md:text-sm">
              View resident information and verification status
            </DialogDescription>
          </DialogHeader>
          {selectedResident && (
            <div className="space-y-3 md:space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs md:text-sm text-muted-foreground">Status</span>
                {getStatusBadge(selectedResident.status)}
              </div>
              <div className="grid gap-2 md:gap-3 grid-cols-1 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Full Name</p>
                  <p className="font-medium text-sm md:text-base">{selectedResident.name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Email</p>
                  <p className="font-medium text-sm md:text-base truncate">{selectedResident.email}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Purok</p>
                  <p className="font-medium text-sm md:text-base">{selectedResident.purok}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Gender</p>
                  <p className="font-medium text-sm md:text-base">{selectedResident.gender}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Document Type</p>
                  <p className="font-medium text-sm md:text-base">{selectedResident.documentType}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Registered Date</p>
                  <p className="font-medium text-sm md:text-base">{selectedResident.registeredDate}</p>
                </div>
              </div>
              
                  {/* Notification / Message Section */}
                  {selectedResident?.status !== "verified" && (
                  <div className="rounded-lg border p-3 md:p-4 bg-blue-50 dark:bg-blue-950/20">
                    <div className="flex items-center gap-2 mb-3">
                      <Bell className="w-4 h-4 text-blue-600" />
                      <p className="text-xs md:text-sm font-semibold text-blue-900 dark:text-blue-200">Send Notification</p>
                    </div>
                <div className="space-y-2">
                  <textarea 
                    placeholder="Type a message that the resident will receive..."
                    className="w-full text-xs md:text-sm p-2 border rounded-md resize-none bg-white dark:bg-slate-900 border-gray-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 h-20"
                  />
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1 md:flex-none gap-2 bg-blue-600 hover:bg-blue-700"
                    >
                      <Send className="w-3 h-3" />
                      Send Message
                    </Button>
                  </div>
                </div>
              </div>
              )}

              {/* Documents Section */}
              <div className="rounded-lg border p-3 md:p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    <p className="text-xs md:text-sm font-semibold">Resident Documents</p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="gap-1 h-7"
                  >
                    <Plus className="w-3 h-3" />
                    <span className="text-xs">Add</span>
                  </Button>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="w-4 h-4 text-slate-500 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs md:text-sm font-medium truncate">{selectedResident.documentType}</p>
                        <p className="text-[10px] md:text-xs text-muted-foreground">Registered: {selectedResident.registeredDate}</p>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-7 w-7 p-0 flex-shrink-0"
                    >
                      <Trash2 className="w-3 h-3 text-red-500" />
                    </Button>
                  </div>
                  <div className="text-center py-2 border-2 border-dashed rounded-md">
                    <p className="text-[10px] md:text-xs text-muted-foreground">Drag & drop or click to add documents</p>
                  </div>
                </div>
              </div>
            </div>
            )}
          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setSelectedResident(null)}
              className="w-full sm:w-auto"
            >
              Close
            </Button>
            {selectedResident?.status === "pending" && (
              <>
                <Button 
                  variant="destructive" 
                  size="sm"
                  className="w-full sm:w-auto"
                >
                  Reject
                </Button>
                <Button 
                  size="sm" 
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700"
                >
                  Verify
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
