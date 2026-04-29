"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Search, 
  Eye,
  Plus,
  Scroll,
  Printer,
  Edit,
  Calendar
} from "lucide-react"

const mockOrdinances = [
  {
    id: "ORD-2026-001",
    number: "001",
    year: "2026",
    title: "Noise Regulation Ordinance of Barangay Santiago",
    fullTitle: "AN ORDINANCE REGULATING NOISE DISTURBANCE IN BARANGAY SANTIAGO",
    status: "Published",
    date: "March 15, 2026",
    author: "Rolando C. Borja",
    whereas: [
      "WHEREAS, excessive noise has caused disturbances among residents;",
      "WHEREAS, maintaining peace and order is essential for community welfare;",
      "WHEREAS, the barangay aims to promote a safe and harmonious environment;"
    ],
    sections: [
      { title: "TITLE", content: "This Ordinance shall be known as the \"Noise Regulation Ordinance of Barangay Santiago.\"" },
      { title: "DEFINITION OF TERMS", content: "Noise Disturbance - Any excessive or disruptive sound affecting residents\nCurfew Hours - Time period between 10:00 PM to 5:00 AM" },
      { title: "COVERAGE", content: "This Ordinance applies to all residents and establishments within Barangay Santiago." },
      { title: "PROHIBITED ACTS", content: "Playing loud music beyond allowed hours\nCausing unnecessary disturbances during curfew hours" },
      { title: "PENALTIES", content: "First Offense: Warning\nSecond Offense: PHP 500 Fine\nSubsequent Offenses: PHP 1,000 Fine or community service" },
    ]
  },
  {
    id: "ORD-2026-002",
    number: "002",
    year: "2026",
    title: "Waste Management Ordinance",
    fullTitle: "AN ORDINANCE IMPLEMENTING PROPER WASTE MANAGEMENT IN BARANGAY SANTIAGO",
    status: "Draft",
    date: "April 10, 2026",
    author: "Rolando C. Borja",
    whereas: [
      "WHEREAS, proper waste management is essential for community health;",
    ],
    sections: [
      { title: "TITLE", content: "This Ordinance shall be known as the \"Waste Management Ordinance of Barangay Santiago.\"" },
    ]
  },
]

export default function OfficialOrdinancesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedOrdinance, setSelectedOrdinance] = useState<typeof mockOrdinances[0] | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const publishedCount = mockOrdinances.filter(o => o.status === "Published").length
  const draftCount = mockOrdinances.filter(o => o.status === "Draft").length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Ordinances & Resolutions</h1>
          <p className="text-muted-foreground">Create and manage barangay ordinances</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Ordinance
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Create New Ordinance</DialogTitle>
              <DialogDescription>
                Fill in the ordinance template
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-4 pr-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Ordinance Number</Label>
                    <Input placeholder="e.g., 003" />
                  </div>
                  <div className="space-y-2">
                    <Label>Series Year</Label>
                    <Input placeholder="e.g., 2026" defaultValue="2026" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input placeholder="AN ORDINANCE..." />
                </div>
                <div className="space-y-2">
                  <Label>Whereas Clauses</Label>
                  <Textarea 
                    placeholder="Enter each whereas clause on a new line..."
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Section 1 - Title</Label>
                  <Input placeholder='This Ordinance shall be known as the "..."' />
                </div>
                <div className="space-y-2">
                  <Label>Section 2 - Definition of Terms</Label>
                  <Textarea placeholder="Define terms used in this ordinance..." rows={3} />
                </div>
                <div className="space-y-2">
                  <Label>Section 3 - Coverage</Label>
                  <Textarea placeholder="This ordinance applies to..." rows={2} />
                </div>
                <div className="space-y-2">
                  <Label>Section 4 - Prohibited Acts</Label>
                  <Textarea placeholder="List prohibited acts..." rows={3} />
                </div>
                <div className="space-y-2">
                  <Label>Section 5 - Penalties</Label>
                  <Textarea placeholder="List penalties for violations..." rows={3} />
                </div>
              </div>
            </ScrollArea>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
              <Button variant="outline">Save as Draft</Button>
              <Button>Preview</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-emerald-100 p-2">
                <Scroll className="h-5 w-5 text-emerald-700" />
              </div>
              <div>
                <p className="text-2xl font-bold">{publishedCount}</p>
                <p className="text-sm text-muted-foreground">Published</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-amber-100 p-2">
                <Edit className="h-5 w-5 text-amber-700" />
              </div>
              <div>
                <p className="text-2xl font-bold">{draftCount}</p>
                <p className="text-sm text-muted-foreground">Drafts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-primary/10 p-2">
                <Scroll className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockOrdinances.length}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input 
          placeholder="Search ordinances..." 
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Ordinances List */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All ({mockOrdinances.length})</TabsTrigger>
          <TabsTrigger value="published">Published ({publishedCount})</TabsTrigger>
          <TabsTrigger value="drafts">Drafts ({draftCount})</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            {mockOrdinances.map((ordinance) => (
              <Card key={ordinance.id} className="transition-shadow hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">
                      No. {ordinance.number} Series of {ordinance.year}
                    </Badge>
                    <Badge className={
                      ordinance.status === "Published" 
                        ? "bg-emerald-100 text-emerald-700" 
                        : "bg-amber-100 text-amber-700"
                    }>
                      {ordinance.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg leading-tight">{ordinance.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {ordinance.date}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedOrdinance(ordinance)}
                    >
                      <Eye className="mr-1 h-3 w-3" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="mr-1 h-3 w-3" />
                      Edit
                    </Button>
                    {ordinance.status === "Draft" && (
                      <Button size="sm">
                        Publish
                      </Button>
                    )}
                    {ordinance.status === "Published" && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedOrdinance(ordinance)
                          setShowPreview(true)
                        }}
                      >
                        <Printer className="mr-1 h-3 w-3" />
                        Print
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="published" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            {mockOrdinances.filter(o => o.status === "Published").map((ordinance) => (
              <Card key={ordinance.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">
                      No. {ordinance.number} Series of {ordinance.year}
                    </Badge>
                    <Badge className="bg-emerald-100 text-emerald-700">Published</Badge>
                  </div>
                  <CardTitle className="text-lg leading-tight">{ordinance.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setSelectedOrdinance(ordinance)}>
                      View
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedOrdinance(ordinance)
                        setShowPreview(true)
                      }}
                    >
                      <Printer className="mr-1 h-3 w-3" />
                      Print
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="drafts" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            {mockOrdinances.filter(o => o.status === "Draft").map((ordinance) => (
              <Card key={ordinance.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">
                      No. {ordinance.number} Series of {ordinance.year}
                    </Badge>
                    <Badge className="bg-amber-100 text-amber-700">Draft</Badge>
                  </div>
                  <CardTitle className="text-lg leading-tight">{ordinance.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button size="sm">Publish</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* View Details Modal */}
      <Dialog open={!!selectedOrdinance && !showPreview} onOpenChange={() => setSelectedOrdinance(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Ordinance Details</DialogTitle>
          </DialogHeader>
          {selectedOrdinance && (
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-4 pr-4">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">
                    Ordinance No. {selectedOrdinance.number} Series of {selectedOrdinance.year}
                  </Badge>
                  <Badge className={
                    selectedOrdinance.status === "Published" 
                      ? "bg-emerald-100 text-emerald-700" 
                      : "bg-amber-100 text-amber-700"
                  }>
                    {selectedOrdinance.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Full Title</p>
                  <p className="font-medium">{selectedOrdinance.fullTitle}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Author</p>
                  <p className="font-medium">{selectedOrdinance.author}</p>
                </div>
                <div className="border-t pt-4">
                  <p className="font-semibold mb-2">Whereas Clauses</p>
                  {selectedOrdinance.whereas.map((clause, i) => (
                    <p key={i} className="text-sm mb-1">{clause}</p>
                  ))}
                </div>
                <div className="border-t pt-4">
                  <p className="font-semibold mb-2">Sections</p>
                  {selectedOrdinance.sections.map((section, i) => (
                    <div key={i} className="mb-3">
                      <p className="text-sm font-medium">Section {i + 1}: {section.title}</p>
                      <p className="text-sm text-muted-foreground whitespace-pre-line">{section.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollArea>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedOrdinance(null)}>Close</Button>
            <Button variant="outline">Edit</Button>
            {selectedOrdinance?.status === "Published" && (
              <Button onClick={() => setShowPreview(true)}>
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Print Preview Modal */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Ordinance Document Preview</DialogTitle>
          </DialogHeader>
          {selectedOrdinance && (
            <ScrollArea className="max-h-[70vh]">
              <div className="rounded-lg border bg-white p-8 text-black">
                <div className="text-center space-y-1 mb-6">
                  <p className="text-sm">Republic of the Philippines</p>
                  <p className="text-sm">Province of Zambales</p>
                  <p className="text-sm">Municipality of San Antonio</p>
                  <p className="text-sm font-semibold">Barangay Santiago</p>
                </div>
                <div className="border-t border-b border-black py-4 my-6">
                  <h2 className="text-center font-bold">
                    BARANGAY ORDINANCE NO. {selectedOrdinance.number} SERIES OF {selectedOrdinance.year}
                  </h2>
                </div>
                <h3 className="text-center font-bold mb-6">{selectedOrdinance.fullTitle}</h3>
                <div className="mb-6">
                  <p className="font-bold mb-2">WHEREAS:</p>
                  {selectedOrdinance.whereas.map((clause, i) => (
                    <p key={i} className="mb-2 text-justify">{clause}</p>
                  ))}
                </div>
                <div className="mb-6">
                  <p className="font-bold mb-2">NOW THEREFORE:</p>
                  <p className="text-justify">
                    BE IT ORDAINED by the Sangguniang Barangay of Barangay Santiago, Municipality of San Antonio, 
                    Province of Zambales, in session duly assembled, that:
                  </p>
                </div>
                {selectedOrdinance.sections.map((section, i) => (
                  <div key={i} className="mb-4">
                    <p className="font-bold">SECTION {i + 1}. {section.title}</p>
                    <p className="text-justify whitespace-pre-line">{section.content}</p>
                  </div>
                ))}
                <div className="mt-8 pt-4 border-t">
                  <p className="mb-8">ENACTED this {selectedOrdinance.date} at Barangay Santiago.</p>
                  <div className="grid grid-cols-2 gap-8 text-center mt-12">
                    <div>
                      <p className="border-t border-black pt-1 font-semibold">APRIL JOY C. CANO</p>
                      <p className="text-sm">Barangay Secretary</p>
                      <p className="text-xs text-gray-600 mt-1">CERTIFIED CORRECT</p>
                    </div>
                    <div>
                      <p className="border-t border-black pt-1 font-semibold">ROLANDO C. BORJA</p>
                      <p className="text-sm">Punong Barangay</p>
                      <p className="text-xs text-gray-600 mt-1">ATTESTED BY</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreview(false)}>Close</Button>
            <Button onClick={() => window.print()}>
              <Printer className="mr-2 h-4 w-4" />
              Print Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
