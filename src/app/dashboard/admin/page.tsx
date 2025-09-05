'use client';

import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

export default function AdminDashboard() {
  // Mock data - in production, this would come from API
  const systemStats = {
    totalUsers: 1247,
    totalAssessments: 89,
    totalSubmissions: 3421,
    systemHealth: 98,
  };

  const userBreakdown = [
    { role: 'Students', count: 1089, percentage: 87 },
    { role: 'Professors', count: 156, percentage: 13 },
    { role: 'Admins', count: 2, percentage: 0.2 },
  ];

  const recentActivity = [
    {
      id: '1',
      type: 'user_registration',
      user: 'Alice Johnson',
      action: 'New student registration',
      timestamp: '2 hours ago',
      status: 'success',
    },
    {
      id: '2',
      type: 'assessment_creation',
      user: 'Prof. Smith',
      action: 'Created new Code Review assessment',
      timestamp: '4 hours ago',
      status: 'success',
    },
    {
      id: '3',
      type: 'system_update',
      user: 'System',
      action: 'Database backup completed',
      timestamp: '6 hours ago',
      status: 'success',
    },
  ];

  const assessmentStats = [
    { type: 'Code Questions', count: 34, active: 12 },
    { type: 'Code Reviews', count: 28, active: 8 },
    { type: 'AI Exams', count: 27, active: 15 },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_registration':
        return '👤';
      case 'assessment_creation':
        return '📝';
      case 'system_update':
        return '🔧';
      default:
        return '📊';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">System overview and platform management</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">System Settings</Button>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              Generate Report
            </Button>
          </div>
        </div>

        {/* System Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{systemStats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-blue-600 mt-1">Across all roles</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Total Assessments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">{systemStats.totalAssessments}</div>
              <p className="text-xs text-green-600 mt-1">All assessment types</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">Total Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">{systemStats.totalSubmissions.toLocaleString()}</div>
              <p className="text-xs text-purple-600 mt-1">This semester</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-orange-700">System Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900">{systemStats.systemHealth}%</div>
              <Progress value={systemStats.systemHealth} className="mt-2" />
              <p className="text-xs text-orange-600 mt-1">All systems operational</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* User Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>👥</span>
                User Distribution
              </CardTitle>
              <CardDescription>Breakdown of users by role</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {userBreakdown.map((userType) => (
                <div key={userType.role} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div>
                      <h3 className="font-medium text-gray-900">{userType.role}</h3>
                      <p className="text-sm text-gray-600">{userType.count.toLocaleString()} users</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-20">
                      <Progress value={userType.percentage} />
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-12 text-right">
                      {userType.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent System Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>📊</span>
                Recent System Activity
              </CardTitle>
              <CardDescription>Latest platform events and updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <span className="text-xl">{getActivityIcon(activity.type)}</span>
                    <div>
                      <h3 className="font-medium text-gray-900">{activity.user}</h3>
                      <p className="text-sm text-gray-600">{activity.action}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(activity.status)} variant="secondary">
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Assessment Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>📚</span>
              Assessment Overview
            </CardTitle>
            <CardDescription>Summary of all assessment types across the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {assessmentStats.map((assessment) => (
                <div key={assessment.type} className="text-center p-4 border border-gray-200 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">{assessment.type}</h3>
                  <div className="space-y-2">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{assessment.count}</div>
                      <div className="text-sm text-gray-500">Total Created</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-green-600">{assessment.active}</div>
                      <div className="text-xs text-gray-500">Currently Active</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Admin Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>⚡</span>
              Quick Admin Actions
            </CardTitle>
            <CardDescription>Common administrative tasks and system management</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <span className="text-2xl">👥</span>
                <span className="text-sm">Manage Users</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <span className="text-2xl">📊</span>
                <span className="text-sm">View Analytics</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <span className="text-2xl">🔧</span>
                <span className="text-sm">System Settings</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <span className="text-2xl">📄</span>
                <span className="text-sm">Export Reports</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}