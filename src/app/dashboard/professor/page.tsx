'use client';

import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function ProfessorDashboard() {
  // Mock data - in production, this would come from API
  const stats = {
    totalStudents: 156,
    activeAssessments: 8,
    avgClassScore: 84,
    totalSubmissions: 342,
  };

  const recentActivity = [
    {
      id: '1',
      type: 'submission',
      student: 'Alice Johnson',
      assessment: 'React Fundamentals',
      score: 92,
      timestamp: '2 hours ago',
    },
    {
      id: '2',
      type: 'completion',
      student: 'Bob Smith', 
      assessment: 'Code Review Exercise',
      score: 88,
      timestamp: '4 hours ago',
    },
    {
      id: '3',
      type: 'submission',
      student: 'Carol Davis',
      assessment: 'Algorithm Challenges',
      score: 96,
      timestamp: '6 hours ago',
    },
  ];

  const myAssessments = [
    {
      id: '1',
      title: 'JavaScript ES6 Features',
      type: 'code-questions',
      students: 45,
      completed: 38,
      avgScore: 87,
      difficulty: 'intermediate',
    },
    {
      id: '2',
      title: 'React Component Design',
      type: 'code-review', 
      students: 52,
      completed: 41,
      avgScore: 82,
      difficulty: 'advanced',
    },
    {
      id: '3',
      title: 'Database Design Principles',
      type: 'ai-exam',
      students: 67,
      completed: 59,
      avgScore: 79,
      difficulty: 'intermediate',
    },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'code-questions':
        return 'bg-blue-100 text-blue-800';
      case 'code-review':
        return 'bg-green-100 text-green-800';
      case 'ai-exam':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'submission':
        return '📤';
      case 'completion':
        return '✅';
      default:
        return '📝';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'code-questions':
        return '💻';
      case 'code-review':
        return '🔍';
      case 'ai-exam':
        return '📝';
      default:
        return '📄';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Professor Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your assessments and track student progress</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">View Analytics</Button>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Create Assessment
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{stats.totalStudents}</div>
              <p className="text-xs text-blue-600 mt-1">Across all classes</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Active Assessments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">{stats.activeAssessments}</div>
              <p className="text-xs text-green-600 mt-1">Currently running</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">Avg Class Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">{stats.avgClassScore}%</div>
              <p className="text-xs text-purple-600 mt-1">+3% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-orange-700">Total Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900">{stats.totalSubmissions}</div>
              <p className="text-xs text-orange-600 mt-1">This semester</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>🔔</span>
                Recent Activity
              </CardTitle>
              <CardDescription>Latest student submissions and completions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <span className="text-xl">{getActivityIcon(activity.type)}</span>
                    <div>
                      <h3 className="font-medium text-gray-900">{activity.student}</h3>
                      <p className="text-sm text-gray-600">{activity.assessment}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">{activity.score}%</div>
                    <div className="text-xs text-gray-500">Score</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* My Assessments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>📚</span>
                My Assessments
              </CardTitle>
              <CardDescription>Overview of your created assessments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {myAssessments.map((assessment) => (
                <div key={assessment.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getTypeIcon(assessment.type)}</span>
                      <div>
                        <h3 className="font-medium text-gray-900">{assessment.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getTypeColor(assessment.type)} variant="secondary">
                            {assessment.type.replace('-', ' ')}
                          </Badge>
                          <Badge className={getDifficultyColor(assessment.difficulty)} variant="secondary">
                            {assessment.difficulty}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-gray-900">{assessment.students}</div>
                      <div className="text-gray-500">Students</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{assessment.completed}</div>
                      <div className="text-gray-500">Completed</div>
                      <Progress 
                        value={(assessment.completed / assessment.students) * 100} 
                        className="mt-1 h-1"
                      />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{assessment.avgScore}%</div>
                      <div className="text-gray-500">Avg Score</div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>🚀</span>
              Quick Actions
            </CardTitle>
            <CardDescription>Create new assessments and manage your classes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/create/code-questions">
                <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center space-y-2 hover:bg-blue-50">
                  <span className="text-3xl">💻</span>
                  <span className="font-medium">Create Code Questions</span>
                  <span className="text-xs text-gray-500">Interactive coding problems</span>
                </Button>
              </Link>
              <Link href="/create/code-review">
                <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center space-y-2 hover:bg-green-50">
                  <span className="text-3xl">🔍</span>
                  <span className="font-medium">Setup Code Review</span>
                  <span className="text-xs text-gray-500">Automated code analysis</span>
                </Button>
              </Link>
              <Link href="/create/ai-exam">
                <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center space-y-2 hover:bg-purple-50">
                  <span className="text-3xl">📝</span>
                  <span className="font-medium">Generate AI Exam</span>
                  <span className="text-xs text-gray-500">LaTeX to MCQ conversion</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}