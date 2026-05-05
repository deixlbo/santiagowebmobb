"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts"
import Link from "next/link"
import {
  Users,
  FileText,
  AlertTriangle,
  TrendingUp,
  Clock,
  CheckCircle2,
  Activity,
  ArrowUp,
} from "lucide-react"

// Mock data for charts
const trendsData = [
  { date: "Apr 24", requests: 12, approvals: 8, rejections: 2 },
  { date: "Apr 25", requests: 19, approvals: 15, rejections: 2 },
  { date: "Apr 26", requests: 15, approvals: 12, rejections: 1 },
  { date: "Apr 27", requests: 22, approvals: 18, rejections: 3 },
  { date: "Apr 28", requests: 28, approvals: 23, rejections: 4 },
]

const alertsData = [
  { id: 1, type: "overdue", message: "5 requests overdue (>7 days)", priority: "high" },
  { id: 2, type: "pending", message: "12 pending document requests awaiting review", priority: "medium" },
  { id: 3, type: "blotter", message: "3 unresolved blotter cases", priority: "high" },
  { id: 4, type: "verification", message: "8 residents pending verification", priority: "medium" },
]

const recentActivities = [
  { id: 1, user: "Maria Santos", action: "Submitted document request", type: "request", time: "5 mins ago" },
  { id: 2, user: "Admin", action: "Approved clearance for Juan Dela Cruz", type: "approval", time: "15 mins ago" },
  { id: 3, user: "Pedro Reyes", action: "Filed blotter report", type: "blotter", time: "1 hour ago" },
  { id: 4, user: "Admin", action: "Verified resident account", type: "verification", time: "2 hours ago" },
  { id: 5, user: "Elena Store", action: "Applied for business permit", type: "business", time: "3 hours ago" },
]

export default function AdminDashboard() {
  const [stats, setStats] = useState([
    { name: "Total Residents", value: "1,245", change: "+12%", icon: Users, color: "bg-emerald-100 text-emerald-600" },
    { name: "Pending Documents", value: "23", change: "-5%", icon: FileText, color: "bg-blue-100 text-blue-600" },
    { name: "Active Blotters", value: "8", change: "+2%", icon: AlertTriangle, color: "bg-amber-100 text-amber-600" },
    { name: "Verified Accounts", value: "987", change: "+18%", icon: CheckCircle2, color: "bg-green-100 text-green-600" },
  ])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Admin Dashboard</h1>
          <p className="text-slate-600">Barangay Santiago Management System</p>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600">{stat.name}</p>
                        <p className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</p>
                        <p className="text-xs text-emerald-600 mt-2 font-semibold">{stat.change}</p>
                      </div>
                      <div className={`p-3 rounded-lg ${stat.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Charts and Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Trends Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>📈 Request Trends</CardTitle>
              <CardDescription>Requests, approvals, and rejections over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="requests" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="approvals" stroke="#10b981" strokeWidth={2} />
                  <Line type="monotone" dataKey="rejections" stroke="#ef4444" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Alerts */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>🚨 Alerts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {alertsData.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg border-l-4 ${
                    alert.priority === "high"
                      ? "bg-red-50 border-red-500"
                      : "bg-yellow-50 border-yellow-500"
                  }`}
                >
                  <p className="text-xs font-semibold text-slate-900">{alert.message}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>📊 Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 pb-4 border-b last:border-b-0"
                  >
                    <div className="p-2 rounded-full bg-blue-100">
                      <Activity className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">
                        {activity.user} <span className="text-slate-600 font-normal">{activity.action}</span>
                      </p>
                      <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>


        </div>
      </div>
    </div>
  )
}
