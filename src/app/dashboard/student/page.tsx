'use client';

import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function StudentDashboard() {
  // Mock data - in production, this would come from API
  const stats = {
    totalAssessments: 24,
    completedAssessments: 18,
    averageScore: 87,
    currentStreak: 7,
  };

  const recentAssessments = [
    {
      id: '1',
      title: 'JavaScript Fundamentals',
      type: 'code-questions',
      score: 92,
      completedAt: '2 hours ago',
      difficulty: 'beginner',
    },
    {
      id: '2', 
      title: 'React Components Review',
      type: 'code-review',
      score: 88,
      completedAt: '1 day ago',
      difficulty: 'intermediate',
    },
    {
      id: '3',
      title: 'Data Structures Exam',
      type: 'ai-exam',
      score: 94,
      completedAt: '3 days ago',
      difficulty: 'advanced',
    },
  ];

  const availableAssessments = [
    {
      id: '4',
      title: 'Python Problem Solving',
      type: 'code-questions',
      difficulty: 'intermediate',
      estimatedTime: '45 min',
      description: 'Test your Python skills with algorithmic challenges',
    },
    {
      id: '5',
      title: 'Code Quality Review',
      type: 'code-review',
      difficulty: 'beginner',
      estimatedTime: '30 min',
      description: 'Get feedback on code structure and best practices',
    },
    {
      id: '6',
      title: 'Database Concepts Quiz',
      type: 'ai-exam',
      difficulty: 'intermediate',
      estimatedTime: '60 min',
      description: 'Multiple choice questions on SQL and database design',
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
            <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
            <p className="text-gray-600 mt-1">Track your learning progress and take assessments</p>
          </div>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            Practice Mode
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Total Assessments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{stats.totalAssessments}</div>
              <p className="text-xs text-blue-600 mt-1">Across all subjects</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">{stats.completedAssessments}</div>
              <Progress value={(stats.completedAssessments / stats.totalAssessments) * 100} className="mt-2" />
              <p className="text-xs text-green-600 mt-1">
                {Math.round((stats.completedAssessments / stats.totalAssessments) * 100)}% completion rate
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">Average Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">{stats.averageScore}%</div>
              <p className="text-xs text-purple-600 mt-1">Above class average</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-orange-700">Current Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900">{stats.currentStreak} days</div>
              <p className="text-xs text-orange-600 mt-1">Keep it up! 🔥</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Assessments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>📊</span>
                Recent Assessments
              </CardTitle>
              <CardDescription>Your latest completed assessments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentAssessments.map((assessment) => (
                <div key={assessment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start space-x-3">
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
                      <p className="text-xs text-gray-500 mt-1">{assessment.completedAt}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">{assessment.score}%</div>
                    <div className="text-xs text-gray-500">Score</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Available Assessments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>🎯</span>
                Available Assessments
              </CardTitle>
              <CardDescription>Ready to take your next challenge?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {availableAssessments.map((assessment) => (
                <div key={assessment.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getTypeIcon(assessment.type)}</span>
                      <div>
                        <h3 className="font-medium text-gray-900">{assessment.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{assessment.description}</p>
                      </div>
                    </div>
                    <Button size="sm" className="shrink-0">
                      Start
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getTypeColor(assessment.type)} variant="secondary">
                      {assessment.type.replace('-', ' ')}
                    </Badge>
                    <Badge className={getDifficultyColor(assessment.difficulty)} variant="secondary">
                      {assessment.difficulty}
                    </Badge>
                    <span className="text-xs text-gray-500">• {assessment.estimatedTime}</span>
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
              <span>⚡</span>
              Quick Actions
            </CardTitle>
            <CardDescription>Jump right into your learning activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/assessments/code-questions">
                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2 hover:bg-blue-50">
                  <span className="text-2xl">💻</span>
                  <span>Code Questions</span>
                </Button>
              </Link>
              <Link href="/assessments/code-review">
                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2 hover:bg-green-50">
                  <span className="text-2xl">🔍</span>
                  <span>Code Review</span>
                </Button>
              </Link>
              <Link href="/assessments/ai-exam">
                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2 hover:bg-purple-50">
                  <span className="text-2xl">📝</span>
                  <span>AI Exams</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}