'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

export default function CodeReviewPage() {
  const [activeTab, setActiveTab] = useState('submit');
  const [loading, setLoading] = useState(false);
  const [reviewResult, setReviewResult] = useState<any>(null);
  const [error, setError] = useState('');
  
  // Code submission form state
  const [codeForm, setCodeForm] = useState({
    code: '',
    language: 'javascript',
    specifications: '',
    standards: '',
    reviewLanguage: 'en'
  });

  const handleSubmitCode = async () => {
    if (!codeForm.code.trim()) {
      setError('Please enter the code to review');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/ai/analyze-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(codeForm),
      });

      const result = await response.json();

      if (result.success) {
        setReviewResult(result.data);
        setActiveTab('analysis');
      } else {
        setError(result.error || 'Failed to analyze code');
      }
    } catch (err) {
      setError('Failed to analyze code. Please try again.');
      console.error('Code analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'suggestion':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const sampleCode = `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    if (items[i].price) {
      total += items[i].price * items[i].quantity;
    }
  }
  return total;
}

// Usage
const cartItems = [
  { name: "Laptop", price: 999.99, quantity: 1 },
  { name: "Mouse", price: 25.00, quantity: 2 }
];

console.log("Total:", calculateTotal(cartItems));`;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              🔍 Code Review Assistant
            </h1>
            <p className="text-gray-600 mt-1">Automated code analysis with improvement suggestions and guided questions</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="submit">Submit Code</TabsTrigger>
            <TabsTrigger value="analysis" disabled={!reviewResult}>
              Analysis Results
            </TabsTrigger>
            <TabsTrigger value="questions" disabled={!reviewResult}>
              Helper Questions
            </TabsTrigger>
          </TabsList>

          {/* Submit Tab */}
          <TabsContent value="submit" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Code Review Submission</CardTitle>
                <CardDescription>
                  Submit your code for comprehensive AI-powered analysis including readability, performance, security, and best practices
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="language">Programming Language</Label>
                    <Select value={codeForm.language} onValueChange={(value) => 
                      setCodeForm({ ...codeForm, language: value })
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="javascript">JavaScript</SelectItem>
                        <SelectItem value="python">Python</SelectItem>
                        <SelectItem value="java">Java</SelectItem>
                        <SelectItem value="cpp">C++</SelectItem>
                        <SelectItem value="typescript">TypeScript</SelectItem>
                        <SelectItem value="react">React/JSX</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reviewLanguage">Review Language</Label>
                    <Select value={codeForm.reviewLanguage} onValueChange={(value) => 
                      setCodeForm({ ...codeForm, reviewLanguage: value })
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="code">Your Code</Label>
                  <Textarea
                    id="code"
                    placeholder="Paste your code here for analysis..."
                    value={codeForm.code}
                    onChange={(e) => setCodeForm({ ...codeForm, code: e.target.value })}
                    rows={15}
                    className="font-mono text-sm"
                  />
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCodeForm({ ...codeForm, code: sampleCode })}
                    >
                      Use Sample Code
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="specifications">Project Specifications (Optional)</Label>
                    <Textarea
                      id="specifications"
                      placeholder="Describe the project requirements and context..."
                      value={codeForm.specifications}
                      onChange={(e) => setCodeForm({ ...codeForm, specifications: e.target.value })}
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="standards">Coding Standards (Optional)</Label>
                    <Textarea
                      id="standards"
                      placeholder="Specify any coding standards or conventions to follow..."
                      value={codeForm.standards}
                      onChange={(e) => setCodeForm({ ...codeForm, standards: e.target.value })}
                      rows={4}
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleSubmitCode} 
                  disabled={loading || !codeForm.code.trim()}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  size="lg"
                >
                  {loading ? 'Analyzing Code...' : 'Submit for AI Review'}
                </Button>
              </CardContent>
            </Card>

            {/* Features Info */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="bg-green-50 border-green-200">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl mb-2">🎯</div>
                    <h3 className="font-semibold text-green-900">Comprehensive Analysis</h3>
                    <p className="text-sm text-green-700 mt-1">Evaluates readability, performance, security, and maintainability</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl mb-2">💡</div>
                    <h3 className="font-semibold text-blue-900">Actionable Suggestions</h3>
                    <p className="text-sm text-blue-700 mt-1">Specific line-by-line improvements with priority levels</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-purple-50 border-purple-200">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl mb-2">❓</div>
                    <h3 className="font-semibold text-purple-900">Helper Questions</h3>
                    <p className="text-sm text-purple-700 mt-1">Guided questions for external reviewers and collaboration</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analysis Tab */}
          <TabsContent value="analysis" className="space-y-6">
            {reviewResult && (
              <>
                {/* Overall Score */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span>📊</span>
                      Overall Code Analysis
                    </CardTitle>
                    <CardDescription>Comprehensive evaluation across key quality metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-6">
                      <div className={`text-4xl font-bold ${getScoreColor(reviewResult.overallScore)} mb-2`}>
                        {reviewResult.overallScore}%
                      </div>
                      <p className="text-gray-600">Overall Quality Score</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${getScoreColor(reviewResult.analysis?.readability)}`}>
                          {reviewResult.analysis?.readability || 0}%
                        </div>
                        <div className="text-sm text-gray-600">Readability</div>
                        <Progress value={reviewResult.analysis?.readability || 0} className="mt-1" />
                      </div>
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${getScoreColor(reviewResult.analysis?.performance)}`}>
                          {reviewResult.analysis?.performance || 0}%
                        </div>
                        <div className="text-sm text-gray-600">Performance</div>
                        <Progress value={reviewResult.analysis?.performance || 0} className="mt-1" />
                      </div>
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${getScoreColor(reviewResult.analysis?.security)}`}>
                          {reviewResult.analysis?.security || 0}%
                        </div>
                        <div className="text-sm text-gray-600">Security</div>
                        <Progress value={reviewResult.analysis?.security || 0} className="mt-1" />
                      </div>
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${getScoreColor(reviewResult.analysis?.maintainability)}`}>
                          {reviewResult.analysis?.maintainability || 0}%
                        </div>
                        <div className="text-sm text-gray-600">Maintainability</div>
                        <Progress value={reviewResult.analysis?.maintainability || 0} className="mt-1" />
                      </div>
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${getScoreColor(reviewResult.analysis?.bestPractices)}`}>
                          {reviewResult.analysis?.bestPractices || 0}%
                        </div>
                        <div className="text-sm text-gray-600">Best Practices</div>
                        <Progress value={reviewResult.analysis?.bestPractices || 0} className="mt-1" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Detailed Comments */}
                {reviewResult.analysis?.comments && reviewResult.analysis.comments.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <span>💬</span>
                        Detailed Analysis Comments
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {reviewResult.analysis.comments.map((comment: string, index: number) => (
                          <div key={index} className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-gray-700">{comment}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Improvements */}
                {reviewResult.improvements && reviewResult.improvements.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <span>🔧</span>
                        Suggested Improvements
                      </CardTitle>
                      <CardDescription>Line-by-line recommendations to enhance your code</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {reviewResult.improvements.map((improvement: any, index: number) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Badge className={getTypeColor(improvement.type)}>
                                  {improvement.type}
                                </Badge>
                                <Badge className={getPriorityColor(improvement.priority)}>
                                  {improvement.priority} priority
                                </Badge>
                                {improvement.line && (
                                  <span className="text-sm text-gray-500">Line {improvement.line}</span>
                                )}
                              </div>
                            </div>
                            <h4 className="font-medium text-gray-900 mb-1">{improvement.message}</h4>
                            <p className="text-sm text-gray-600 bg-blue-50 p-2 rounded">
                              <strong>Suggestion:</strong> {improvement.suggestion}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Summary */}
                {reviewResult.summary && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <span>📋</span>
                        Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 leading-relaxed">{reviewResult.summary}</p>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </TabsContent>

          {/* Questions Tab */}
          <TabsContent value="questions" className="space-y-6">
            {reviewResult?.helperQuestions && reviewResult.helperQuestions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span>❓</span>
                    Helper Questions for External Reviewers
                  </CardTitle>
                  <CardDescription>
                    Questions to help non-technical reviewers understand and evaluate the code
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {reviewResult.helperQuestions.map((item: any, index: number) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">{item.question}</h4>
                        <div className="space-y-3">
                          <div>
                            <h5 className="text-sm font-medium text-gray-700 mb-1">Context:</h5>
                            <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{item.context}</p>
                          </div>
                          <div>
                            <h5 className="text-sm font-medium text-gray-700 mb-1">Suggested Response:</h5>
                            <p className="text-sm text-gray-600 bg-green-50 p-2 rounded">{item.suggestedResponse}</p>
                          </div>
                        </div>
                        {index < reviewResult.helperQuestions.length - 1 && <Separator className="mt-4" />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-center">
              <Button 
                onClick={() => {
                  setActiveTab('submit');
                  setCodeForm(prev => ({ ...prev, code: '' }));
                  setReviewResult(null);
                  setError('');
                }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Review New Code
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}