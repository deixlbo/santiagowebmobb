"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  FileText,
  AlertTriangle,
  Scroll,
  FolderKanban,
  Megaphone,
  User,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navigation = [
  { name: "Dashboard", href: "/resident", icon: LayoutDashboard },
  { name: "Documents", href: "/resident/documents", icon: FileText },
  { name: "Blotter", href: "/resident/blotter", icon: AlertTriangle },
  { name: "Ordinances", href: "/resident/ordinances", icon: Scroll },
  { name: "Projects", href: "/resident/projects", icon: FolderKanban },
  { name: "Announcements", href: "/resident/announcements", icon: Megaphone },
]

export default function ResidentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4">
            <Link href="/resident" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <span className="text-sm font-bold">BS</span>
              </div>
              <span className="hidden font-semibold md:inline-block">
                Barangay Santiago
              </span>
            </Link>
          </div>

          <nav className="hidden items-center gap-1 md:flex">
            {navigation.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== "/resident" && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Juan Dela Cruz</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    juan@example.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/resident/profile">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Mobile Navigation */}
      <nav className="sticky top-16 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
        <div className="flex items-center gap-1 overflow-x-auto px-4 py-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== "/resident" && pathname.startsWith(item.href))
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 md:px-6">{children}</main>
    </div>
  )
}
