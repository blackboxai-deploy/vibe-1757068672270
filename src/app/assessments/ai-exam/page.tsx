'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function AIExamPage() {
  const [activeTab, setActiveTab] = useState('generator');
  const [loading, setLoading] = useState(false);
  const [exam, setExam] = useState<any>(null);
  const [error, setError] = useState('');
  
  // Generator form state
  const [generatorForm, setGeneratorForm] = useState({
    latexContent: '',
    numberOfQuestions: 10,
    difficulty: 'intermediate',
    language: 'en',
    topic: ''
  });

  // Exam taking state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});

  const [results, setResults] = useState<any>(null);

  const handleGenerateExam = async () => {
    if (!generatorForm.latexContent.trim()) {
      setError('Please enter LaTeX content for the exam');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/ai/generate-exam', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(generatorForm),
      });

      const result = await response.json();

      if (result.success) {
        setExam(result.data.exam || result.data);
        setActiveTab('exam');
        setCurrentQuestion(0);
        setUserAnswers({});

        setResults(null);
      } else {
        setError(result.error || 'Failed to generate exam');
      }
    } catch (err) {
      setError('Failed to generate exam. Please try again.');
      console.error('Generate exam error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId: string, answerId: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));
  };

  const handleSubmitExam = () => {
    if (!exam || !exam.questions) return;

    let correctAnswers = 0;
    const totalQuestions = exam.questions.length;
    const questionResults = exam.questions.map((question: any) => {
      const userAnswer = userAnswers[question.id];
      const correctOption = question.options.find((opt: any) => opt.isCorrect);
      const isCorrect = userAnswer === correctOption?.id;
      
      if (isCorrect) correctAnswers++;

      return {
        questionId: question.id,
        question: question.question,
        userAnswer,
        correctAnswer: correctOption?.id,
        isCorrect,
        explanation: question.explanation
      };
    });

    const score = Math.round((correctAnswers / totalQuestions) * 100);

    setResults({
      score,
      correctAnswers,
      totalQuestions,
      questionResults
    });


    setActiveTab('results');
  };

  const sampleLatex = `\\documentclass{article}
\\title{Database Systems}
\\begin{document}

\\section{Relational Database Design}
Database normalization is a systematic approach of decomposing tables to eliminate data redundancy.

\\subsection{First Normal Form (1NF)}
A table is in 1NF if each table cell contains a single value and each record is unique.

\\subsection{Second Normal Form (2NF)}
A table is in 2NF if it is in 1NF and all non-key attributes are fully functionally dependent on the primary key.

\\section{SQL Queries}
SQL is the standard language for relational database management systems.

\\end{document}`;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              📝 AI Exam Generator
            </h1>
            <p className="text-gray-600 mt-1">Transform LaTeX documents into intelligent MCQ exams</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="generator">Generate Exam</TabsTrigger>
            <TabsTrigger value="exam" disabled={!exam}>
              Take Exam ({exam?.questions?.length || 0} questions)
            </TabsTrigger>
            <TabsTrigger value="results" disabled={!results}>
              Results & Analysis
            </TabsTrigger>
          </TabsList>

          {/* Generator Tab */}
          <TabsContent value="generator" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Exam Generation from LaTeX</CardTitle>
                <CardDescription>
                  Paste LaTeX content to automatically generate multiple-choice questions
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
                    <Label htmlFor="numberOfQuestions">Number of Questions</Label>
                    <Select value={generatorForm.numberOfQuestions.toString()} onValueChange={(value) => 
                      setGeneratorForm({ ...generatorForm, numberOfQuestions: parseInt(value) })
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 Questions</SelectItem>
                        <SelectItem value="10">10 Questions</SelectItem>
                        <SelectItem value="15">15 Questions</SelectItem>
                        <SelectItem value="20">20 Questions</SelectItem>
                      </SelectContent>
                    </Select>
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="latexContent">LaTeX Content</Label>
                  <Textarea
                    id="latexContent"
                    placeholder="Paste your LaTeX document content here..."
                    value={generatorForm.latexContent}
                    onChange={(e) => setGeneratorForm({ ...generatorForm, latexContent: e.target.value })}
                    rows={12}
                    className="font-mono text-sm"
                  />
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setGeneratorForm({ ...generatorForm, latexContent: sampleLatex })}
                    >
                      Use Sample LaTeX
                    </Button>
                  </div>
                </div>

                <Button 
                  onClick={handleGenerateExam} 
                  disabled={loading || !generatorForm.latexContent.trim()}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  size="lg"
                >
                  {loading ? 'Generating Exam...' : 'Generate AI Exam'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Exam Tab */}
          <TabsContent value="exam" className="space-y-6">
            {exam && exam.questions && exam.questions.length > 0 && (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">{exam.title || 'Generated Exam'}</h2>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">
                      Question {currentQuestion + 1} of {exam.questions.length}
                    </span>
                    <Progress value={((currentQuestion + 1) / exam.questions.length) * 100} className="w-32" />
                  </div>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Question {currentQuestion + 1}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-gray-800 text-lg leading-relaxed">
                      {exam.questions[currentQuestion]?.question}
                    </p>

                    <div className="space-y-3">
                      <Label className="text-base font-medium">Choose the best answer:</Label>
                      <RadioGroup 
                        value={userAnswers[exam.questions[currentQuestion]?.id] || ''} 
                        onValueChange={(value) => handleAnswerSelect(exam.questions[currentQuestion]?.id, value)}
                      >
                        {exam.questions[currentQuestion]?.options?.map((option: any) => (
                          <div key={option.id} className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer">
                            <RadioGroupItem value={option.id} id={option.id} className="mt-1" />
                            <Label htmlFor={option.id} className="flex-1 cursor-pointer text-gray-700">
                              <span className="font-medium">{option.id.toUpperCase()}.</span> {option.text}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t">
                      <div className="space-x-2">
                        <Button 
                          variant="outline" 
                          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                          disabled={currentQuestion === 0}
                        >
                          Previous
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setCurrentQuestion(Math.min(exam.questions.length - 1, currentQuestion + 1))}
                          disabled={currentQuestion === exam.questions.length - 1}
                        >
                          Next
                        </Button>
                      </div>
                      
                      {currentQuestion === exam.questions.length - 1 && (
                        <Button 
                          onClick={handleSubmitExam}
                          disabled={Object.keys(userAnswers).length !== exam.questions.length}
                          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                        >
                          Submit Exam
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results" className="space-y-6">
            {results && (
              <Card>
                <CardHeader>
                  <CardTitle>Exam Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-8">
                    <div className={`text-5xl font-bold mb-2 ${
                      results.score >= 80 ? 'text-green-600' : 
                      results.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {results.score}%
                    </div>
                    <p className="text-gray-600">Final Score</p>
                    <div className="mt-4 text-sm">
                      {results.correctAnswers} correct out of {results.totalQuestions} questions
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <Button 
                      onClick={() => {
                        setActiveTab('generator');
                        setExam(null);
                        setResults(null);
                        setUserAnswers({});
                        setCurrentQuestion(0);
                        setError('');
                      }}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      Generate New Exam
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