'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function CodeQuestionsPage() {
  const [activeTab, setActiveTab] = useState('generator');
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [error, setError] = useState('');
  
  // Generator form state
  const [generatorForm, setGeneratorForm] = useState({
    topic: '',
    difficulty: 'intermediate',
    count: 5,
    language: 'en'
  });

  // Practice mode state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userCode, setUserCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);

  const handleGenerateQuestions = async () => {
    if (!generatorForm.topic.trim()) {
      setError('Please enter a topic for the questions');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/ai/generate-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(generatorForm),
      });

      const result = await response.json();

      if (result.success) {
        setQuestions(result.data.questions || []);
        setActiveTab('practice');
        setCurrentQuestion(0);
        setUserCode('');
        setFeedback(null);
      } else {
        setError(result.error || 'Failed to generate questions');
      }
    } catch (err) {
      setError('Failed to generate questions. Please try again.');
      console.error('Generate questions error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitCode = async () => {
    if (!userCode.trim()) {
      setError('Please enter your code solution');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const question = questions[currentQuestion];
      const response = await fetch('/api/ai/validate-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          question: question.content,
          studentCode: userCode,
          expectedSolution: question.solution,
          testCases: question.testCases || [],
          language: generatorForm.language
        }),
      });

      const result = await response.json();

      if (result.success) {
        setFeedback(result.data);
      } else {
        setError(result.error || 'Failed to validate code');
      }
    } catch (err) {
      setError('Failed to validate code. Please try again.');
      console.error('Code validation error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setUserCode('');
      setFeedback(null);
      setError('');
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setUserCode('');
      setFeedback(null);
      setError('');
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

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              💻 Code Questions Generator
            </h1>
            <p className="text-gray-600 mt-1">AI-powered interactive coding assessments with personalized difficulty levels</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="generator">Generate Questions</TabsTrigger>
            <TabsTrigger value="practice" disabled={questions.length === 0}>
              Practice ({questions.length} questions)
            </TabsTrigger>
            <TabsTrigger value="results" disabled={!feedback}>
              Results & Feedback
            </TabsTrigger>
          </TabsList>

          {/* Generator Tab */}
          <TabsContent value="generator" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Question Generation Settings</CardTitle>
                <CardDescription>
                  Configure the AI to generate personalized coding questions based on your learning needs
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
                    <Label htmlFor="topic">Programming Topic</Label>
                    <Input
                      id="topic"
                      placeholder="e.g., Array manipulation, Recursion, Object-oriented programming"
                      value={generatorForm.topic}
                      onChange={(e) => setGeneratorForm({ ...generatorForm, topic: e.target.value })}
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty Level</Label>
                    <Select value={generatorForm.difficulty} onValueChange={(value) => 
                      setGeneratorForm({ ...generatorForm, difficulty: value })
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="count">Number of Questions</Label>
                    <Select value={generatorForm.count.toString()} onValueChange={(value) => 
                      setGeneratorForm({ ...generatorForm, count: parseInt(value) })
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 Questions</SelectItem>
                        <SelectItem value="5">5 Questions</SelectItem>
                        <SelectItem value="10">10 Questions</SelectItem>
                        <SelectItem value="15">15 Questions</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select value={generatorForm.language} onValueChange={(value) => 
                      setGeneratorForm({ ...generatorForm, language: value })
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

                <Button 
                  onClick={handleGenerateQuestions} 
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  size="lg"
                >
                  {loading ? 'Generating Questions...' : 'Generate AI Questions'}
                </Button>
              </CardContent>
            </Card>

            {/* Features Info */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl mb-2">🎯</div>
                    <h3 className="font-semibold text-blue-900">Personalized Difficulty</h3>
                    <p className="text-sm text-blue-700 mt-1">AI adjusts question complexity based on your selected level</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-green-50 border-green-200">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl mb-2">⚡</div>
                    <h3 className="font-semibold text-green-900">Instant Feedback</h3>
                    <p className="text-sm text-green-700 mt-1">Real-time code validation with detailed explanations</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-purple-50 border-purple-200">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl mb-2">🧠</div>
                    <h3 className="font-semibold text-purple-900">Adaptive Learning</h3>
                    <p className="text-sm text-purple-700 mt-1">Questions evolve based on your performance patterns</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Practice Tab */}
          <TabsContent value="practice" className="space-y-6">
            {questions.length > 0 && (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <h2 className="text-xl font-semibold">Question {currentQuestion + 1} of {questions.length}</h2>
                    <Badge className={getDifficultyColor(questions[currentQuestion]?.difficulty || 'intermediate')}>
                      {questions[currentQuestion]?.difficulty || 'intermediate'}
                    </Badge>
                  </div>
                  <Progress value={((currentQuestion + 1) / questions.length) * 100} className="w-32" />
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>{questions[currentQuestion]?.title}</CardTitle>
                    <CardDescription>
                      Estimated time: {questions[currentQuestion]?.estimatedTime || 15} minutes
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="prose max-w-none">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {questions[currentQuestion]?.content}
                      </p>
                    </div>

                    {questions[currentQuestion]?.codeTemplate && (
                      <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
                        <pre>{questions[currentQuestion].codeTemplate}</pre>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="userCode">Your Solution</Label>
                      <Textarea
                        id="userCode"
                        placeholder="Write your code solution here..."
                        value={userCode}
                        onChange={(e) => setUserCode(e.target.value)}
                        rows={12}
                        className="font-mono"
                      />
                    </div>

                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <div className="flex justify-between">
                      <div className="space-x-2">
                        <Button 
                          variant="outline" 
                          onClick={handlePrevQuestion}
                          disabled={currentQuestion === 0}
                        >
                          Previous
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={handleNextQuestion}
                          disabled={currentQuestion === questions.length - 1}
                        >
                          Next
                        </Button>
                      </div>
                      <Button 
                        onClick={handleSubmitCode}
                        disabled={submitting || !userCode.trim()}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                      >
                        {submitting ? 'Validating...' : 'Submit Solution'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results" className="space-y-6">
            {feedback && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span>{feedback.evaluation?.passed ? '✅' : '❌'}</span>
                    Solution Feedback
                  </CardTitle>
                  <CardDescription>
                    AI analysis of your code submission
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Overall Score */}
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-900 mb-2">
                      {feedback.evaluation?.overallScore || 0}%
                    </div>
                    <p className="text-gray-600">Overall Score</p>
                  </div>

                  {/* Detailed Evaluation */}
                  {feedback.evaluation && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-900">{feedback.evaluation.correctness}%</div>
                        <div className="text-sm text-blue-700">Correctness</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-900">{feedback.evaluation.efficiency}%</div>
                        <div className="text-sm text-green-700">Efficiency</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-900">{feedback.evaluation.style}%</div>
                        <div className="text-sm text-purple-700">Style</div>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-900">{feedback.evaluation.completeness}%</div>
                        <div className="text-sm text-orange-700">Completeness</div>
                      </div>
                    </div>
                  )}

                  {/* Feedback Text */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Detailed Feedback</h3>
                    <p className="text-gray-700 leading-relaxed">{feedback.feedback}</p>
                  </div>

                  {/* Suggestions */}
                  {feedback.suggestions && feedback.suggestions.length > 0 && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-blue-900 mb-2">Improvement Suggestions</h3>
                      <ul className="space-y-1">
                        {feedback.suggestions.map((suggestion: string, index: number) => (
                          <li key={index} className="text-blue-800 text-sm">• {suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex justify-center">
                    <Button 
                      onClick={() => {
                        setActiveTab('practice');
                        setFeedback(null);
                        setError('');
                      }}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      Try Another Question
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}