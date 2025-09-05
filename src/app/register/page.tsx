'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { RegisterForm } from '@/types';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<RegisterForm>({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    role: 'student'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate passwords match
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          name: form.name,
          role: form.role,
        }),
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
        setError(result.error || 'Registration failed');
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
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
          <p className="text-gray-600 mt-2">Create your account</p>
        </div>

        {/* Registration Form */}
        <Card>
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>
              Join EduAI Platform to access intelligent assessment tools
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
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>

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

              <div className="space-y-3">
                <Label>Account Type</Label>
                <RadioGroup
                  value={form.role}
                  onValueChange={(value) => setForm({ ...form, role: value as 'student' | 'professor' })}
                  disabled={loading}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="student" id="student" />
                    <Label htmlFor="student" className="cursor-pointer">
                      Student - Take assessments and practice coding
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="professor" id="professor" />
                    <Label htmlFor="professor" className="cursor-pointer">
                      Professor - Create and manage assessments
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a secure password (min. 6 characters)"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  disabled={loading}
                  minLength={6}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  required
                  disabled={loading}
                  minLength={6}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="text-blue-600 hover:underline font-medium">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Demo Note */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <p className="text-sm text-blue-800 text-center">
              💡 <strong>Demo Mode:</strong> You can also use the pre-configured demo accounts 
              on the <Link href="/login" className="underline font-medium">login page</Link> to explore all features immediately.
            </p>
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