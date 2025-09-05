'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function HomePage() {
  const features = [
    {
      title: "Code Questions Generator",
      description: "AI-powered interactive coding assessments with personalized difficulty levels and real-time feedback.",
      icon: "🔧",
      gradient: "from-blue-500 to-cyan-500",
      demoPath: "/demo/code-questions"
    },
    {
      title: "Code Review Assistant", 
      description: "Automated code analysis with improvement suggestions and guided questions for comprehensive evaluation.",
      icon: "📋",
      gradient: "from-green-500 to-teal-500",
      demoPath: "/demo/code-review"
    },
    {
      title: "AI Exam Generator",
      description: "Transform LaTeX documents into intelligent MCQ exams with randomization and adaptive testing.",
      icon: "📚",
      gradient: "from-purple-500 to-pink-500", 
      demoPath: "/demo/ai-exam"
    }
  ];

  const stats = [
    { label: "Active Users", value: "2.5K+", change: "+15%" },
    { label: "Assessments Created", value: "15.8K", change: "+28%" },
    { label: "Code Reviews", value: "8.2K", change: "+42%" },
    { label: "Success Rate", value: "94%", change: "+5%" }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                EduAI Platform
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                Beta
              </Badge>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
                Features
              </Link>
              <Link href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">
                About
              </Link>
              <Link href="/login" className="text-gray-600 hover:text-gray-900 transition-colors">
                Login
              </Link>
              <Link href="/register">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Get Started
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
            Revolutionary AI-Powered Educational Assessment
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Transform your teaching experience with intelligent code assessment, automated review systems, 
            and adaptive examination tools designed for the modern classroom.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href="/register">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8">
                Start Free Trial
              </Button>
            </Link>
            <Link href="#demo">
              <Button size="lg" variant="outline" className="px-8">
                View Demo
              </Button>
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center bg-white/60 border-white/20 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                  <div className="text-xs text-green-600 mt-1">{stat.change}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white/40">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              Three Powerful Assessment Tools
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Each tool is designed to address specific educational challenges, 
              powered by advanced AI to enhance learning outcomes.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 bg-white/80 border-white/20 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl text-gray-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 mb-6 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                  <Link href={feature.demoPath}>
                    <Button variant="outline" className="w-full group-hover:bg-gray-50 transition-colors">
                      Try Demo
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-6 text-gray-900">
              Built for Educational Excellence
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              EduAI Platform represents years of research and development in educational technology. 
              Our AI-powered tools are designed to streamline assessment processes while maintaining 
              the highest standards of educational integrity.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-900">For Professors</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-blue-800">
                  <li>• Automated assessment creation and grading</li>
                  <li>• Comprehensive analytics and progress tracking</li>
                  <li>• Multi-language support for global education</li>
                  <li>• Seamless integration with existing LMS platforms</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-green-900">For Students</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-green-800">
                  <li>• Interactive learning with instant feedback</li>
                  <li>• Personalized difficulty adaptation</li>
                  <li>• Comprehensive code review and suggestions</li>
                  <li>• Practice modes for skill development</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardHeader className="text-center">
              <CardTitle className="text-purple-900">Demo Credentials</CardTitle>
              <CardDescription>Try the platform with these demo accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-semibold text-purple-900">Professor</div>
                  <div className="text-purple-700">professor@eduai.com</div>
                  <div className="text-purple-700">prof123</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-purple-900">Student</div>
                  <div className="text-purple-700">student@eduai.com</div>
                  <div className="text-purple-700">student123</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-purple-900">Admin</div>
                  <div className="text-purple-700">admin@eduai.com</div>
                  <div className="text-purple-700">admin123</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <div className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              EduAI Platform
            </div>
            <p className="text-gray-400 mb-8">
              Transforming education through intelligent assessment tools
            </p>
            <div className="flex justify-center space-x-6">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                Terms
              </Link>
              <Link href="/support" className="text-gray-400 hover:text-white transition-colors">
                Support
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}