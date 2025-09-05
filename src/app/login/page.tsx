'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { LoginForm } from '@/types';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState<LoginForm>({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (result.success) {
        // Store token in localStorage
        localStorage.setItem('token', result.token);
        
        // Redirect based on user role
        const dashboardRoute = result.user.role === 'admin' 
          ? '/dashboard/admin'
          : result.user.role === 'professor'
          ? '/dashboard/professor' 
          : '/dashboard/student';
        
        router.push(dashboardRoute);
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const demoAccounts = [
    { role: 'Professor', email: 'professor@eduai.com', password: 'prof123', color: 'bg-blue-100 text-blue-800' },
    { role: 'Student', email: 'student@eduai.com', password: 'student123', color: 'bg-green-100 text-green-800' },
    { role: 'Admin', email: 'admin@eduai.com', password: 'admin123', color: 'bg-purple-100 text-purple-800' },
  ];

  const fillDemoCredentials = (email: string, password: string) => {
    setForm({ email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              EduAI Platform
            </h1>
          </Link>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        {/* Demo Accounts */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-gray-900">Demo Accounts</CardTitle>
            <CardDescription>Click to auto-fill credentials</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {demoAccounts.map((account) => (
              <button
                key={account.role}
                onClick={() => fillDemoCredentials(account.email, account.password)}
                className="w-full text-left p-3 rounded-lg bg-white/60 hover:bg-white/80 transition-colors border border-white/40"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <Badge className={account.color} variant="secondary">
                      {account.role}
                    </Badge>
                    <div className="text-sm text-gray-600 mt-1">
                      {account.email}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    Click to use
                  </div>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        <Separator className="my-6" />

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link href="/register" className="text-blue-600 hover:underline font-medium">
                  Sign up here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}