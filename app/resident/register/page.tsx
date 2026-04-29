"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Eye, EyeOff, Upload, CheckCircle2, AlertCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

const puroks = ["Purok 1", "Purok 2", "Purok 3", "Purok 4", "Purok 5", "Purok 6"]
const documentTypes = [
  { value: "valid_id", label: "Valid Government ID" },
  { value: "birth_cert", label: "Birth Certificate" },
  { value: "voters_id", label: "Voter's ID" },
  { value: "philhealth", label: "PhilHealth ID" },
]

export default function ResidentRegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  // Form fields
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [purok, setPurok] = useState("")
  const [gender, setGender] = useState("")
  const [docType, setDocType] = useState("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0].name)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()
    
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? 
          `${window.location.origin}/auth/callback`,
        data: {
          full_name: `${firstName} ${lastName}`,
          purok: purok,
          gender: gender === 'male' ? 'Male' : 'Female',
          document_type: docType,
          role: 'resident'
        }
      }
    })

    if (signUpError) {
      setError(signUpError.message)
      setIsLoading(false)
      return
    }

    if (data.user) {
      setSuccess(true)
      setTimeout(() => {
        router.push("/resident/login")
      }, 2000)
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10">
              <CheckCircle2 className="h-7 w-7 text-accent" />
            </div>
            <CardTitle className="text-2xl">Registration Successful!</CardTitle>
            <CardDescription>
              Please check your email to verify your account before signing in.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col gap-2">
            <Button asChild className="w-full">
              <Link href="/resident/login">Go to Login</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4 py-8">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary">
            <Shield className="h-7 w-7 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>
            Register as a Barangay Santiago resident
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input 
                  id="firstName" 
                  placeholder="Juan" 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input 
                  id="lastName" 
                  placeholder="Dela Cruz" 
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="juan@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password (min 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  required 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="purok">Purok</Label>
                <Select value={purok} onValueChange={setPurok} required>
                  <SelectTrigger id="purok">
                    <SelectValue placeholder="Select purok" />
                  </SelectTrigger>
                  <SelectContent>
                    {puroks.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={gender} onValueChange={setGender} required>
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="docType">Identification Document</Label>
              <Select value={docType} onValueChange={setDocType} required>
                <SelectTrigger id="docType">
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  {documentTypes.map((doc) => (
                    <SelectItem key={doc.value} value={doc.value}>
                      {doc.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Upload Document</Label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
                <div className="flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/25 p-6 transition-colors hover:border-primary/50">
                  {uploadedFile ? (
                    <>
                      <CheckCircle2 className="h-5 w-5 text-accent" />
                      <span className="text-sm font-medium">{uploadedFile}</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Click to upload or drag and drop
                      </span>
                    </>
                  )}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Upload a clear photo of your selected ID (PNG, JPG, or PDF)
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/resident/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
            <Link href="/" className="text-center text-sm text-muted-foreground hover:underline">
              Back to Home
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
